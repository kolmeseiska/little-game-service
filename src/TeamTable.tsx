import {
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'

import { calculateTotalScore } from './helpers'
import Rank from './Rank'
import TeamColors from './TeamColors'
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
  const headers = visibleDisciplines.map(({ id, name }) => (
    <Th key={id} maxWidth='18ch' width='100%'>
      {name}
    </Th>
  ))
  const getScore = (teamId: RecordId, disciplineId: RecordId) =>
    scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId)

  const isGamesStarted = !!scores.some(({ value }) => value != null)

  const sortedTeams: Team[] = teams.sort((a: Team, b: Team) => {
    const rankA = calculateTotalScore(a.id, scores)
    const rankB = calculateTotalScore(b.id, scores)
    return rankB - rankA
  })

  useScrollHint(headers.length ? '#teamTable' : null)

  const rows = sortedTeams.map((team: Team, index) => {
    return (
      <Tr key={team.id}>
        <Td>
          {isGamesStarted
            ? <Rank rank={index + 1} />
            : '#'
          }
        </Td>
        <Td className='sticky-column'>
          <HStack>
            <TeamColors colors={team.colors} />
            <Box>
              {team.name}
            </Box>
          </HStack>
        </Td>
        {visibleDisciplines.map(discipline => {
          const score = getScore(team.id, discipline.id)
          return (
            <Td key={score?.id || `${team.id}-${discipline.id}`} isNumeric>
              {score?.value ?? '-'}
            </Td>
          )
        }
        )}
        <Td isNumeric>
          {calculateTotalScore(team.id, scores)}
        </Td>
      </Tr>
    )
  })

  return (
    <TableContainer id='teamTable' overflowX='auto'>
      <Table variant='simple' size={['sm', 'md']}>
        <Thead>
          <Tr>
            <Th width='8ch'>
              Sijoitus
            </Th>
            <Th width='12ch' className='sticky-column'>
              Joukkue
            </Th>
            {headers}
            <Th isNumeric>
              Pisteet
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TeamTable
