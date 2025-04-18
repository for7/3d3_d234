import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  GradientTexture,
  useCursor,
  AsciiRenderer,
  Billboard,
  Text,
  Clone,
  Box,
  Edges,
  Html,
} from '@react-three/drei';
import { Button, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Flag() {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame(() => {
    ref.current.distort = THREE.MathUtils.lerp(ref.current.distort, hovered ? 0.4 : 0, hovered ? 0.05 : 0.01);
  });
  return (
    <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={[2, 4, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshDistortMaterial ref={ref} speed={5}>
        <GradientTexture stops={[0, 0.8, 1]} colors={['#e63946', '#f1faee', '#a8dadc']} size={100} />
      </MeshDistortMaterial>
    </mesh>
  );
}

const Create3DTest = () => {
  return (<Text color={'red'} fontSize={1}>test</Text>);
};

export default function App() {
  return (
    <Canvas>
      {/* AsciiRenderer 将3d内容渲染为ascii字符内容 */}
      {/* <AsciiRenderer fgColor="yellow" /> */}

      {/*  Billboard 设置其子元素始终朝向摄像机方向 固定其相对于摄像机的位置、角度 */}
      {/* <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text fontSize={1}>I'm a billboard</Text>
      </Billboard> */}

      <Create3DTest />
      {/* <Box position={[-2, 0, 0]} />
      <Clone object={<Box position={[0, 0, 0]} />} />
      <Clone object={<Box position={[2, 0, 0]} />} /> */}

      {/* 添加边框线 */}
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
        <Edges threshold={0.2} color="red" linewidth={2} />
      </mesh> */}

      {/* <Html position={[0, 1, 0]} center>
        <Tooltip title="search">
          <Button shape="circle" icon={<SearchOutlined />} />
        </Tooltip>
      </Html> */}

      <ambientLight />
      <Flag />
    </Canvas>
  );
}
