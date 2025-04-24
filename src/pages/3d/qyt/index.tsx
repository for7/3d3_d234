// Original and the models by Bruno Simon: https://threejs-journey.com

import { createRoot } from 'react-dom/client'
import { GizmoHelper, Loader, GizmoViewport } from '@react-three/drei'
import './styles.css'
import App from './App'

// createRoot(document.getElementById('root')).render(
//   <>
//     <App />
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
      <App />
      <Loader />
    </div>
  );
}