"use client";

import { gql, useQuery } from "@apollo/client";
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

export default function EpisodesPage() {
  const { data, loading, error } = useQuery(GET_EPISODES);

  if (loading) return <p>Loading episodes...</p>;
  if (error) return <p>Error loading episodes</p>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Episodes</h1>

      <ul>
        {data.episodes.results.map((ep: Episode) => (
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
