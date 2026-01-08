"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

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

type CharactersData = {
  characters: {
    results: Character[];
  };
};

export default function HomePage() {
  const { data, loading, error } =
    useQuery<CharactersData>(GET_CHARACTERS);

  if (loading) return <p>Loading characters...</p>;
  if (error || !data) return <p>Error loading data</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Rick and Morty Characters</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: 20 }}>
        {data.characters.results.map((char) => (
          <Link key={char.id} href={`/characters/${char.id}`}>
            <div>
              <img src={char.image} width={200} />
              <h3>{char.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
