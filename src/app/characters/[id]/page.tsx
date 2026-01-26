"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../style/character-page.module.css";
import LoadingSkeleton from "../../LoadingSkeleton";

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      gender
      episode { id name episode }
    }
  }
`;

type Episode = { id:string; name:string|null; episode:string|null };
type CharacterData = { character: { id:string; name:string|null; image:string|null; status:string|null; species:string|null; gender:string|null; episode:Episode[] } };

export default function CharacterPage() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { data, loading, error } = useQuery<CharacterData>(GET_CHARACTER, { variables: {id} });

  if (loading) return <LoadingSkeleton items={1} />; // skeleton for single character
  if (error || !data) return <p style={{textAlign:"center",color:"#ff6b6b"}}>Error loading character</p>;

  const char = data.character;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <button className={styles.backButton} onClick={()=>router.push("/")}>← Back</button>
          <h1 className={styles.name}>{char.name??"Unknown Name"}</h1>
          <div className={styles.profileImage}>
            <Image src={char.image??"/placeholder.png"} alt={char.name??"Unknown"} width={260} height={260} priority/>
          </div>
          <div className={styles.badges}>
            {[{label:"Status", value:char.status??"Unknown"},
              {label:"Species", value:char.species??"Unknown"},
              {label:"Gender", value:char.gender??"Unknown"}].map(({label,value})=>(
                <div key={label} className={styles.badge}><strong>{label}:</strong> {value}</div>
              ))}
          </div>
          <div className={styles.episodesMobile}>
            <h3>Episodes Appeared In</h3>
            <ul>{(char.episode??[]).map(ep=>(
              <li key={ep.id}><strong>{ep.episode??"Unknown Episode"}</strong> — {ep.name??"Unknown Name"}</li>
            ))}</ul>
          </div>
        </div>
        <div className={styles.episodesDesktop}>
          <div className={styles.episodes}>
            <h3>Episodes Appeared In</h3>
            <ul>{(char.episode??[]).map(ep=>(
              <li key={ep.id}><strong>{ep.episode??"Unknown Episode"}</strong> — {ep.name??"Unknown Name"}</li>
            ))}</ul>
          </div>
        </div>
      </div>
    </main>
  );
}
