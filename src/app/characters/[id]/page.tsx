"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

/* GraphQL Query */
const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      gender
      episode {
        id
        name
        episode
      }
    }
  }
`;

/* Types */
type Episode = {
  id: string;
  name: string;
  episode: string;
};

type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  episode: Episode[];
};

type CharacterData = {
  character: Character;
};

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id },
  });

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#fff" }}>
        Loading character...
      </p>
    );

  if (error || !data)
    return (
      <p style={{ textAlign: "center", color: "#ff6b6b" }}>
        Error loading character
      </p>
    );

  const { character: char } = data;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background:
          "radial-gradient(circle at 20% 10%, #0f172a, transparent 40%), radial-gradient(circle at 80% 0%, #1e3a8a, transparent 35%), linear-gradient(180deg, #0f172a, #0f172a)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {/* Left: Profile */}
        <div
          style={{
            flex: "0 0 320px",
            position: "sticky",
            top: "20px",
            alignSelf: "flex-start",
            background: "#1e293b",
            borderRadius: "28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            padding: "40px",
            color: "#f8fafc",
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "8px 16px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#22c55e",
              color: "#1e293b",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          {/* Name */}
          <h1
            style={{
              textAlign: "center",
              fontSize: "44px",
              fontWeight: "900",
              marginBottom: "30px",
              letterSpacing: "1.5px",
              color: "#fef08a",
              textShadow:
                "0 0 15px rgba(254, 208, 8,0.6), 0 0 30px rgba(34,197,94,0.4)",
            }}
          >
            {char.name}
          </h1>

          {/* Image */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <Image
              src={char.image}
              alt={char.name}
              width={260}
              height={260}
              priority
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "6px solid #22c55e",
                boxShadow:
                  "0 0 30px rgba(34,197,94,0.6), 0 0 60px rgba(34,197,94,0.4)",
              }}
            />
          </div>

          {/* Info Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "40px",
            }}
          >
            {[
              { label: "Status", value: char.status },
              { label: "Species", value: char.species },
              { label: "Gender", value: char.gender },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "14px 22px",
                  borderRadius: "999px",
                  fontWeight: "700",
                  background: "#334155",
                  color: "#fef08a",
                  boxShadow: "0 0 15px rgba(34,197,94,0.4)",
                }}
              >
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Episodes */}
        <div
          style={{
            flex: 1,
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontSize: "26px",
              marginBottom: "20px",
              textAlign: "center",
              color: "#fef08a",
            }}
          >
            Episodes Appeared In
          </h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {char.episode.map((ep) => (
              <li
                key={ep.id}
                style={{
                  marginBottom: "14px",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#1e293b",
                  color: "#f8fafc",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
                }}
              >
                <strong style={{ color: "#22c55e" }}>
                  {ep.episode}
                </strong>{" "}
                — {ep.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
