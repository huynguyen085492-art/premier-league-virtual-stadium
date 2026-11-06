import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

function Pitch() {
  const lines = useMemo(() => {
    const pts=[]; const add=(x1,z1,x2,z2)=>{pts.push(new THREE.Vector3(x1,.035,z1),new THREE.Vector3(x2,.035,z2));};
    add(-17,-10,17,-10); add(17,-10,17,10); add(17,10,-17,10); add(-17,10,-17,-10); add(0,-10,0,10);
    for(let i=0;i<64;i++){const a=i/64*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*2.0,.04,Math.sin(a)*2.0),new THREE.Vector3(Math.cos((i+1)/64*Math.PI*2)*2,.04,Math.sin((i+1)/64*Math.PI*2)*2));}
    return new THREE.BufferGeometry().setFromPoints(pts);
  },[]);
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow><planeGeometry args={[36,22]}/><meshStandardMaterial color="#176b38" roughness={.92}/></mesh>
    {Array.from({length:11},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[-16.4+i*3.28,.012,0]}><planeGeometry args={[3.28,20]}/><meshStandardMaterial color={i%2?'#1c783f':'#176b38'}/></mesh>)}
    <lineSegments geometry={lines}><lineBasicMaterial color="#e9f5e8"/></lineSegments>
    <mesh position={[-17,.6,0]}><boxGeometry args={[.25,1.2,7.2]}/><meshStandardMaterial color="#f4f4f4"/></mesh>
    <mesh position={[17,.6,0]}><boxGeometry args={[.25,1.2,7.2]}/><meshStandardMaterial color="#f4f4f4"/></mesh>
    <mesh position={[0,.02,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.0,2.04,64]}/><meshBasicMaterial color="white"/></mesh>
    <mesh position={[0,.04,0]}><boxGeometry args={[.06,.02,20]}/><meshBasicMaterial color="white"/></mesh>
    {[-1,1].map(side=><group key={side}><mesh position={[side*15.8,1.1,0]}><boxGeometry args={[.3,2.2,7]}/><meshStandardMaterial color="#eeeeee"/></mesh><mesh position={[side*18.1,1.0,0]}><boxGeometry args={[.4,2,7.5]}/><meshStandardMaterial color="#ffffff"/></mesh></group>)}
  </group>;
}

