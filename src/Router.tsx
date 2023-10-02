import {
  Outlet,
  ReactLocation,
  Router
} from '@tanstack/react-location'

import ResultService from './ResultService'

type Props = {
  children: JSX.Element | JSX.Element[]
}

const location = new ReactLocation()

const AppRouter = ({ children }: Props) => {
  return (
    <Router
      location={location}
      routes={[
        {
          path: '/',
          element: <ResultService />,
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
