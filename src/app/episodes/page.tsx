"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

const GET_EPISODES = gql`
  query GetEpisodes {
    episodes {
      results {
        id
        name
        episode
      }
    }
  }
`;

type Episode = {
  id: string;
  name: string;
  episode: string;
};

type EpisodesData = {
  episodes: {
    results: Episode[];
  };
};

export default function EpisodesPage() {
  const { data, loading, error } = useQuery<EpisodesData>(GET_EPISODES);

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading episodes...</p>;

  if (error || !data)
    return <p style={{ textAlign: "center", color: "red" }}>Error loading episodes</p>;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background:
          "radial-gradient(circle at 20% 10%, #22c55e33, transparent 40%), radial-gradient(circle at 80% 0%, #0ea5e933, transparent 35%), linear-gradient(180deg, #020617, #020617)",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "60px",
            fontSize: "44px",
            fontWeight: "900",
            letterSpacing: "1.5px",
            color: "#ecfeff",
            textShadow:
              "0 0 25px rgba(34,197,94,0.8), 0 0 60px rgba(14,165,233,0.4)",
          }}
        >
          Rick and Morty Episodes
        </h1>

        {/* Episodes Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "35px",
          }}
        >
          {data.episodes.results.map((ep, index) => (
            <Link
              key={ep.id}
              href={`/episodes/${ep.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "24px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.55)",
                  transition: "all 0.4s ease",
                  transform: `translateY(${index % 2 === 0 ? "0px" : "10px"})`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-14px) scale(1.04)";
                  e.currentTarget.style.boxShadow =
                    "0 35px 90px rgba(34,197,94,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    `translateY(${index % 2 === 0 ? "0px" : "10px"}) scale(1)`;
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(0,0,0,0.55)";
                }}
              >
                {/* Episode Code */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "12px",
                    color: "#86efac",
                    letterSpacing: "1px",
                  }}
                >
                  {ep.episode}
                </div>

                {/* Episode Name */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "900",
                    color: "#ecfeff",
                    textShadow: "0 0 12px rgba(34,197,94,0.5)",
                  }}
                >
                  {ep.name}
                </h3>

                {/* Glow Line */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    background:
                      "linear-gradient(90deg, transparent, #22c55e, transparent)",
                    opacity: 0.6,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
