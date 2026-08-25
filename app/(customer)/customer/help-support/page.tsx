"use client";

import React, { useState } from "react";
import TwoFactorPinModal from "@/components/customer/TwoFactorPinModal";
import TurnOffTwoFactorModal from "@/components/customer/TurnOffTwoFactorModal";
import styles from "./HelpSupportPage.module.css";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
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
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Prosper Edward", phone: "+2341238476632" },
    { id: "2", name: "Prosper", phone: "+2341238476632" },
  ]);

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: "How do I book this vehicle?",
      a: "You can book this vehicle by selecting your pickup and return dates, reviewing the total price, and confirming your reservation through our secure checkout.",
    },
    { q: "Do I need to select dates before booking?", a: "Yes, dates are required to check vehicle availability." },
    { q: "What happens after I book?", a: "You will receive a confirmation code and pickup instructions." },
    { q: "Can I extend my rental period?", a: "Yes, you can extend your rental period via the Ongoing Trip details page." },
    { q: "Can I get a raise?", a: "Contact customer support for promotions and driver rewards!" },
  ];

  // Tab 6: 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isTurnOffModalOpen, setIsTurnOffModalOpen] = useState(false);
  const [isChangePin, setIsChangePin] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { id: Date.now().toString(), name: "New Contact", phone: "+2340000000000" }]);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
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
          {contacts.map((contact) => (
            <div key={contact.id} className={styles.emergencyRow}>
              <span className={styles.emergencyLabel}>Emergency Contact</span>
              <div className={styles.contactInputsWrap}>
                <div className={styles.copyInputBox}>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={contact.phone}
                    readOnly
                  />
                  <button
                    type="button"
                    className={styles.copyIconBtn}
                    onClick={() => handleCopy(contact.phone)}
                    aria-label="Copy Phone Number"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>

                <input
                  type="text"
                  className={styles.inputField}
                  value={contact.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, name: newName } : c)));
                  }}
                />

                <button
                  type="button"
                  className={styles.trashBtn}
                  onClick={() => handleDeleteContact(contact.id)}
                  aria-label="Delete Contact"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button type="button" className={styles.addContactBtn} onClick={handleAddContact}>
            + Add Contact
          </button>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.76-1.55 4 4 0 011.89 7.74M12 12v9m0-9l-3 3m3-3l3 3" />
              </svg>
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
                <div className={styles.pdfBadge}>PDF</div>
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
                style={{ width: "32px", height: "32px", border: "none" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
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
          <input type="text" className={styles.faqSearchInput} placeholder="Search..." />
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.faqCard}>
              <div
                className={styles.faqHeader}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <h4 className={styles.faqQuestion}>{faq.q}</h4>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {openFaq === idx && <div className={styles.faqBody}>{faq.a}</div>}
            </div>
          ))}
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