import { Heading, Spinner } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'

import './App.css'
import { useFirebaseRecord } from './firebaseHooks'
import AppRouter from './Router'
import theme from './theme'

function App() {
  const event = useFirebaseRecord<GameEvent>('event')

  const isEventStarted = event?.startDate
    ? event.startDate <= new Date().toISOString()
    : false

  return (
    <ChakraProvider theme={theme}>
      {event
        ? (
          <AppRouter isEventStarted={isEventStarted} placeholder={event?.description}>
            <Heading as='h2' size='2xl' mb={3}>
              {event.name}
            </Heading>
            <Heading as='h3' size='md' mb={3}>
              Tulospalvelu
            </Heading>
          </AppRouter>
        )
        : <Spinner />}

    </ChakraProvider>
  )
}

export default App
