// LoadingSkeleton.tsx
import React from "react";
import styles from "./style/home-content.module.css";

type Props = { items: number };

export default function LoadingSkeleton({ items }: Props) {
  return (
    <div className={styles.cardsGridStatic}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.characterCard}>
          <div className={styles.imageWrapper} style={{ background: "#ccc", position: "relative" }}></div>
          <div className={styles.characterInfo}>
            <strong>Loading...</strong>
            <p>Loading • Loading • Loading</p>
          </div>
        </div>
      ))}
    </div>
  );
}
