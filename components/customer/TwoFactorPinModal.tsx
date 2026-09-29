"use client";

import React, { useState, useRef, useEffect } from "react";
import { accountsService, formatApiError } from "@/services/accounts-service";
import styles from "./TwoFactorPinModal.module.css";

interface TwoFactorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isChangePin?: boolean;
}

export default function TwoFactorPinModal({
  isOpen,
  onClose,
  onSuccess,
  isChangePin = false,
}: TwoFactorPinModalProps) {
  // Flow steps:
  // Setup: 'setup' -> 'confirm'
  // Change: 'current' -> 'new' -> 'confirm_new'
  const [step, setStep] = useState<"setup" | "confirm" | "current" | "new" | "confirm_new">(
    isChangePin ? "current" : "setup"
  );

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [storedPin, setStoredPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep(isChangePin ? "current" : "setup");
      setDigits(["", "", "", "", "", ""]);
      setStoredPin("");
      setCurrentPin("");
      setNewPin("");
      setErrorMsg("");
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen, isChangePin]);

  if (!isOpen) return null;

  const isFormComplete = digits.every((d) => d !== "");
  const currentPinString = digits.join("");

  const handleChange = (index: number, value: string) => {
    setErrorMsg("");
    if (value.length > 1) value = value[value.length - 1];
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetDigits = () => {
    setDigits(["", "", "", "", "", ""]);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  const handleAction = async () => {
    if (!isFormComplete || isLoading) return;

    setErrorMsg("");

    try {
      if (!isChangePin) {
        // --- 2FA SETUP FLOW ---
        if (step === "setup") {
          setStoredPin(currentPinString);
          setStep("confirm");
          resetDigits();
        } else if (step === "confirm") {
          if (currentPinString !== storedPin) {
            setErrorMsg("PINs do not match. Please try again.");
            return;
          }
          setIsLoading(true);
          await accountsService.setup2FA({
            user_pin: storedPin,
            confirm_pin: currentPinString,
          });
          await accountsService.manage2FA({
            mfa_enabled: "True",
            mfa_method: "2FA_PIN",
          });
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 800);
        }
      } else {
        // --- 2FA CHANGE PIN FLOW ---
        if (step === "current") {
          setIsLoading(true);
          await accountsService.initiatePinChange({ current_pin: currentPinString });
          setCurrentPin(currentPinString);
          setStep("new");
          resetDigits();
        } else if (step === "new") {
          setNewPin(currentPinString);
          setStep("confirm_new");
          resetDigits();
        } else if (step === "confirm_new") {
          if (currentPinString !== newPin) {
            setErrorMsg("PINs do not match. Please try again.");
            return;
          }
          setIsLoading(true);
          await accountsService.confirmPinChange({
            user_pin: newPin,
            confirm_pin: currentPinString,
          });
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 800);
        }
      }
    } catch (err: any) {
      console.error("2FA Action error:", err);
      setErrorMsg(formatApiError(err, "Operation failed. Please check your PIN."));
    } finally {
      setIsLoading(false);
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case "setup":
        return "Create a six digit PIN";
      case "confirm":
        return "Confirm your six digit PIN";
      case "current":
        return "Enter your current six digit PIN";
      case "new":
        return "Enter a new six digit PIN";
      case "confirm_new":
        return "Confirm your new six digit PIN";
      default:
        return "";
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Two-Factor Authentication</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>{getSubtitle()}</p>

        {/* 6 Digit Inputs */}
        <div className={styles.digitsRow}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="password"
              maxLength={1}
              className={styles.digitBox}
              value={digit}
              disabled={isLoading}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>

        {errorMsg && (
          <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          disabled={!isFormComplete || isLoading}
          className={`${styles.actionBtn} ${isFormComplete ? styles.activeAction : ""}`}
          onClick={handleAction}
          style={{ marginTop: "16px" }}
        >
          {isLoading ? (
            "Processing..."
          ) : isSuccess ? (
            <span className={styles.enabledWrap}>
              {isChangePin ? "PIN Updated" : "Enabled"}
              <span className={styles.checkCircle}>✓</span>
            </span>
          ) : step === "confirm" ? (
            "Enable 2FA"
          ) : step === "confirm_new" ? (
            "Update PIN"
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
