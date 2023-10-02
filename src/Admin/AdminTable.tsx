import React, { useMemo } from 'react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Td,
  Th,
  Tr
} from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable
} from '@tanstack/react-table'

import DataTable from '../DataTable/DataTable'
import { useMutateFirebaseRecord } from '../firebaseHooks'
import { calculateTotalScore } from '../helpers'
import useToggle from '../hooks/useToggle'
import AdminDangerZone from './AdminDangerZone'
import ScoreInput from './ScoreInput'
import useGameData from './useGameData'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (scoreData: Score | null, id?: RecordId) => void
    deleteColumn: (columnId: string) => void,
    deleteRow: (rowId: string) => void,
    isDeleteMode: boolean
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

const scoreColumn: Partial<ColumnDef<TableData>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const score = getValue<{ scoreId: RecordId, value: number }>()
    const { updateData, isDeleteMode } = table.options.meta || {}
    return (
      <ScoreInput
        teamId={row.original.teamId}
        disciplineId={id}
        score={score}
        updateData={updateData}
        isDeleteMode={isDeleteMode}

      />
    )
  },
}

const createRecordHandler = <T extends { name: string }, >(
  value: string,
  setValue: (value: string) => void,
  mutateRecord: (record: T) => void
) => {
  if (value.length) {
    try {
      mutateRecord({ name: value } as T)
      setValue('')
    } catch (error) {
      console.error(`Something went wrong with creating ${value}`)
      console.error(error)
    }
  }
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

  const headers = React.useMemo<ColumnDef<TableData, string>[]>(() =>
    disciplines.map(discipline => ({
      header: ({ table }) => {
        const { isDeleteMode, deleteColumn } = table.options.meta || {}
        return (
          <>
            {discipline.name}
            {(isDeleteMode && deleteColumn)
              ? (
                <IconButton
                  isRound={true}
                  variant='ghost'
                  colorScheme='red'
                  aria-label='remove'
                  size='sm'
                  fontSize='10px'
                  ml='1'
                  onClick={() => deleteColumn(discipline.id)}
                  icon={<CloseIcon />}
                />
              )
              : null}
          </>
        )
      },
      accessorKey: discipline.id,
      cell: scoreColumn.cell
    })), [disciplines])

  const columns = React.useMemo<ColumnDef<TableData, string>[]>(() => [
    {
      header: '#',
      cell: ({ row }) => `${row.index + 1}.`,
    },
    {
      header: 'Joukkue',
      accessorKey: 'teamName',
      cell: ({ getValue, table, row }) => {
        const { isDeleteMode, deleteRow } = table.options.meta || {}
        return (
          <>
            {getValue<string | number>()}
            {(isDeleteMode && deleteRow)
              ? (
                <IconButton
                  isRound={true}
                  variant='ghost'
                  colorScheme='red'
                  aria-label='remove'
                  size='sm'
                  fontSize='10px'
                  ml='1'
                  onClick={() => deleteRow(row.original.teamId)}
                  icon={<CloseIcon />}
                />
              )
              : null}
          </>
        )
      }
    },
    // {
    //   header: 'Värit',
    //   accessorKey: 'colors',
    //   cell: ({ getValue }) => <TeamColors colors={getValue<FbColors>()} />
    // },
    ...headers
  ], [headers])

  const [newTeam, setNewTeam] = React.useState('')
  const [newDiscipline, setNewDiscipline] = React.useState('')
  const [isDeleteMode, { toggle }] = useToggle()

  const mutateTeam = useMutateFirebaseRecord<Partial<Team>>('team')
  const mutateDiscipline = useMutateFirebaseRecord<Partial<Discipline>>('discipline')
  const mutateScore = useMutateFirebaseRecord<Score>('score')

  const meta = useMemo(() => ({
    updateData: mutateScore,
    isDeleteMode,
    deleteColumn: (disciplineId: string) => mutateDiscipline(null, disciplineId),
    deleteRow: (teamId: string) => mutateTeam(null, teamId),
  }), [isDeleteMode, mutateDiscipline, mutateScore, mutateTeam])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta
  })

  const onClickCreateTeam = () => createRecordHandler<Pick<Team, 'name'>>(newTeam, setNewTeam, mutateTeam)
  const onClickCreateDiscipline = () => createRecordHandler<Pick<Discipline, 'name'>>(newDiscipline, setNewDiscipline, mutateDiscipline)
  return (
    <div className='p-2'>
      <DataTable
        id={'adminTable'}
        variant='striped'
        size={['sm']}
        className='h-2'
        headers={table.getHeaderGroups().map(headerGroup => (
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
                  isDisabled={isDeleteMode}
                />
                <InputRightElement>
                  <IconButton
                    size='sm'
                    aria-label='Lisää laji'
                    icon={<AddIcon />}
                    disabled={!newDiscipline.length}
                    onClick={onClickCreateDiscipline}
                    isDisabled={isDeleteMode}
                  />
                </InputRightElement>
              </InputGroup>
            </Th>
          </Tr>
        ))}
        rows={table.getRowModel().rows.map((row: any) => {
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
        extras={(
          <Box maxWidth={200} marginY={5}>
            <InputGroup>
              <Input
                value={newTeam as string}
                onChange={e => setNewTeam(e.target.value)}
                placeholder='Joukkueen nimi'
                minWidth={40}
                isDisabled={isDeleteMode}
              />
              <InputRightElement>
                <IconButton
                  size='sm'
                  aria-label='Lisää joukkue'
                  icon={<AddIcon />}
                  disabled={!newTeam.length}
                  onClick={onClickCreateTeam}
                  isDisabled={isDeleteMode}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
        )}
      />
      <AdminDangerZone isEnabled={isDeleteMode} toggle={toggle} />
    </div>
  )
}

export default AdminTable
