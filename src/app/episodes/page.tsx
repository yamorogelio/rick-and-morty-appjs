"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";

const GET_EPISODES = gql`
  query GetEpisodes {
    episodes {
      results {
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

type EpisodesData = {
  episodes: {
    results: Episode[];
  };
};

export default function EpisodesPage() {
  const { data, loading, error } =
    useQuery<EpisodesData>(GET_EPISODES);

  if (loading) return <p>Loading episodes...</p>;
  if (error || !data) return <p>Error loading episodes</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Episodes</h1>
      <ul>
        {data.episodes.results.map((ep) => (
          <li key={ep.id}>
            <Link href={`/episodes/${ep.id}`}>
              {ep.name} ({ep.episode})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
