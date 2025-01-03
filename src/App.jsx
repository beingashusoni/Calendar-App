import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import { CommunicationProvider } from "./context/data";
import AdminModule from "./routes/adminModule";
import UserDashboard from "./routes/userDashboard";
import CalendarView from "./routes/notificationCalandar";
import CompanyListPage from "./routes/companies";
import AnalyticsPage from "./routes/analyticsPage";
import "./App.css";
import logo from "./assets/logo.svg";
import { useState } from "react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <CommunicationProvider>
      <Router>
        <div className="app-container">
          <nav className="main-navigation">
            <div className="logo">
              <img src={logo} alt="ENTNT Logo" />
            </div>
            <div className="hamburger-menu" onClick={toggleMenu}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Module
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/company"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Company List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Calendar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </NavLink>
              </li>
            </ul>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminModule />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/company" element={<CompanyListPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>Calendar Application for Communication Tracking</p>
            <p className="right">© Ashutosh Soni</p>
          </footer>
        </div>
      </Router>
    </CommunicationProvider>
  );
}

export default App;


