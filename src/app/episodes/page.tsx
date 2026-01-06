"use client";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_EPISODES = gql`
  query {
    episodes {
      results {
        id
        name
        episode
      }
    }
  }
`;

export default function EpisodesPage() {
  const { data, loading, error } = useQuery(GET_EPISODES);

  if (loading) return <p>Loading episodes...</p>;
  if (error) return <p>Error loading episodes</p>;

  return (
    <div>
      <h1>Episodes</h1>

      {data.episodes.results.map((ep: any) => (
        <div key={ep.id}>
          <p>
            {ep.name} ({ep.episode})
          </p>
          <Link href={`/episodes/${ep.id}`}>
            View Episode
          </Link>
        </div>
      ))}
    </div>
  );
}
