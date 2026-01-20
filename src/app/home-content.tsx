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
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;

  if (error || !data)
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Error loading characters
      </p>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "70px 20px",
        background:
          "radial-gradient(circle at 20% 20%, #22c55e33, transparent 40%), radial-gradient(circle at 80% 0%, #0ea5e933, transparent 35%), linear-gradient(180deg, #020617, #020617)",
      }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: "50px",
            fontWeight: "900",
            color: "#ecfeff",
          }}
        >
          Rick & Morty Multiverse
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#99f6e4",
          }}
        >
          Dive into infinite realities and iconic characters
        </p>

        {/* Search + Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "50px",
          }}
        >
          <div style={{ maxWidth: "320px", width: "100%" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backgroundColor: "#1b1f2a",
                  color: "#fff",
                }}
              />
              <MdSearch
                size={16}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "12px",
                  transform: "translateY(-50%)",
                  color: "#fff",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
              }}
            >
              {[
                { value: gender, set: setGender, options: ["All", "Male", "Female", "unknown"] },
                { value: status, set: setStatus, options: ["All", "Alive", "Dead", "unknown"] },
                { value: species, set: setSpecies, options: ["All", "Human", "Alien"] },
              ].map((filter, index) => (
                <select
                  key={index}
                  value={filter.value}
                  onChange={(e) => filter.set(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "14px",
                    backgroundColor: "#1b1f2a",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "13px",
                  }}
                >
                  {filter.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          <Link
            href="/episodes"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 26px",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: "800",
              color: "#022c22",
              background: "linear-gradient(135deg, #4ade80, #22c55e)",
            }}
          >
            <MdMovie size={24} />
            View Episodes
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          modules={[Autoplay]}
          style={{ width: "90%", margin: "0 auto", padding: "10px 0" }}
        >
          {filteredCharacters.map((char) => (
            <SwiperSlide key={char.id}>
              <Link href={`/characters/${char.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    position: "relative",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                    cursor: "pointer",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  <div style={{ position: "relative", height: "350px" }}>
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      color: "#ecfeff",
                    }}
                  >
                    <strong>{char.name}</strong>
                    <p
                      style={{
                        fontSize: "14px",
                        marginTop: "6px",
                        color: "#a7f3d0",
                      }}
                    >
                      {char.species} • {char.gender} • {char.status}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "45px",
            marginTop: "60px",
          }}
        >
          {filteredCharacters.map((char) => (
            <Link
              key={char.id}
              href={`/characters/${char.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card"
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                  transition: "transform .3s",
                }}
              >
                <div style={{ position: "relative", height: "300px" }}>
                  <Image src={char.image} alt={char.name} fill style={{ objectFit: "cover" }} />
                </div>

                <div className="overlay">
                  <div>
                    <div>Gender: {char.gender}</div>
                    <div>Species: {char.species}</div>
                    <div>Status: {char.status}</div>
                  </div>
                </div>

                <div style={{ padding: "18px", textAlign: "center", color: "#ecfeff" }}>
                  <strong>{char.name}</strong>
                </div>
              </div>

              <style jsx>{`
                .card:hover {
                  transform: translateY(-8px);
                }
                .card:hover img {
                  transform: scale(1.08);
                }
                .overlay {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                  opacity: 0;
                  transition: opacity 0.3s;
                  display: flex;
                  align-items: flex-end;
                  padding: 16px;
                  color: #ecfeff;
                  font-size: 13px;
                }
                .card:hover .overlay {
                  opacity: 1;
                }
              `}</style>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
