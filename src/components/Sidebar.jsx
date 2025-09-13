// src/components/Sidebar.jsx
import React from "react";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div
      className="border-end bg-white d-flex flex-column"
      id="sidebar-wrapper"
    >
      <div className="sidebar-heading border-bottom bg-light">
        Štatistické metódy v geoinformatike
      </div>
      <div className="list-group">
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Náhodná veličina
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Rozdelenia pravdepodobnosti
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Odhady parametrov
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Testovanie hypotéz
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Korelácia
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Priestorová autokorelácia
        </a>
        <a
          className="list-group-item list-group-item-action list-group-item-light p-3"
          href="#!"
        >
          Regresia
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
