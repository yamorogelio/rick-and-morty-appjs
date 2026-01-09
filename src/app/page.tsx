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

  if (loading) return <p style={{ textAlign: "center" }}>Loading characters...</p>;
  if (error || !data)
    return <p style={{ textAlign: "center" }}>Error loading characters</p>;

  return (
    <main style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Link href="/episodes" style={{ textDecoration: "none", fontSize: "18px" }}>
          <MdMovie size={30} /> View Episodes
        </Link>
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Rick and Morty Characters
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "25px",
        }}
      >
        {data.characters.results.map((char) => (
          <Link
            key={char.id}
            href={`/characters/${char.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={char.image}
                alt={char.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "15px", textAlign: "center" }}>
                <h3>{char.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
