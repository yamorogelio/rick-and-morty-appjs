"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      name
      episode
      air_date
      characters {
        id
        name
      }
    }
  }
`;

type EpisodeData = {
  episode: {
    name: string;
    episode: string;
    air_date: string;
    characters: { id: string; name: string }[];
  };
};

export default function EpisodePage({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, error } =
    useQuery<EpisodeData>(GET_EPISODE, {
      variables: { id: params.id },
    });

  if (loading) return <p>Loading episode...</p>;
  if (error || !data) return <p>Error loading episode</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>{data.episode.name}</h1>
      <p>{data.episode.episode}</p>
      <p>{data.episode.air_date}</p>

      <ul>
        {data.episode.characters.map((char) => (
          <li key={char.id}>{char.name}</li>
        ))}
      </ul>
    </main>
  );
}
