"use client";

import React from "react";
import Link from "next/link";
import styles from "./NotificationsPage.module.css";

interface NotificationItem {
  id: string;
  title: string;
  statusIcon?: "check" | "cross";
  timestamp: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  hasContactSupportLink?: boolean;
  complaintDetails?: {
    category: string;
    description: string;
    attachment?: {
      name: string;
      size: string;
      ext: string;
    };
  };
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Your car is on the way!",
    timestamp: "2 hours ago",
    description: "Your driver is heading to the pickup location.",
  },
  {
    id: "2",
    title: "Booking Confirmed",
    statusIcon: "check",
    timestamp: "2 hours ago",
    description: "Your vehicle has been successfully booked. Pick-up Toyota Corolla 2026 on 30 May 2026.",
    actionText: "View Bookings",
    actionHref: "/customer/trips",
  },
  {
    id: "3",
    title: "Booking Cancelled",
    statusIcon: "cross",
    timestamp: "2 hours ago",
    description: "Your vehicle reservation has been cancelled. If it wasn't you ",
    hasContactSupportLink: true,
  },
  {
    id: "4",
    title: "Complaint Received",
    timestamp: "2 hours ago",
    description: "Your complaint has been logged and our team will review it shortly.",
    complaintDetails: {
      category: "Payment Issues",
      description: "Still stuff about the payemnt",
      attachment: {
        name: "Issue.png",
        size: "120 KB",
        ext: "PNG",
      },
    },
  },
  {
    id: "5",
    title: "Booking Confirmed",
    statusIcon: "check",
    timestamp: "2 hours ago",
    description: "Your vehicle has been successfully booked. Pick-up Toyota Corolla 2026 on 30 May 2026.",
    actionText: "View Bookings",
    actionHref: "/customer/trips",
  },
];

export default function NotificationsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.notificationsList}>
        {MOCK_NOTIFICATIONS.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.itemHeader}>
              <div className={styles.titleRow}>
                <h3 className={styles.title}>{item.title}</h3>
                {item.statusIcon === "check" && (
                  <span className={styles.statusIconGreen}>✓</span>
                )}
                {item.statusIcon === "cross" && (
                  <span className={styles.statusIconRed}>✕</span>
                )}
              </div>
              <span className={styles.timestamp}>{item.timestamp}</span>
            </div>

            {item.description && (
              <p className={styles.description}>
                {item.description}
                {item.hasContactSupportLink && (
                  <Link href="/customer/help-support" className={styles.contactLink}>
                    contact support
                  </Link>
                )}
              </p>
            )}

            {item.actionText && item.actionHref && (
              <Link href={item.actionHref} className={styles.actionBtn}>
                {item.actionText}
              </Link>
            )}

            {item.complaintDetails && (
              <div className={styles.complaintSection}>
                <div className={styles.fieldLabel}>Category</div>
                <div className={styles.fieldValue}>{item.complaintDetails.category}</div>

                <div className={styles.fieldLabel} style={{ marginTop: "8px" }}>
                  Description
                </div>
                <div className={styles.fieldValue}>{item.complaintDetails.description}</div>

                {item.complaintDetails.attachment && (
                  <div className={styles.attachmentCard}>
                    <div className={styles.fileBadge}>
                      {item.complaintDetails.attachment.ext}
                    </div>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileName}>
                        {item.complaintDetails.attachment.name}
                      </span>
                      <span className={styles.fileSize}>
                        {item.complaintDetails.attachment.size} •
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
