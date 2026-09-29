"use client";

import React, { useState } from "react";
import { accountsService, formatApiError } from "@/services/accounts-service";
import styles from "./TurnOffTwoFactorModal.module.css";

interface TurnOffTwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTurnOff: () => void;
}

export default function TurnOffTwoFactorModal({
  isOpen,
  onClose,
  onConfirmTurnOff,
}: TurnOffTwoFactorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleTurnOff = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      await accountsService.deactivate2FA();
      await accountsService.manage2FA({ mfa_enabled: "False", mfa_method: "2FA_PIN" });
      onConfirmTurnOff();
    } catch (err: any) {
      console.error("Failed to turn off 2FA:", err);
      setErrorMsg(formatApiError(err, "Failed to turn off 2FA."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Turn Off Two-Factor Authentication?</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>Are you sure you want to turn off two factor authentication</p>

        {errorMsg && (
          <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        <div className={styles.actionsRow}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className={styles.turnOffBtn} onClick={handleTurnOff} disabled={isLoading}>
            {isLoading ? "Turning off..." : "Turn Off"}
          </button>
        </div>
      </div>
    </div>
  );
}
