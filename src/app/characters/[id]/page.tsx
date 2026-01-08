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

  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id },
  });

  if (loading) return <p style={{ textAlign: "center" }}>Loading character...</p>;
  if (error || !data) return <p style={{ textAlign: "center", color: "red" }}>Error loading character</p>;

  const char = data.character;

  return (
    <main
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: 600,
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 20, color: "#333" }}>{char.name}</h1>
        <img
          src={char.image}
          alt={char.name}
          width={250}
          height={250}
          style={{ borderRadius: "50%", marginBottom: 20, objectFit: "cover" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
          <p><strong>Status:</strong> {char.status}</p>
          <p><strong>Species:</strong> {char.species}</p>
          <p><strong>Gender:</strong> {char.gender}</p>
        </div>

        <h3 style={{ marginTop: 10, color: "#555" }}>Episodes</h3>
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {char.episode.map((ep) => (
            <li
              key={ep.id}
              style={{
                backgroundColor: "#f0f0f0",
                marginBottom: 8,
                padding: 10,
                borderRadius: 8,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <strong>{ep.episode}</strong> - {ep.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
