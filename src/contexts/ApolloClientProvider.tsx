import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import { hasuraConfigs } from 'configs'

const httpLink = createHttpLink({
  uri: hasuraConfigs.serverUrl,
  headers: {
    'x-hasura-admin-secret': hasuraConfigs.apiKey,
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
