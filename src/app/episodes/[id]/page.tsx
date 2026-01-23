"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MdArrowBack, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useState, useMemo } from "react";
import styles from "../../style/episode-details.module.css";

/* GraphQL Query */
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

/* Types */
type Character = {
  id: string;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
};

type EpisodeData = {
  episode: {
    name: string;
    episode: string;
    characters: Character[];
  };
};

/* Role Summary Generator */
function getEpisodeRoleSummary(char: Character) {
  if (char.status === "Alive") {
    return `${char.name} actively participates in the events of this episode, interacting with other characters and playing a direct role in how the story develops.`;
  }
  if (char.status === "Dead") {
    return `${char.name} appears in this episode as part of the storyline, where their background or past actions influence the situation and other characters.`;
  }
  return `${char.name} has a supporting presence in this episode, contributing through brief but meaningful interactions that help move the story forward.`;
}

export default function EpisodeDetailsPage() {
  const { id } = useParams<{ id: string }>();

  /* Slider */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* Pagination */
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data, loading, error } = useQuery<EpisodeData>(GET_EPISODE, {
    variables: { id },
  });

  const characters = data?.episode.characters || [];
  const totalPages = Math.ceil(characters.length / itemsPerPage);

  const paginatedCharacters = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return characters.slice(start, end);
  }, [characters, page, itemsPerPage]);

  const activeChar =
    activeIndex !== null ? paginatedCharacters[activeIndex] : null;

  if (loading) return <p className={styles.centerText}>Loading episode...</p>;
  if (error || !data) return <p className={styles.errorText}>Error loading episode</p>;

  const { name, episode } = data.episode;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/episodes" className={styles.backButton}>
          <MdArrowBack size={18} /> Back to Episodes
        </Link>

        <div className={styles.header}>
          <h1>{episode}</h1>
          <p>{name}</p>
        </div>

        <div className={styles.controls}>
          <label>
            Show per page:
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={1}>1</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </label>
        </div>

        {/* 🔹 Fixed Grid */}
        <div className={styles.gridCenter}>
          {paginatedCharacters.map((char, index) => (
            <div
              key={char.id}
              onClick={() => setActiveIndex(index)}
              className={styles.card}
            >
              <Image
                src={char.image}
                alt={char.name}
                width={360}
                height={360}
                className={styles.image}
              />
              <div className={styles.cardName}>
                <strong>{char.name}</strong>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {activeChar && (
        <div className={styles.slider}>
          <button onClick={() => setActiveIndex(null)} className={styles.close}>
            <MdClose />
          </button>

          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev! > 0 ? prev! - 1 : paginatedCharacters.length - 1
              )
            }
            className={styles.prev}
          >
            <MdChevronLeft />
          </button>

          <div className={styles.sliderContent}>
            <Image
              src={activeChar.image}
              alt={activeChar.name}
              width={400}
              height={400}
              className={styles.sliderImage}
            />

            <h2>{activeChar.name}</h2>

            <p className={styles.species}>
              {activeChar.species} • {activeChar.gender}
            </p>

            <p className={styles.status}>Status: {activeChar.status}</p>

            <p className={styles.roleSummary}>
              {getEpisodeRoleSummary(activeChar)}
            </p>
          </div>

          <button
            onClick={() =>
              setActiveIndex((prev) =>
                prev! < paginatedCharacters.length - 1 ? prev! + 1 : 0
              )
            }
            className={styles.next}
          >
            <MdChevronRight />
          </button>
        </div>
      )}
    </main>
  );
}