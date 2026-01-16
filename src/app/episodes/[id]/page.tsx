"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MdArrowBack,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useState } from "react";

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

type EpisodeData = {
  episode: {
    name: string;
    episode: string;
    characters: Character[];
  };
};

/* 🔹 Role Summary Generator */
function getEpisodeRoleSummary(char: Character) {
  if (char.status === "Alive") {
    return `${char.name} actively participates in the events of this episode, interacting with other characters and playing a direct role in how the story develops.`;
  }

  if (char.status === "Dead") {
    return `${char.name} appears in this episode as part of the storyline, where their background or past actions influence the situation and other characters.`;
  }

  return `${char.name} has a supporting presence in this episode, contributing through brief but meaningful interactions that help move the story forward.`;
}

export default function EpisodeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id },
  });

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#fff" }}>
        Loading episode...
      </p>
    );

  if (error || !data)
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Error loading episode
      </p>
    );

  const { name, episode, characters } = data.episode;
  const activeChar =
    activeIndex !== null ? characters[activeIndex] : null;

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
        {/* Back */}
        <Link
          href="/episodes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "35px",
            padding: "10px 18px",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: "700",
            color: "#ecfeff",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.4)",
          }}
        >
          <MdArrowBack size={18} />
          Back to Episodes
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "900",
              color: "#ecfeff",
            }}
          >
            {episode}
          </h1>

          <p style={{ fontSize: "22px", color: "#99f6e4" }}>
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
          {characters.map((char, index) => (
            <div
              key={char.id}
              onClick={() => setActiveIndex(index)}
              style={{
                cursor: "pointer",
                borderRadius: "22px",
                overflow: "hidden",
                border: "1px solid rgba(34,197,94,0.35)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                transition: "transform 0.3s",
              }}
            >
              <Image
                src={char.image}
                alt={char.name}
                width={300}
                height={300}
                style={{
                  width: "100%",
                  height: "260px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "14px",
                  textAlign: "center",
                  color: "#ecfeff",
                }}
              >
                <strong>{char.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 CHARACTER SLIDER */}
      {activeChar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          {/* Close */}
          <button
            onClick={() => setActiveIndex(null)}
            style={{
              position: "absolute",
              top: 30,
              right: 30,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "32px",
              cursor: "pointer",
            }}
          >
            <MdClose />
          </button>

          {/* Prev */}
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev! > 0 ? prev! - 1 : characters.length - 1
              )
            }
            style={{
              position: "absolute",
              left: 20,
              fontSize: "42px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <MdChevronLeft />
          </button>

          {/* Content */}
          <div
            style={{
              maxWidth: "420px",
              textAlign: "center",
              color: "#ecfeff",
            }}
          >
            <Image
              src={activeChar.image}
              alt={activeChar.name}
              width={400}
              height={400}
              style={{ borderRadius: "22px" }}
            />

            <h2 style={{ marginTop: "20px" }}>
              {activeChar.name}
            </h2>

            <p style={{ color: "#a7f3d0" }}>
              {activeChar.species} • {activeChar.gender}
            </p>

            <p style={{ fontWeight: "700" }}>
              Status: {activeChar.status}
            </p>

            {/* Understandable Role Summary */}
            <p
              style={{
                marginTop: "22px",
                lineHeight: 1.7,
                color: "#e5e7eb",
              }}
            >
              {getEpisodeRoleSummary(activeChar)}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev! < characters.length - 1 ? prev! + 1 : 0
              )
            }
            style={{
              position: "absolute",
              right: 20,
              fontSize: "42px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <MdChevronRight />
          </button>
        </div>
      )}
    </main>
  );
}