function Stands({homeColor,awayColor}) {
  const count=2100, dummy=new THREE.Object3D(); const mesh=useRef();
  const colors=useMemo(()=>Array.from({length:count},(_,i)=>new THREE.Color([homeColor,awayColor,'#f5f0e8','#202a38','#f2bd46','#1c8b67'][Math.floor(Math.random()*6)])),[homeColor,awayColor]);
  const positions=useMemo(()=>Array.from({length:count},(_,i)=>{
    const side=i%4, row=Math.floor(i/4)%18, col=Math.floor(i/72);
    const along=(col/7.3-0.5)*40;
    if(side===0) return [along,2.5+row*.48,-12-row*.34];
    if(side===1) return [along,2.5+row*.48,12+row*.34];
    const end=(col/7.3-.5)*26;
    return [side===2?-19-row*.34:19+row*.34,2.5+row*.48,end];
  }),[]);
  React.useLayoutEffect(()=>{if(!mesh.current)return;positions.forEach((p,i)=>{dummy.position.set(...p);dummy.position.y+=Math.random()*.12;dummy.rotation.y=Math.random()*.2;dummy.scale.set(.16,.28,.15);dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix);mesh.current.setColorAt(i,colors[i]);});mesh.current.instanceMatrix.needsUpdate=true;},[positions,colors]);
  useFrame(({clock})=>{if(!mesh.current)return;const t=clock.elapsedTime; for(let i=0;i<count;i++){const p=positions[i];dummy.position.set(p[0],p[1]+Math.sin(t*3+i*.17)*.035,p[2]);dummy.rotation.z=Math.sin(t*2+i*.1)*.035;dummy.scale.set(.16,.28,.15);dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix);}mesh.current.instanceMatrix.needsUpdate=true;});
  return <instancedMesh ref={mesh} args={[null,null,count]} castShadow><capsuleGeometry args={[.38,.42,2,5]}/><meshStandardMaterial roughness={.8}/></instancedMesh>;
}
function StadiumStructure({homeColor,awayColor}) {
  return <group>
    {[-1,1].map(side=><group key={side}>
      {[0,1,2].map(level=><mesh key={level} position={[0,2.2+level*2.4,side*(12.5+level*.8)]} rotation={[side*.08,0,0]}><boxGeometry args={[42,1.7,2.1]}/><meshStandardMaterial color={level===2?'#26313b':'#39434c'} roughness={.8}/></mesh>)}
      <mesh position={[0,1.4,side*12.1]}><boxGeometry args={[40,.35,.25]}/><meshStandardMaterial color={side===-1?homeColor:awayColor} emissive={side===-1?homeColor:awayColor} emissiveIntensity={.25}/></mesh>
    </group>)}
    {[-1,1].map(side=><group key={side+'end'}>
      {[0,1,2].map(level=><mesh key={level} position={[side*(19.3+level*.8),2.2+level*2.4,0]}><boxGeometry args={[2.1,1.7,26]}/><meshStandardMaterial color="#303a43"/></mesh>)}
    </group>)}
    {[-1,1].map(x=>[-1,1].map(z=><group key={`${x}${z}`} position={[x*21,0,z*14]}><mesh position={[0,12,0]}><cylinderGeometry args={[.22,.35,24,8]}/><meshStandardMaterial color="#aeb8c0"/></mesh><spotLight position={[0,23,0]} angle={.72} penumbra={.5} intensity={260} distance={65} color="#e7f3ff" castShadow target-position={[0,0,-z*10]}/><mesh position={[0,24,0]}><boxGeometry args={[5,.45,1.1]}/><meshStandardMaterial color="#e9f5ff" emissive="#d8edff" emissiveIntensity={2}/></mesh></group>)))}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.12,0]}><planeGeometry args={[100,100]}/><meshStandardMaterial color="#080d13"/></mesh>
  </group>;
}
function Ball({running,resetKey}) {
  const ref=useRef(); const [target,setTarget]=useState([0,.25,0]);
  useFrame((state,dt)=>{if(!ref.current)return; if(running){ref.current.position.x += Math.sin(state.clock.elapsedTime*.55)*dt*1.8;ref.current.position.z += Math.cos(state.clock.elapsedTime*.39)*dt*1.4;ref.current.position.y=.24+Math.abs(Math.sin(state.clock.elapsedTime*5))*.12;ref.current.rotation.x+=dt*3;ref.current.rotation.z+=dt*2;}});
  React.useEffect(()=>{if(ref.current)ref.current.position.set(0,.25,0)},[resetKey]);
  return <mesh ref={ref} position={[0,.25,0]} castShadow><sphereGeometry args={[.24,24,24]}/><meshStandardMaterial color="#f8f8f2" roughness={.42}/></mesh>;
}
function CameraRig({view}) {
  const {camera}=useThree();
  React.useEffect(()=>{
    const poses={stands:[[0,6,26],[0,0,0]],sideline:[[0,2.2,15],[0,0,0]],high:[[0,32,1],[0,0,0]],goal:[[0,3,20],[0,0,0]]};
    const [p,l]=poses[view]||poses.stands; camera.position.set(...p);camera.lookAt(...l);
  },[view,camera]);
  return null;
}
export default function Stadium({fixture,view,running,resetKey}) {
  return <Canvas shadows dpr={[1,1.6]} gl={{antialias:true}}>
    <PerspectiveCamera makeDefault fov={58} position={[0,6,26]}/><CameraRig view={view}/>
    <color attach="background" args={['#07111d']}/><fog attach="fog" args={['#07111d',38,95]}/>
    <ambientLight intensity={.7}/><directionalLight position={[0,25,0]} intensity={2.2} castShadow shadow-mapSize={[1024,1024]}/>
    <Pitch/><StadiumStructure homeColor={fixture.home.color} awayColor={fixture.away.color}/><Stands homeColor={fixture.home.color} awayColor={fixture.away.color}/><Ball running={running} resetKey={resetKey}/>
    <Billboard position={[0,10,-13]}><Text fontSize={1.15} color="#ffffff" outlineWidth={.035} outlineColor="#111827">{fixture.home.short}  VS  {fixture.away.short}</Text></Billboard>
    <OrbitControls makeDefault enablePan={false} minDistance={8} maxDistance={48} maxPolarAngle={Math.PI*.48}/>
  </Canvas>;
}
