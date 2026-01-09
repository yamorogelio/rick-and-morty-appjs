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

  if (loading) return <p style={{ textAlign: "center" }}>Loading episodes...</p>;
  if (error || !data)
    return <p style={{ textAlign: "center" }}>Error loading episodes</p>;

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Rick and Morty Episodes
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {data.episodes.results.map((ep) => (
          <Link
            key={ep.id}
            href={`/episodes/${ep.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 15px rgba(0,0,0,0.1)";
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#333" }}>
                {ep.episode}
              </h3>
              <p style={{ margin: 0, color: "#666" }}>{ep.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
