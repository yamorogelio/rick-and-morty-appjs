"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
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
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // default 12 for professional look

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id },
  });

  // Always calculate characters & pagination at the top (Hooks safe)
  const allCharacters = data?.episode.characters ?? [];
  const totalPages = Math.ceil(allCharacters.length / itemsPerPage);

  const paginatedCharacters = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allCharacters.slice(start, end);
  }, [allCharacters, page, itemsPerPage]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handleItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setPage(1);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* BACK BUTTON */}
        <Link href="/episodes" className={styles.backButton}>
          <MdArrowBack size={18} /> Back to Episodes
        </Link>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>{data?.episode.episode ?? "Loading..."}</h1>
          <p>{data?.episode.name ?? ""}</p>
        </div>

        {/* SHOW ITEMS PER PAGE - LEFT */}
        <div className={styles.itemsPerPage}>
          <label>
            Show{" "}
            <input
              type="number"
              min={1}
              value={itemsPerPage}
              onChange={handleItemsChange}
            />{" "}
            characters per page
          </label>
        </div>

        {/* LOADING & ERROR */}
        {loading && <LoadingSkeleton items={itemsPerPage} />}
        {error && <ErrorMessage message="Error loading episode" />}

        {/* CHARACTER GRID */}
        {data && (
          <div className={styles.gridCenter}>
            {paginatedCharacters.map((char) => (
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
                  <p>
                    {char.species ?? "Unknown"} • {char.gender ?? "Unknown"} •{" "}
                    {char.status ?? "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {data && allCharacters.length > itemsPerPage && (
          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
