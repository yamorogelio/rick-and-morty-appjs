"use client";

import React from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"; // ✅ ApolloClient comes from here
import { ApolloProvider } from "@apollo/client/react"; // ✅ ApolloProvider from react

type Props = {
  children: React.ReactNode;
};

// Apollo Client setup
const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://rickandmortyapi.com/graphql", // GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});

export default function Providers({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
