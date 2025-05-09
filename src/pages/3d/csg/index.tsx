
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

export default function Main() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        color: '#fff'
      }}>
      <App />
    </div>
  )
}
