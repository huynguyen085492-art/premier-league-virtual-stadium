import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Activity, AudioLines, Camera, ChevronDown, CirclePlay, Crown, Expand, Flame, Goal, Headphones, Pause, Play, RotateCcw, Settings2, Shield, Shuffle, Volume2, VolumeX, Waves } from 'lucide-react'
import { Stadium } from './components/Stadium.jsx'
import { randomMatch } from './data/teams.js'
import { crowdRoar, setCrowdVolume, speakCommentary, startCrowdAudio } from './components/AudioEngine.js'

const initial = randomMatch()
const openingLines = [
  'Trọng tài đã thổi còi! Trận đấu chính thức bắt đầu.',
  'Một pha phối hợp rất có ý đồ ở khu vực giữa sân.',
  'Đường chuyền vượt tuyến, hàng phòng ngự cần phải tập trung.',
  'Một cú sút từ xa! Bóng đi chệch khung thành trong gang tấc.',
  'Khán đài đang tạo nên bầu không khí vô cùng cuồng nhiệt.',
  'Pha tranh chấp quyết liệt, trọng tài cho trận đấu tiếp tục.'
]

function TeamBadge({ team, small = false }) {
  return <div className={`team-badge ${small ? 'small' : ''}`} style={{ '--team': team.color, '--trim': team.secondary }}>
    <span>{team.short}</span>
  </div>
}

