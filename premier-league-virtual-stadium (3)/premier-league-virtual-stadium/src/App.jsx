import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Shuffle, Trophy, Users, Camera, Maximize2, Heart, Radio, Settings2, Flag, Zap } from 'lucide-react';
import Stadium from './components/Stadium.jsx';
import { TEAMS, randomFixture } from './data/teams.js';
import { startAudio, stopAudio, playWhistle, playCheer, speakCommentary, setCrowdIntensity } from './lib/audio.js';

const fmt = n => String(n).padStart(2,'0');
const commentaryLines = [
  (h,a)=>`Một pha lên bóng đầy tốc độ của ${h}! Hàng phòng ngự ${a} đang phải lùi sâu.`,
  (h,a)=>`Cơ hội nguy hiểm! Cú sút vừa đi chệch cột dọc trong gang tấc. Khán đài đang nóng lên!`,
  (h,a)=>`Một pha tranh chấp quyết liệt ở khu vực giữa sân. Trọng tài cho trận đấu tiếp tục.`,
  (h,a)=>`${a} đang tổ chức phản công. Đường chuyền vượt tuyến, liệu có cơ hội?`,
  (h,a)=>`Khán giả đang tạo nên bầu không khí tuyệt vời. Hai đội vẫn chơi đầy quyết tâm!`
];

function Crest({team,size=52}) { return <div className="crest" style={{'--team':team.color,'--secondary':team.secondary,width:size,height:size}}><span>{team.short.slice(0,3)}</span></div>; }
function TeamCard({team,side,selected,onClick}) { return <button className={`team-card ${selected?'selected':''}`} onClick={onClick}><Crest team={team}/><span className="team-info"><b>{team.name}</b><small>{side} · {team.ground}</small></span>{selected&&<Heart size={17} fill="currentColor"/>}</button>; }

