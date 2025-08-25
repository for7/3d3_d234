import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App'
import './styles.css'

// createRoot(document.getElementById('root')).render(
//   <App />)

  export default function AppHtml() {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          color: '#fff'
        }}>
        <App />
      </div>
    );
  }