"use client";

import { Routes, Route } from "react-router-dom";
import SubnettingGames from "./pages/Games";
import Subnettify from "./pages/Subnettify";
import Subnettimize from "./pages/Subnettimize";
import Storynet from "./pages/Storynet";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SubnettingGames />} />
        <Route path="/subnettify" element={<Subnettify />} />
        <Route path="/subnettimize" element={<Subnettimize />} />
        <Route path="/storynet" element={<Storynet />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
