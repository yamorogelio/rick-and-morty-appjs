"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

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
        {data.characters.results.map(
          ({ id, name, image }: Character) => (
            <Link
              key={id}
              href={`/characters/${id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "0.2s",
                  cursor: "pointer",
                }}
              >
                <img
                  src={image}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "15px", textAlign: "center" }}>
                  <h3 style={{ margin: 0 }}>{name}</h3>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
