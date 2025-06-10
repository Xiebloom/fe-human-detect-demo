import "./App.css";
import MediaPipeDemo from "./components/MediaPipe/MediaPipeDemo";
import { Nav } from "./components/Nav";
import { MediaPipeLegacy } from "./components/MediaPipeLegacy";
import { TensorFlowDemo } from "./components/TensorFlow";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Home component
function Home() {
  return (
    <div className="home-container">
      <h1>人景分割</h1>
      <p className="welcome-text">欢迎体验我们的人景分割演示应用</p>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>TensorFlow 演示</h3>
          <p>基于 TensorFlow.js 的人景分割</p>
          <Link to="/tensorflow" className="feature-btn">
            查看演示
          </Link>
        </div>
        <div className="feature-card">
          <h3>MediaPipe 演示</h3>
          <p>基于 MediaPipe 的面部检测与姿态分析</p>
          <Link to="/mediapipe" className="feature-btn">
            查看演示
          </Link>
        </div>
        <div className="feature-card">
          <h3>MediaPipe Legacy 演示</h3>
          <p>基于 MediaPipe Legacy 的面部检测与姿态分析</p>
          <Link to="/mediapipe-legacy" className="feature-btn">
            查看演示
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Nav />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tensorflow" element={<TensorFlowDemo />} />
            <Route path="/mediapipe" element={<MediaPipeDemo />} />
            <Route path="/mediapipe-legacy" element={<MediaPipeLegacy />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
