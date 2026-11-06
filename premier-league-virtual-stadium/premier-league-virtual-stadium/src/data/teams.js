// Danh sách CLB mẫu để demo. Hãy cập nhật theo danh sách Premier League chính thức
// của mùa giải bạn muốn phát hành trước khi đưa website vào sử dụng thực tế.
export const teams = [
  { name: 'Arsenal', short: 'ARS', color: '#e32636', secondary: '#ffffff', ground: 'Emirates Stadium' },
  { name: 'Aston Villa', short: 'AVL', color: '#7b1e3b', secondary: '#9bd7f5', ground: 'Villa Park' },
  { name: 'Bournemouth', short: 'BOU', color: '#c8102e', secondary: '#111111', ground: 'Vitality Stadium' },
  { name: 'Brentford', short: 'BRE', color: '#c8102e', secondary: '#ffffff', ground: 'Gtech Community Stadium' },
  { name: 'Brighton', short: 'BHA', color: '#0057b8', secondary: '#ffffff', ground: 'Amex Stadium' },
  { name: 'Burnley', short: 'BUR', color: '#6c1d45', secondary: '#8fd3f4', ground: 'Turf Moor' },
  { name: 'Chelsea', short: 'CHE', color: '#034694', secondary: '#ffffff', ground: 'Stamford Bridge' },
  { name: 'Crystal Palace', short: 'CRY', color: '#1b458f', secondary: '#e31b23', ground: 'Selhurst Park' },
  { name: 'Everton', short: 'EVE', color: '#003399', secondary: '#ffffff', ground: 'Hill Dickinson Stadium' },
  { name: 'Fulham', short: 'FUL', color: '#ffffff', secondary: '#111111', ground: 'Craven Cottage' },
  { name: 'Leeds United', short: 'LEE', color: '#ffffff', secondary: '#f4c542', ground: 'Elland Road' },
  { name: 'Liverpool', short: 'LIV', color: '#c8102e', secondary: '#f6eb61', ground: 'Anfield' },
  { name: 'Manchester City', short: 'MCI', color: '#6cabdd', secondary: '#ffffff', ground: 'Etihad Stadium' },
  { name: 'Manchester United', short: 'MUN', color: '#da291c', secondary: '#fbe122', ground: 'Old Trafford' },
  { name: 'Newcastle United', short: 'NEW', color: '#111111', secondary: '#ffffff', ground: 'St James’ Park' },
  { name: 'Nottingham Forest', short: 'NFO', color: '#e53233', secondary: '#ffffff', ground: 'City Ground' },
  { name: 'Sunderland', short: 'SUN', color: '#eb172b', secondary: '#ffffff', ground: 'Stadium of Light' },
  { name: 'Tottenham', short: 'TOT', color: '#ffffff', secondary: '#132257', ground: 'Tottenham Hotspur Stadium' },
  { name: 'West Ham', short: 'WHU', color: '#7a263a', secondary: '#f3d1a5', ground: 'London Stadium' },
  { name: 'Wolves', short: 'WOL', color: '#fdb913', secondary: '#111111', ground: 'Molineux Stadium' }
]

export function randomMatch() {
  const pool = [...teams]
  const homeIndex = Math.floor(Math.random() * pool.length)
  const home = pool.splice(homeIndex, 1)[0]
  const away = pool[Math.floor(Math.random() * pool.length)]
  return { home, away }
}
