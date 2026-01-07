"use client";

import React from "react";
import { gql } from "@apollo/client"; 
import { useQuery } from "@apollo/client/react"; 
import Link from "next/link";

// GraphQL query to get characters
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

type Character = {
  id: string;
  name: string;
  image: string;
};

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Rick and Morty Characters</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 200px)",
          gap: "20px",
        }}
      >
        {data.characters.results.map((char: Character) => (
          <Link key={char.id} href={`/characters/${char.id}`}>
            <div style={{ cursor: "pointer" }}>
              <img src={char.image} alt={char.name} width={200} />
              <h3>{char.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
