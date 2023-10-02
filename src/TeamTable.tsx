import {
  Box,
  HStack,
  Td,
  Th,
  Tr
} from '@chakra-ui/react'

import DataTable from './DataTable/DataTable'
import { calculateTotalScore } from './helpers'
import Rank from './Rank'
import useScrollHint from './useScrollHint'

type Props = {
  teams: Team[],
  scores: Score[],
  disciplines: Discipline[]
}

const TeamTable = ({ teams, scores, disciplines }: Props) => {
  const visibleDisciplines = disciplines.filter(({ id }) =>
    scores.some(({ disciplineId, value }) => disciplineId === id && Number.isFinite(value))
  )
  const headers = visibleDisciplines.length
    ? visibleDisciplines.map(({ id, name }) => (
      <Th key={id} textAlign={'right'}>
        {name}
      </Th>
    ))
    : [<Th key='placeholder-header' />] // To keep table columns on the left
  const getScore = (teamId: RecordId, disciplineId: RecordId) =>
    scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId)

  const isGamesStarted = !!scores.some(({ value }) => value != null)

  const sortedTeams: Team[] = teams.sort((a: Team, b: Team) => {
    const rankA = calculateTotalScore(a.id, scores)
    const rankB = calculateTotalScore(b.id, scores)
    return rankB - rankA
  })

  useScrollHint(visibleDisciplines.length ? '#teamTable' : null)

  const rows = sortedTeams.map((team: Team, index) => {
    return (
      <Tr key={team.id}>
        <Td width='8ch'>
          {isGamesStarted
            ? <Rank rank={index + 1} />
            : '#'
          }
        </Td>
        <Td width='12ch' className='sticky-column'>
          <HStack>
            <Box>
              {team.name}
            </Box>
          </HStack>
        </Td>
        {visibleDisciplines.length
          ? visibleDisciplines.map(discipline => {
            const score = getScore(team.id, discipline.id)
            return (
              <Td key={score?.id || `${team.id}-${discipline.id}`} isNumeric>
                {score?.value ?? '-'}
              </Td>
            )
          }
          )
          : <Td key='placeholder-cell' />}
        <Td isNumeric width='8ch'>
          <b>
            {calculateTotalScore(team.id, scores)}
          </b>
        </Td>
      </Tr>
    )
  })

  return (
    <DataTable
      id='teamsTable'
      headers={(
        <Tr>
          <Th width='8ch'>
            Sijoitus
          </Th>
          <Th width='12ch' className='sticky-column'>
            Joukkue
          </Th>
          {headers}
          <Th isNumeric width='8ch'>
            Pisteet
          </Th>
        </Tr>
      )}
      rows={rows}
    />
  )
}

export default TeamTable
