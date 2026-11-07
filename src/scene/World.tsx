import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Group } from 'three'

export type Theme = 'city' | 'cosmos' | 'sunset'
type V3 = [number, number, number]

const rng = (seed: number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }
const PAL = ['#f4a261', '#e76f51', '#8ecae6', '#cdb4db', '#ffd166', '#06d6a0', '#ef476f', '#4aa3df']
const NEON = ['#7c3aed', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#ec4899']

function Orbit({ r, h }: { r: number; h: number }) {
  useFrame(({ camera, clock, pointer }) => {
    const a = clock.elapsedTime * 0.05 + pointer.x * 0.35
    camera.position.set(Math.sin(a) * r, h + pointer.y * 1.5, Math.cos(a) * r)
    camera.lookAt(0, 3, 0)
  })
  return null
}

function Coin({ p, s = 1 }: { p: V3; s?: number }) {
  const g = useRef<Group>(null)
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 1.6 })
  return (
    <Float speed={2} floatIntensity={2}>
      <group ref={g} position={p} scale={s}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.18, 24]} />
          <meshStandardMaterial color="#ffc83d" metalness={0.6} roughness={0.3} flatShading emissive="#a16207" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

/* ---------- Dashboard / Deadlines: low-poly scholarship city ---------- */
function City() {
  const { blds, trees, lamps } = useMemo(() => {
    const r = rng(11)
    const blds: { x: number; z: number; h: number; w: number; c: string }[] = []
    const trees: V3[] = []
    for (let x = -4; x <= 4; x++)
      for (let z = -4; z <= 4; z++) {
        if (x === 0 || z === 0 || r() < 0.22) continue
        blds.push({ x: x * 6 + (r() - 0.5) * 1.2, z: z * 6 + (r() - 0.5) * 1.2, h: 1.5 + r() * r() * 10, w: 1.7 + r() * 1.3, c: PAL[Math.floor(r() * PAL.length)] })
      }
    for (let x = -4; x < 4; x++)
      for (let z = -4; z < 4; z++) if (r() > 0.5) trees.push([x * 6 + 3, 0, z * 6 + 3])
    const lamps: V3[] = []
    for (let i = -24; i <= 24; i += 6) if (i !== 0) { lamps.push([2.3, 0, i], [i, 0, 2.3]) }
    return { blds, trees, lamps }
  }, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[160, 160]} /><meshStandardMaterial color="#1f6b3a" flatShading /></mesh>
      <mesh position={[0, 0.03, 0]}><boxGeometry args={[160, 0.05, 3]} /><meshStandardMaterial color="#3d4a6b" /></mesh>
      <mesh position={[0, 0.03, 0]}><boxGeometry args={[3, 0.05, 160]} /><meshStandardMaterial color="#3d4a6b" /></mesh>
      {blds.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}><boxGeometry args={[b.w, b.h, b.w]} /><meshStandardMaterial color={b.c} flatShading /></mesh>
      ))}
      {trees.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.12, 0.15, 0.8, 5]} /><meshStandardMaterial color="#6b4423" flatShading /></mesh>
          <mesh position={[0, 1.6, 0]}><coneGeometry args={[0.75, 1.9, 6]} /><meshStandardMaterial color="#2f9e57" flatShading /></mesh>
        </group>
      ))}
      {lamps.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.05, 0.05, 2, 6]} /><meshStandardMaterial color="#222a44" /></mesh>
          <mesh position={[0, 2.1, 0]}><sphereGeometry args={[0.22, 8, 8]} /><meshStandardMaterial color="#fff3b0" emissive="#ffe27a" emissiveIntensity={1.5} /></mesh>
        </group>
      ))}
      {/* central fountain + giant coin */}
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[2.2, 2.4, 0.4, 16]} /><meshStandardMaterial color="#8892b0" flatShading /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[1.6, 1.6, 0.3, 16]} /><meshStandardMaterial color="#38bdf8" flatShading /></mesh>
      <Coin p={[0, 5, 0]} s={2.2} />
      {[[-12, 8, -10], [14, 10, 8], [-8, 7, 14], [10, 9, -14]].map((p, i) => <Coin key={i} p={p as V3} />)}
    </group>
  )
}

