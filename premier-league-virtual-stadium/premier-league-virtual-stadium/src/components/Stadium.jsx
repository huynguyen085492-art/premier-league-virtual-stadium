import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

function CrowdStand({ side = 1, color = '#d8d8d8' }) {
  const crowd = useMemo(() => {
    const items = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 46; col++) {
        items.push({
          x: (col - 22.5) * 0.34,
          y: 2.4 + row * 0.29,
          z: side * (10.7 + row * 0.42),
          c: ['#d7d9dc', '#d9bd82', '#7da0b7', '#b95c54', '#d4d4d4', '#3b4754'][Math.floor(Math.random() * 6)]
        })
      }
    }
    return items
  }, [side])
  return <group>
    {crowd.map((p, i) => (
      <group key={i} position={[p.x, p.y, p.z]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.15, 3, 5]} />
          <meshStandardMaterial color={p.c} roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <sphereGeometry args={[0.075, 7, 6]} />
          <meshStandardMaterial color="#d6b99b" roughness={1} />
        </mesh>
      </group>
    ))}
  </group>
}

function Floodlight({ position }) {
  return <group position={position}>
    <mesh>
      <boxGeometry args={[0.16, 5.5, 0.16]} />
      <meshStandardMaterial color="#343d3c" metalness={0.7} roughness={0.4} />
    </mesh>
    <mesh position={[0, 2.8, 0]}>
      <boxGeometry args={[2.5, 0.7, 0.35]} />
      <meshStandardMaterial color="#f6f4df" emissive="#fff2c7" emissiveIntensity={2.8} />
    </mesh>
    <pointLight position={[0, 2.4, 0]} intensity={95} distance={42} color="#eaf4ff" />
  </group>
}

export function Player({ position, color, number, isKeeper = false, phase = 0 }) {
  const group = useRef()
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime
      group.current.position.x = position[0] + Math.sin(t * 0.42 + phase) * 0.48
      group.current.position.z = position[2] + Math.cos(t * 0.36 + phase * 1.3) * 0.34
      group.current.position.y = position[1] + Math.abs(Math.sin(t * 5 + phase)) * 0.035
      group.current.rotation.y = Math.sin(t * 0.7 + phase) * 0.12
    }
  })
  return <group ref={group} position={position}>
    <mesh castShadow position={[0, 0.42, 0]}>
      <capsuleGeometry args={[0.19, 0.38, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
    <mesh castShadow position={[0, 0.82, 0]}>
      <sphereGeometry args={[0.145, 12, 10]} />
      <meshStandardMaterial color="#c99f7d" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.16, 0.01]}>
      <boxGeometry args={[0.27, 0.12, 0.3]} />
      <meshStandardMaterial color={isKeeper ? '#f2c94c' : '#f2f2f2'} />
    </mesh>
    <mesh position={[0, 0.42, 0.195]}>
      <planeGeometry args={[0.17, 0.16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  </group>
}

export function Stadium({ home, away, running = true }) {
  const ball = useRef()
  const players = useMemo(() => {
    const list = []
    for (let i = 0; i < 11; i++) {
      const x = -8.4 + (i % 4) * 1.7 + Math.floor(i / 4) * 0.3
      const z = -3.8 + Math.floor(i / 4) * 2.5
      list.push({ x, z, team: 0, i })
      list.push({ x: -x, z: -z, team: 1, i })
    }
    return list
  }, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ball.current && running) {
      ball.current.position.x = Math.sin(t * 0.53) * 5.4
      ball.current.position.z = Math.cos(t * 0.71) * 2.9
      ball.current.position.y = 0.16 + Math.abs(Math.sin(t * 2.4)) * 0.12
    }
  })
  return <>
    <color attach="background" args={['#07110f']} />
    <fog attach="fog" args={['#07110f', 25, 62]} />
    <ambientLight intensity={0.65} />
    <directionalLight position={[0, 18, 2]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
    <Floodlight position={[-18, 5, -8]} />
    <Floodlight position={[18, 5, -8]} />
    <Floodlight position={[-18, 5, 8]} />
    <Floodlight position={[18, 5, 8]} />
    <Environment preset="night" />
    {/* Pitch */}
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
      <planeGeometry args={[22, 13]} />
      <meshStandardMaterial color="#176b3b" roughness={1} />
    </mesh>
    {Array.from({ length: 10 }).map((_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-9.9 + i * 2.2, -0.045, 0]}>
        <planeGeometry args={[2.2, 13]} />
        <meshStandardMaterial color={i % 2 ? '#1a713e' : '#1d7943'} roughness={1} />
      </mesh>
    ))}
    {/* Pitch markings */}
    <group position={[0, 0.005, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.05, 3.09, 64]} /><meshBasicMaterial color="#e9f3e8" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[0.045, 13]} /><meshBasicMaterial color="#e9f3e8" /></mesh>
      {[-10.8, 10.8].map(x => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, 0]}><planeGeometry args={[0.045, 13]} /><meshBasicMaterial color="#e9f3e8" /></mesh>)}
      {[-6.3, 6.3].map(z => <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}><planeGeometry args={[22, 0.045]} /><meshBasicMaterial color="#e9f3e8" /></mesh>)}
      {[-1, 1].map(sign => <group key={sign} position={[sign * 9.3, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3, 7.4]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.035} /></mesh>
        <mesh position={[sign * 1.55, 0.7, 0]}><boxGeometry args={[0.12, 1.4, 0.12]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[sign * 1.55, 1.4, 0]}><boxGeometry args={[0.12, 0.12, 3.8]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>)}
    </group>
    {/* Stands and crowd */}
    <mesh position={[0, 2.0, -11.4]}><boxGeometry args={[42, 5.4, 1.3]} /><meshStandardMaterial color="#172326" metalness={0.35} roughness={0.8} /></mesh>
    <mesh position={[0, 2.0, 11.4]}><boxGeometry args={[42, 5.4, 1.3]} /><meshStandardMaterial color="#172326" metalness={0.35} roughness={0.8} /></mesh>
    <CrowdStand side={-1} /><CrowdStand side={1} />
    <CrowdStand side={-1} />
    {/* Side stands */}
    <mesh position={[-12.2, 2.1, 0]}><boxGeometry args={[1.2, 5.4, 20]} /><meshStandardMaterial color="#1a2929" /></mesh>
    <mesh position={[12.2, 2.1, 0]}><boxGeometry args={[1.2, 5.4, 20]} /><meshStandardMaterial color="#1a2929" /></mesh>
    {/* Team players */}
    {players.map((p, i) => {
      const team = p.team === 0 ? home : away
      return <Player key={i} position={[p.x, 0, p.z]} color={team.color} number={p.i + 1} isKeeper={p.i === 0} phase={i * 0.8} />
    })}
    <mesh ref={ball} position={[0, 0.2, 0]} castShadow>
      <sphereGeometry args={[0.16, 16, 12]} />
      <meshStandardMaterial color="#ffffff" roughness={0.35} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
      <planeGeometry args={[100, 100]} /><meshStandardMaterial color="#07110f" />
    </mesh>
  </>
}
