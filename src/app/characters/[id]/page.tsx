"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

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

  const { data, loading, error } =
    useQuery<CharacterData>(GET_CHARACTER, {
      variables: { id },
    });

  if (loading) return <p>Loading character...</p>;
  if (error || !data) return <p>Error loading character</p>;

  const char = data.character;

  return (
    <main style={{ padding: 20 }}>
      <h1>{char.name}</h1>
      <img src={char.image} width={300} />
      <p>Status: {char.status}</p>
      <p>Species: {char.species}</p>
      <p>Gender: {char.gender}</p>

      <h3>Episodes</h3>
      <ul>
        {char.episode.map((ep) => (
          <li key={ep.id}>
            {ep.episode} - {ep.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
