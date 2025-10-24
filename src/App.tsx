import type { ReactNode } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import CarouselLab from "./pages/CarouselLab";
import StreamLab from "./pages/StreamLab";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="top-nav">
          <div className="nav-brand">Jessibuca Lab</div>
          <nav className="nav-links">
            <NavItem to="/">Stream Switcher</NavItem>
            <NavItem to="/carousel">Carousel POC</NavItem>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<StreamLab />} />
            <Route path="/carousel" element={<CarouselLab />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

interface NavItemProps {
  to: string;
  children: ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }: { isActive: boolean }) =>
      isActive ? "nav-link nav-link-active" : "nav-link"
    }
  >
    {children}
  </NavLink>
);

export default App;
