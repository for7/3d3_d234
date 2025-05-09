// src/components/HybridModelingDemo.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, OrbitControls, useGLTF, Text, Loader, Outlines, Decal, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg'
import { Mesh } from 'three'
const box = new THREE.BoxGeometry()
const tri = new THREE.CylinderGeometry(0.5, 0.5, 3, 3)

function Sticker({ url, ...props }) {
  const { debug } = useControls({ debug: false })
  const emoji = useTexture(url)
  return (
    <Decal debug={debug} {...props}>
      <meshPhysicalMaterial
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        map={emoji}
        map-flipY={false}
        map-anisotropy={16}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        roughness={1}
        clearcoat={0.5}
        metalness={0.75}
        toneMapped={false}
      />
    </Decal>
  )
}


function BoxOutlines(props) {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      {...props}
      position={[4, 0, 0]}
      scale={[2, 2, 2]}
      receiveShadow
      castShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
      <Sticker
        url="/react.png"
        position={[0, 0, 0]}
        // rotation={-0.5}
        scale={[0.9, 0.9, 1]}
      />
      <Outlines
        screenspace
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={100}
        transparent
        opacity={hovered * 1}
        color="white"
        angle={Math.PI}
        thickness={0.05}
      />
    </mesh>
  )
}

function BooleanModel(props) {
  const [hovered, setHovered] = useState(false)
  return (
    <mesh receiveShadow castShadow {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : 'gold'} />
      <Geometry computeVertexNormals >
        <Base name="base" geometry={box} scale={[3, 3, 3]} />
        <Addition name="cavity" geometry={tri} scale={[2, 2, 2]} />
      </Geometry>
    </mesh>
  );
}

// ✅ Instanced Mesh：hover 效果为整体变色（因不能逐个 hover）
function InstancedGrid() {
  const count = 10
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const [hovered, setHovered] = useState(false)

  const positions = useMemo(() => {
    const arr = []
    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        arr.push([x * 1.5 - count * 0.75, 0, z * 1.5 - count * 0.75])
      }
    }
    return arr
  }, [count])

  useEffect(() => {
    positions.forEach((pos, i) => {
      dummy.position.set(...pos)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, dummy])

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, positions.length]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={hovered ? 'orange' : 'skyblue'} />
    </instancedMesh>
  )
}

// ✅ 静态 Mesh：鼠标悬浮变色
function StaticMesh() {
  const [hovered, setHovered] = useState(false)
  return (
    <mesh
      position={[-4, 1, -4]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial color={hovered ? 'deepskyblue' : 'gold'} />
    </mesh>
  )
}

// ✅ 动态波动平面：hover 无感，但受 GUI 控制
function ProceduralAnimatedPlane() {
  const meshRef = useRef()
  const geom = useMemo(() => new THREE.PlaneGeometry(8, 8, 64, 64), [])

  const { freqX, freqY, ampX, ampY, color, wireframe } = useControls('Wave Control', {
    freqX: { value: 2, min: 0, max: 10, step: 0.1 },
    freqY: { value: 2, min: 0, max: 10, step: 0.1 },
    ampX: { value: 0.2, min: 0, max: 1, step: 0.01 },
    ampY: { value: 0.2, min: 0, max: 1, step: 0.01 },
    color: '#ffffff',
    wireframe: true,
  })

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pos = meshRef.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = Math.sin(x * freqX + t) * ampX + Math.cos(y * freqY + t * 0.5) * ampY
      pos.setZ(i, z)
    }
    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  )
}

// ✅ Voxel 建模：简单点击添加 voxel
function VoxelBuilder() {
  const [voxels, setVoxels] = useState({ '0,0,0': [0, 0, 0] })

  const addVoxel = (event) => {
    event.stopPropagation()
    const intersect = event.intersections?.[0]
    if (!intersect) return
    const pos = intersect.object.position
    const face = intersect.face?.normal
    if (!face) return
    const newPos = [pos.x + face.x, pos.y + face.y, pos.z + face.z]
    const key = newPos.join(',')
    setVoxels((v) => ({ ...v, [key]: newPos }))
  }

  return (
    <group onClick={addVoxel} position={[-4, 0, 2]}>
      {Object.values(voxels).map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="tomato" />
        </mesh>
      ))}
    </group>
  )
}

// ✅ GLTF 外部模型
function GLTFModel() {
  const { scene } = useGLTF('/react-transformed.glb')
  return <primitive object={scene} position={[4, 0, -4]} />
}

// ✅ 文本建模
function ProceduralText() {
  const [hovered, setHovered] = useState(false)
  return (
    <Text
      position={[-6, 2, 2]}
      fontSize={0.5}
      color={hovered ? 'yellow' : 'lime'}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      R3F Build
    </Text>
  )
}

export function App() {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <color attach="background" args={["#202020"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <BoxOutlines />
      {/* <Center>
        <BooleanModel />
      </Center> */}

      {/* <InstancedGrid />
      <StaticMesh />
      <ProceduralAnimatedPlane />
      <VoxelBuilder />
      <GLTFModel />
      <ProceduralText /> */}

      <OrbitControls />
    </Canvas>
  )
}

export default function AppHtml() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        color: '#fff'
      }}>
      <App />
      <Loader />
    </div>
  );
}
// 使用前确保 public/model.glb 存在，或替换为有效的 glTF 文件路径
