"use client";

import { Routes, Route } from "react-router-dom";
import SubnettingGames from "./pages/Games";
import Subnettify from "./pages/Subnettify";
import Subnettimize from "./pages/Subnettimize";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SubnettingGames />} />
      <Route path="/subnettify" element={<Subnettify />} />
      <Route path="/subnettimize" element={<Subnettimize />} />
    </Routes>
  );
}

export default App;
