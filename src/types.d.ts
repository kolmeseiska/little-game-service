// Espoo (vihreä)  - { "0": "#38A169" }
// Joensuu (Beige)   - { "0": "#E6CCB2" }
// Jyväskylä (vaaleanpunainen)   - { "0": "#FFAFCC" }
// Kuopio (Ruskea)   - { "0": "#7F5539" }
// Lahti (harmaa)  - { "0": "#D3D3D3" }
// Lappeenranta (violetti)   - { "0": "#7209B7" }
// Mikkeli (oranssi)   - { "0": "#FB8500" }
// Oulu (sateenkari)   - { "0": "#3182ce" "1": "#38A169" "2": "#FFDD00" "3": "#E53E3E" }
// Pori (punamusta)  - { "0": "#E53E3E", "1": "#1A1919" }
// Rauma (keltainen)   - { "0": "#FFDD00"}
// Rovaniemi (valkoinen)   - { "0": "#F8F9FA"}
// Seinäjoki (sinivalkoinen) - { "0": "#3182ce", "1": "#F8F9FA"}
// Tampere (punainen)  - { "0": "#E53E3E"}
// Turku (sininen) - { "0": "#3182ce"}
// Vaasa (Turkoosi) - { "0": "#06d6a0"}

enum FbEndpoints {
  TEAM = 'team',
  DISCIPLINE = 'discipline',
  SCORE = 'score',
  USER = 'user'
}
type FbEndpoint = `${FbEndpoints}`

type HEX = `#${string}`

type FbColors = { [key: string]: HEX }

type RecordId = string
type Team = {
  id: RecordId,
  name: string
  colors: FbColors// how firebase stores "arrays"
}

type Discipline = {
  id: RecordId,
  name: string
}

type Score = {
  id: RecordId,
  teamId: RecordId,
  disciplineId: RecordId,
  value: number | null
}

type AuthUser = {
  id: RecordId,
  email: string
}
