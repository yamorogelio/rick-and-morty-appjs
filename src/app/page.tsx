"use client";

import { Suspense } from "react";
import HomeContent from "./home-content";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <p style={{ textAlign: "center", color: "#fff" }}>
          Loading...
        </p>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
