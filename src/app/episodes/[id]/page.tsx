"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import styles from "../../style/episode-details.module.css";
import LoadingSkeleton from "../../LoadingSkeleton";
import ErrorMessage from "../../ErrorMessage";

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

type Character = {
  id: string;
  name: string | null;
  image: string | null;
  species: string | null;
  status: string | null;
  gender: string | null;
};

type EpisodeData = {
  episode: {
    name: string | null;
    episode: string | null;
    characters: Character[];
  };
};

export default function EpisodeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [itemsPerPage] = useState(12);

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id },
  });

  if (loading) return <LoadingSkeleton items={itemsPerPage} />;
  if (error || !data) return <ErrorMessage message="Error loading episode" />;

  const characters = data.episode.characters ?? [];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/episodes" className={styles.backButton}>
          <MdArrowBack size={18} /> Back to Episodes
        </Link>

        <div className={styles.header}>
          <h1>{data.episode.episode}</h1>
          <p>{data.episode.name}</p>
        </div>

        <div className={styles.gridCenter}>
          {characters.map((char) => (
            <div key={char.id} className={styles.card}>
              <Image
                src={char.image ?? "/placeholder.png"}
                alt={char.name ?? "Unknown"}
                width={360}
                height={360}
                className={styles.image}
              />
              <div className={styles.cardName}>
                <strong>{char.name ?? "Unknown"}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
