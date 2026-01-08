"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

type Props = {
  children: React.ReactNode;
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://rickandmortyapi.com/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function Providers({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
