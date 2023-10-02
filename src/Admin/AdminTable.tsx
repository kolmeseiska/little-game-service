import React from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Table as ChTable,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable
} from '@tanstack/react-table'

import { useMutateFirebaseRecord } from '../firebaseHooks'
import { calculateTotalScore } from '../helpers'
import TeamColors from '../TeamColors'
import useGameData from './useGameData'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (scoreData: Score | null, id?: RecordId) => void
  }
}
const scoreColumn: Partial<ColumnDef<TableData>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const score = getValue() as { scoreId: RecordId, value: number }
    const [value, setValue] = React.useState<number | null>(score?.value ?? null)
    const onBlur = () => {
      const scoreData: Score = {
        id: score.scoreId,
        disciplineId: id,
        teamId: row.original.teamId,
        value: value == null ? null : Number(value)
      }
      table.options.meta?.updateData(scoreData, score.scoreId)
    }
    React.useEffect(() => {
      setValue(score?.value || null)
    }, [score?.value])

    return (
      <Input
        value={value ?? ''}
        onChange={value => Number.isFinite(Number(value)) ? setValue(Number(value)) : setValue(null)}
        onBlur={onBlur}
        min={0}
        max={20}
        width='80px'
        size='sm'
      />
    )
  },
}

const createRecordHandler = (value: string, setValue: Function, mutateRecord: Function) => {
  if (value.length) {
    try {
      mutateRecord({ name: value })
      setValue('')
    } catch (error) {
      console.error(`Something went wrong with creating ${value}`)
      console.error(error)
    }
  }
}

type ScoreData = { scoreId: RecordId | null, value: number | null }
type TableDataDisciplines = Record<RecordId, ScoreData>
type TableData = {
  teamId: RecordId,
  teamName: string,
  colors: FbColors,
  [key: string]: string | FbColors | ScoreData
}

function AdminTable() {
  const { teams, scores, disciplines } = useGameData()

  const data = React.useMemo(() => {
    const getScore = (teamId: RecordId, disciplineId: RecordId): Score | null =>
      scores.find((score: Score) => score.teamId === teamId && score.disciplineId === disciplineId) || null
    return teams.map((team): TableData => {
      return {
        teamId: team.id,
        teamName: team.name,
        colors: team.colors || {},
        ...disciplines.reduce<TableDataDisciplines>((acc, discipline) => {
          const score = getScore(team.id, discipline.id)
          return {
            ...acc,
            [discipline.id]: {
              scoreId: score?.id || null,
              value: score?.value || null
            }
          }
        }, {} as TableDataDisciplines)
      }
    })
  }, [teams, disciplines, scores])

  const headers = React.useMemo<ColumnDef<any>[]>(() =>
    disciplines.map(discipline => ({
      header: discipline.name,
      accessorKey: discipline.id,
      cell: scoreColumn.cell
    })), [disciplines])

  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      header: '#',
      cell: ({ row }) => `${row.index + 1}.`,
    },
    {
      header: 'Joukkue',
      accessorKey: 'teamName',
    },
    {
      header: 'Värit',
      accessorKey: 'colors',
      cell: ({ getValue }) => <TeamColors colors={getValue<FbColors>()} />
    },
    ...headers
  ], [headers])

  const [newTeam, setNewTeam] = React.useState('')
  const [newDiscipline, setNewDiscipline] = React.useState('')

  const mutateTeam = useMutateFirebaseRecord<Team>('team')
  const mutateDiscipline = useMutateFirebaseRecord<Discipline>('discipline')
  const mutateScore = useMutateFirebaseRecord<Score>('score')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: mutateScore,
    },
    debugTable: true,
  })

  const onClickCreateTeam = () => createRecordHandler(newTeam, setNewTeam, mutateTeam)
  const onClickCreateDiscipline = () => createRecordHandler(newDiscipline, setNewDiscipline, mutateDiscipline)
  return (
    <div className='p-2'>
      <TableContainer className='h-2' overflowX='auto'>
        <ChTable variant='striped' colorScheme='gray' size='sm'>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      paddingX={3}
                      className={header.id === 'teamName' ? 'sticky-column' : ''}
                    >
                      {
                        header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )
                      }
                    </Th>
                  )
                })}
                <Th paddingX={3}>
                  PISTEET
                </Th>
                <Th>
                  <InputGroup>
                    <Input
                      value={newDiscipline as string}
                      onChange={e => setNewDiscipline(e.target.value)}
                      placeholder='Laji'
                      minWidth={40}
                    />
                    <InputRightElement>
                      <IconButton
                        size='sm'
                        aria-label='Lisää laji'
                        icon={<AddIcon />}
                        disabled={!newDiscipline.length}
                        onClick={onClickCreateDiscipline}
                      />
                    </InputRightElement>
                  </InputGroup>
                </Th>
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row: any) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell: any) => {
                    return (
                      <Td
                        key={cell.id}
                        paddingX={3}
                        className={cell.id.includes('teamName') ? 'sticky-column' : ''}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    )
                  })}
                  <Td paddingX={3} isNumeric>
                    {calculateTotalScore(row.original.teamId, scores)}
                  </Td>
                  <Td />
                </Tr>
              )
            })}
          </Tbody>
        </ChTable>
        <Box maxWidth={200} marginY={5}>
          <InputGroup>
            <Input
              value={newTeam as string}
              onChange={e => setNewTeam(e.target.value)}
              placeholder='Joukkueen nimi'
              minWidth={40}
            />
            <InputRightElement>
              <IconButton
                size='sm'
                aria-label='Lisää joukkue'
                icon={<AddIcon />}
                disabled={!newTeam.length}
                onClick={onClickCreateTeam}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </TableContainer>
    </div>
  )
}

export default AdminTable
