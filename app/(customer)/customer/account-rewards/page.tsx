"use client";

import React, { useState } from "react";
import OtpVerificationModal from "@/components/customer/OtpVerificationModal";
import styles from "./AccountRewards.module.css";

export default function AccountRewardsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "referrals">("profile");

  // Profile Form State
  const [firstName, setFirstName] = useState("Edward");
  const [lastName, setLastName] = useState("Prosper");
  const [alias, setAlias] = useState("Pdot");
  const [email, setEmail] = useState("Edward@gmail.com");
  const [phone, setPhone] = useState("(555) 000-0000");
  const [password, setPassword] = useState("••••••••");
  const [address, setAddress] = useState("42 Monthomery Road, Houston");

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // Notification Preferences State
  const [inAppNotif, setInAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(false);

  // Referrals Copy State
  const [copied, setCopied] = useState(false);
  const referralCode = "DRF-VALERIE-24";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsOtpOpen(true);
  };

  return (
    <div className={styles.container}>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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
                  <input type="file" className={styles.hiddenInput} />
                </label>
              </div>
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
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* Alias Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>Alias</label>
              <div className={styles.fieldRight}>
                <input
                  type="text"
                  className={styles.input}
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  onFocus={() => setFocusedField("alias")}
                />
                {focusedField === "alias" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
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
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* Phone Row */}
            <div className={styles.formRow}>
              <label className={styles.fieldLabel}>Phone Number</label>
              <div className={styles.fieldRight}>
                <div className={styles.phoneGroup}>
                  <div className={styles.countrySelect}>
                    <span>🇺🇸</span>
                    <span>+1</span>
                    <span>˅</span>
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
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                />
                {focusedField === "password" && (
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                )}
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
                  <button type="button" className={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── NOTIFICATIONS SETTINGS TAB CONTENT ─── */}
      {activeTab === "notifications" && (
        <div className={styles.notifSettingsList}>
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
                onChange={(e) => setInAppNotif(e.target.checked)}
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
                onChange={(e) => setEmailNotif(e.target.checked)}
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
                onChange={(e) => setSmsNotif(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
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
              <div className={styles.statValue}>0</div>
            </div>

            <div className={styles.rewardStatCard}>
              <span className={styles.statLabel}>No. Of Referrals</span>
              <div className={styles.statValue}>0</div>
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
              <span className={styles.codeText}>{referralCode}</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyCode}
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
              <li>Share your referral code.</li>
              <li>Your friend signs up and books.</li>
              <li>You both earn rewards.</li>
            </ol>

            <div className={styles.termsNote}>
              Rewards are credited after your friend's first completed trip. Terms apply.
            </div>
          </div>
        </>
      )}

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerified={() => {
          setIsOtpOpen(false);
          setFocusedField(null);
        }}
      />
    </div>
  );
}