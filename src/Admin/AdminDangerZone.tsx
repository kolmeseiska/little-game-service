import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup
} from '@chakra-ui/react'

import { useDeleteFirebaseCollection } from '../firebaseHooks'
import useToggle from '../hooks/useToggle'
import DeleteSwitch from './DeleteSwitch'

type Props = {
  isEnabled: boolean,
  toggle: () => void
}

const AdminDangerZone = ({ isEnabled, toggle }: Props) => {
  const deleteScores = useDeleteFirebaseCollection('score')
  const [isConfirmed, { enable: enableIsConfirmed, disable: disableIsConfirmed }] = useToggle()

  const handleDeleteScores = () => {
    if (isConfirmed) {
      deleteScores()
      disableIsConfirmed
    } else {
      enableIsConfirmed()
    }
  }

  return (
    <>
      <DeleteSwitch isEnabled={isEnabled} toggle={toggle} />
      {isEnabled
        ? (
          <Alert status='error'>
            <AlertTitle>Tyhjennä tilastot</AlertTitle>
            <ButtonGroup isAttached>
              <Button onClick={handleDeleteScores} colorScheme='red'>
                {isConfirmed
                  ? 'Oletko aivan varma? Toiminto on peruuttamaton'
                  : 'Poista kaikkien joukkueiden pisteet'}
              </Button>
              {isConfirmed
                ? (
                  <Button onClick={disableIsConfirmed} colorScheme='red' variant='outline'>
                    Peruuta
                  </Button>
                ) : null}
            </ButtonGroup>
          </Alert>
        )
        : null}
    </>
  )
}

export default AdminDangerZone
