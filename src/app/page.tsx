import HomeContent from "./home-content";

async function getInitialCharacters() {
  const res = await fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { page: 1 },
    }),
    cache: "no-store", // SSR
  });

  const json = await res.json();
  return json.data.characters;
}

export default async function HomePage() {
  const characters = await getInitialCharacters();

  return (
    <HomeContent
      initialCharacters={characters.results}
      initialPages={characters.info.pages}
    />
  );
}