"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { client } from "../../../lib/apolloClient";
import styles from "../../style/character-page.module.css";
import LoadingSkeleton from "../../LoadingSkeleton";

// GraphQL query
const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      gender
      episode {
        id
        name
        episode
      }
    }
  }
`;

// Types
type Episode = {
  id: string;
  name: string | null;
  episode: string | null;
};

type CharacterData = {
  character: {
    id: string;
    name: string | null;
    image: string | null;
    status: string | null;
    species: string | null;
    gender: string | null;
    episode: Episode[];
  };
};

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    client,
    variables: { id },
  });

  if (loading) {
    return <LoadingSkeleton items={1} />;
  }

  if (error || !data?.character) {
    return (
      <p style={{ textAlign: "center", color: "#ff6b6b" }}>
        Error loading character
      </p>
    );
  }

  const char = data.character;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← Back
          </button>

          <h1 className={styles.name}>{char.name ?? "Unknown Name"}</h1>

        <div className={styles.profileImage}>
  <Image
    src={char.image || "/placeholder.png"}
    alt={char.name || "Unknown"}
    width={260}
    height={260}
    priority={true}
  />
</div>


          <div className={styles.badges}>
            <div className={styles.badge}>
              <strong>Status:</strong> {char.status ?? "Unknown"}
            </div>
            <div className={styles.badge}>
              <strong>Species:</strong> {char.species ?? "Unknown"}
            </div>
            <div className={styles.badge}>
              <strong>Gender:</strong> {char.gender ?? "Unknown"}
            </div>
          </div>

          {/* Mobile Episodes */}
          <div className={styles.episodesMobile}>
            <h3>Episodes Appeared In</h3>
            <ul>
              {char.episode.map((ep: Episode) => (
                <li key={ep.id}>
                  <strong>{ep.episode ?? "Unknown Episode"}</strong> —{" "}
                  {ep.name ?? "Unknown Name"}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Episodes */}
        <div className={styles.episodesDesktop}>
          <div className={styles.episodes}>
            <h3>Episodes Appeared In</h3>
            <ul>
              {char.episode.map((ep: Episode) => (
                <li key={ep.id}>
                  <strong>{ep.episode ?? "Unknown Episode"}</strong> —{" "}
                  {ep.name ?? "Unknown Name"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
