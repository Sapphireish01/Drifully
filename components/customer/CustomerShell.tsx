"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { accountsService } from "@/services/accounts-service";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import styles from "./CustomerShell.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/customer", icon: "home-2.svg" },
  { label: "Trips", href: "/customer/trips", icon: "car.svg" },
  { label: "Notifications", href: "/customer/notifications", icon: "notification.svg" },
  { label: "Account & Rewards", href: "/customer/account-rewards", icon: "profile.svg" },
  { label: "Help & Support", href: "/customer/help-support", icon: "help&support.svg" },
];

const SIDEBAR_ICON_PATH = "/customer app/customer-sidebar-icons";

function getInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [authenticated] = useState(() =>
    typeof window !== "undefined" && Boolean(localStorage.getItem("drifully_customer_user"))
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/customer/login");
      return;
    }

    accountsService.getProfile()
      .then((data) => {
        if (data) {
          setUserProfile(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load profile for customer shell:", err);
      });
  }, [authenticated, router]);

  const handleLogout = async () => {
    try {
      await accountsService.logout();
    } finally {
      localStorage.removeItem("drifully_customer_user");
      router.push("/customer/login");
    }
  };

  if (!authenticated) return null;

  const fullName = userProfile?.full_name || "User";
  const firstName = fullName.split(" ")[0];
  const email = userProfile?.email || "";
  const address = userProfile?.address_line_1 || "No address provided";
  const avatarUrl = userProfile?.profile_picture || null;
  const initials = getInitials(fullName);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/customer" className={styles.brand} aria-label="Drifully customer dashboard">
          <svg width="150" height="46" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.98047 24.6766L16.7168 2.9187H144.08L156.816 24.6766L144.08 46.4345H16.7168L3.98047 24.6766Z" fill="white" stroke="#111111" strokeWidth="2.12272" />
            <path d="M36.4836 32.7427H30.9647L33.5141 17.3858H38.9281C40.4728 17.3858 41.755 17.7007 42.7748 18.3306C43.7996 18.9604 44.5219 19.8628 44.9419 21.0375C45.3618 22.2073 45.4368 23.6045 45.1668 25.2292C44.9069 26.7989 44.3895 28.1461 43.6146 29.2709C42.8398 30.3906 41.8475 31.2505 40.6377 31.8504C39.428 32.4452 38.0432 32.7427 36.4836 32.7427ZM34.6764 29.9607H36.671C37.6358 29.9607 38.4807 29.7808 39.2055 29.4208C39.9354 29.0609 40.5327 28.506 40.9976 27.7562C41.4676 27.0063 41.8 26.0465 41.9949 24.8768C42.1799 23.767 42.1674 22.8672 41.9575 22.1773C41.7525 21.4824 41.3551 20.975 40.7652 20.6551C40.1753 20.3302 39.4005 20.1677 38.4407 20.1677H36.3036L34.6764 29.9607ZM46.3272 32.7427L48.8767 17.3858H54.9355C56.0952 17.3858 57.0501 17.5907 57.7999 18.0006C58.5548 18.4105 59.0847 18.9929 59.3896 19.7478C59.6995 20.4976 59.772 21.3825 59.607 22.4022C59.4371 23.422 59.0697 24.2969 58.5048 25.0267C57.9449 25.7566 57.215 26.319 56.3152 26.7139C55.4204 27.1038 54.3831 27.2988 53.2033 27.2988H49.1466L49.5966 24.6893H53.1208C53.7407 24.6893 54.2706 24.6043 54.7105 24.4343C55.1504 24.2644 55.4979 24.0094 55.7528 23.6695C56.0128 23.3296 56.1827 22.9071 56.2627 22.4022C56.3477 21.8873 56.3177 21.4574 56.1727 21.1125C56.0278 20.7626 55.7653 20.4976 55.3854 20.3177C55.0055 20.1327 54.5056 20.0402 53.8857 20.0402H51.6961L49.5741 32.7427H46.3272ZM55.7753 25.7541L58.4373 32.7427H54.853L52.2735 25.7541H55.7753ZM66.1045 17.3858L63.555 32.7427H60.3082L62.8576 17.3858H66.1045ZM66.2263 32.7427L68.7758 17.3858H78.9438L78.4939 20.0627H71.5728L70.9729 23.722H77.2191L76.7692 26.3989H70.523L69.4732 32.7427H66.2263ZM90.6133 17.3858H93.8602L92.2105 27.3588C92.0256 28.4785 91.5981 29.4583 90.9283 30.2982C90.2584 31.138 89.4061 31.7929 88.3713 32.2628C87.3365 32.7277 86.1817 32.9601 84.907 32.9601C83.6322 32.9601 82.5574 32.7277 81.6826 32.2628C80.8078 31.7929 80.1754 31.138 79.7855 30.2982C79.3956 29.4583 79.2931 28.4785 79.4781 27.3588L81.1277 17.3858H84.3746L82.7624 27.0813C82.6724 27.6662 82.7174 28.1861 82.8974 28.641C83.0823 29.0959 83.3873 29.4533 83.8122 29.7133C84.2371 29.9732 84.762 30.1032 85.3869 30.1032C86.0168 30.1032 86.5866 29.9732 87.0965 29.7133C87.6114 29.4533 88.0339 29.0959 88.3638 28.641C88.6987 28.1861 88.9112 27.6662 89.0012 27.0813L90.6133 17.3858ZM93.982 32.7427L96.5315 17.3858H99.7784L97.6788 30.0657H104.262L103.813 32.7427H93.982ZM105.963 32.7427L108.512 17.3858H111.759L109.66 30.0657H116.243L115.793 32.7427H105.963ZM117.634 17.3858H121.271L123.678 23.9994H123.843L128.425 17.3858H132.061L124.818 27.3138L123.91 32.7427H120.686L121.593 27.3138L117.634 17.3858Z" fill="#111111" />
          </svg>
        </Link>
        <div className={styles.searchWrap}>
          <Image className={styles.searchIcon} src={`${SIDEBAR_ICON_PATH}/search.svg`} alt="" width={15} height={15} />
          <input className={styles.search} placeholder="Search..." aria-label="Search dashboard" />
        </div>
        <nav className={styles.nav} aria-label="Customer navigation">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/customer" && pathname.startsWith(`${item.href}/`));
            return (
              <Link key={item.href} href={item.href} className={`${styles.navLink} ${active ? styles.active : ""}`}>
                <Image className={styles.icon} src={`${SIDEBAR_ICON_PATH}/${item.icon}`} alt="" width={15} height={15} />
                {item.label}
              </Link>
            );
          })}
          <Link href="/customer/deactivate-account" className={`${styles.navLink} ${pathname.startsWith("/customer/deactivate-account") ? styles.active : ""}`}>
            <Image className={styles.icon} src={`${SIDEBAR_ICON_PATH}/deactivate.svg`} alt="" width={15} height={15} />
            Deactivate Account
          </Link>
        </nav>
        <div className={styles.sidebarBottom}>
          <button
            type="button"
            className={`${styles.navLink} ${styles.logout}`}
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <span className={styles.icon} aria-hidden="true">↪</span>
            Logout
          </button>
          <div className={styles.profile}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <span className={styles.avatar}>{initials}</span>
            )}
            <span>
              <span className={styles.profileName}>{fullName}</span>
              <span className={styles.profileEmail}>{email}</span>
            </span>
            <span className={styles.profileArrow}>›</span>
          </div>
        </div>
      </aside>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleLogout}
      />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.welcome}>
            <div className={styles.welcomeAvatarWrap}>
              <span className={styles.welcomeAvatar}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className={styles.avatarImg}
                  />
                ) : (
                  <span className={styles.avatarText}>{initials}</span>
                )}
              </span>
              <span className={styles.onlineDot} />
            </div>
            <div className={styles.welcomeTextGroup}>
              <span className={styles.welcomeTitle}>Hello {firstName},</span>
              <span className={styles.welcomeAddress}>{address}</span>
            </div>
          </div>
          <div className={styles.topActions}>
            <button className={styles.topButton} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link href="/customer/notifications" className={styles.topButton} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className={styles.notificationDot} />
            </Link>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}