"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState } from "react";
import styles from "../style/episodes-page.module.css";

/* GraphQL Query */
const GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        episode
      }
    }
  }
`;

type Episode = { id: string; name: string; episode: string };

type EpisodesData = {
  episodes: {
    info: {
      pages: number;
      next: number | null;
      prev: number | null;
    };
    results: Episode[];
  };
};

export default function EpisodesPage() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<EpisodesData>(GET_EPISODES, {
    variables: { page },
  });

  if (loading) return <p className={styles.centerText}>Loading episodes...</p>;
  if (error || !data) return <p className={styles.errorText}>Error loading episodes</p>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rick & Morty Episodes</h1>

        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        <div className={styles.episodesGrid}>
          {data.episodes.results.map((ep) => (
            <Link key={ep.id} href={`/episodes/${ep.id}`} className={styles.episodeCard}>
              <div className={styles.episodeCode}>{ep.episode}</div>
              <div className={styles.episodeName}>{ep.name}</div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            disabled={!data.episodes.info.prev}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {data.episodes.info.pages}
          </span>

          <button
            disabled={!data.episodes.info.next}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
