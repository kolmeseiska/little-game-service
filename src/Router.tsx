import { ReactNode } from 'react'
import { Text } from '@chakra-ui/react'
import { Outlet, ReactLocation, Router } from '@tanstack/react-location'

import ResultService from './ResultService'

type Props = {
  children: ReactNode,
  isEventStarted: boolean,
  placeholder?: ReactNode
}

const location = new ReactLocation()

const AppRouter = ({ children, isEventStarted, placeholder }: Props) => {
  return (
    <Router
      key={isEventStarted?.toString()}
      location={location}
      routes={[
        {
          path: '/',
          element: isEventStarted
            ? <ResultService />
            : <Text fontSize='xl' my='28'>{placeholder}</Text>,
        },
        {
          path: 'admin',
          element: () => import('./Admin').then((mod) => <mod.default />),
        },
      ]}
    >
      {children}
      <Outlet />
    </Router>
  )
}

export default AppRouter
