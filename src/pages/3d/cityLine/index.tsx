// App.js
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, Html } from '@react-three/drei';
import { generateCityData } from './simulateData';

const App = () => {
  const { cities, connections } = generateCityData();

  return (
    <Canvas camera={{ position: [0, 0, 1000], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {cities.map((city) => (
        <CityNode key={city.id} city={city} />
      ))}

      {connections.map(({ sourceId, targetId, strength, color }) => (
        <ConnectionLine
          key={`${sourceId}-${targetId}`}
          start={cities[sourceId].position}
          end={cities[targetId].position}
          strength={strength}
          color={color}
        />
      ))}
    </Canvas>
  );
};

const CityNode = ({ city }) => {
  return (
    <>
      <Sphere args={[10, 16, 16]} position={city.position}>
        <meshStandardMaterial color="blue" />
      </Sphere>
      <Html position={city.position}>
        <div style={{ color: "white", fontSize: "12px" }}>{city.name}</div>
      </Html>
    </>
  );
};

// 水流效果的连接线
const ConnectionLine = ({ start, end, strength, color }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const lineRef = useRef();

  // 使用动画来模拟水流效果
  useFrame(() => {
    if (animationProgress < 1) {
      setAnimationProgress(animationProgress + 0.005); // 速度调整
    }
  });

  // 渲染连接线的动态效果
  return (
    <Line
      ref={lineRef}
      points={[start, end]} // 连接线的起点和终点
      color={color} // 使用传入的颜色
      lineWidth={strength} // 连接线宽度根据强度变化
      dashed={false}
      lineJoin="round"
      lineCap="round"
      opacity={animationProgress} // 水流逐步显示的透明度效果
    />
  );
};

export default App;
