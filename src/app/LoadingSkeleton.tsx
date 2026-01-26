"use client";

import styles from "./style/loading-skeleton.module.css";

export default function LoadingSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: items }).map((_, idx) => (
        <div key={idx} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.textLine} />
          <div className={styles.textLineShort} />
        </div>
      ))}
    </div>
  );
}
