import { Table, TableContainer, Tbody, Thead } from '@chakra-ui/react'

type Props = {
  id?: string,
  headers: React.JSX.Element | React.JSX.Element[],
  rows: React.JSX.Element | React.JSX.Element[],
  extras?: React.JSX.Element | React.JSX.Element[],
  className?: string,
  size?: string[],
  variant?: 'simple' | 'striped' | 'unstyled'
}

const DataTable = ({ id,
  headers,
  rows,
  extras,
  className,
  size = ['sm', 'lg'],
  variant = 'simple' }: Props) => {
  return (
    <TableContainer id={id} overflowX='auto' className={className}>
      <Table variant={variant} size={size}>
        <Thead>
          {headers}
        </Thead>
        <Tbody>
          {rows}
        </Tbody>
      </Table>
      {extras}
    </TableContainer>
  )
}
export default DataTable
