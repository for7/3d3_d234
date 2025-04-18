import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function ChinaMap(props) {
  const { nodes, materials, scene } = useGLTF("/china.glb");
  console.log("nodes", nodes);
  // useEffect(() => {
  //   // 设置地图材质
  //   Object.values(materials).forEach(material => {
  //     material.color.set("#2A5CAA");  // 深蓝色
  //     material.metalness = 0.5;
  //     material.roughness = 0.5;
  //     material.envMapIntensity = 1;
  //   });
  // }, [materials]);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} scale={8} position={[0, 0, 0]} />
    </group>
  );
}