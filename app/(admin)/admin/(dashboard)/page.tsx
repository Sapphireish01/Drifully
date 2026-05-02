import StatCard from "@/components/admin/StatCard";
import { DASHBOARD_STATS, RECENT_BOOKINGS, RECENT_ACTIVITY } from "@/data/admin-mock";
import styles from "./page.module.css";

/* ─── Status badge color helper ─── */
function statusClass(status: string) {
  switch (status) {
    case "active": return styles.statusActive;
    case "completed": return styles.statusCompleted;
    case "pending": return styles.statusPending;
    case "cancelled": return styles.statusCancelled;
    default: return "";
  }
}

/* ─── Activity icon helper ─── */
function ActivityIcon({ type }: { type: string }) {
  const size = 16;
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case "booking":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case "return":
      return <svg {...props}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>;
    case "user":
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>;
    case "payment":
      return <svg {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
    case "vehicle":
      return <svg {...props}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      {/* Stat Cards */}
      <div className={styles.statsGrid} id="admin-stats">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            id={`stat-${stat.id}`}
          />
        ))}
      </div>

      {/* Main content grid: Recent Bookings + Activity */}
      <div className={styles.contentGrid}>
        {/* Recent Bookings */}
        <div className={styles.card} id="admin-recent-bookings">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Bookings</h2>
            <button className={styles.viewAll}>View All</button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((booking) => (
                  <tr key={booking.id}>
                    <td className={styles.mono}>{booking.id}</td>
                    <td>{booking.customer}</td>
                    <td>{booking.vehicle}</td>
                    <td className={styles.dateCell}>
                      {new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" – "}
                      {new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className={styles.amountCell}>{booking.amount}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.card} id="admin-recent-activity">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
          </div>
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <ActivityIcon type={item.type} />
                </div>
                <div className={styles.activityContent}>
                  <span className={styles.activityAction}>{item.action}</span>
                  <span className={styles.activityDetail}>{item.detail}</span>
                </div>
                <span className={styles.activityTime}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
