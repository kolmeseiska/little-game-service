import {
  Alert,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  Switch
} from '@chakra-ui/react'

type Props = {
  isEnabled: boolean,
  toggle: () => void
}

const DeleteSwitch = ({ isEnabled, toggle }: Props) => {
  return (
    <>
      <FormControl display='flex' alignItems='center' my={5}>
        <FormLabel htmlFor='delete-switch' mb='0' textColor={'dimgray'}>
          Poista joukkueita sekä lajeja
        </FormLabel>
        <Switch
          id={'delete-switch'}
          isChecked={isEnabled}
          onChange={toggle}
          colorScheme='red'
        />
      </FormControl>
      {
        isEnabled
          ? (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>Varovasti! Olet poistamassa joukkueita sekä lajeja!</AlertTitle>
            </Alert>
          )
          : null
      }
    </>
  )
}

export default DeleteSwitch
