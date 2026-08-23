"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { accountsService } from "@/services/accounts-service";
import styles from "./CustomerShell.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/customer", icon: "home-2.svg" },
  { label: "Trips", href: "/customer/trips", icon: "car.svg" },
  { label: "Notifications", href: "/customer/notifications", icon: "notification.svg" },
  { label: "Account & Rewards", href: "/customer/account-rewards", icon: "profile.svg" },
  { label: "Help & Support", href: "/customer/help-support", icon: "help&support.svg" },
];

const SIDEBAR_ICON_PATH = "/customer app/customer-sidebar-icons";

export default function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated] = useState(() =>
    typeof window !== "undefined" && Boolean(localStorage.getItem("drifully_customer_user"))
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/customer/login");
    }
  }, [authenticated, router]);

  const handleLogout = async () => {
    try { await accountsService.logout(); } finally {
      localStorage.removeItem("drifully_customer_user");
      router.push("/customer/login");
    }
  };

  if (!authenticated) return null;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/customer" className={styles.brand} aria-label="Drifully customer dashboard">
          <span className={styles.brandMark}>D</span>
          <span><span className={styles.brandName}>DRIFULLY</span><span className={styles.brandType}>Car Rental</span></span>
        </Link>
        <div className={styles.searchWrap}>
          <Image className={styles.searchIcon} src={`${SIDEBAR_ICON_PATH}/search.svg`} alt="" width={15} height={15} />
          <input className={styles.search} placeholder="Search..." aria-label="Search dashboard" />
        </div>
        <nav className={styles.nav} aria-label="Customer navigation">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/customer" && pathname.startsWith(`${item.href}/`));
            return <Link key={item.href} href={item.href} className={`${styles.navLink} ${active ? styles.active : ""}`}><Image className={styles.icon} src={`${SIDEBAR_ICON_PATH}/${item.icon}`} alt="" width={15} height={15} />{item.label}</Link>;
          })}
          <Link href="/customer/deactivate-account" className={`${styles.navLink} ${pathname.startsWith("/customer/deactivate-account") ? styles.active : ""}`}><Image className={styles.icon} src={`${SIDEBAR_ICON_PATH}/deactivate.svg`} alt="" width={15} height={15} />Deactivate Account</Link>
        </nav>
        <div className={styles.sidebarBottom}>
          <button type="button" className={`${styles.navLink} ${styles.logout}`} onClick={handleLogout}><span className={styles.icon} aria-hidden="true">↪</span>Logout</button>
          <div className={styles.profile}><span className={styles.avatar}>JB</span><span><span className={styles.profileName}>James Brown</span><span className={styles.profileEmail}>james@drifully.com</span></span><span className={styles.profileArrow}>›</span></div>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.welcome}><span className={styles.welcomeAvatar}>JB</span><span><span className={styles.welcomeTitle}>Hello James,</span><span className={styles.welcomeAddress}>42 Montgomery Road</span></span></div>
          <div className={styles.topActions}><button className={styles.topButton} aria-label="Search">⌕</button><Link href="/customer/notifications" className={styles.topButton} aria-label="Notifications">♧</Link></div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}