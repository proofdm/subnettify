"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const Subnettify = () => {
  const GRID_SIZE = 5;
  const [currentIP, setCurrentIP] = useState(0);
  const [grid, setGrid] = useState([]);
  const [activeNetwork, setActiveNetwork] = useState(null);
  const [splitResults, setSplitResults] = useState({});
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("");
  const [score, setScore] = useState(0);
  const touchStartRef = useRef(null);

  const isScrollableLine = (i, j) => {
    if (!activeNetwork) return false;

    switch (activeNetwork.side) {
      case "left":
        return j === 1; // Column 1
      case "right":
        return j === 3; // Column 3
      case "top":
        return i === 1; // Row 1
      case "bottom":
        return i === 3; // Row 3
      default:
        return false;
    }
  };

  const handleTouchStart = (e, i, j) => {
    if (!isScrollableLine(i, j)) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchEnd = (e, i, j) => {
    if (!touchStartRef.current || !isScrollableLine(i, j)) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.timestamp;

    // Minimum swipe distance and maximum time for a swipe
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;

    if (deltaTime <= maxSwipeTime) {
      if (activeNetwork.side === "left" || activeNetwork.side === "right") {
        // Vertical swipe for left/right
        if (Math.abs(deltaY) > minSwipeDistance) {
          handleScroll(activeNetwork.side, deltaY < 0 ? "next" : "prev");
        }
      } else {
        // Horizontal swipe for top/bottom
        if (Math.abs(deltaX) > minSwipeDistance) {
          handleScroll(activeNetwork.side, deltaX < 0 ? "next" : "prev");
        }
      }
    }

    touchStartRef.current = null;
  };

  const getCellClassNames = (value, i, j) => {
    const baseClasses = `h-14 flex items-center justify-center text-l font-bold rounded-lg ${getCellColor(
      value,
      i,
      j
    )}`;

    if (isScrollableLine(i, j)) {
      return `${baseClasses} cursor-grab active:cursor-grabbing`;
    }

    return baseClasses;
  };

  const SUBNET_MASKS = {
    top: { value: "255.255.255.0", networks: [0] },
    right: { value: "255.255.255.128", networks: [0, 128] },
    bottom: { value: "255.255.255.192", networks: [0, 64, 128, 192] },
    left: {
      value: "255.255.255.224",
      networks: [0, 32, 64, 96, 128, 160, 192, 224],
    },
  };

  const generateNewIP = () => Math.floor(Math.random() * 256);

  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    const ip = generateNewIP();
    setCurrentIP(ip);
    newGrid[2][2] = ip;
    return newGrid;
  };

  const calculateNetworkID = (ip, mask) => {
    const maskBits = mask.split(".")[3];
    switch (maskBits) {
      case "0":
        return 0;
      case "128":
        return ip & 128;
      case "192":
        return ip & 192;
      case "224":
        return ip & 224;
      default:
        return 0;
    }
  };

  const calculateHostID = (ip, networkID) => ip - networkID;

  const splitPositions = {
    top: [1, 2],
    right: [2, 3],
    bottom: [3, 2],
    left: [2, 1],
  };

  const shouldHidePosition = (row, col) => {
    if (!activeNetwork) return false;

    // Check if position is a split position
    for (const [side, [sRow, sCol]] of Object.entries(splitPositions)) {
      if (row === sRow && col === sCol) {
        // If this is the active side's position, show it
        if (side === activeNetwork.side) return false;
        // If this side is already split, show it
        if (splitResults[side]) return false;
        // Otherwise hide it
        return true;
      }
    }
    return false;
  };

  const updateNetworkDisplay = (side, currentIndex, networks) => {
    const newGrid = [...grid];

    // Definisci le posizioni per ogni lato
    const positions = {
      top: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
      ],
      right: [
        [0, 3],
        [1, 3],
        [2, 3],
        [3, 3],
        [4, 3],
      ],
      bottom: [
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
      ],
      left: [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
      ],
    };

    const alwaysClear = [
      [1, 0],
      [1, 1],
      [1, 3],
      [1, 4],
      [0, 3],
      [1, 3],
      [3, 3],
      [4, 3],
      [3, 0],
      [3, 1],
      [3, 3],
      [3, 4],
      [0, 1],
      [1, 1],
      [3, 1],
      [4, 1],
    ];
    alwaysClear.forEach(([row, col]) => {
      newGrid[row][col] = null;
    });

    // Pulisci le posizioni precedenti
    positions[side].forEach(([row, col]) => {
      newGrid[row][col] = null;
    });

    // Calcola i valori da mostrare
    const displayValues = [];
    // Per reti con un solo valore (255.0)
    if (networks.length === 1) {
      displayValues.push(null, null, networks[0], null, null);
    }
    // Per reti con due valori (255.128)
    else if (networks.length === 2) {
      const idx = currentIndex % 2;
      displayValues.push(
        networks[idx],
        networks[(idx + 1) % 2],
        networks[idx],
        networks[(idx + 1) % 2],
        networks[idx]
      );
    }
    // Per reti con quattro valori (255.192)
    else if (networks.length === 4) {
      for (let i = 0; i < 5; i++) {
        displayValues.push(networks[(currentIndex + i) % 4]);
      }
    }
    // Per reti con otto valori (255.224)
    else {
      for (let i = 0; i < 5; i++) {
        displayValues.push(networks[(currentIndex + i) % networks.length]);
      }
    }

    // Aggiorna la griglia con i valori
    positions[side].forEach(([row, col], i) => {
      newGrid[row][col] = displayValues[i];
    });

    // Clear other split positions if they're not already split
    Object.entries(splitPositions).forEach(([otherSide, [row, col]]) => {
      if (otherSide !== side && !splitResults[otherSide]) {
        newGrid[row][col] = null;
      }
    });

    setGrid(newGrid);
  };

  const handleScroll = (side, direction) => {
    if (!activeNetwork || activeNetwork.side !== side) return;

    const networks = activeNetwork.networks;
    const newIndex =
      (activeNetwork.currentIndex +
        (direction === "next" ? 1 : -1) +
        networks.length) %
      networks.length;

    setActiveNetwork({
      ...activeNetwork,
      currentIndex: newIndex,
    });

    updateNetworkDisplay(side, newIndex, networks);
  };

  const handleSplit = (side) => {
    if (!activeNetwork || splitResults[side]) return;

    // Ottieni il valore nella posizione di split
    const splitPositions = {
      top: [1, 2],
      right: [2, 3],
      bottom: [3, 2],
      left: [2, 1],
    };
    const [row, col] = splitPositions[side];
    const selectedNetwork = grid[row][col];
    const correctNetwork = calculateNetworkID(
      currentIP,
      SUBNET_MASKS[side].value
    );

    if (selectedNetwork === correctNetwork) {
      const hostID = calculateHostID(currentIP, selectedNetwork);
      const newGrid = [...grid];

      // Posiziona l'host ID
      const hostPositions = {
        top: [0, 2],
        right: [2, 4],
        bottom: [4, 2],
        left: [2, 0],
      };
      const [hostRow, hostCol] = hostPositions[side];
      newGrid[hostRow][hostCol] = hostID;

      setSplitResults({
        ...splitResults,
        [side]: { networkID: selectedNetwork, hostID },
      });
      setGrid(newGrid);
      setMessage(`Corretto! ${currentIP} = ${selectedNetwork} + ${hostID}`);
      setMsgColor("text-green-600");
      setScore((prev) => prev + 1);
      setActiveNetwork(null);
    } else {
      setMessage(
        "Riprova! Il network ID non è corretto per questa subnet mask."
      );
      setMsgColor("text-red-600");
      setScore((prev) => prev - 1);
    }
  };

  const handleNetworkSelect = (side) => {
    if (splitResults[side]) return;

    const networks = SUBNET_MASKS[side].networks;
    setActiveNetwork({
      side,
      networks,
      currentIndex: 0,
    });

    updateNetworkDisplay(side, 0, networks);
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setActiveNetwork(null);
    setSplitResults({});
    setMessage(`Subnetta l'ultimo byte dell'IP con le diverse maschere!`);
    setMsgColor("text-gray-500");
  };

  useEffect(() => {
    resetGame();
  }, []);

  const isSplitPosition = (i, j) => {
    return (
      (i === 1 && j === 2) || // top
      (i === 2 && j === 3) || // right
      (i === 3 && j === 2) || // bottom
      (i === 2 && j === 1) // left
    );
  };

  const getCellColor = (value, i, j) => {
    // If the position should be hidden, return empty style
    if (shouldHidePosition(i, j)) {
      return "bg-gray-200";
    }

    // Controllo se la cella contiene un host ID
    const isHostID = Object.entries(splitResults).some(([side, result]) => {
      if (side === "top" && i === 0 && j === 2) return value === result.hostID;
      if (side === "right" && i === 2 && j === 4)
        return value === result.hostID;
      if (side === "bottom" && i === 4 && j === 2)
        return value === result.hostID;
      if (side === "left" && i === 2 && j === 0) return value === result.hostID;
      return false;
    });

    // Se è un host ID mostra giallo
    if (isHostID) {
      return "bg-yellow-500 text-white";
    }

    // Se è l'IP originale e non è stato splittato con network ID 0
    if (value === currentIP) return "bg-blue-500 text-white";
    if (value !== null) {
      return isSplitPosition(i, j)
        ? "bg-green-600 text-white"
        : "bg-stone-400 text-white";
    }
    return "bg-gray-200";
  };

  // Define controlProps object with all required props for Controls component
  const controlProps = {
    handleScroll,
    handleNetworkSelect,
    splitResults,
    activeNetwork,
    handleSplit,
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-6">
        <div className="flex justify-between items-start px-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Subnettify
          </h2>

          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 rounded-full px-4 py-2"
          >
            <RefreshCw size={18} className="animate-spin-hover" />
            IP
          </Button>
        </div>

        {/* Score and message below the header */}
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-700">Score: {score}</p>
          <p
            className={`text-sm sm:text-base font-medium mt-2 ${msgColor} transition-colors duration-300`}
          >
            {message}
          </p>
        </div>
      </div>

      <CardContent className="relative p-0">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* Top Controls */}
          <Controls
            side="top"
            handleScroll={handleScroll}
            handleNetworkSelect={handleNetworkSelect}
            splitResults={splitResults}
            activeNetwork={activeNetwork}
            handleSplit={handleSplit}
          />

          {/* Top Subnet Mask */}
          <div
            className={`col-span-5 flex justify-center align-items-center pointer-events-none font-mono text-xl p-2 -translate-y-4`}
            style={{ height: "10px" }}
          >
            255.255.255<span className="font-bold">.0</span>
          </div>

          {/* Main Grid Section */}
          <div className="col-span-5 flex items-center gap-4 sm:gap-3">
            {/* Left Controls */}
            <Controls side="left" {...controlProps} />

            {/* Left Subnet Mask */}
            <div className="pointer-events-none font-mono text-base sm:text-xl relative z-10">
              <div
                className={`pointer-events-none font-mono text-xl`}
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg) translateX(-50%)",
                  transformOrigin: "left center",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
              >
                255.255.255<span className="font-bold">.224</span>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-5 gap-2 sm:gap-3">
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      ${getCellClassNames(cell, i, j)}
                      transition-all duration-300
                      ${
                        isScrollableLine(i, j) && activeNetwork
                          ? "ring-2 ring-offset-2 ring-purple-300"
                          : ""
                      }
                      ${cell === currentIP ? "animate-pulse-slow" : ""}
                    `}
                    onTouchStart={(e) => handleTouchStart(e, i, j)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, i, j)}
                    style={{
                      touchAction: isScrollableLine(i, j) ? "none" : "auto",
                    }}
                  >
                    {cell !== null ? cell : ""}
                  </div>
                ))
              )}
            </div>

            {/* Right Subnet Mask */}
            <div className="pointer-events-none font-mono text-base sm:text-xl relative z-10">
              <div
                className={`pointer-events-none font-mono text-xl`}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%) rotate(90deg) translateX(50%)",
                  transformOrigin: "right center",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                }}
              >
                255.255.255<span className="font-bold">.128</span>
              </div>
            </div>

            {/* Right Controls */}
            <Controls side="right" {...controlProps} />
          </div>

          {/* Bottom Subnet Mask */}
          <div
            className={`col-span-5 flex justify-center align-items-center pointer-events-none font-mono text-xl p-2 -translate-y-2`}
            style={{ height: "10px" }}
          >
            255.255.255<span className="font-bold">.192</span>
          </div>

          {/* Bottom Controls */}
          <Controls side="bottom" {...controlProps} />
        </div>
      </CardContent>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes spin-hover {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-hover {
          transition: transform 0.3s ease;
        }
        button:hover .animate-spin-hover {
          animation: spin-hover 1s linear infinite;
        }
      `}</style>
    </Card>
  );
};

