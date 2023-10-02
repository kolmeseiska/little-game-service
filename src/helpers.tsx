export const calculateTotalScore = (teamId: RecordId, scores: Score[]) =>
  scores.filter(score => score.teamId === teamId)
    .reduce((acc, score: Score) =>
      Number.isFinite(score.value)
        ? acc + Number(score.value)
        : acc,
    0)
