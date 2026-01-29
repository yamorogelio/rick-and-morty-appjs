"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { MdMovie, MdSearch } from "react-icons/md";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import styles from "./style/home-content.module.css";
import LoadingSkeleton from "./LoadingSkeleton";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info { pages }
      results {
        id
        name
        image
        gender
        status
        species
      }
    }
  }
`;

type Character = {
  id: string;
  name: string | null;
  image: string | null;
  gender: string | null;
  status: string | null;
  species: string | null;
};

type CharactersData = {
  characters: {
    info: { pages: number };
    results: Character[];
  };
};

type CharactersVars = {
  page: number;
  name?: string;
};

export default function HomeContent({
  initialCharacters,
  initialPages,
}: {
  initialCharacters: Character[];
  initialPages: number;
}) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [species, setSpecies] = useState("All");
  const [page, setPage] = useState(1);

  // 🔥 SSR hydration
  const [allCharacters, setAllCharacters] = useState<Character[]>(
    initialCharacters
  );

  const { data, loading, error } = useQuery<
    CharactersData,
    CharactersVars
  >(GET_CHARACTERS, {
    variables: { page, name: search },
    notifyOnNetworkStatusChange: true,
  });

  // Sync Apollo data (keeps your logic intact)
  useEffect(() => {
    if (!data?.characters?.results) return;

    if (page === 1) {
      setAllCharacters(data.characters.results);
    } else {
      setAllCharacters((prev) => {
        const newChars = data.characters.results.filter(
          (c) => !prev.some((p) => p.id === c.id)
        );
        return [...prev, ...newChars];
      });
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter((char) =>
      (char.name ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (gender === "All" || (char.gender ?? "") === gender) &&
      (status === "All" || (char.status ?? "") === status) &&
      (species === "All" || (char.species ?? "") === species)
    );
  }, [allCharacters, search, gender, status, species]);

  const totalPages = data?.characters?.info.pages ?? initialPages;

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return <p className={styles.errorText}>Error loading characters</p>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rick & Morty Multiverse</h1>
        <p className={styles.subtitle}>
          Dive into infinite realities and iconic characters
        </p>

        {/* SEARCH + FILTERS */}
        <div className={styles.searchFilters}>
          <div className={styles.searchWrapper}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <MdSearch size={16} />
            </div>

            <div className={styles.filtersGrid}>
              {[{ value: gender, set: setGender, options: ["All","Male","Female","unknown"] },
                { value: status, set: setStatus, options: ["All","Alive","Dead","unknown"] },
                { value: species, set: setSpecies, options: ["All","Human","Alien"] }
              ].map((filter, index) => (
                <select
                  key={index}
                  value={filter.value}
                  onChange={(e) => filter.set(e.target.value)}
                >
                  {filter.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <Link href="/episodes" className={styles.episodeLink}>
            <MdMovie size={24} /> View Episodes
          </Link>
        </div>

        {/* LOADING */}
        {loading && page === 1 ? (
          <LoadingSkeleton items={6} />
        ) : (
          <>
            {/* SWIPER */}
            {filteredCharacters.length > 0 && (
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                modules={[Autoplay]}
                className={styles.swiperContainer}
              >
                {filteredCharacters.map((char, index) => (
                  <SwiperSlide key={`slide-${char.id}-${index}`}>
                    <Link
                      href={`/characters/${char.id}`}
                      className={styles.characterLink}
                    >
                      <div className={styles.characterCard}>
                        <div className={styles.imageWrapper}>
                          <Image
                            src={char.image ?? "/placeholder.png"}
                            alt={char.name ?? "Unknown"}
                            fill
                          />
                        </div>
                        <div className={styles.characterInfo}>
                          <strong>{char.name}</strong>
                          <p>
                            {char.species} • {char.gender} • {char.status}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* GRID */}
            <div className={styles.cardsGridStatic}>
              {filteredCharacters.map((char, index) => (
                <Link
                  key={`card-${char.id}-${index}`}
                  href={`/characters/${char.id}`}
                  className={styles.characterLink}
                >
                  <div className={styles.characterCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={char.image ?? "/placeholder.png"}
                        alt={char.name ?? "Unknown"}
                        fill
                      />
                    </div>
                    <div className={styles.characterInfo}>
                      <strong>{char.name}</strong>
                      <p>
                        {char.species} • {char.gender} • {char.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* LOAD MORE */}
            {page < totalPages && (
              <div className={styles.loadMoreWrapper}>
                <button
                  onClick={handleLoadMore}
                  className={styles.loadMoreButton}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}