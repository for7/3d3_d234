import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef } from 'react'

function Earth() {
  const ref = useRef()
  const [colorMap, bumpMap, specularMap] = useLoader(TextureLoader, [
    '/textures/earth/2k_earth_daymap.jpg',
    '/textures/earth/2k_earth_clouds.jpg',
    '/textures/earth/2k_earth_nightmap.jpg',
  ])

  useFrame((state, delta) => (ref.current.rotation.y = ref.current.rotation.y += delta))

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.05}
        specularMap={specularMap}
        specular={[0.3, 0.3, 0.3]}
      />
    </mesh>
  )
}

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        color: '#fff'
      }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  )
}
