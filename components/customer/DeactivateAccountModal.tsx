"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { accountsService, formatApiError } from "@/services/accounts-service";
import styles from "./DeactivateAccountModal.module.css";

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeactivateAccountModal({
  isOpen,
  onClose,
}: DeactivateAccountModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [hasActiveBookings, setHasActiveBookings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setMfaCode("");
      setErrorMsg("");
      setSuccessMsg("");
      setHasActiveBookings(false);

      accountsService.getProfile()
        .then((profile) => {
          if (profile) {
            const mfaOn = Boolean(profile.mfa_enabled || profile.is_2fa_enabled || profile.two_factor_enabled);
            setIsMfaEnabled(mfaOn);
          }
        })
        .catch((err) => {
          console.error("Failed to load profile for MFA check:", err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    if (isMfaEnabled && !mfaCode.trim()) {
      setErrorMsg("Please enter your 2FA PIN / MFA code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setHasActiveBookings(false);

    try {
      const response = await accountsService.deactivateAccount({
        password,
        mfa_code: isMfaEnabled ? mfaCode.trim() : undefined,
      });

      setSuccessMsg(response?.message || "Account deactivated successfully.");

      // Clear tokens and redirect after short delay
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.clear();
      }

      setTimeout(() => {
        router.push("/customer/login");
      }, 1500);
    } catch (err: any) {
      console.error("Account deactivation error:", err);
      const rawError = err.response?.data?.error || err.response?.data?.detail || err.response?.data?.message || "";
      
      if (
        typeof rawError === "string" &&
        (rawError.toLowerCase().includes("active trip") || rawError.toLowerCase().includes("active booking"))
      ) {
        setHasActiveBookings(true);
      }

      setErrorMsg(formatApiError(err, "Failed to deactivate account. Please check your credentials."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Deactivate Account?</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>
          Are you sure you want to <strong>deactivate</strong> this account? You will no longer have access to Drifully.
        </p>

        {hasActiveBookings ? (
          <div className={styles.errorBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>We cannot deactivate your account at the moment, you still have active bookings. Please complete bookings to proceed.</span>
          </div>
        ) : (
          <div className={styles.warningBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>Active bookings must be completed before deactivation.</span>
          </div>
        )}

        {hasActiveBookings ? (
          <Link href="/customer/trips" className={styles.backBookingsBtn} onClick={onClose}>
            Back to Bookings
          </Link>
        ) : (
          <form onSubmit={handleDeactivate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Account Password *</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="Enter your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {isMfaEnabled && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>2FA PIN / MFA Code *</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter your 6-digit 2FA code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required={isMfaEnabled}
                  disabled={isLoading}
                />
              </div>
            )}

            {errorMsg && <div className={styles.apiErrorBox}>{errorMsg}</div>}
            {successMsg && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: "13px" }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              className={styles.deactivateBtn}
              disabled={isLoading || !password || (isMfaEnabled && !mfaCode.trim())}
            >
              {isLoading ? "Deactivating Account..." : "Deactivate Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
