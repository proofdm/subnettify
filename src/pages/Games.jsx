import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card";
import { Network, Timer, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const TerminalText = ({ text, speed = 40 }) => {
  const [position, setPosition] = useState(0);
  const [displayText, setDisplayText] = useState(text);

  // Function to get the current color based on position
  const getBlockStyle = () => {
    // Find the position of "logica base" in the text
    const lines = text.split("\n");
    const startPos = lines[0].length + 1 + lines[1].indexOf("logica base");

    // Check if we're in the "logica base" range
    if (position >= startPos && position < startPos + 11) {
      const relativePos = position - startPos;

      if (relativePos < 4) {
        // "logi"
        return {
          color: "#3b82f6", // blue
          transition: "color 0.2s ease",
        };
      } else if (relativePos < 7) {
        // "ca b"
        return {
          color: "#22c55e", // green
          transition: "color 0.2s ease",
        };
      } else if (relativePos < 11) {
        // "ase"
        return {
          color: "#eab308", // yellow
          transition: "color 0.2s ease",
        };
      }
    }

    // Default gradient for other positions
    const progress = position / text.length;
    return {
      color: "transparent",
      backgroundImage: `linear-gradient(to right, #9333ea ${
        progress * 100
      }%, #6366f1 ${progress * 100 + 50}%)`,
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      transition: "background-image 0.2s ease",
    };
  };

  // Helper function to check if we're in the "logica base" section
  const isInLogicaBase = () => {
    const lines = text.split("\n");
    const startPos = lines[0].length + 1 + lines[1].indexOf("logica base");
    return position >= startPos && position < startPos + 11;
  };

  useEffect(() => {
    const animate = () => {
      if (position < text.length) {
        if (text[position] !== "\n") {
          const beforeText = text.substring(0, position);
          const afterText = text.substring(position + 1);

          const newDisplayText = (
            <>
              {beforeText}
              <span style={getBlockStyle()}>█</span>
              {afterText}
            </>
          );

          setDisplayText(newDisplayText);
        }
        setPosition((p) => p + 1);
      } else {
        // Reset to start after 7 seconds
        setTimeout(() => {
          setPosition(0);
          setDisplayText(text);
        }, 7000);
      }
    };

    // Use slower speed when in "logica base" section
    const currentSpeed = isInLogicaBase() ? speed * 3 : speed;
    const timer = setTimeout(animate, currentSpeed);
    return () => clearTimeout(timer);
  }, [position, text, speed]);

  return <div className="font-mono whitespace-pre-line">{displayText}</div>;
};

const SubnettingGames = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2"
            style={{ lineHeight: "3rem" }}
          >
            OneByte
          </h1>
          <div className="text-lg text-gray-600">
            <TerminalText
              text={
                "Un unico byte, diverse modalità di\ngioco per impare la logica base\ndell'IP subnetting."
              }
              speed={45}
            />
          </div>
        </div>

        {/* Games List Grid*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subnettify Card */}
          <Link to="/subnettify" className="block group">
            <Card className="h-full relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:to-purple-100 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                  <Network className="h-6 w-6 text-purple-500" />
                  Subnettify
                  <ArrowRight className="h-5 w-5 ml-auto transition-transform transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>
                  Impara da un unico byte la dinamica del subnetting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Dato un IP scegli la rete corretta in ogni subnet mask. Lo
                    stesso IP darà luogo a letture diverse.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Subnettimize Card */}
          <Link to="/subnettimize" className="block group">
            <Card className="h-full relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-purple-50 hover:to-purple-100 cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                  <Timer className="h-6 w-6 text-purple-500" />
                  Subnettimize
                  <ArrowRight className="h-5 w-5 ml-auto transition-transform transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>
                  Assegna in modo ottimale le subnet agli host
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Gioca contro il tempo e impara a minimizzare gli sprechi di
                    indirizzi IP con le giuste subnet
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li className="flex items-center gap-2">
                      • Partite da 90 secondi
                    </li>
                    <li className="flex items-center gap-2">
                      • Scegli usando swipe e scroll la rete CIDR più
                      appropriata
                    </li>
                    <li className="flex items-center gap-2">
                      • 100pt se la subnet minimizza gli sprechi <br /> o
                      penalità pari a indirizzi sprecati
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          © {new Date().getFullYear()} - Daniele Montesi
        </footer>
      </div>
    </div>
  );
};

export default SubnettingGames;
