import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Center,
  GizmoHelper,
  Helper,
  GizmoViewport,
  AdaptiveDpr,
  StatsGl,
  Stats,
  Grid,
} from "@react-three/drei";
import * as THREE from "three";
import cityData from "./cityData.ts";
import { ChinaMap } from "@/components/ChinaMap";

import { TextureLoader } from "three";

// const BackgroundImage = ({ url }) => {
//   const texture = useLoader(TextureLoader, url);
//   const { scene } = useThree();
//   scene.background = texture; // ✅ 设置背景图
//   return null;
// };

const MapPlaneBackground = () => {
  const texture = useLoader(TextureLoader, "/a2.png");
  return (
    <mesh position={[-40, 0, -5]} scale={8} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};


const latLonToXY = (lat, lon) => {
  const x = (lon - 100) * 8;
  const z = -(lat - 35) * 8;
  return [x, 0.2, z];
};

const HeatPoint = ({ position, intensity = 1, color = "red" }) => {
  const ref = useRef();
  const base = intensity * 0.3;
  useFrame(() => {
    const s = base + Math.sin(Date.now() * 0.005) * 0.1;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
      />
    </mesh>
  );
};

const getCurve = (from, to) => {
  const p1 = new THREE.Vector3(...from);
  const p2 = new THREE.Vector3(...to);
  const mid = p1.clone().lerp(p2, 0.5).add(new THREE.Vector3(0, 5, 0));
  return new THREE.QuadraticBezierCurve3(p1, mid, p2);
};

// ✅ 多彩连接线组件
const ConnectionLine = ({ from, to, color = "cyan" }) => {
  const curve = useMemo(() => getCurve(from, to), [from, to]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.2, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  );
};

// ✅ 粒子流动组件
const FlowParticles = ({ from, to, count = 100, color = "#0237fd" }) => {
  // 修改默认颜色为绿色
  const curve = useMemo(() => getCurve(from, to), [from, to]);
  const meshRef = useRef();
  const dummy = new THREE.Object3D();

  const points = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      offset: i / count,
      speed: 0.002 + Math.random() * 0.004, // 提高基础速度和随机变化范围
      scale: 0.2 + Math.random() * 0.7, // 添加随机大小变化
    }));
  }, [count]);

  useFrame(() => {
    points.forEach((point, i) => {
      point.offset += point.speed;
      if (point.offset > 1) point.offset = 0;
      const position = curve.getPoint(point.offset);
      dummy.position.copy(position);
      dummy.scale.set(point.scale, point.scale, point.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.3, 8, 8]} /> {/* 增大基础粒子尺寸 */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={4} // 增强发光强度
        transparent={true} // 启用透明
        opacity={0.8} // 设置透明度
      />
    </instancedMesh>
  );
};

const ChinaHeatMap = () => {
  return (
    <Canvas
      camera={{
        position: [0, 150, 300],
        fov: 50,
        near: 1,
        far: 1000,
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[50, 50, 50]} />
      {/* 替换原来的平面为3D地图 */}
      {/* <ChinaMap /> */}
      <MapPlaneBackground />

      <Center position={[-20, 5, -110]} scale={[1, 1, 1.75]}>
        {/* 城市节点和标签 */}
        {cityData.map((city, i) => {
          const pos = latLonToXY(city.lat, city.lon);
          const intensity = city.value / 100;
          const color =
            intensity > 0.7 ? "red" : intensity > 0.4 ? "orange" : "yellow";
          return (
            <React.Fragment key={i}>
              <HeatPoint position={pos} intensity={intensity} color={color} />
              <Html position={pos}>
                <div style={{ color: "white", fontSize: "10px" }}>
                  {city.name}
                </div>
              </Html>
            </React.Fragment>
          );
        })}

        {/* 主干网连接线 + 粒子流动 */}
        {cityData.flatMap((city) => {
          const from = latLonToXY(city.lat, city.lon);
          return city.links.map((targetName, i) => {
            const target = cityData.find((c) => c.name === targetName);
            if (!target) return null;
            const to = latLonToXY(target.lat, target.lon);
            // 移除随机颜色生成
            const particleColor = "#0237fd"; // 使用固定的绿色
            const lineColor = "rgba(0, 255, 0, 0.3)"; // 连接线使用半透明绿色

            return (
              <React.Fragment key={`${city.name}-${target.name}-${i}`}>
                <ConnectionLine from={from} to={to} color={lineColor} />
                <FlowParticles from={from} to={to} color={particleColor} />
              </React.Fragment>
            );
          });
        })}
      </Center>
      <Stats showPanel={0} />
      <Grid cellColor={"red"} />
      <AdaptiveDpr />
      <OrbitControls />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
};

export default ChinaHeatMap;
