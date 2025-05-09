import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { Loader } from '@react-three/drei'
import './styles.css'
import { App } from './App'

// createRoot(document.getElementById('root')).render(
//   <>
//     <Suspense fallback={null}>
//       <App />
//     </Suspense>
//     <Loader />
//   </>,
// )

export default function AppHtml() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        color: '#fff'
      }}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
      {/*
        Loader 组件是 @react-three/drei 库中的一个组件，用于显示加载进度条或加载动画。
        当 three.js 场景、模型或纹理正在加载时，它会自动显示加载状态。
        它通常与 Suspense 一起使用，在 3D 内容加载完成前提供视觉反馈给用户。
      */}
      <Loader />
    </div>
  );
}
