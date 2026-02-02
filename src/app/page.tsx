"use client";

import { useEffect, useState } from "react";
import HomeContent from "./home-content";
import { client } from "./apolloClient";
import { gql } from "@apollo/client";

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

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
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

export default function HomePage() {
  const [initialCharacters, setInitialCharacters] = useState<Character[]>([]);
  const [initialPages, setInitialPages] = useState<number>(1);

  useEffect(() => {
    client
      .query<CharactersData>({ query: GET_CHARACTERS, variables: { page: 1 } })
      .then((res) => {
        if (res.data?.characters) {
          setInitialCharacters(res.data.characters.results);
          setInitialPages(res.data.characters.info.pages);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <HomeContent
      initialCharacters={initialCharacters}
      initialPages={initialPages}
    />
  );
}