export default function App(){
  const [fixture,setFixture]=useState(()=>randomFixture());
  const [favorite,setFavorite]=useState('');
  const [view,setView]=useState('stands');
  const [started,setStarted]=useState(false);
  const [running,setRunning]=useState(false);
  const [sound,setSound]=useState(false);
  const [commentary,setCommentary]=useState(true);
  const [crowd,setCrowd]=useState(72);
  const [minute,setMinute]=useState(0);
  const [score,setScore]=useState([0,0]);
  const [event,setEvent]=useState('Chào mừng đến với Virtual Stadium');
  const [feed,setFeed]=useState(['Sân vận động đã sẵn sàng. Hãy chọn trận đấu và vào sân!']);
  const [resetKey,setResetKey]=useState(0);
  const [showTeams,setShowTeams]=useState(false);
  const [favoriteSearch,setFavoriteSearch]=useState('');
  const timer=useRef(null);

  const addFeed=(line)=>setFeed(prev=>[line,...prev].slice(0,5));
  const chooseRandom=()=>{const next=randomFixture(favorite);setFixture(next);setScore([0,0]);setMinute(0);setFeed(['Đã bốc thăm trận đấu mới.']);setEvent(`${next.home.name} gặp ${next.away.name}`);setResetKey(k=>k+1);setRunning(false);};
  const begin=()=>{if(!sound){const ok=startAudio();setSound(ok);}setStarted(true);setRunning(true);setEvent('Trọng tài chuẩn bị thổi còi khai cuộc');playWhistle();speakCommentary(`Chào mừng quý vị đến với trận đấu giữa ${fixture.home.name} và ${fixture.away.name}.`);};
  const toggleSound=()=>{if(sound){stopAudio();setSound(false);}else{setSound(startAudio());}};
  const stopMatch=()=>{setRunning(false);setEvent('Trận đấu đang tạm dừng');};
  useEffect(()=>{if(!running)return;timer.current=setInterval(()=>{
    setMinute(m=>{const next=m+1;if(next>=90){setRunning(false);setEvent('Trận đấu kết thúc');addFeed('Trọng tài thổi còi mãn cuộc.');return 90;}
      if(next%7===0){const line=commentaryLines[Math.floor(Math.random()*commentaryLines.length)](fixture.home.name,fixture.away.name);setEvent(line);addFeed(`${fmt(next)}’ ${line}`);if(commentary)speakCommentary(line);}
      if(next%19===0 && Math.random()>.28){const side=Math.random()>.5?0:1;setScore(s=>s.map((v,i)=>i===side?v+1:v));const scorer=side===0?fixture.home:fixture.away;const goal=`VÀOOOO! ${scorer.name} ghi bàn! Cả sân vận động bùng nổ!`;setEvent(goal);addFeed(`${fmt(next)}’ ⚽ ${goal}`);if(sound)playCheer();if(commentary)speakCommentary(goal);}
      if(next%13===0 && sound)playCheer();return next;});
  },1800);return()=>clearInterval(timer.current);},[running,fixture,commentary,sound]);
  useEffect(()=>{setCrowdIntensity(crowd/400);},[crowd,sound]);
  useEffect(()=>()=>{clearInterval(timer.current);stopAudio();},[]);
  const filtered=TEAMS.filter(t=>t.name.toLowerCase().includes(favoriteSearch.toLowerCase()));

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">PL</span><span>VIRTUAL <b>STADIUM</b><small>THE MATCHDAY EXPERIENCE</small></span></a><div className="live-pill"><i/> SIMULATED MATCHDAY</div><div className="top-actions"><button className="icon-button" title="Âm thanh" onClick={toggleSound}>{sound?<Volume2/>:<VolumeX/>}</button><button className="icon-button" title="Toàn màn hình" onClick={()=>document.documentElement.requestFullscreen?.()}><Maximize2/></button></div></header>
    <section className="hero-row"><div><div className="eyebrow"><span/> PREMIER LEAGUE EXPERIENCE</div><h1>FEEL THE <em>GAME.</em></h1><p>Bước lên khán đài. Chọn màu cờ sắc áo. Sống trong từng khoảnh khắc của trận đấu.</p></div><div className="match-meta"><span>VIRTUAL MATCH</span><b>{fixture.venue}</b><small>90 phút · Mô phỏng 3D</small></div></section>

    <section className="stadium-layout">
      <div className="stadium-column"><div className="stadium-frame"><Stadium fixture={fixture} view={view} running={running} resetKey={resetKey}/>
        <div className="stadium-overlay"><div className="overlay-top"><span className="live-tag"><i/> {running?'LIVE SIMULATION':'STADIUM VIEW'}</span><span className="weather">☾ NIGHT KICK-OFF · FLOODLIGHTS ON</span></div>
          <div className="scoreboard"><div className="score-team"><Crest team={fixture.home} size={38}/><b>{fixture.home.short}</b></div><div className="score-center"><strong>{score[0]} <small>:</small> {score[1]}</strong><span>{fmt(minute)}’ · {running?'1ST HALF':'PRE-MATCH'}</span></div><div className="score-team away"><b>{fixture.away.short}</b><Crest team={fixture.away} size={38}/></div></div>
          <div className="overlay-bottom"><span><Users size={14}/> 42,816 IN THE STANDS</span><span><Zap size={14}/> ATMOSPHERE {crowd}%</span></div>
        </div>
        {!started&&<div className="start-overlay"><div className="start-card"><div className="start-icon"><Trophy/></div><span>YOUR SEAT IS WAITING</span><h2>Welcome to<br/><em>the stadium.</em></h2><p>Nhấn vào nút bên dưới để bật âm thanh và bước vào trận đấu.</p><button className="primary-button" onClick={begin}><Play size={17} fill="currentColor"/> ENTER THE STADIUM</button></div></div>}
      </div>
      <div className="viewbar"><div className="view-label"><Camera size={16}/> CAMERA ANGLE</div><div className="view-buttons">{[['stands','Khán đài'],['sideline','Đường biên'],['high','Trên cao'],['goal','Sau cầu môn']].map(([id,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</div><span className="drag-hint">Kéo chuột để xoay góc nhìn</span></div>
      <div className="match-controls"><div className="control-status"><span className={running?'status-live':''}/><b>{running?'TRẬN ĐẤU ĐANG DIỄN RA':minute===90?'FULL TIME':'SẴN SÀNG RA SÂN'}</b><small>{event}</small></div><div className="control-buttons"><button className="secondary-button" onClick={chooseRandom}><Shuffle size={16}/> Random trận</button>{running?<button className="primary-button compact" onClick={stopMatch}><Pause size={16} fill="currentColor"/> Tạm dừng</button>:<button className="primary-button compact" onClick={()=>{if(!started)begin();else {setRunning(true);setEvent('Trận đấu tiếp tục');}}}><Play size={16} fill="currentColor"/> {minute===0?'Bắt đầu':'Tiếp tục'}</button>}</div></div>
      </div>

      <aside className="side-panel"><div className="panel-heading"><div><span className="eyebrow">MATCH CENTER</span><h2>Trận đấu của bạn</h2></div><span className="round-icon"><Radio size={18}/></span></div>
        <div className="fixture-card"><div className="fixture-top"><span>RANDOM FIXTURE</span><span>PL · EXHIBITION</span></div><TeamCard team={fixture.home} side="HOME"/><div className="versus">VS <span>90 MIN</span></div><TeamCard team={fixture.away} side="AWAY"/><div className="venue-line"><Flag size={14}/>{fixture.venue}</div><button className="outline-button" onClick={chooseRandom}><Shuffle size={15}/> BỐC THĂM ĐỘI KHÁC</button></div>
        <div className="favorite-section"><div className="section-title"><Heart size={16}/> ĐỘI BẠN YÊU THÍCH</div><p>Chọn CLB để tăng cơ hội xuất hiện trong lượt bốc thăm tiếp theo.</p><button className="select-team-button" onClick={()=>setShowTeams(v=>!v)}>{favorite?TEAMS.find(t=>t.id===favorite)?.name:'Chọn đội bóng yêu thích'} <span>⌄</span></button>
          {showTeams&&<div className="team-picker"><input value={favoriteSearch} onChange={e=>setFavoriteSearch(e.target.value)} placeholder="Tìm câu lạc bộ..."/>{filtered.map(t=><button key={t.id} onClick={()=>{setFavorite(t.id);setShowTeams(false);setFavoriteSearch('');}}><Crest team={t} size={28}/>{t.name}{favorite===t.id&&<Heart size={14} fill="currentColor"/>}</button>)}<button className="clear-fav" onClick={()=>{setFavorite('');setShowTeams(false);}}>Bỏ chọn đội yêu thích</button></div>}
        </div>
        <div className="sound-section"><div className="section-title"><Volume2 size={16}/> KHÔNG KHÍ SÂN VẬN ĐỘNG</div><div className="sound-row"><span>Âm thanh sân</span><button className={`toggle ${sound?'on':''}`} onClick={toggleSound}><i/></button></div><div className="sound-row"><span>Bình luận viên</span><button className={`toggle ${commentary?'on':''}`} onClick={()=>setCommentary(v=>!v)}><i/></button></div><label className="range-label">Cường độ cổ động <b>{crowd}%</b></label><input className="range" type="range" min="0" max="100" value={crowd} onChange={e=>setCrowd(+e.target.value)}/><small className="audio-note">Âm thanh đám đông được tổng hợp bằng Web Audio; giọng đọc dùng giọng hệ thống của trình duyệt.</small></div>
      </aside>
    </section>

    <section className="lower-grid"><div className="commentary-card"><div className="section-title"><Radio size={16}/> LIVE COMMENTARY <span className="live-dot"/></div><div className="commentary-main"><div className="commentator-avatar">MC</div><div><b>BLV Sân Cỏ</b><p>{event}</p></div></div><div className="feed-list">{feed.map((f,i)=><div key={i}><span>{i===0?'NOW':`-${i}’`}</span>{f}</div>)}</div></div>
      <div className="how-card"><div className="section-title"><Settings2 size={16}/> MATCHDAY GUIDE</div><h3>Trải nghiệm của bạn</h3><div className="guide-item"><span>01</span><div><b>Bốc thăm trận đấu</b><small>Hai CLB ngẫu nhiên từ danh sách đội bóng.</small></div></div><div className="guide-item"><span>02</span><div><b>Chọn vị trí khán đài</b><small>Đổi góc nhìn và tự do xoay camera 3D.</small></div></div><div className="guide-item"><span>03</span><div><b>Hòa mình vào trận đấu</b><small>Diễn biến, bàn thắng và âm thanh mô phỏng.</small></div></div></div></section>
    <footer><div className="brand-mark">PL</div><span>PREMIER LEAGUE · VIRTUAL STADIUM</span><small>Fan-made simulation experience. Not affiliated with the Premier League or any football club.</small></footer>
  </main>;
}
