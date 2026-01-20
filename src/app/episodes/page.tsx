"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import styles from "../style/episodes-page.module.css";

/* GraphQL Query */
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

type Episode = { id: string; name: string; episode: string; };
type EpisodesData = { episodes: { results: Episode[] } };

export default function EpisodesPage() {
  const { data, loading, error } = useQuery<EpisodesData>(GET_EPISODES);

  if (loading) return <p className={styles.centerText}>Loading episodes...</p>;
  if (error || !data) return <p className={styles.errorText}>Error loading episodes</p>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rick & Morty Episodes</h1>

        {/* Back Button */}
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
      </div>
    </main>
  );
}
