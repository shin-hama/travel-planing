import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Firebase API Key is not defined on environment')
}
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true })

if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY) {
  throw new Error('Google Maps API key is not defined on environment')
}
export const googleMapConfigs = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
}

if (!process.env.NEXT_PUBLIC_BFF_URL) {
  throw new Error('NEXT_PUBLIC_BFF_URL is not defined on environment')
}
export const bffConfigs = {
  url: process.env.NEXT_PUBLIC_BFF_URL,
}

if (
  !process.env.NEXT_PUBLIC_HASURA_API_KEY ||
  !process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL
) {
  throw new Error('Hasura properties are not defined on environment')
}
export const hasuraConfigs = {
  apiKey: process.env.NEXT_PUBLIC_HASURA_API_KEY,
  serverUrl: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
}

if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
  throw new Error('Unsplash API Key is not defined on environment')
}
export const unsplashConfig = {
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
}
