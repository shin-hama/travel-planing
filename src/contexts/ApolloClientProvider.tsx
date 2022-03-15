import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
  headers: {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_API_KEY,
    'x-hasura-role': 'dev',
  },
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
export const ApolloClientProvider: React.FC = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
