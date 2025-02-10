import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";

const BinaryInspector = ({ number, type, currentIP, netbits }) => {
  console.log(number, type, currentIP, netbits);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (number !== null) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [number]);

  const getBinary = (num) => num?.toString(2).padStart(8, "0");

  const renderBinary = () => {
    // if (!number) return null;

    // Always use the original IP for binary representation
    const binary = getBinary(currentIP);

    return (
      <div className="bg-gray-200 py-1 px-3 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">
          {type === "net"
            ? "Network ID"
            : type === "host"
            ? "Host ID"
            : "IP Address"}
        </div>
        <div className="font-mono text-lg tracking-wider">
          {binary.split("").map((digit, i) => {
            let className = "text-gray-400"; // Default color for non-highlighted digits

            if (type === "net" && i < netbits) {
              // Highlight network bits in green for network ID
              className = "text-green-600 font-bold";
            } else if (type === "host" && i >= netbits) {
              // Highlight host bits in yellow for host ID
              className = "text-yellow-500 font-bold";
            }

            return (
              <span key={i} className={className}>
                {digit}
              </span>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {type === "net"
            ? `${netbits} network bits`
            : type === "host"
            ? `${8 - netbits} host bits`
            : "The last 8 bits"}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-0 bg-gradient-to-b from-gray-100 to-white">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">
          Click a tile for binary
        </h3>
        <div
          className={`transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {number !== null ? (
            renderBinary()
          ) : (
            <div className="text-gray-500 text-center py-4">
              Click any number in the grid to see its binary representation
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BinaryInspector;
