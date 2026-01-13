"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Image from "next/image";

/* GraphQL Query */
const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      name
      episode
      characters {
        id
        name
        image
        species
        status
        gender
      }
    }
  }
`;

/* Types */
type Character = {
  id: string;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
};

type Episode = {
  name: string;
  episode: string;
  characters: Character[];
};

type EpisodeData = {
  episode: Episode;
};

export default function EpisodeDetailsPage() {
  const params = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id: params.id },
  });

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading episode...</p>;

  if (error || !data)
    return <p style={{ textAlign: "center", color: "red" }}>Error loading episode</p>;

  const { name, episode, characters } = data.episode;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background:
          "radial-gradient(circle at 20% 10%, #22c55e33, transparent 40%), radial-gradient(circle at 80% 0%, #0ea5e933, transparent 35%), linear-gradient(180deg, #020617, #020617)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Episode Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "900",
              letterSpacing: "1.5px",
              color: "#ecfeff",
              textShadow:
                "0 0 25px rgba(34,197,94,0.8), 0 0 60px rgba(14,165,233,0.4)",
            }}
          >
            {episode}
          </h1>

          <p style={{ marginTop: "10px", fontSize: "22px", color: "#99f6e4" }}>
            {name}
          </p>
        </div>

        {/* Characters Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "40px",
          }}
        >
          {characters.map((char) => (
            <div
              key={char.id}
              style={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(34,197,94,0.35)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
                transition: "all 0.4s ease",
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
                  "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 25px 60px rgba(0,0,0,0.55)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "260px",
                }}
              >
                <Image
                  src={char.image}
                  alt={char.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </div>

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.1), transparent)",
                }}
              />

              {/* Character Info */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  padding: "18px",
                  textAlign: "center",
                  color: "#ecfeff",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "900",
                    textShadow:
                      "0 0 15px rgba(34,197,94,0.7)",
                  }}
                >
                  {char.name}
                </h3>

                <p style={{ margin: "6px 0", fontSize: "14px", color: "#a7f3d0" }}>
                  {char.species} • {char.gender}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "700",
                    color:
                      char.status === "Alive"
                        ? "#4ade80"
                        : char.status === "Dead"
                        ? "#f87171"
                        : "#facc15",
                  }}
                >
                  {char.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
