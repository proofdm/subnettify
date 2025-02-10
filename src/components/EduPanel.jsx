import React from "react";
import { Card, CardContent } from "./../..//components/ui/card";

const EduPanel = ({ currentIP, selectedMask, networkID, hostID }) => {
  const getBinaryRepresentation = (number) => {
    return number.toString(2).padStart(8, "0");
  };

  const getMaskBinary = (mask) => {
    if (!mask) return null;
    const maskValue = parseInt(mask.value);
    return getBinaryRepresentation(256 - maskValue); // Invert for subnet mask
  };

  const highlightNetworkBits = (binary, mask) => {
    if (!mask) return binary;
    const maskBits = mask.cidr.replace("/", "");
    const networkBits = binary.slice(0, maskBits);
    const hostBits = binary.slice(maskBits);
    return (
      <span className="font-mono">
        <span className="text-purple-600 font-bold">{networkBits}</span>
        <span className="text-gray-500">{hostBits}</span>
      </span>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4 bg-gradient-to-b from-gray-50 to-white">
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-purple-600 mb-3">
          Binary Breakdown
        </h3>

        <div className="space-y-3">
          {currentIP !== null && (
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  IP Address: {currentIP}
                </div>
                <div className="font-mono text-sm">
                  Binary:{" "}
                  {highlightNetworkBits(
                    getBinaryRepresentation(currentIP),
                    selectedMask
                  )}
                </div>
              </div>

              {selectedMask && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Subnet Mask ({selectedMask.cidr}): {selectedMask.value}
                  </div>
                  <div className="font-mono text-sm">
                    Binary: {getMaskBinary(selectedMask)}
                  </div>
                </div>
              )}

              {networkID !== null && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Network ID: {networkID}
                  </div>
                  <div className="font-mono text-sm">
                    Binary:{" "}
                    {highlightNetworkBits(
                      getBinaryRepresentation(networkID),
                      selectedMask
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Obtained by AND operation between IP and Subnet Mask
                  </div>
                </div>
              )}

              {hostID !== null && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    Host ID: {hostID}
                  </div>
                  <div className="font-mono text-sm">
                    Binary: {getBinaryRepresentation(hostID)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Obtained by subtracting Network ID from IP Address
                  </div>
                </div>
              )}
            </div>
          )}

          {!currentIP && (
            <div className="text-center text-gray-500 py-4">
              Start the game to see the binary breakdown of subnetting
              operations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EduPanel;
