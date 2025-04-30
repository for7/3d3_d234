import { createRoot } from "react-dom/client"
import "./styles.css"
import App from "./App"
import { Leva } from "leva"

// createRoot(document.getElementById("root")).render(
//   <>
//     <App />
//     <Leva collapsed />
//   </>
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
      <Leva collapsed />
    </div>
  );
}
