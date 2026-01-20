"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../style/character-page.module.css";

/* GraphQL Query */
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

type Episode = { id: string; name: string; episode: string; };
type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  episode: Episode[];
};
type CharacterData = { character: Character; };

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, {
    variables: { id },
  });

  if (loading)
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading character...</p>;

  if (error || !data)
    return <p style={{ textAlign: "center", color: "#ff6b6b" }}>Error loading character</p>;

  const { character: char } = data;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Left Profile */}
        <div className={styles.profileCard}>
          <button className={styles.backButton} onClick={() => router.push("/")}>← Back</button>
          <h1 className={styles.name}>{char.name}</h1>
          <div className={styles.profileImage}>
            <Image src={char.image} alt={char.name} width={260} height={260} priority />
          </div>
          <div className={styles.badges}>
            {[
              { label: "Status", value: char.status },
              { label: "Species", value: char.species },
              { label: "Gender", value: char.gender },
            ].map(({ label, value }) => (
              <div key={label} className={styles.badge}>
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        {/* Right Episodes */}
        <div className={styles.episodes}>
          <h3>Episodes Appeared In</h3>
          <ul>
            {char.episode.map((ep) => (
              <li key={ep.id}>
                <strong>{ep.episode}</strong> — {ep.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
