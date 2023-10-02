import { LockIcon } from '@chakra-ui/icons'
import { Button, Link, Spinner, Text } from '@chakra-ui/react'

import { useAuth } from '../auth'
import { useFirebaseRecords } from '../firebaseHooks'
import AdminTable from './AdminTable'

const Admin = () => {
  const { user, logIn, isLoading } = useAuth()
  const users = useFirebaseRecords<AuthUser>('user')

  if (isLoading || !users.length) {
    return <Spinner />
  }

  if (!user) {
    return (
      <Button
        leftIcon={<LockIcon />}
        onClick={logIn}
      >
        Kirjaudu sisään
      </Button>
    )
  }

  const isAuthor = users.some(({ email }) => email === user.email)
  if (!isAuthor) {
    return (
      <Text fontSize='2xl' fontStyle='bold'>
        En tunnista sinua :(
        <br />
        <Link color='teal.500' href='/'>
          Siirry tulospalveluun
        </Link>
      </Text>
    )
  }
  return (
    <div>
      {user
        ? <AdminTable />
        : (
          null
        )
      }
    </div>
  )
}

export default Admin
