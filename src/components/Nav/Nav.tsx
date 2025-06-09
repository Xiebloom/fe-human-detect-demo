import { Link, useLocation } from "react-router-dom";
import "./Nav.css";

export function Nav() {
  const location = useLocation();
  const getActiveBtnCls = (path: string) => (location.pathname.includes(path) ? "active-nav-btn" : "");

  return (
    <header>
      <h2 className="logo">「字在人后」</h2>
      <nav className="main-nav">
        <Link to="/" className="nav-btn">
          首页
        </Link>
        <Link to="/tensorflow" className={`nav-btn ${getActiveBtnCls("tensorflow")}`}>
          TensorFlow Demo
        </Link>
        <Link to="/mediapipe" className={`nav-btn ${getActiveBtnCls("mediapipe")}`}>
          MediaPipe Demo
        </Link>
      </nav>
    </header>
  );
}
