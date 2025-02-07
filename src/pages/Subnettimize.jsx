import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./../../components/ui/card";
import { Button } from "./../../components/ui/button";
import { RefreshCw, Timer, ArrowLeft } from "lucide-react";

const GAME_DURATION = 90; // seconds
const CORRECT_CHOICE_POINTS = 100;

const Subnettimize = () => {
  const GRID_SIZE = 5;
  const SUBNET_MASKS = [
    { cidr: "/24", availableHosts: 254, value: "0" },
    { cidr: "/25", availableHosts: 126, value: "128" },
    { cidr: "/26", availableHosts: 62, value: "192" },
    { cidr: "/27", availableHosts: 30, value: "224" },
  ];

  const [currentIP, setCurrentIP] = useState(0);
  const [requiredHosts, setRequiredHosts] = useState(0);
  const [grid, setGrid] = useState([]);
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("subnettimize_bestScore");
    return saved ? parseInt(saved) : 0;
  });
  const [maskPositions, setMaskPositions] = useState({});
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const touchStartRef = useRef(null);
  const timerRef = useRef(null);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("subnettimize_highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Timer management
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [isGameActive, timeLeft]);

  const startGame = () => {
    setIsGameActive(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    resetGame();
  };

  const endGame = () => {
    setIsGameActive(false);
    clearInterval(timerRef.current);

    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("subnettimize_bestScore", score.toString());
    }

    setMessage(`Game Over! Punteggio finale: ${score}`);
    setMsgColor("text-purple-600");
  };

  const generateNewIP = () => Math.floor(Math.random() * 256);
  const generateRequiredHosts = () => Math.floor(Math.random() * 252) + 1;

  const shuffleMaskPositions = () => {
    const positions = ["top", "right", "bottom", "left"];
    const shuffled = [...positions].sort(() => Math.random() - 0.5);
    const posMap = {};
    shuffled.forEach((pos, idx) => {
      posMap[pos] = SUBNET_MASKS[idx];
    });
    return posMap;
  };

  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null));
    const ip = generateNewIP();
    const hosts = generateRequiredHosts();
    setCurrentIP(ip);
    setRequiredHosts(hosts);
    newGrid[2][2] = ip;
    setMaskPositions(shuffleMaskPositions());
    return newGrid;
  };

  const calculateNetworkID = (ip, mask) => {
    const maskValue = parseInt(mask.value);
    return ip & (256 - maskValue);
  };

  const calculateHostID = (ip, networkID) => ip - networkID;

  const findOptimalSubnet = (hosts) => {
    if (hosts > 126) return SUBNET_MASKS[0]; // /24
    if (hosts > 62) return SUBNET_MASKS[1]; // /25
    if (hosts > 30) return SUBNET_MASKS[2]; // /26
    return SUBNET_MASKS[3]; // /27
  };

  const calculateWastedHosts = (selectedMask, requiredHosts) => {
    if (selectedMask.availableHosts < requiredHosts) {
      return -requiredHosts; // Negative score for insufficient hosts
    }
    return selectedMask.availableHosts - requiredHosts;
  };

  const handleSplit = (side) => {
    if (!isGameActive) return;

    const selectedMask = maskPositions[side];
    const optimalMask = findOptimalSubnet(requiredHosts);
    const networkID = calculateNetworkID(currentIP, selectedMask);
    const hostID = calculateHostID(currentIP, networkID);
    const wasted = calculateWastedHosts(selectedMask, requiredHosts);
    const isOptimalChoice = selectedMask.cidr === optimalMask.cidr;

    const newGrid = [...grid];
    const positions = {
      top: [0, 2],
      right: [2, 4],
      bottom: [4, 2],
      left: [2, 0],
    };

    // Add network and host IDs to grid
    const [row, col] = positions[side];
    newGrid[row][col] = hostID;

    // Update split position
    const splitPositions = {
      top: [1, 2],
      right: [2, 3],
      bottom: [3, 2],
      left: [2, 1],
    };
    const [splitRow, splitCol] = splitPositions[side];
    newGrid[splitRow][splitCol] = networkID;

    setGrid(newGrid);

    let pointsEarned;
    if (selectedMask.availableHosts < requiredHosts) {
      pointsEarned = -Math.abs(wasted);
      setMessage(
        `Subnet troppo piccola! Mancano ${Math.abs(
          wasted
        )} host. ${pointsEarned} punti`
      );
      setMsgColor("text-red-600");
    } else if (isOptimalChoice) {
      pointsEarned = CORRECT_CHOICE_POINTS - Math.abs(wasted);
      setMessage(`Corretto! Sprechi solo ${wasted} host. +100 punti`);
      setMsgColor("text-green-600");
    } else {
      pointsEarned = -Math.abs(wasted);
      setMessage(
        `Subnet troppo grande! Sprechi ${wasted} host. ${pointsEarned} punti`
      );
      setMsgColor("text-yellow-600");
    }

    setScore((prev) => prev + pointsEarned);

    if (selectedMask === optimalMask) {
      setMessage(
        `+${pointsEarned} punti! (${Math.abs(wasted)} host inutilizzati)`
      );
      setMsgColor("text-green-600");
    } else if (selectedMask.availableHosts < requiredHosts) {
      setMessage(`${pointsEarned} punti! Subnet troppo piccola!`);
      setMsgColor("text-red-600");
    } else {
      setMessage(`${pointsEarned} punti! Subnet troppo grande!`);
      setMsgColor("text-yellow-600");
    }

    // Reset game after short delay
    setTimeout(() => {
      if (isGameActive) {
        resetGame();
      }
    }, 1500);
  };

  const handleTouchStart = (e) => {
    if (!isGameActive) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e) => {
    if (!isGameActive || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        handleSplit(deltaX > 0 ? "right" : "left");
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        handleSplit(deltaY > 0 ? "bottom" : "top");
      }
    }

    touchStartRef.current = null;
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setMessage(
      isGameActive ? "Scegli la subnet ottimale!" : "Premi Start per iniziare!"
    );
    setMsgColor("text-gray-500");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    resetGame();
  }, []);

  const getCellColor = (value, i, j) => {
    if (value === currentIP) return "bg-blue-500 text-white";
    if (value !== null) {
      return i === 1 || i === 3 || j === 1 || j === 3
        ? "bg-green-600 text-white"
        : "bg-yellow-500 text-white";
    }
    return "bg-gray-200";
  };

  const Controls = ({ side }) => {
    return (
      <div
        className={`flex ${
          side === "left" || side === "right" ? "flex-col" : "flex-row"
        } justify-center gap-2`}
      >
        <Button
          onClick={() => handleSplit(side)}
          disabled={!isGameActive}
          // className="px-2 sm:px-3 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ width: "35px" }}
          className="px-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg w-16 disabled:opacity-50"
        >
          Split
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-6">
        <div className="flex justify-between items-start pr-2">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Torna alla home"
            >
              <ArrowLeft size={16} className="text-purple-600" />
            </Link>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Subnet
              <br />
              -timize
            </h2>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-lg font-bold text-purple-600">
                <Timer size={20} />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">
                Best Score: {bestScore}
              </div>
            </div>

            <Button
              onClick={startGame}
              disabled={isGameActive}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 rounded-full px-4 py-2"
            >
              <RefreshCw size={18} className="animate-spin-hover" />
              Start
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-700">Score: {score}</p>
          {isGameActive && (
            <p className="text-lg font-bold text-purple-600 mt-2">
              Host richiesti: {requiredHosts}
            </p>
          )}
          <p
            className={`text-base font-medium mt-2 ${msgColor} transition-colors duration-300`}
          >
            {message}
          </p>
        </div>
      </div>

      <CardContent
        className="relative p-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* Top Controls */}
          <div className="col-span-5 flex justify-center">
            <Controls side="top" />
          </div>

          {/* Top CIDR */}
          <div
            className={`col-span-5 flex justify-center align-items-center pointer-events-none font-bold text-xl p-2 -translate-y-4`}
            style={{ height: "10px", opacity: "0.9" }}
          >
            {maskPositions.top?.cidr}
          </div>

          <div className="col-span-5 flex items-center gap-4 sm:gap-3">
            {/* Left Controls */}
            <Controls side="left" />

            {/* Left CIDR */}
            <div className="pointer-events-none font-bold text-base sm:text-xl relative z-10">
              <div
                className={`pointer-events-none text-xl`}
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%) rotate(-90deg) translateX(-50%)",
                  transformOrigin: "left center",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  opacity: 0.9,
                }}
              >
                {maskPositions.left?.cidr}
              </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 grid grid-cols-5 gap-2 sm:gap-3">
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      h-14 flex items-center justify-center 
                      text-lg font-bold rounded-lg
                      ${getCellColor(cell, i, j)}
                      transition-all duration-300
                      ${cell === currentIP ? "animate-pulse-slow" : ""}
                    `}
                  >
                    {cell !== null ? cell : ""}
                  </div>
                ))
              )}
            </div>

            {/* Right CIDR */}
            <div className="pointer-events-none text-base sm:text-xl relative z-10">
              <div
                className={`pointer-events-none text-xl font-bold`}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%) rotate(90deg) translateX(50%)",
                  transformOrigin: "right center",
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  opacity: 0.9,
                }}
              >
                {maskPositions.right?.cidr}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center ml-2">
              <Controls side="right" />
            </div>
          </div>

          {/* Bottom CIDR */}
          <div
            className={`col-span-5 flex justify-center align-items-center pointer-events-none font-bold text-xl p-2 -translate-y-3`}
            style={{ height: "10px", opacity: "0.9" }}
          >
            {maskPositions.bottom?.cidr}
          </div>

          {/* Bottom Controls */}
          <div className="col-span-5 flex justify-center">
            <Controls side="bottom" />
          </div>
        </div>
      </CardContent>

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
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </Card>
  );
};

export default Subnettimize;
