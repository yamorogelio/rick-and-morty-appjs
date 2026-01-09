"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";

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

type Episode = {
  name: string;
  episode: string;
  characters: Character[];
};

type EpisodeData = {
  episode: Episode;
};

export default function EpisodeDetailsPage() {
  const params = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading episode...</p>;
  if (error || !data) return <p>Error loading episode</p>;

  const { name, episode, characters } = data.episode;

  return (
    <main style={{ padding: "30px" }}>
      <h1>
        {episode} - {name}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {characters.map((char) => (
          <div
            key={char.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={char.image}
              alt={char.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3>{char.name}</h3>
            <p>Species: {char.species}</p>
            <p>Status: {char.status}</p>
            <p>Gender: {char.gender}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
