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
  query GetCharacters {
    characters {
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
  name: string;
  image: string;
  gender: string;
  status: string;
  species: string;
};

type CharactersData = {
  characters: {
    results: Character[];
  };
};

export default function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [species, setSpecies] = useState("All");

  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);

  const filteredCharacters = useMemo(() => {
    if (!data) return [];
    return data.characters.results.filter((char) => {
      return (
        char.name.toLowerCase().includes(search.toLowerCase()) &&
        (gender === "All" || char.gender === gender) &&
        (status === "All" || char.status === status) &&
        (species === "All" || char.species === species)
      );
    });
  }, [data, search, gender, status, species]);

  if (loading)
    return <p className={styles.centerText}>Loading...</p>;

  if (error || !data)
    return <p className={styles.errorText}>Error loading characters</p>;

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
                onChange={(e) => setSearch(e.target.value)}
              />
              <MdSearch size={16} />
            </div>

            <div className={styles.filtersGrid}>
              {[
                { value: gender, set: setGender, options: ["All", "Male", "Female", "unknown"] },
                { value: status, set: setStatus, options: ["All", "Alive", "Dead", "unknown"] },
                { value: species, set: setSpecies, options: ["All", "Human", "Alien"] },
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

        {/* Slider Section (keep height 350px) */}
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          modules={[Autoplay]}
          className={styles.swiperContainer}
        >
          {filteredCharacters.map((char) => (
            <SwiperSlide key={char.id}>
              <Link href={`/characters/${char.id}`} className={styles.characterLink}>
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

        {/* Static Cards Grid (same layout & image height) */}
        <div className={styles.cardsGridStatic}>
          {filteredCharacters.map((char) => (
            <Link key={char.id} href={`/characters/${char.id}`} className={styles.characterLink}>
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
      </div>
    </main>
  );
}
