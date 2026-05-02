import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  id?: string;
}

export default function StatCard({ label, value, accent, id }: StatCardProps) {
  return (
    <div className={styles.card} id={id}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueArea}>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
}