// Update Controls component styling
const Controls = ({
  side,
  handleScroll,
  handleNetworkSelect,
  splitResults,
  activeNetwork,
  handleSplit,
}) => {
  const isVertical = side === "left" || side === "right";
  const prevIcon = isVertical ? <ArrowUp size={18} /> : <ArrowLeft size={18} />;
  const nextIcon = isVertical ? (
    <ArrowDown size={18} />
  ) : (
    <ArrowRight size={18} />
  );

  return (
    <div
      className={`flex ${
        isVertical ? "flex-col" : "flex-row"
      } justify-center gap-2 ${isVertical ? "" : "col-span-5"}`}
    >
      <Button
        onClick={() => handleScroll(side, "prev")}
        disabled={!activeNetwork || activeNetwork.side !== side}
        className="p-1 sm:p-2 bg-stone-400 hover:bg-stone-500 transition-colors duration-300 disabled:opacity-50"
      >
        {prevIcon}
      </Button>

      {activeNetwork?.side === side ? (
        <Button
          onClick={() => handleSplit(side)}
          className="px-2 sm:px-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ width: "35px" }}
        >
          Split
        </Button>
      ) : (
        <Button
          onClick={() => handleNetworkSelect(side)}
          disabled={splitResults[side]}
          className="px-2 sm:px-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-medium disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ width: "35px" }}
        >
          See
        </Button>
      )}

      <Button
        onClick={() => handleScroll(side, "next")}
        disabled={!activeNetwork || activeNetwork.side !== side}
        className="p-1 sm:p-2 bg-stone-400 hover:bg-stone-500 transition-colors duration-300 disabled:opacity-50"
      >
        {nextIcon}
      </Button>
    </div>
  );
};

export default Subnettify;