function App() {
  const [match, setMatch] = useState(initial)
  const [score, setScore] = useState([0, 0])
  const [minute, setMinute] = useState(0)
  const [running, setRunning] = useState(false)
  const [volume, setVolume] = useState(42)
  const [audioOn, setAudioOn] = useState(false)
  const [commentary, setCommentary] = useState('Chào mừng quý vị đến với Virtual Stadium. Hai đội đang chuẩn bị bước ra sân.')
  const [events, setEvents] = useState([{ minute: 0, text: 'Trận đấu sắp bắt đầu', type: 'info' }])
  const [showSettings, setShowSettings] = useState(false)
  const [crowdMode, setCrowdMode] = useState('normal')
  const [speed, setSpeed] = useState(1)
  const [showHelp, setShowHelp] = useState(false)
  const lastEvent = useRef(0)

  const addEvent = (text, type = 'info', say = true) => {
    setEvents(prev => [{ minute, text, type }, ...prev].slice(0, 7))
    setCommentary(text)
    if (say) speakCommentary(text)
  }

  const newMatch = () => {
    const next = randomMatch()
    setMatch(next); setScore([0, 0]); setMinute(0); setRunning(false)
    setEvents([{ minute: 0, text: 'Đã bốc thăm trận đấu mới', type: 'info' }])
    setCommentary(`Trận đấu mới: ${next.home.name} gặp ${next.away.name}. Mời quý vị ổn định chỗ ngồi!`)
    lastEvent.current = 0
    window.speechSynthesis?.cancel()
  }

  const toggleAudio = () => {
    if (!audioOn) {
      startCrowdAudio()
      setCrowdVolume(volume / 100)
      setAudioOn(true)
      speakCommentary('Âm thanh sân vận động đã được bật. Cùng tận hưởng trận đấu!')
    } else {
      setAudioOn(false); setCrowdVolume(0); window.speechSynthesis?.cancel()
    }
  }

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setMinute(m => {
        const next = m + speed
        if (next >= 90) {
          setRunning(false)
          setCommentary('Hết giờ! Trọng tài đã thổi còi kết thúc trận đấu.')
          setEvents(prev => [{ minute: 90, text: 'HẾT GIỜ — Trận đấu kết thúc', type: 'end' }, ...prev])
          speakCommentary('Hết giờ! Trận đấu đã kết thúc.')
          return 90
        }
        return next
      })
    }, 1200)
    return () => window.clearInterval(timer)
  }, [running, speed])

  useEffect(() => {
    if (!running || minute >= 90) return
    if (minute > 0 && minute % 4 === 0 && lastEvent.current !== minute) {
      lastEvent.current = minute
      const roll = Math.random()
      if (roll < 0.16) {
        const homeScored = Math.random() > 0.5
        setScore(prev => homeScored ? [prev[0] + 1, prev[1]] : [prev[0], prev[1] + 1])
        const scorer = homeScored ? match.home : match.away
        const line = `VÀOOOO! ${scorer.name} đã ghi bàn! Cả khán đài như bùng nổ!`
        addEvent(line, 'goal')
        if (audioOn) crowdRoar(1.3)
      } else {
        const line = openingLines[Math.floor(Math.random() * openingLines.length)]
        addEvent(line, 'play', false)
      }
    }
  }, [minute, running])

  const toggleRun = () => {
    if (minute >= 90) { newMatch(); return }
    if (!running && minute === 0) {
      addEvent('Trọng tài thổi còi khai cuộc! Bóng đã lăn!', 'play')
      if (audioOn) crowdRoar(0.7)
    }
    setRunning(v => !v)
  }

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Crown size={19} /></div>
        <div><div className="brand-name">VIRTUAL <b>STADIUM</b></div><div className="brand-sub">PREMIER LEAGUE EXPERIENCE</div></div>
      </div>
      <nav className="top-nav"><span className="nav-active">MATCHDAY</span><span>FAN ZONE</span><span>CLUBS</span></nav>
      <div className="top-actions">
        <div className="live-pill"><i /> SIMULATION</div>
        <button className="icon-button" onClick={() => setShowSettings(v => !v)} aria-label="Cài đặt"><Settings2 size={18}/></button>
      </div>
    </header>

    <section className="match-strip">
      <div className="match-meta"><span className="eyebrow">VIRTUAL PREMIER LEAGUE</span><span className="meta-dot">•</span><span>EXHIBITION MATCH</span></div>
      <div className="match-scoreline">
        <div className="club-side"><TeamBadge team={match.home}/><div><strong>{match.home.name}</strong><small>HOME</small></div></div>
        <div className="score-center"><div className="score">{String(score[0]).padStart(2,'0')} <i>:</i> {String(score[1]).padStart(2,'0')}</div><div className="match-clock">{minute}' <span>●</span> {minute === 0 ? 'KICK-OFF READY' : minute >= 90 ? 'FULL TIME' : 'LIVE SIMULATION'}</div></div>
        <div className="club-side away"><div><strong>{match.away.name}</strong><small>AWAY</small></div><TeamBadge team={match.away}/></div>
      </div>
      <div className="venue-line"><Shield size={13}/> {match.home.ground} <span>—</span> VIRTUAL ARENA</div>
    </section>

    <section className="stadium-layout">
      <div className="viewport">
        <div className="viewport-top"><div className="view-label"><span className="view-dot"/> STAND CAM <span className="view-divider">/</span> BLOCK  W12 · ROW 08</div><button className="view-chip" onClick={() => setShowHelp(v => !v)}><Camera size={13}/> CAMERA VIEW</button></div>
        <Canvas shadows camera={{ position: [0, 9.5, 20], fov: 48 }} dpr={[1, 1.7]}>
          <Suspense fallback={null}>
            <Stadium home={match.home} away={match.away} running={running}/>
            <OrbitControls enablePan={false} minDistance={15} maxDistance={29} minPolarAngle={0.78} maxPolarAngle={1.35} target={[0, 1, 0]} />
          </Suspense>
        </Canvas>
        <div className="stadium-bottom">
          <div className="crowd-status"><Waves size={15}/><span>ATMOSPHERE</span><b>{crowdMode === 'normal' ? 'MATCHDAY' : 'DERBY MODE'}</b></div>
          <div className="stadium-tip">DRAG TO LOOK AROUND <span>·</span> SCROLL TO ZOOM</div>
        </div>
        {showHelp && <div className="camera-popover">Góc nhìn khán đài. Bạn có thể kéo chuột để xoay camera và cuộn để phóng to / thu nhỏ.</div>}
      </div>

      <aside className="side-panel">
        <div className="panel-heading"><div><span className="eyebrow">MATCH CONTROL</span><h2>Trung tâm trận đấu</h2></div><span className="panel-live">{running ? 'LIVE' : 'READY'}</span></div>
        <div className="control-card">
          <div className="control-title"><span>TRẬN ĐẤU</span><span className="tiny-status"><i/> {running ? 'ĐANG DIỄN RA' : 'CHỜ BẮT ĐẦU'}</span></div>
          <div className="mini-teams">
            <div><TeamBadge team={match.home} small/><b>{match.home.short}</b></div><span>VS</span><div><TeamBadge team={match.away} small/><b>{match.away.short}</b></div>
          </div>
          <button className="primary-button" onClick={toggleRun}>{running ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}{minute >= 90 ? 'TRẬN MỚI' : running ? 'TẠM DỪNG' : minute === 0 ? 'BẮT ĐẦU TRẬN ĐẤU' : 'TIẾP TỤC TRẬN ĐẤU'}</button>
          <button className="secondary-button" onClick={newMatch}><Shuffle size={15}/> RANDOM MATCH</button>
          <div className="speed-row"><span>TỐC ĐỘ MÔ PHỎNG</span><div>{[1,2,3].map(v=><button key={v} className={speed === v ? 'speed-active' : ''} onClick={()=>setSpeed(v)}>{v}x</button>)}</div></div>
        </div>

        <div className="control-card audio-card">
          <div className="control-title"><span>ÂM THANH SÂN VẬN ĐỘNG</span><button className="sound-toggle" onClick={toggleAudio}>{audioOn ? <Volume2 size={17}/> : <VolumeX size={17}/>} {audioOn ? 'ON' : 'OFF'}</button></div>
          <div className="audio-description"><Headphones size={16}/><span>Không khí cổ động & bình luận tiếng Việt</span></div>
          <div className="volume-row"><Volume2 size={14}/><input type="range" min="0" max="100" value={volume} onChange={e=>{setVolume(+e.target.value);setCrowdVolume(+e.target.value/100)}}/><b>{volume}%</b></div>
          <p className="audio-note">Nhấn ON để kích hoạt âm thanh. Trình duyệt yêu cầu thao tác của bạn trước khi phát.</p>
        </div>

        <div className="control-card commentary-card">
          <div className="control-title"><span><AudioLines size={14}/> BÌNH LUẬN TRỰC TIẾP</span><span className="sound-wave"><i/><i/><i/><i/></span></div>
          <div className="commentary-text">“{commentary}”</div>
          <button className="replay-comment" onClick={()=>speakCommentary(commentary)}><Volume2 size={13}/> NGHE LẠI BÌNH LUẬN</button>
        </div>
      </aside>
    </section>

    <section className="bottom-grid">
      <div className="bottom-card event-card">
        <div className="bottom-heading"><div><span className="eyebrow">LIVE FEED</span><h3>Diễn biến trận đấu</h3></div><Activity size={17}/></div>
        <div className="event-list">{events.slice(0,4).map((ev,i)=><div className={`event-item ${ev.type}`} key={i}><span className="event-time">{ev.minute}'</span><span className="event-marker">{ev.type === 'goal' ? <Goal size={14}/> : ev.type === 'end' ? '✓' : '•'}</span><span>{ev.text}</span></div>)}</div>
      </div>
      <div className="bottom-card atmosphere-card">
        <div className="bottom-heading"><div><span className="eyebrow">THE 12TH PLAYER</span><h3>Không khí khán đài</h3></div><Flame size={18}/></div>
        <div className="atmosphere-meter"><div className="meter-copy"><b>{running ? (minute % 3 === 0 ? 'CUỒNG NHIỆT' : 'MATCHDAY') : 'SẴN SÀNG'}</b><span>STADIUM ENERGY</span></div><div className="meter-track"><i style={{width: running ? `${Math.min(95, 58 + (minute % 5)*7)}%` : '24%'}}/></div></div>
        <div className="chant-row"><span>♪</span> COME ON YOU FANS! <span className="chant-tag">FAN CHANT</span></div>
      </div>
      <div className="bottom-card settings-mini">
        <div className="bottom-heading"><div><span className="eyebrow">QUICK SETTINGS</span><h3>Trải nghiệm</h3></div><Settings2 size={17}/></div>
        <button className="setting-line" onClick={()=>setCrowdMode(v=>v==='normal'?'derby':'normal')}><span><Waves size={15}/> Chế độ cổ động</span><b>{crowdMode === 'normal' ? 'NORMAL' : 'DERBY'}</b></button>
        <button className="setting-line" onClick={()=>setShowSettings(v=>!v)}><span><Expand size={15}/> Cài đặt hiển thị</span><ChevronDown size={15}/></button>
        {showSettings && <div className="settings-detail">Kéo chuột để xoay góc nhìn · Cuộn để zoom · Âm thanh được điều khiển ở bảng bên trên.</div>}
      </div>
    </section>
    <footer><div className="footer-brand">VIRTUAL <b>STADIUM</b></div><span>AN INTERACTIVE FOOTBALL SIMULATION · NOT AN OFFICIAL PREMIER LEAGUE PRODUCT</span><span>BUILD 1.0.0</span></footer>
  </main>
}

export default App
