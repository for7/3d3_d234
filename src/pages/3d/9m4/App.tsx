import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Preload } from '@react-three/drei'
// import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
// import { suspend } from 'suspend-react'

extend(geometry)
// const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
// const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export const App = ({ meshId, setmeshId }) => { 
  return (<>
    <Canvas flat camera={{ fov: 75, position: [0, 0, 20] }} eventPrefix="client">
      <color attach="background" args={['#f0f0f0']} />
      <Frame meshId={meshId} setmeshId={setmeshId} id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
        <Gltf src="/pickles_3d_version_of_hyuna_lees_illustration-transformed.glb" scale={8} position={[0, -0.7, -2]} />
      </Frame>
      <Frame meshId={meshId} setmeshId={setmeshId} id="02" name="tea" author="Omar Faruq Tawsif">
        <Gltf src="/fiesta_tea-transformed.glb" position={[0, -2, -3]} />
      </Frame>
      <Frame meshId={meshId} setmeshId={setmeshId} id="03" name="still" author="Omar Faruq Tawsif" bg="#d1d1ca" position={[1.15, 0, 0]} rotation={[0, -0.5, 0]}>
        <Gltf src="/still_life_based_on_heathers_artwork-transformed.glb" scale={2} position={[0, -0.8, -4]} />
      </Frame>
      <Rig meshId={meshId} setmeshId={setmeshId} />
      <Preload all />
    </Canvas>
  </>);
}

function Frame({ meshId, setmeshId, id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  // const [, setLocation] = useLocation()
  // const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', meshId === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
        {name}
      </Text>
      <Text fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text>
      <mesh
        name={id}
        // onClick={() => alert(5)}
        onDoubleClick={(e) => (e.stopPropagation(), setmeshId(e.object.name))}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={meshId === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({ meshId, setmeshId, position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  // const [, params] = useRoute('/item/:id')
  useEffect(() => {
    // 找到当前点击目标，将其放置在场景中间
    const active = meshId && scene.getObjectByName(meshId)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    }
    // 设置相机位置 看向目标
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
