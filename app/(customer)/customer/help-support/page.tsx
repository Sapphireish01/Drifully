"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import TwoFactorPinModal from "@/components/customer/TwoFactorPinModal";
import TurnOffTwoFactorModal from "@/components/customer/TurnOffTwoFactorModal";
import CustomSelect from "@/components/admin/CustomSelect";
import { accountsService, Country, EmergencyContactResponse, FaqItem } from "@/services/accounts-service";
import styles from "./HelpSupportPage.module.css";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface ReportHistoryItem {
  id: string;
  subject: string;
  category: string;
  description: string;
  timestamp: string;
  status: "Sent" | "Pending";
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  options?: string[];
}

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState<
    "emergency" | "report" | "chat" | "faqs" | "contact" | "2fa"
  >("emergency");

  // Tab 1: Emergency Contacts State
  const [contacts, setContacts] = useState<EmergencyContactResponse[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  // New Contact Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCountry, setNewCountry] = useState<number | "">("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const phonePrefixOptions = countries.map((country) => {
    let flagIcon = country.flag;
    if (!flagIcon && country.iso_code) {
      flagIcon = getFlagEmoji(country.iso_code);
    }
    return {
      value: String(country.id),
      label: country.dial_code,
      icon: flagIcon,
    };
  });

  // Tab 2: Report a Problem State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("e.g Payment Issue");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  const [history] = useState<ReportHistoryItem[]>([
    {
      id: "1",
      subject: "Payment Issue",
      category: "Payment Issue",
      description: "made a transaction and it did...",
      timestamp: "18 Aug 2026 12:01 PM",
      status: "Sent",
    },
    {
      id: "2",
      subject: "Payment Issue",
      category: "Payment Issue",
      description: "made a transaction and it did...",
      timestamp: "18 Aug 2026 12:01 PM",
      status: "Pending",
    },
    {
      id: "3",
      subject: "Payment Issue",
      category: "Payment Issue",
      description: "made a transaction and it did...",
      timestamp: "18 Aug 2026 12:01 PM",
      status: "Sent",
    },
  ]);

  // Tab 3: Chat with Support State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Tab 4: FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 11,
      category: "vehicle",
      question: "Are there mileage limits on rental cars?",
      answer: "Most rentals include unlimited mileage, but some vehicles may have daily mileage limits. Please check the vehicle details before booking.",
      is_active: true,
      order: 0,
      created: "2026-03-13T19:38:27.309839Z",
      last_updated: "2026-03-13T19:38:27.309839Z",
    },
    {
      id: 1,
      category: "booking",
      question: "How do I book a car?",
      answer: "You can book a car through our mobile app or website by selecting your location, dates, and preferred vehicle.",
      is_active: true,
      order: 1,
      created: "2026-03-13T19:23:25.373589Z",
      last_updated: "2026-03-13T19:23:25.373589Z",
    },
    {
      id: 2,
      category: "booking",
      question: "Can I modify my reservation?",
      answer: "Yes, you can modify your booking from your account dashboard before the pickup time.",
      is_active: true,
      order: 2,
      created: "2026-03-13T19:23:26.509179Z",
      last_updated: "2026-03-13T19:23:26.509179Z",
    },
    {
      id: 3,
      category: "payment",
      question: "What payment methods are accepted?",
      answer: "We accept credit cards, debit cards, and selected digital wallets.",
      is_active: true,
      order: 3,
      created: "2026-03-13T19:23:27.595604Z",
      last_updated: "2026-03-13T19:23:27.595604Z",
    },
    {
      id: 4,
      category: "payment",
      question: "Is a security deposit required?",
      answer: "Yes, a refundable security deposit may be required depending on the vehicle.",
      is_active: true,
      order: 4,
      created: "2026-03-13T19:23:28.690436Z",
      last_updated: "2026-03-13T19:23:28.690436Z",
    },
    {
      id: 5,
      category: "cancellation",
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking before the scheduled pickup time. Cancellation policies may apply.",
      is_active: true,
      order: 5,
      created: "2026-03-13T19:23:29.771384Z",
      last_updated: "2026-03-13T19:23:29.771384Z",
    },
    {
      id: 6,
      category: "vehicle",
      question: "What documents do I need to rent a car?",
      answer: "You need a valid driver's license and a valid ID or passport.",
      is_active: true,
      order: 6,
      created: "2026-03-13T19:23:30.950979Z",
      last_updated: "2026-03-13T19:23:30.950979Z",
    },
    {
      id: 7,
      category: "vehicle",
      question: "Can someone else drive the rental car?",
      answer: "Yes, additional drivers can be added during booking for an extra fee.",
      is_active: true,
      order: 7,
      created: "2026-03-13T19:23:32.041582Z",
      last_updated: "2026-03-13T19:23:32.041582Z",
    },
    {
      id: 8,
      category: "insurance",
      question: "Is insurance included in the rental?",
      answer: "Basic insurance is included with every rental. Additional coverage can be purchased.",
      is_active: true,
      order: 8,
      created: "2026-03-13T19:23:33.249485Z",
      last_updated: "2026-03-13T19:23:33.249485Z",
    },
    {
      id: 9,
      category: "general",
      question: "What happens if I return the car late?",
      answer: "Late returns may incur additional hourly or daily charges.",
      is_active: true,
      order: 9,
      created: "2026-03-13T19:23:35.381262Z",
      last_updated: "2026-03-13T19:23:35.381262Z",
    },
    {
      id: 10,
      category: "general",
      question: "Do you offer roadside assistance?",
      answer: "Yes, 24/7 roadside assistance is included with every rental.",
      is_active: true,
      order: 10,
      created: "2026-03-13T19:23:36.697276Z",
      last_updated: "2026-03-13T19:23:36.697276Z",
    },
  ]);
  const [openFaq, setOpenFaq] = useState<number | null>(11);
  const [faqSearch, setFaqSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const q = faqSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category?.toLowerCase().includes(q)
    );
  });

  // Tab 6: 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isTurnOffModalOpen, setIsTurnOffModalOpen] = useState(false);
  const [isChangePin, setIsChangePin] = useState(false);

  const fetchEmergencyContacts = useCallback(async (isMounted = true) => {
    setIsLoadingContacts(true);
    try {
      const data = await accountsService.getEmergencyContacts();
      if (isMounted) {
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load emergency contacts:", err);
    } finally {
      if (isMounted) {
        setIsLoadingContacts(false);
      }
    }
  }, []);

  const getContactPhoneNumber = useCallback((contact: unknown) => {
    if (!contact) return "";
    if (typeof contact === "string" || typeof contact === "number") return String(contact);

    const target = (
      typeof contact === "object" && contact !== null
        ? (contact as Record<string, unknown>).contact ||
          (contact as Record<string, unknown>).attributes ||
          contact
        : contact
    ) as Record<string, unknown>;

    if (target.full_phone_number) return String(target.full_phone_number);
    if (target.full_phone) return String(target.full_phone);

    const code = target.phone_code || target.dial_code || target.country_code || "";
    const num = target.phone_number || target.phone || target.mobile || target.contact_number || target.phoneNumber || "";

    if (code && num) {
      return `${code}${num}`;
    }
    return String(num || code || "");
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) {
        fetchEmergencyContacts(isMounted);
      }
    });

    accountsService.getCountries()
      .then((list) => {
        if (isMounted) {
          setCountries(list);
          if (list.length > 0) {
            setNewCountry(list[0].id);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load countries:", err);
      });

    accountsService.getFaqs()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFaqs(data);
          setOpenFaq(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load FAQs from API:", err);
      });

    accountsService.getProfile()
      .then((profile) => {
        if (isMounted && profile) {
          const isEnabled = Boolean(
            profile.mfa_enabled || profile.is_2fa_enabled || profile.two_factor_enabled || profile.mfa_method === "2FA_PIN"
          );
          setIs2FAEnabled(isEnabled);
        }
      })
      .catch((err) => {
        console.error("Failed to load profile 2FA status:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchEmergencyContacts]);

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCountry || !newPhoneNumber.trim()) return;

    setIsSubmittingContact(true);
    try {
      await accountsService.createEmergencyContact({
        name: newName.trim(),
        country: Number(newCountry),
        phone_number: newPhoneNumber.trim(),
      });
      setNewName("");
      setNewPhoneNumber("");
      setShowAddForm(false);
      await fetchEmergencyContacts();
    } catch (err) {
      console.error("Failed to create emergency contact:", err);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleUpdateContactName = async (contactId: number, name: string) => {
    try {
      setEditingContactId(contactId);
      await accountsService.updateEmergencyContact(contactId, { name });
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, name } : c))
      );
    } catch (err) {
      console.error("Failed to update contact name:", err);
    } finally {
      setEditingContactId(null);
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await accountsService.deleteEmergencyContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: chatInput,
      timestamp: "10:11 AM",
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate AI greeting response card after 1 second
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Hi Prosper, how can we help you today?",
          timestamp: "10:11 AM",
          options: ["Find a Car", "Payment Issues", "Manage Booking", "Talk to Support"],
        },
      ]);
    }, 600);
  };

  return (
    <div className={styles.container}>
      {/* Sub-Navigation Tabs */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "emergency" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("emergency")}
        >
          Emergency Contacts
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "report" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("report")}
        >
          Report a Problem
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "chat" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat with Support
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "faqs" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "2fa" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("2fa")}
        >
          Two Factor Authentication
        </button>
      </div>

      {/* ─── TAB 1: EMERGENCY CONTACTS ─── */}
      {activeTab === "emergency" && (
        <div className={styles.emergencyList}>
          {isLoadingContacts ? (
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading emergency contacts...</p>
          ) : contacts.length === 0 && !showAddForm ? (
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>No emergency contacts added yet.</p>
          ) : (
            contacts.map((contact, index) => (
              <div key={contact.id} className={styles.emergencyRow}>
                <span className={styles.emergencyLabel}>
                  {index === 0 ? "Emergency Contact" : ""}
                </span>
                <div className={styles.contactInputsWrap}>
                  <div className={styles.copyInputBox}>
                    <input
                      type="text"
                      className={styles.inputField}
                      value={getContactPhoneNumber(contact)}
                      readOnly
                    />
                    <button
                      type="button"
                      className={styles.copyIconBtn}
                      onClick={() => handleCopy(getContactPhoneNumber(contact))}
                      aria-label="Copy Phone Number"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth="1.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>

                  <input
                    type="text"
                    className={styles.inputField}
                    value={contact.name}
                    disabled={editingContactId === contact.id}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setContacts((prev) =>
                        prev.map((c) => (c.id === contact.id ? { ...c, name: newName } : c))
                      );
                    }}
                    onBlur={(e) => handleUpdateContactName(contact.id, e.target.value)}
                  />

                  <button
                    type="button"
                    className={styles.trashBtn}
                    onClick={() => handleDeleteContact(contact.id)}
                    aria-label="Delete Contact"
                  >
                    <Image src="/customer app/icons/trash.svg" alt="Delete" width={18} height={18} />
                  </button>
                </div>
              </div>
            ))
          )}

          {showAddForm && (
            <form onSubmit={handleCreateContact} className={styles.emergencyRow} style={{ flexWrap: "wrap" }}>
              <span className={styles.emergencyLabel}>
                {contacts.length === 0 ? "Emergency Contact" : ""}
              </span>
              <div className={styles.contactInputsWrap} style={{ flexWrap: "wrap" }}>
                <div className={styles.phoneGroup}>
                  <div className={styles.countrySelect}>
                    <CustomSelect
                      name="newCountry"
                      value={String(newCountry)}
                      placeholder="+1"
                      options={phonePrefixOptions}
                      onChange={(_name, value) => setNewCountry(Number(value))}
                      variant="minimal"
                    />
                  </div>
                  <input
                    type="text"
                    className={styles.phoneInput}
                    placeholder="(555) 000-0000"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Contact Name (e.g. Prosper)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    className={styles.addContactBtn}
                    style={{ marginTop: 0 }}
                    disabled={isSubmittingContact}
                  >
                    {isSubmittingContact ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className={styles.trashBtn}
                    onClick={() => setShowAddForm(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </form>
          )}

          {!showAddForm && (
            <button
              type="button"
              className={styles.addContactBtn}
              onClick={() => setShowAddForm(true)}
            >
              + Add Contact
            </button>
          )}
        </div>
      )}

      {/* ─── TAB 2: REPORT A PROBLEM ─── */}
      {activeTab === "report" && (
        <div className={styles.reportForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Subject<span>*</span></label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="e.g Payment Issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category<span>*</span></label>
            <select
              className={styles.selectInput}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="e.g Payment Issue">e.g Payment Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Vehicle Condition">Vehicle Condition</option>
              <option value="Driver Behavior">Driver Behavior</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description<span>*</span></label>
            <div className={styles.textareaWrap}>
              <textarea
                className={styles.textarea}
                placeholder="Tell us what happened"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className={styles.charCounter}>{description.length}/200 ⤢</span>
            </div>
          </div>

          {/* Evidence Dropzone */}
          <div className={styles.evidenceDropzone}>
            <div className={styles.cloudIcon}>
              <Image src="/customer app/icons/upload.svg" alt="Upload" width={28} height={28} />
            </div>
            <span className={styles.dropTitle}>Upload Supporting Evidence</span>
            <span className={styles.dropHint}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</span>
            <label className={styles.browseBtn}>
              Browse File
              <input
                type="file"
                className={styles.hiddenInput}
                onChange={() => setUploadedFile({ name: "my-cv.pdf", size: "120 KB" })}
              />
            </label>
          </div>

          {/* Uploaded File Card */}
          {uploadedFile && (
            <div className={styles.uploadedFileCard}>
              <div className={styles.fileLeft}>
                <div className={styles.pdfBadge}>
                  <Image src="/customer app/icons/pdf-file.svg" alt="PDF" width={24} height={24} />
                </div>
                <div className={styles.fileMeta}>
                  <span className={styles.fileName}>{uploadedFile.name}</span>
                  <div className={styles.fileStatusRow}>
                    <span>0 KB of {uploadedFile.size}</span>
                    <span>•</span>
                    <span className={styles.completedText}>✔ Completed</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.trashBtn}
                onClick={() => setUploadedFile(null)}
                style={{ width: "32px", height: "32px", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Image src="/customer app/icons/trash.svg" alt="Delete" width={18} height={18} />
              </button>
            </div>
          )}

          <button
            type="button"
            className={`${styles.submitBtn} ${isReportSubmitted ? styles.submittedBtn : ""}`}
            onClick={() => setIsReportSubmitted(true)}
          >
            {isReportSubmitted ? (
              <>
                <span className={styles.submittedCheck}>✓</span>
                Report Submitted
              </>
            ) : (
              "Submit Report"
            )}
          </button>

          {/* History Section */}
          <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>History</h3>
            <div className={styles.tableWrap}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    {subject && <th>Subject</th>}
                    <th>Category</th>
                    <th>Description</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      {subject && <td>{row.subject}</td>}
                      <td>{row.category}</td>
                      <td>{row.description}</td>
                      <td>{row.timestamp}</td>
                      <td>
                        {row.status === "Sent" ? (
                          <span className={styles.badgeSent}>✓ Sent</span>
                        ) : (
                          <span className={styles.badgePending}>🕒 Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: CHAT WITH SUPPORT ─── */}
      {activeTab === "chat" && (
        <div className={styles.chatContainer}>
          <div className={styles.chatMessages}>
            {chatMessages.length === 0 ? (
              <div className={styles.aiPromptCenter}>
                Chat with our AI assistant for quick answers and support.
              </div>
            ) : (
              chatMessages.map((msg) =>
                msg.sender === "user" ? (
                  <div key={msg.id} className={styles.userMessageBubble}>
                    <div className={styles.userBubbleText}>{msg.text}</div>
                    <span className={styles.msgTimestamp}>{msg.timestamp}</span>
                  </div>
                ) : (
                  <div key={msg.id} className={styles.aiCard}>
                    <p className={styles.aiTitle}>{msg.text}</p>
                    {msg.options?.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={styles.optionChip}
                        onClick={() => {
                          setChatMessages((prev) => [
                            ...prev,
                            { id: Date.now().toString(), sender: "user", text: opt, timestamp: "10:11 AM" },
                          ]);
                        }}
                      >
                        <span>{opt}</span>
                        <span>→</span>
                      </button>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          <div className={styles.chatInputBar}>
            <button type="button" className={styles.attachIconBtn} aria-label="Attach file">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className={styles.chatInputWrap}>
              <input
                type="text"
                className={styles.chatInput}
                placeholder="Type a message"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
            </div>
            {chatInput.trim() ? (
              <button
                type="button"
                className={styles.sendIconBtn}
                onClick={handleSendMessage}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            ) : (
              <button type="button" className={styles.attachIconBtn} aria-label="Camera">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 4: FAQS ACCORDION ─── */}
      {activeTab === "faqs" && (
        <div className={styles.faqsList}>
          <input
            type="text"
            className={styles.faqSearchInput}
            placeholder="Search..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
          />
          {filteredFaqs.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>No FAQs found.</p>
          ) : (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className={styles.faqCard}>
                <div
                  className={styles.faqHeader}
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <h4 className={styles.faqQuestion}>{faq.question}</h4>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transform: openFaq === faq.id ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {openFaq === faq.id && <div className={styles.faqBody}>{faq.answer}</div>}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── TAB 6: TWO FACTOR AUTHENTICATION ─── */}
      {activeTab === "2fa" && (
        <div className={styles.twoFactorCenter}>
          <div className={styles.twoFactorCard}>
            <div className={styles.shieldCircle}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="1.5" />
                <path d="M12 12.5v3" />
              </svg>
            </div>

            <p className={styles.twoFactorSub}>
              {is2FAEnabled
                ? "Two factor authentication is on. You'll need to enter your PIN if you register your current number again."
                : "Create a PIN for extra security, use the PIN to access your account"}
            </p>

            <div className={styles.turnOnRow}>
              <span className={styles.turnOnText}>Turn on</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={is2FAEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setIsChangePin(false);
                      setIsPinModalOpen(true);
                    } else {
                      setIsTurnOffModalOpen(true);
                    }
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {is2FAEnabled && (
              <button
                type="button"
                className={styles.changePinBtn}
                onClick={() => {
                  setIsChangePin(true);
                  setIsPinModalOpen(true);
                }}
              >
                Change PIN
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2FA PIN Modal */}
      <TwoFactorPinModal
        isOpen={isPinModalOpen}
        isChangePin={isChangePin}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIs2FAEnabled(true);
        }}
      />

      {/* Turn Off 2FA Confirmation Modal */}
      <TurnOffTwoFactorModal
        isOpen={isTurnOffModalOpen}
        onClose={() => setIsTurnOffModalOpen(false)}
        onConfirmTurnOff={() => {
          setIsTurnOffModalOpen(false);
          setIs2FAEnabled(false);
        }}
      />
    </div>
  );
}