"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
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
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id },
  });

  const allCharacters = data?.episode.characters ?? [];
  const totalPages = Math.ceil(allCharacters.length / itemsPerPage);

  const paginatedCharacters = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return allCharacters.slice(start, start + itemsPerPage);
  }, [allCharacters, page, itemsPerPage]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/episodes" className={styles.backButton}>
          <MdArrowBack size={18} /> Back to Episodes
        </Link>

        <div className={styles.header}>
          <h1>{data?.episode.episode ?? "Loading..."}</h1>
          <p>{data?.episode.name ?? ""}</p>
        </div>

        <div className={styles.itemsPerPage}>
          <label>
            Show{" "}
            <input
              type="number"
              min={1}
              value={itemsPerPage}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (v > 0) {
                  setItemsPerPage(v);
                  setPage(1);
                }
              }}
            />{" "}
            characters per page
          </label>
        </div>

        {loading && <LoadingSkeleton items={itemsPerPage} />}
        {error && <ErrorMessage message="Error loading episode" />}

        {data && (
          <div className={styles.gridCenter}>
            {paginatedCharacters.map((char) => (
              <div key={char.id} className={styles.card}>
                <img
                  src={char.image ?? "/placeholder.png"}
                  alt={char.name ?? "Unknown"}
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

        {data && allCharacters.length > itemsPerPage && (
          <div className={styles.pagination}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
