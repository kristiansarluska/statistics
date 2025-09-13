// src/components/Navbar.jsx
import React from "react";

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={onToggleSidebar}
        >
          Kapitoly
          <img
            className={`arrow ms-2 ${isSidebarOpen ? "open" : ""}`}
            src="./assets/images/up-arrow.png"
            alt="Toggle arrow"
          />
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" href="#!">
                Úvod
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!">
                O bakalárskej práci
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Dôležité odkazy
              </a>
              <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <a className="dropdown-item" href="#!">
                  Katedra
                </a>
                <a className="dropdown-item" href="#!">
                  Bootstrap
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#!">
                  Kontakt
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
