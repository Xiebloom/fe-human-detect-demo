import "./App.css";
import MediaPipeDemo from "./components/MediaPipe/MediaPipeDemo";
import { Nav } from "./components/Nav";
import { TensorFlowDemo } from "./components/TensorFlow";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Home component
function Home() {
  return (
    <div className="home-container">
      <h1>「字在人后」</h1>
      <p className="welcome-text">欢迎体验我们的人体检测与分析演示应用</p>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>TensorFlow 演示</h3>
          <p>基于 TensorFlow.js 的人体检测与分析</p>
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
          </Routes>
        </main>

        <footer>
          <p> 2025 「字在人后」 - 人体检测与分析演示应用</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
