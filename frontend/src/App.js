import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JewishPhotographyApp from "./JewishPhotographyApp";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JewishPhotographyApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
