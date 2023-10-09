import React from 'react'
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
type ScoreCell = { scoreId: RecordId, value: number }

type Props = {
  score: ScoreCell,
  disciplineId: RecordId,
  teamId: RecordId,
  updateData?: (record: Score | null, id?: RecordId) => void,
  isDeleteMode?: boolean
}

const ScoreInput = ({ score, disciplineId, teamId, updateData, isDeleteMode }: Props) => {
  const [value, setValue] = React.useState<number | null>(score?.value ?? null)

  const onBlur = () => {
    const scoreData: Score = {
      id: score.scoreId,
      disciplineId,
      teamId: teamId,
      value: value == null ? null : Number(value)
    }
    updateData?.(scoreData, score.scoreId)
  }
  React.useEffect(() => {
    setValue(score?.value || null)
  }, [score?.value])

  const handleOnChange = (value: string) => {
    if (value != '' && Number.isFinite(Number(value))) {
      setValue(Number(value))
    } else if (value === '') {
      setValue(null)
    }
  }
  return (
    <NumberInput
      value={value ?? ''}
      onChange={handleOnChange}
      onBlur={onBlur}
      min={0}
      max={20}
      width='80px'
      size='sm'
      isDisabled={isDeleteMode}
      borderColor={'gray.600'}
    >
      <NumberInputField />
      <NumberInputStepper
        display={{ base: 'none', md: 'flex' }}
      >
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>

  )
}

export default ScoreInput
