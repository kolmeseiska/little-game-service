import { Spinner } from '@chakra-ui/react'

import useGameData from './Admin/useGameData'
import TeamTable from './TeamTable'

const ResultService = () => {
  const { teams, scores, disciplines } = useGameData()

  const isLoading = !teams.length || !disciplines.length
  return (
    <div id='games'>
      {isLoading
        ? <Spinner />
        : (
          <TeamTable
            teams={teams}
            disciplines={disciplines}
            scores={scores}
          />
        )}
    </div>
  )
}

export default ResultService
