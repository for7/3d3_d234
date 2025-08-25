import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bvh, Instances, Instance, OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

import { data } from './store'

export default function App() {
  // 使用 Leva 创建范围控制滑块，用于控制实例数量
  const { range } = useControls({ 
    range: { value: 100, min: 0, max: 300, step: 10 } 
  })

  return (
    // 创建3D场景，设置相机位置和视场角
    <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
      {/* 添加环境光照 */}
      <ambientLight intensity={0.5 * Math.PI} />
      {/* 添加平行光源 */}
      <directionalLight intensity={0.3} position={[5, 25, 20]} />
      {/* BVH (Bounding Volume Hierarchy) 用于优化射线检测性能 */}
      <Bvh firstHitOnly>
        <Shoes data={data} range={range} />
      </Bvh>
      {/* 添加城市环境贴图 */}
      <Environment preset="city" />
      {/* 添加轨道控制器，启用自动旋转 */}
      <OrbitControls autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

// Shoes组件：管理鞋子实例的容器
function Shoes({ data, range }) {
  // 加载GLB模型，获取节点和材质
  const { nodes, materials } = useGLTF('/shoe.glb')
  return (
    // Instances组件用于实现GPU实例化渲染
    <Instances 
      range={range}  // 实例数量
      material={materials.phong1SG}  // 共享材质
      geometry={nodes.Shoe.geometry}  // 共享几何体
    >
      {/* 遍历数据创建多个鞋子实例 */}
      {data.map((props, i) => (
        <Shoe key={i} {...props} />
      ))}
    </Instances>
  )
}

// Shoe组件：单个鞋子实例
function Shoe({ random, color = new THREE.Color(), ...props }) {
  // 创建实例引用
  const ref = useRef()
  // 悬停状态管理
  const [hovered, setHover] = useState(false)

  // 每帧更新实例属性
  useFrame((state) => {
    // 计算动画时间
    const t = state.clock.getElapsedTime() + random * 10000
    
    // 设置旋转动画
    ref.current.rotation.set(
      Math.cos(t / 4) / 2,
      Math.sin(t / 4) / 2, 
      Math.cos(t / 1.5) / 2
    )
    
    // 设置上下浮动动画
    ref.current.position.y = Math.sin(t / 1.5) / 2
    
    // 设置缩放动画，悬停时放大
    ref.current.scale.x = 
    ref.current.scale.y = 
    ref.current.scale.z = THREE.MathUtils.lerp(
      ref.current.scale.z, 
      hovered ? 1.4 : 1, 
      0.1
    )
    
    // 设置颜色过渡动画
    ref.current.color.lerp(
      color.set(hovered ? 'red' : 'white'),
      hovered ? 1 : 0.1
    )
  })

  return (
    <group {...props}>
      {/* 创建可交互的实例 */}
      <Instance 
        ref={ref}
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={(e) => setHover(false)}
      />
    </group>
  )
}