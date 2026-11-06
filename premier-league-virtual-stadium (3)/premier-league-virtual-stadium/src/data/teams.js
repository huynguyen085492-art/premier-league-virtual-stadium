// Demo roster: update this file to match the official club list for the season you deploy.
export const TEAMS = [
  { id:'ars', name:'Arsenal', short:'ARS', city:'London', color:'#ef0107', secondary:'#ffffff', ground:'Emirates Stadium', emoji:'🔴' },
  { id:'avl', name:'Aston Villa', short:'AVL', city:'Birmingham', color:'#670e36', secondary:'#95bfe5', ground:'Villa Park', emoji:'🟣' },
  { id:'bou', name:'Bournemouth', short:'BOU', city:'Bournemouth', color:'#da291c', secondary:'#000000', ground:'Vitality Stadium', emoji:'🍒' },
  { id:'bre', name:'Brentford', short:'BRE', city:'London', color:'#e30613', secondary:'#ffffff', ground:'Gtech Community Stadium', emoji:'🐝' },
  { id:'bha', name:'Brighton', short:'BHA', city:'Brighton', color:'#0057b8', secondary:'#ffffff', ground:'Amex Stadium', emoji:'🔵' },
  { id:'bur', name:'Burnley', short:'BUR', city:'Burnley', color:'#6c1d45', secondary:'#99d6ea', ground:'Turf Moor', emoji:'🍷' },
  { id:'che', name:'Chelsea', short:'CHE', city:'London', color:'#034694', secondary:'#ffffff', ground:'Stamford Bridge', emoji:'🔵' },
  { id:'cry', name:'Crystal Palace', short:'CRY', city:'London', color:'#1b458f', secondary:'#c41230', ground:'Selhurst Park', emoji:'🦅' },
  { id:'eve', name:'Everton', short:'EVE', city:'Liverpool', color:'#003399', secondary:'#ffffff', ground:'Hill Dickinson Stadium', emoji:'🔵' },
  { id:'ful', name:'Fulham', short:'FUL', city:'London', color:'#ffffff', secondary:'#000000', ground:'Craven Cottage', emoji:'⚪' },
  { id:'lee', name:'Leeds United', short:'LEE', city:'Leeds', color:'#ffcd00', secondary:'#1d428a', ground:'Elland Road', emoji:'🟡' },
  { id:'liv', name:'Liverpool', short:'LIV', city:'Liverpool', color:'#c8102e', secondary:'#00b2a9', ground:'Anfield', emoji:'🔴' },
  { id:'mci', name:'Manchester City', short:'MCI', city:'Manchester', color:'#6cabdd', secondary:'#ffffff', ground:'Etihad Stadium', emoji:'🩵' },
  { id:'mun', name:'Manchester United', short:'MUN', city:'Manchester', color:'#da291c', secondary:'#fbe122', ground:'Old Trafford', emoji:'🔴' },
  { id:'new', name:'Newcastle United', short:'NEW', city:'Newcastle', color:'#241f20', secondary:'#ffffff', ground:'St James’ Park', emoji:'⚫' },
  { id:'nfo', name:'Nottingham Forest', short:'NFO', city:'Nottingham', color:'#dd0000', secondary:'#ffffff', ground:'City Ground', emoji:'🌳' },
  { id:'sun', name:'Sunderland', short:'SUN', city:'Sunderland', color:'#eb172b', secondary:'#ffffff', ground:'Stadium of Light', emoji:'🔴' },
  { id:'tot', name:'Tottenham', short:'TOT', city:'London', color:'#132257', secondary:'#ffffff', ground:'Tottenham Hotspur Stadium', emoji:'⚪' },
  { id:'whu', name:'West Ham', short:'WHU', city:'London', color:'#7a263a', secondary:'#1bb1e7', ground:'London Stadium', emoji:'⚒️' },
  { id:'wol', name:'Wolves', short:'WOL', city:'Wolverhampton', color:'#fdb913', secondary:'#231f20', ground:'Molineux Stadium', emoji:'🟡' }
];

export function randomFixture(favoriteId) {
  let home = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  let away;
  do { away = TEAMS[Math.floor(Math.random() * TEAMS.length)]; } while (away.id === home.id);
  if (favoriteId) {
    const fav = TEAMS.find(t => t.id === favoriteId);
    if (fav && Math.random() < .72) {
      if (Math.random() < .5) home = fav; else away = fav;
      if (home.id === away.id) away = TEAMS.filter(t => t.id !== home.id)[Math.floor(Math.random()*19)];
    }
  }
  return { home, away, venue: home.ground };
}
