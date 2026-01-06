"use client";

import React from "react";
import { gql } from "@apollo/client"; // ✅ gql from here
import { useQuery } from "@apollo/client/react"; // ✅ useQuery from react
import { useParams } from "next/navigation";

// GraphQL query to get character by id
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

export default function CharacterPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const { data, loading, error } = useQuery(GET_CHARACTER, {
    variables: { id },
  });

  if (loading) return <p>Loading character...</p>;
  if (error) return <p>Error loading character</p>;

  const char: Character = data.character;

  return (
    <main style={{ padding: "20px" }}>
      <h1>{char.name}</h1>
      <img src={char.image} alt={char.name} width={300} />
      <p>Status: {char.status}</p>
      <p>Species: {char.species}</p>
      <p>Gender: {char.gender}</p>

      <h2>Episodes:</h2>
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
