"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ChangePasswordModal from "@/components/customer/ChangePasswordModal";
import CustomSelect from "@/components/admin/CustomSelect";
import { accountsService } from "@/services/accounts-service";
import styles from "./AccountRewards.module.css";

export default function AccountRewardsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "referrals">("profile");

  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [address, setAddress] = useState("");

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileSaveStatus, setProfileSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const [phonePrefix, setPhonePrefix] = useState("");
  const [phonePrefixOptions, setPhonePrefixOptions] = useState<{ value: string; label: string; icon: string | null }[]>([]);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Notification Preferences State
  const [inAppNotif, setInAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingNotif, setIsSavingNotif] = useState(false);
  const [notifSaveStatus, setNotifSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load countries for phone prefix selector
  useEffect(() => {
    let isMounted = true;
    const loadCountries = async () => {
      try {
        const countries = await accountsService.getCountries();
        if (!isMounted) return;
        setPhonePrefixOptions(
          countries.map((country) => {
            let flagIcon = country.flag;
            if (!flagIcon && country.iso_code) {
              flagIcon = getFlagEmoji(country.iso_code);
            }
            return {
              value: String(country.id),
              label: country.dial_code,
              icon: flagIcon,
            };
          })
        );
        const defaultCountry = countries.find((c) => c.iso_code === "US") || countries[0];
        if (defaultCountry) setPhonePrefix((prev) => prev || String(defaultCountry.id));
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    loadCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load user profile & notification settings
  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const response = await accountsService.getProfile();
        const profileData = response?.data || response;
        if (profileData && isMounted) {
          if (profileData.profile_picture) {
            setProfilePictureUrl(profileData.profile_picture);
          }
          if (profileData.country !== undefined && profileData.country !== null) {
            setPhonePrefix(String(profileData.country));
          }

          // Full Name mapping
          const fullName = profileData.full_name || profileData.user?.full_name || "";
          if (fullName) {
            const nameParts = fullName.trim().split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
          }

          // Email mapping
          const userEmail = profileData.email || profileData.user?.email || "";
          if (userEmail) setEmail(userEmail);

          // Phone mapping
          const userPhone = profileData.phone_number || profileData.user?.phone_number || "";
          if (userPhone) setPhone(userPhone);

          // Address mapping
          if (profileData.address_line_1 !== undefined && profileData.address_line_1 !== null) {
            setAddress(profileData.address_line_1);
          } else {
            setAddress("");
          }

          // Notification settings mapping
          if (typeof profileData.notify_in_app === "boolean") {
            setInAppNotif(profileData.notify_in_app);
          }
          if (typeof profileData.notify_via_email === "boolean") {
            setEmailNotif(profileData.notify_via_email);
          }
          if (typeof profileData.notify_via_sms === "boolean") {
            setSmsNotif(profileData.notify_via_sms);
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleNotif = async (
    field: "notify_in_app" | "notify_via_email" | "notify_via_sms",
    currentVal: boolean
  ) => {
    const newVal = !currentVal;

    const updatedInApp = field === "notify_in_app" ? newVal : inAppNotif;
    const updatedEmail = field === "notify_via_email" ? newVal : emailNotif;
    const updatedSms = field === "notify_via_sms" ? newVal : smsNotif;

    if (field === "notify_in_app") setInAppNotif(newVal);
    if (field === "notify_via_email") setEmailNotif(newVal);
    if (field === "notify_via_sms") setSmsNotif(newVal);

    setIsSavingNotif(true);
    setNotifSaveStatus("saving");

    try {
      const formData = new FormData();
      formData.append("notify_via_email", updatedEmail ? "True" : "False");
      formData.append("notify_in_app", updatedInApp ? "True" : "False");
      formData.append("notify_via_sms", updatedSms ? "True" : "False");

      await accountsService.updateProfile(formData);

      setNotifSaveStatus("saved");
      setTimeout(() => {
        setNotifSaveStatus("idle");
      }, 2500);
    } catch (err) {
      console.error("Failed to update notification settings:", err);
      if (field === "notify_in_app") setInAppNotif(currentVal);
      if (field === "notify_via_email") setEmailNotif(currentVal);
      if (field === "notify_via_sms") setSmsNotif(currentVal);
      setNotifSaveStatus("error");
    } finally {
      setIsSavingNotif(false);
    }
  };

  // Referrals State
  const [copied, setCopied] = useState(false);
  const [rewardPoints, setRewardPoints] = useState<number>(0);
  const [noOfReferrals, setNoOfReferrals] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);

  // Fetch Referral details from accounts/referrals/
  useEffect(() => {
    let isMounted = true;
    const fetchReferralData = async () => {
      try {
        const response = await accountsService.getReferrals();
        const data = response?.data || response;
        if (data && isMounted) {
          if (data.reward_points !== undefined) setRewardPoints(data.reward_points);
          if (data.no_of_referrals !== undefined) setNoOfReferrals(data.no_of_referrals);
          if (data.referral_code) setReferralCode(data.referral_code);
        }
      } catch (err) {
        console.error("Failed to load referral details:", err);
      } finally {
        if (isMounted) setIsLoadingReferrals(false);
      }
    };

    fetchReferralData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setProfilePictureUrl(URL.createObjectURL(file));
      setFocusedField("photo");
    }
  };

  const handleSave = async () => {
    setIsSavingProfile(true);
    setProfileSaveStatus("saving");
    try {
      const formData = new FormData();

      if (focusedField === "name") {
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) formData.append("full_name", fullName);
      } else if (focusedField === "photo") {
        if (selectedFile) formData.append("profile_picture", selectedFile);
      } else if (focusedField === "phone") {
        if (phone) formData.append("phone_number", phone);
        if (phonePrefix) formData.append("country", phonePrefix);
      } else if (focusedField === "address") {
        if (address) formData.append("address_line_1", address);
      } else {
        // Fallback: append fields if present
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) formData.append("full_name", fullName);
        if (phonePrefix) formData.append("country", phonePrefix);
        if (phone) formData.append("phone_number", phone);
        if (address) formData.append("address_line_1", address);
        if (selectedFile) formData.append("profile_picture", selectedFile);
      }

      const response = await accountsService.updateProfile(formData);
      const updatedData = response?.data || response;

      if (updatedData) {
        if (updatedData.profile_picture) {
          setProfilePictureUrl(updatedData.profile_picture);
        }
      }

      setProfileSaveStatus("saved");
      setFocusedField(null);
      setSelectedFile(null);
      setTimeout(() => {
        setProfileSaveStatus("idle");
      }, 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileSaveStatus("error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className={styles.container}>
      {isSavingProfile && (
        <div className={styles.pageOverlay}>
          <div className={styles.spinner} />
        </div>
      )}
      {/* Sub Navigation Tabs */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "notifications" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "referrals" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("referrals")}
        >
          Referrals
        </button>
      </div>

      {/* ─── PROFILE TAB CONTENT ─── */}
      {activeTab === "profile" && (
        <>
          <div className={styles.sectionHeader}>
            <h1 className={styles.title}>Personal info</h1>
            <p className={styles.subtitle}>Update your photo and personal details here.</p>
          </div>

          {/* Photo Uploader Section */}
          <div className={styles.photoSection}>
            <div className={styles.photoLabelGroup}>
              <span className={styles.sectionLabel}>Your photo</span>
              <span className={styles.sectionSub}>This will be displayed on your profile.</span>
            </div>

            <div className={styles.photoUploadWrap}>
              <div className={styles.avatarCircle}>
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt="Profile Avatar"
                    width={80}
                    height={80}
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>

              <div className={styles.dropzone}>
                <div className={styles.cloudIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.76-1.55 4 4 0 011.89 7.74M12 12v9m0-9l-3 3m3-3l3 3" />
                  </svg>
                </div>
                <div>
                  <span className={styles.dropTitle}>Choose a file or drag & drop it here.</span>
                  <div className={styles.dropHint}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</div>
                </div>
                <label className={styles.browseBtn}>
                  Browse File
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {focusedField === "photo" && (
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Saving..." : "Save Photo"}
                </button>
              )}
            </div>
          </div>

          {/* Profile Form Fields */}
          <div className={styles.formList}>
            {/* Name Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>Name</label>
              <div className={styles.fieldRight}>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                  />
                </div>
                {focusedField === "name" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>

            {/* Email Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>Email address</label>
              <div className={styles.fieldRight}>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                />
                {focusedField === "email" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>

            {/* Phone Row */}
            <div className={styles.formRow} style={{ position: "relative", zIndex: 30 }}>
              <label className={styles.fieldLabel}>Phone Number</label>
              <div className={styles.fieldRight}>
                <div className={styles.phoneGroup}>
                  <div className={styles.countrySelect}>
                    <CustomSelect
                      name="phonePrefix"
                      value={phonePrefix}
                      placeholder="+1"
                      options={phonePrefixOptions}
                      onChange={(_name, value) => {
                        setPhonePrefix(value);
                        setFocusedField("phone");
                      }}
                      variant="minimal"
                    />
                  </div>
                  <input
                    type="text"
                    className={styles.phoneInput}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                  />
                </div>
                {focusedField === "phone" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>Password</label>
              <div className={styles.fieldRight}>
                <input
                  type="password"
                  className={styles.input}
                  value="••••••••••••"
                  readOnly
                  style={{ letterSpacing: "2px", color: "#64748b", background: "#f8fafc" }}
                />
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={() => setIsChangePasswordOpen(true)}
                  style={{ display: "inline-flex" }}
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* House Address Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>House Address</label>
              <div className={styles.fieldRight}>
                <input
                  type="text"
                  className={styles.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => setFocusedField("address")}
                />
                {focusedField === "address" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={isSavingProfile}>
                    {isSavingProfile ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── NOTIFICATIONS SETTINGS TAB CONTENT ─── */}
      {activeTab === "notifications" && (
        <div className={styles.notifSettingsWrap}>
          {isSavingNotif && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <span className={styles.loadingText}>Updating preferences...</span>
            </div>
          )}

          <div className={styles.notifSettingsList}>
            {notifSaveStatus !== "idle" && (
              <div className={styles.notifSettingsHeader}>
                {notifSaveStatus === "saved" && (
                  <span className={styles.saveBadge}>
                    ✓ Preferences updated
                  </span>
                )}
                {notifSaveStatus === "error" && (
                  <span className={styles.saveBadge} style={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}>
                    ✕ Failed to save
                  </span>
                )}
              </div>
            )}

            {/* In-App Notification */}
            <div className={styles.notifRow}>
              <div className={styles.notifLabelWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className={styles.notifLabel}>In-App Notification</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={inAppNotif}
                  disabled={isLoadingProfile || isSavingNotif}
                  onChange={() => handleToggleNotif("notify_in_app", inAppNotif)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Email Notification */}
            <div className={styles.notifRow}>
              <div className={styles.notifLabelWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <span className={styles.notifLabel}>Email Notification</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  disabled={isLoadingProfile || isSavingNotif}
                  onChange={() => handleToggleNotif("notify_via_email", emailNotif)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* SMS Notification */}
            <div className={styles.notifRow}>
              <div className={styles.notifLabelWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className={styles.notifLabel}>SMS Notification</span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={smsNotif}
                  disabled={isLoadingProfile || isSavingNotif}
                  onChange={() => handleToggleNotif("notify_via_sms", smsNotif)}
                />
                <span className={styles.slider} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ─── REFERRALS TAB CONTENT ─── */}
      {activeTab === "referrals" && (
        <>
          {/* Top Reward Stats Cards */}
          <div className={styles.referralsTopGrid}>
            <div className={styles.rewardStatCard}>
              <span className={styles.statLabel}>Your Reward Points</span>
              <div className={styles.statValue}>
                {isLoadingReferrals ? "..." : rewardPoints}
              </div>
            </div>

            <div className={styles.rewardStatCard}>
              <span className={styles.statLabel}>No. Of Referrals</span>
              <div className={styles.statValue}>
                {isLoadingReferrals ? "..." : noOfReferrals}
              </div>
            </div>
          </div>

          {/* Referral Offer Description */}
          <div className={styles.referralOfferGroup}>
            <span className={styles.offerTitle}>Invite friends and earn rewards</span>
            <p className={styles.offerBody}>
              Give your friends ₦5,000 off their first trip and earn ₦5,000 when they complete their first booking.
            </p>
          </div>

          {/* Referral Code Box */}
          <div className={styles.referralOfferGroup}>
            <span className={styles.offerTitle}>Referral Code</span>
            <div className={styles.referralCodeBox}>
              <span className={styles.codeText}>
                {isLoadingReferrals ? "Loading code..." : (referralCode || "N/A")}
              </span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyCode}
                disabled={!referralCode}
                aria-label="Copy Referral Code"
              >
                {copied ? (
                  <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Copied!</span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* How It Works Explainer */}
          <div className={styles.howItWorksGroup}>
            <span className={styles.offerTitle}>How It Works</span>
            <p className={styles.explainerSub}>A simple three-step explainer:</p>

            <ol className={styles.stepsList}>
              <li>1. Share your referral code.</li>
              <li>2. Your friend signs up and books.</li>
              <li>3. You both earn rewards.</li>
            </ol>

            <div className={styles.termsNote}>
              Rewards are credited after your friend&rsquo;s first completed trip. Terms apply.
            </div>
          </div>
        </>
      )}


      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          setIsChangePasswordOpen(false);
        }}
      />
    </div>
  );
}

function getFlagEmoji(isoCode: string) {
  if (!isoCode) return "🌐";
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}