"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { MdMovie, MdSearch } from "react-icons/md";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import styles from "./style/home-content.module.css";

/* GraphQL Query */
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        pages
      }
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

/* Types */
type Character = {
  id: string;
  name: string;
  image: string;
  gender: string;
  status: string;
  species: string;
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

export default function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [species, setSpecies] = useState("All");
  const [page, setPage] = useState(1);

  /* Apollo useQuery with proper typing */
  const { data, loading, error, fetchMore } = useQuery<
    CharactersData,
    CharactersVars
  >(GET_CHARACTERS, {
    variables: { page, name: search },
  });

  const filteredCharacters = useMemo(() => {
    if (!data?.characters?.results) return [];
    return data.characters.results.filter((char) => {
      return (
        char.name.toLowerCase().includes(search.toLowerCase()) &&
        (gender === "All" || char.gender === gender) &&
        (status === "All" || char.status === status) &&
        (species === "All" || char.species === species)
      );
    });
  }, [data, search, gender, status, species]);

  if (loading) return <p className={styles.centerText}>Loading...</p>;
  if (error || !data)
    return <p className={styles.errorText}>Error loading characters</p>;

  /* Load More Handler */
  const handleLoadMore = () => {
    if (page < data.characters.info.pages) {
      const nextPage = page + 1;
      fetchMore({
        variables: { page: nextPage, name: search },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            characters: {
              info: fetchMoreResult.characters.info,
              results: [
                ...prev.characters.results,
                ...fetchMoreResult.characters.results,
              ],
            },
          };
        },
      });
      setPage(nextPage);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rick & Morty Multiverse</h1>
        <p className={styles.subtitle}>
          Dive into infinite realities and iconic characters
        </p>

        {/* Search & Filters */}
        <div className={styles.searchFilters}>
          <div className={styles.searchBox}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <MdSearch size={16} />
            </div>

            <div className={styles.filtersGrid}>
              {[
                {
                  value: gender,
                  set: setGender,
                  options: ["All", "Male", "Female", "unknown"],
                },
                {
                  value: status,
                  set: setStatus,
                  options: ["All", "Alive", "Dead", "unknown"],
                },
                {
                  value: species,
                  set: setSpecies,
                  options: ["All", "Human", "Alien"],
                },
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
            <MdMovie size={24} />
            View Episodes
          </Link>
        </div>

        {/* Slider Section */}
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
                  <div style={{ position: "relative", height: "350px" }}>
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      style={{ objectFit: "cover" }}
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

        {/* Static Cards Grid */}
        <div className={styles.cardsGridStatic}>
          {filteredCharacters.map((char, index) => (
            <Link
              key={`card-${char.id}-${index}`}
              href={`/characters/${char.id}`}
              className={styles.characterLink}
            >
              <div className={styles.characterCard}>
                <div style={{ position: "relative", height: "350px" }}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    style={{ objectFit: "cover" }}
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

        {/* Load More Button */}
        {page < data.characters.info.pages && (
          <div className={styles.loadMoreWrapper}>
            <button
              onClick={handleLoadMore}
              className={styles.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
