"use client";

import { gql, useQuery } from "@apollo/client";

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

type PageProps = {
  params: {
    id: string;
  };
};

export default function EpisodePage({ params }: PageProps) {
  const { data, loading, error } = useQuery(GET_EPISODE, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading episode...</p>;
  if (error) return <p>Error loading episode</p>;

  const episode = data.episode;

  return (
    <main style={{ padding: "20px" }}>
      <h1>{episode.name}</h1>
      <p>Episode: {episode.episode}</p>
      <p>Air Date: {episode.air_date}</p>

      <h3>Characters:</h3>
      <ul>
        {episode.characters.map((char: { id: string; name: string }) => (
          <li key={char.id}>{char.name}</li>
        ))}
      </ul>
    </main>
  );
}
