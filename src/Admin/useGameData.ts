import { useFirebaseRecords } from '../firebaseHooks'

const useGameData = () => {
  const teams = useFirebaseRecords<Team>('team')
  const scores = useFirebaseRecords<Score>('score')
  const disciplines = useFirebaseRecords<Discipline>('discipline')

  return {
    teams,
    scores,
    disciplines
  }
}

export default useGameData
