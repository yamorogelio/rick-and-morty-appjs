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

type Episode = { id: string; name: string | null; episode: string | null };

type EpisodesData = {
  episodes: {
    info: {
      pages: number | null;
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

  const episodes = data.episodes.results ?? [];
  const totalPages = data.episodes.info.pages ?? 1;
  const prevPage = data.episodes.info.prev ?? null;
  const nextPage = data.episodes.info.next ?? null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rick & Morty Episodes</h1>

        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>

        <div className={styles.episodesGrid}>
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/episodes/${ep.id}`}
              className={styles.episodeCard}
            >
              <div className={styles.episodeCode}>{ep.episode ?? "Unknown Code"}</div>
              <div className={styles.episodeName}>{ep.name ?? "Unknown Name"}</div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button disabled={!prevPage} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button disabled={!nextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
