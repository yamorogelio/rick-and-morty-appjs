"use client";

import React from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client"; // ✅ client + cache
import { ApolloProvider } from "@apollo/client/react"; // ✅ provider

type Props = {
  children: React.ReactNode;
};

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

export default function Providers({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
