"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { MdMovie } from "react-icons/md";

/* GraphQL Query */
const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results { 
        id  
        name
        image
      }
    }
  }
`;

/* Types */
type Character = {
  id: string;
  name: string;
  image: string;
};

type CharactersData = {
  characters: {
    results: Character[];
  };
};

export default function HomePage() {
  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading characters...</p>;

  if (error || !data)
    return <p style={{ textAlign: "center", color: "red" }}>Error loading characters</p>;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "70px 20px",
        background:
          "radial-gradient(circle at 20% 20%, #22c55e33, transparent 40%), radial-gradient(circle at 80% 0%, #0ea5e933, transparent 35%), linear-gradient(180deg, #020617, #020617)",
      }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        {/* Top Action */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            href="/episodes"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 26px",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: "800",
              color: "#022c22",
              background: "linear-gradient(135deg, #4ade80, #22c55e)",
              boxShadow:
                "0 0 30px rgba(34,197,94,0.7), inset 0 0 10px rgba(255,255,255,0.5)",
            }}
          >
            <MdMovie size={24} />
            View Episodes
          </Link>
        </div>

        {/* Hero */}
        <h1
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "50px",
            fontWeight: "900",
            color: "#ecfeff",
            letterSpacing: "2px",
            textShadow:
              "0 0 25px rgba(34,197,94,0.8), 0 0 60px rgba(14,165,233,0.4)",
          }}
        >
          Rick & Morty Multiverse
        </h1>

        <p
          style={{
            textAlign: "center",
            margin: "15px 0 70px",
            fontSize: "19px",
            color: "#99f6e4",
          }}
        >
          Dive into infinite realities and iconic characters
        </p>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "45px",
          }}
        >
          {data.characters.results.map((char) => (
            <Link
              key={char.id}
              href={`/characters/${char.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.6)",
                  transition: "all 0.45s ease",
                  background:
                    "linear-gradient(180deg, rgba(34,197,94,0.2), rgba(0,0,0,0.2))",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-18px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 45px 120px rgba(34,197,94,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 80px rgba(0,0,0,0.6)";
                }}
              >
                {/* Image */}
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />

                {/* Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.1), transparent)",
                  }}
                />

                {/* Name */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "22px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "900",
                      color: "#ecfeff",
                      textShadow:
                        "0 0 15px rgba(34,197,94,0.7)",
                    }}
                  >
                    {char.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