/* ---------- Discover / Detail / Profile: cosmos ---------- */
function Cosmos({ small }: { small: boolean }) {
  const shapes = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      const d = 6 + r() * 8
      return { p: [Math.cos(a) * d, r() * 8 - 1, Math.sin(a) * d] as V3, c: NEON[i % NEON.length], s: 0.9 + r() * 1.2, k: i % 4 }
    })
  }, [])
  return (
    <group>
      <Stars radius={90} depth={40} count={small ? 1200 : 3500} factor={4} fade speed={1} />
      {shapes.map((o, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.4} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={o.p} scale={o.s}>
            {o.k === 0 && <sphereGeometry args={[1, 48, 48]} />}
            {o.k === 1 && <torusGeometry args={[1, 0.38, 24, 60]} />}
            {o.k === 2 && <icosahedronGeometry args={[1, 1]} />}
            {o.k === 3 && <torusKnotGeometry args={[0.8, 0.28, 120, 16]} />}
            <MeshDistortMaterial color={o.c} distort={0.35} speed={2} roughness={0.15} metalness={0.6} />
          </mesh>
        </Float>
      ))}
      <group position={[-14, 5, -18]}>
        <mesh><sphereGeometry args={[3, 24, 24]} /><meshStandardMaterial color="#f97316" flatShading /></mesh>
        <mesh rotation={[1.2, 0.3, 0]}><torusGeometry args={[5, 0.25, 6, 48]} /><meshStandardMaterial color="#fde68a" flatShading /></mesh>
      </group>
      <Coin p={[0, 4, 0]} s={1.8} />
      <pointLight position={[-8, -4, 6]} intensity={80} color="#ec4899" />
      <pointLight position={[8, 6, 6]} intensity={80} color="#06b6d4" />
    </group>
  )
}

/* ---------- Tracker: sunset hills ---------- */
function Sunset() {
  const { hills, clouds } = useMemo(() => {
    const r = rng(3)
    const cols = ['#7b2cbf', '#c9184a', '#ff6d00', '#9d4edd']
    const hills = Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2 + r() * 0.2
      const d = 22 + r() * 22
      return { p: [Math.cos(a) * d, 0, Math.sin(a) * d] as V3, rad: 5 + r() * 5, h: 6 + r() * 8, c: cols[i % 4] }
    })
    const clouds = Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2
      return [Math.cos(a) * 20, 9 + r() * 5, Math.sin(a) * 20] as V3
    })
    return { hills, clouds }
  }, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[70, 32]} /><meshStandardMaterial color="#ff9f68" flatShading /></mesh>
      {hills.map((h, i) => (
        <mesh key={i} position={[h.p[0], h.h / 2, h.p[2]]}><coneGeometry args={[h.rad, h.h, 5]} /><meshStandardMaterial color={h.c} flatShading /></mesh>
      ))}
      <mesh position={[0, 12, -45]}><sphereGeometry args={[7, 24, 24]} /><meshBasicMaterial color="#fff1a8" /></mesh>
      {clouds.map((p, i) => (
        <Float key={i} speed={1} floatIntensity={2}>
          <group position={p}>
            {[[0, 0, 0, 1.6], [1.6, -0.2, 0, 1.2], [-1.6, -0.3, 0, 1.2]].map(([x, y, z, s], j) => (
              <mesh key={j} position={[x, y, z]}><icosahedronGeometry args={[s, 1]} /><meshStandardMaterial color="#fff" flatShading /></mesh>
            ))}
          </group>
        </Float>
      ))}
      {[[-6, 4, 4], [6, 5, -3], [0, 3, 8], [-9, 6, -6], [9, 4, 6]].map((p, i) => <Coin key={i} p={p as V3} />)}
    </group>
  )
}

const CFG = {
  city: { bg: '#2f9aa0', r: 30, h: 14 },
  cosmos: { bg: '#0a0720', r: 22, h: 2 },
  sunset: { bg: '#ff9770', r: 26, h: 7 },
}

export default function World({ theme }: { theme: Theme }) {
  const reduce = useReducedMotion()
  const c = CFG[theme]
  const small = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <Canvas frameloop={reduce ? 'demand' : 'always'} dpr={[1, small ? 1 : 1.5]} gl={{ antialias: !small, powerPreference: 'low-power' }} camera={{ fov: 50, position: [0, c.h, c.r] }}>
        <color attach="background" args={[c.bg]} />
        <fog attach="fog" args={[c.bg, 35, 95]} />
        <ambientLight intensity={theme === 'cosmos' ? 0.5 : 0.9} />
        <directionalLight position={[10, 20, 10]} intensity={theme === 'cosmos' ? 1.5 : 2} />
        {!reduce && <Orbit r={c.r} h={c.h} />}
        {theme === 'city' && <City />}
        {theme === 'cosmos' && <Cosmos small={small} />}
        {theme === 'sunset' && <Sunset />}
      </Canvas>
    </div>
  )
}
