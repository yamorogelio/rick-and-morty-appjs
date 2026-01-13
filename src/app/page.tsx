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
      }
    }
  }
`;

/* Types */
type Character = {
  id: string;
  name: string;
  image: string;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, loading, error } = useQuery<CharactersData>(GET_CHARACTERS);

  /* Close dropdown when clicking outside */
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

  /* Sync search to URL */
  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  }, [search, router]);

  /* Auto-scroll active dropdown item */
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;

  if (error || !data)
    return <p style={{ textAlign: "center", color: "red" }}>Error loading characters</p>;

  const filteredCharacters = data.characters.results.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredCharacters.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCharacters.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      setSearch(filteredCharacters[activeIndex].name);
      setDropdownOpen(false);
      setActiveIndex(-1);
    }

    if (e.key === "Escape") {
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

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
        {/* Hero */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "50px",
            fontWeight: "900",
            color: "#ecfeff",
            letterSpacing: "2px",
            textShadow:
              "0 0 25px rgba(34,197,94,0.8), 0 0 60px rgba(14,165,233,0.4)",
          }}
        >
          Rick & Morty Multiverse
        </h1>

        <p
          style={{
            textAlign: "center",
            margin: "15px 0 40px",
            fontSize: "19px",
            color: "#99f6e4",
          }}
        >
          Dive into infinite realities and iconic characters
        </p>

        {/* Search + Episodes */}
        <div
          ref={dropdownRef}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "50px",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", maxWidth: "250px", width: "100%" }}>
            <input
              type="text"
              placeholder="Search characters..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDropdownOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setDropdownOpen(true)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: "#1b1f2a",
                color: "#fff",
                outline: "none",
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

            {/* Dropdown (NO REDIRECT) */}
            {dropdownOpen && search && filteredCharacters.length > 0 && (
              <div
                className="hide-scrollbar"
                style={{
                  position: "absolute",
                  top: "40px",
                  width: "100%",
                  background: "#1b1f2a",
                  borderRadius: "12px",
                  maxHeight: "250px",
                  overflowY: "auto",
                  zIndex: 100,
                }}
              >
                {filteredCharacters.map((char, index) => (
                  <div
                    key={char.id}
                    ref={(el) => { itemRefs.current[index] = el; }} // ✅ fixed
                    onClick={() => {
                      setSearch(char.name);
                      setDropdownOpen(false);
                      setActiveIndex(-1);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      color: "#fff",
                      background:
                        index === activeIndex
                          ? "rgba(34,197,94,0.35)"
                          : "transparent",
                    }}
                  >
                    <Image
                      src={char.image}
                      alt={char.name}
                      width={36}
                      height={36}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    {char.name}
                  </div>
                ))}
              </div>
            )}
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
              boxShadow:
                "0 0 30px rgba(34,197,94,0.7), inset 0 0 10px rgba(255,255,255,0.5)",
            }}
          >
            <MdMovie size={24} />
            View Episodes
          </Link>
        </div>

        {/* Cards (IMAGE DESIGN UNCHANGED) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "45px",
          }}
        >
          {filteredCharacters.map((char) => (
            <Link
              key={char.id}
              href={`/characters/${char.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                  transition: "all 0.45s ease",
                  background:
                    "linear-gradient(180deg, rgba(34,197,94,0.2), rgba(0,0,0,0.2))",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-18px) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 45px 120px rgba(34,197,94,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 80px rgba(0,0,0,0.6)";
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "300px" }}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(2,6,23,0.9), rgba(2,6,23,0.1), transparent)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "22px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "900",
                      color: "#ecfeff",
                      textShadow: "0 0 15px rgba(34,197,94,0.7)",
                    }}
                  >
                    {char.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
