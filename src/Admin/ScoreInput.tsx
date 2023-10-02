import React from 'react'
import { Input } from '@chakra-ui/react'

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

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if(value != ''&& Number.isFinite(Number(value))) {
      setValue(Number(value))
    } else if (value === '') {
      setValue(null)
    }
  }
  return (
    <Input
      value={value ?? ''}
      onChange={handleOnChange}
      onBlur={onBlur}
      min={0}
      max={20}
      width='80px'
      size='sm'
      isDisabled={isDeleteMode}
      borderColor={'gray.600'}
    />
  )
}

export default ScoreInput
