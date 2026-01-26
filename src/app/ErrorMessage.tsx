"use client";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <p style={{ textAlign: "center", color: "#ff6b6b" }}>
      {message}
    </p>
  );
}
