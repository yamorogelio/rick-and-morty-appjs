"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import Image from "next/image";
import { MdMovie, MdSearch } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [species, setSpecies] = useState("All");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  }, [search, router]);

  if (loading) return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  if (error || !data)
    return <p style={{ textAlign: "center", color: "red" }}>Error loading characters</p>;

  const filteredCharacters = data.characters.results.filter((char) => {
    return (
      char.name.toLowerCase().includes(search.toLowerCase()) &&
      (gender === "All" || char.gender === gender) &&
      (status === "All" || char.status === status) &&
      (species === "All" || char.species === species)
    );
  });

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

        <p style={{ textAlign: "center", marginBottom: "40px", color: "#99f6e4" }}>
          Dive into infinite realities and iconic characters
        </p>

        {/* Search + Filters + Episodes */}
        <div
          ref={dropdownRef}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "50px",
          }}
        >
          {/* Search & Filters */}
          <div style={{ maxWidth: "320px", width: "100%" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
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

            {/* Unified Filters */}
            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
              }}
            >
              {[{ v: gender, s: setGender, o: ["All", "Male", "Female", "unknown"] },
                { v: status, s: setStatus, o: ["All", "Alive", "Dead", "unknown"] },
                { v: species, s: setSpecies, o: ["All", "Human", "Alien"] }
              ].map((f, i) => (
                <select
                  key={i}
                  value={f.v}
                  onChange={(e) => f.s(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "14px",
                    backgroundColor: "#1b1f2a",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: "13px",
                  }}
                >
                  {f.o.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* Episodes Button */}
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

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "45px",
          }}
        >
          {filteredCharacters.map((char) => (
            <Link key={char.id} href={`/characters/${char.id}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ position: "relative", height: "300px" }}>
                  <Image src={char.image} alt={char.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "18px", textAlign: "center", color: "#ecfeff" }}>
                  <strong>{char.name}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
