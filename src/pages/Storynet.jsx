import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Storynet = () => {
  // State for the IP address and CIDR
  const [ipAddress, setIpAddress] = useState("");
  const [cidr, setCidr] = useState(0);
  const [ipClass, setIpClass] = useState("");

  // State for user input
  const [sliderValue, setSliderValue] = useState([0]); // For the binary subnet mask slider
  const [subnetMaskInput, setSubnetMaskInput] = useState(""); // For the decimal subnet mask input
  const [networkIdInput, setNetworkIdInput] = useState(""); // For the network ID input

  // State for feedback
  const [subnetMaskCorrect, setSubnetMaskCorrect] = useState(null);
  const [networkIdCorrect, setNetworkIdCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // State for binary inspector
  const [inspectedOctet, setInspectedOctet] = useState(null);
  const [inspectedIndex, setInspectedIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [inspectedOctet, inspectedIndex]);

  // Generate a random IP address on initial load and reset
  useEffect(() => {
    generateRandomIPAndCIDR();
  }, []);

  // Generate a random class B or class C IP address with CIDR
  const generateRandomIPAndCIDR = () => {
    // Reset states
    setSubnetMaskInput("");
    setNetworkIdInput("");
    setSubnetMaskCorrect(null);
    setNetworkIdCorrect(null);
    setShowFeedback(false);
    setInspectedOctet(null);
    setInspectedIndex(null);

    // Decide randomly between class B or C
    const classType = Math.random() > 0.5 ? "B" : "C";
    setIpClass(classType);

    let firstOctet, secondOctet, thirdOctet, fourthOctet;
    let randomCidr;

    if (classType === "B") {
      // Class B: 128-191.x.x.x
      firstOctet = Math.floor(Math.random() * 64) + 128;
      secondOctet = Math.floor(Math.random() * 256);
      thirdOctet = Math.floor(Math.random() * 256);
      fourthOctet = Math.floor(Math.random() * 256);
      // CIDR between /17 and /30 for class B
      randomCidr = Math.floor(Math.random() * 14) + 17;
    } else {
      // Class C: 192-223.x.x.x
      firstOctet = Math.floor(Math.random() * 32) + 192;
      secondOctet = Math.floor(Math.random() * 256);
      thirdOctet = Math.floor(Math.random() * 256);
      fourthOctet = Math.floor(Math.random() * 256);
      // CIDR between /25 and /30 for class C
      randomCidr = Math.floor(Math.random() * 6) + 25;
    }

    setIpAddress(`${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`);
    setCidr(randomCidr);
    setSliderValue([randomCidr]);
  };

  // Convert CIDR to binary string (32 bits)
  const cidrToBinary = (cidr) => {
    return "1".repeat(cidr) + "0".repeat(32 - cidr);
  };

  // Convert binary string to subnet mask in dot-decimal notation
  const binaryToSubnetMask = (binary) => {
    const octets = [];
    for (let i = 0; i < 32; i += 8) {
      const octet = binary.substring(i, i + 8);
      octets.push(parseInt(octet, 2));
    }
    return octets.join(".");
  };

  // Calculate the correct subnet mask from CIDR
  const getCorrectSubnetMask = () => {
    const binary = cidrToBinary(cidr);
    return binaryToSubnetMask(binary);
  };

  // Calculate the network ID from IP and subnet mask
  const calculateNetworkId = (ip, mask) => {
    const ipOctets = ip.split(".").map(Number);
    const maskOctets = mask.split(".").map(Number);

    const networkOctets = ipOctets.map((octet, i) => octet & maskOctets[i]);
    return networkOctets.join(".");
  };

  // Handle slider change for subnet mask
  const handleSliderChange = (value) => {
    setSliderValue(value);
    // Update the subnet mask input based on slider
    const binary = cidrToBinary(value[0]);
    setSubnetMaskInput(binaryToSubnetMask(binary));
  };

  // Handle subnet mask input change
  const handleSubnetMaskInputChange = (e) => {
    const value = e.target.value;
    setSubnetMaskInput(value);
  };

  // Handle network ID input change
  const handleNetworkIdInputChange = (e) => {
    const value = e.target.value;
    setNetworkIdInput(value);
  };

  // Check answers
  const checkAnswers = () => {
    const correctSubnetMask = getCorrectSubnetMask();
    const correctNetworkId = calculateNetworkId(ipAddress, correctSubnetMask);

    setSubnetMaskCorrect(subnetMaskInput === correctSubnetMask);
    setNetworkIdCorrect(networkIdInput === correctNetworkId);
    setShowFeedback(true);
  };

  // Generate binary subnet mask representation based on slider value
  const getBinaryRepresentation = () => {
    const binary = cidrToBinary(sliderValue[0]);
    return binary.match(/.{1,8}/g).join(".");
  };

  // Handle IP part click for binary inspector
  const handleIPPartClick = (index, value) => {
    setInspectedOctet(value);
    setInspectedIndex(index);
    setIsVisible(true);
  };

  // Binary representation of a number
  const getBinary = (num) => {
    return num.toString(2).padStart(8, "0");
  };

  // Binary inspector component
  const BinaryInspector = ({ octet, index, cidr }) => {
    if (octet === null) return null;

    const binaryRepresentation = getBinary(octet);

    // Determine which bits are network bits based on CIDR and octet position
    let networkBits = 0;
    if (index === 0) networkBits = 8;
    else if (index === 1)
      networkBits = index === 1 ? (cidr > 16 ? cidr - 8 : 8) : 0;
    else if (index === 2) {
      if (cidr > 24) networkBits = 8;
      else if (cidr > 16) networkBits = cidr - 16;
      else networkBits = 0;
    } else if (index === 3) {
      if (cidr > 24) networkBits = cidr - 24;
      else networkBits = 0;
    }

    return (
      <div className="px-4 py-3 bg-gray-100 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Binary Inspector
        </h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-32 text-sm text-gray-600">Binary:</span>
            <div className="font-mono">
              {binaryRepresentation.split("").map((bit, i) => (
                <span
                  key={i}
                  className={`${
                    i < networkBits
                      ? "text-blue-600 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {networkBits > 0 ? (
              <span>I primi {networkBits} bit sono bit di rete</span>
            ) : (
              <span>Tutti i bit in questo otteto sono bit di host</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    // <div className="p-4 max-w-4xl mx-auto">
    <Card className="w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Torna alla home"
          >
            <ArrowLeft size={16} className="text-purple-600" />
          </Link>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Storynet
          </h2>
        </div>

        <Button
          onClick={generateRandomIPAndCIDR}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 rounded-full px-4 py-2"
        >
          <RefreshCw size={18} className="animate-pulse" />
          Nuovo IP
        </Button>
      </div>

      {/* Section 1: Starting IP Address */}
      <Card className="m-4 overflow-hidden border-2 border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2">
          <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
            <span>Indirizzo IP con CIDR</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Clicca su una parte dell'IP per vedere la rappresentazione
                    binaria
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="text-lg font-medium p-2 bg-gray-100 rounded flex flex-wrap gap-2">
              {ipAddress.split(".").map((part, index) => (
                <button
                  key={index}
                  className={`px-2 py-1 rounded hover:bg-blue-600 transition-colors ${
                    inspectedIndex === index && isVisible
                      ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handleIPPartClick(index, parseInt(part))}
                >
                  {part}
                </button>
              ))}
              <span className="px-2 py-1">/</span>
              <span className="px-2 py-1 bg-green-500 text-white rounded">
                {cidr}
              </span>
            </div>
            {/* Show binary inspector directly in this section */}
            {inspectedOctet !== null && isVisible == true && (
              <BinaryInspector
                octet={inspectedOctet}
                index={inspectedIndex}
                cidr={cidr}
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600 ">
                <i>"In principio c'era un indirizzo di classe..."</i>
                {/* Indirizzo IP di Classe{" "}
                  <span className="font-bold">{ipClass}</span> con
                  {ipClass === "B"
                    ? " 16 bit di rete per default"
                    : " 24 bit di rete per default"} */}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Subnet Mask */}
      <Card className="m-4 overflow-hidden border-2 border-teal-100">
        <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 px-4 py-2">
          <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
            <span>Subnet Mask (SM)</span>
            {subnetMaskCorrect !== null && (
              <span className="flex items-center">
                {subnetMaskCorrect ? (
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                ) : (
                  <XCircle size={20} className="text-red-600 mr-2" />
                )}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Sposta lo slider per la giusta subet mask:
              </label>
              <div className="py-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{ipClass === "B" ? "16" : "24"}</span>
                  <Slider
                    value={sliderValue}
                    min={ipClass === "B" ? 16 : 24}
                    max={30}
                    step={1}
                    onValueChange={handleSliderChange}
                    className="m-2"
                  />
                  <span>30</span>
                </div>
              </div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                {getBinaryRepresentation()}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                In notazione decimale:
              </label>
              <Input
                value={subnetMaskInput}
                onChange={handleSubnetMaskInputChange}
                placeholder="255.255.255.0"
                className={`${
                  subnetMaskCorrect === true
                    ? "border-green-500"
                    : subnetMaskCorrect === false
                    ? "border-red-500"
                    : ""
                }`}
              />
              {subnetMaskCorrect === false && showFeedback && (
                <p className="text-sm text-red-600 mt-1">
                  Subnet mask non corretta. Riprova!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Network ID */}
      <Card className="m-4 overflow-hidden border-2 border-yellow-100">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2">
          <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
            <span>Indirizzo di Rete (ID)</span>
            {networkIdCorrect !== null && (
              <span className="flex items-center">
                {networkIdCorrect ? (
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                ) : (
                  <XCircle size={20} className="text-red-600 mr-2" />
                )}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              La subnet a cui appartiene l'indirizzo è:
            </p>
            <Input
              value={networkIdInput}
              onChange={handleNetworkIdInputChange}
              placeholder="192.168.1.0"
              className={`${
                networkIdCorrect === true
                  ? "border-green-500"
                  : networkIdCorrect === false
                  ? "border-red-500"
                  : ""
              }`}
            />
            {networkIdCorrect === false && showFeedback && (
              <p className="text-sm text-red-600 mt-1">
                Indirizzo di rete non corretto. Riprova!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {networkIdCorrect === true && showFeedback && (
        <div className="m-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            Complimenti! Hai correttamente identificato subnet e indirizzo di
            rete.
          </p>
          {/* Additional information about the subnet */}
          <div className="mt-2 text-sm text-gray-600">
            <p>Con una subnet mask /{cidr}, questa rete:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                Range di indirizzi: <br />
                {calculateGateway(networkIdInput)} -{" "}
                {calculateBroadcastAddress(networkIdInput, cidr)}
              </li>
              <li>{Math.pow(2, 32 - cidr) - 3} host disponibili</li>
              <li>
                Range indirizzi utilizzabili: <br />
                {calculateFirstUsableHost(networkIdInput)} -{" "}
                {calculateLastUsableHost(networkIdInput, cidr)}
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex justify-center p-4">
        <Button
          onClick={checkAnswers}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300 px-8 py-3 text-lg font-medium rounded-lg"
        >
          Verifica
        </Button>
      </div>
      <div className="flex justify-center p-2 mt-2 mb-4">
        <a
          href="https://www.youtube.com/watch?v=vGUNqq3jVLg&t=47s"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
          Come raccontarlo come fosse una storia
        </a>
      </div>
    </Card>
    // </div>
  );
};

// Helper function to calculate the broadcast address
function calculateBroadcastAddress(networkId, cidr) {
  const ipParts = networkId.split(".").map(Number);
  const hostBits = 32 - cidr;

  // Clone the IP parts array
  const broadcastParts = [...ipParts];

  // Calculate which octets need to be modified
  const fullOctetsToModify = Math.floor(hostBits / 8);
  const remainingBits = hostBits % 8;

  // Set the appropriate octets to their maximum values
  for (let i = 0; i < fullOctetsToModify; i++) {
    broadcastParts[3 - i] = 255;
  }

  // If there are remaining bits, modify the appropriate octet
  if (remainingBits > 0) {
    const octetIndex = 3 - fullOctetsToModify;
    const bitmask = (1 << remainingBits) - 1;
    broadcastParts[octetIndex] = broadcastParts[octetIndex] | bitmask;
  }

  return broadcastParts.join(".");
}

// Helper function to calculate the first usable host address
function calculateGateway(networkId) {
  const ipParts = networkId.split(".").map(Number);

  // Gateway is network address + 1
  ipParts[3] += 1;

  return ipParts.join(".");
}

function calculateFirstUsableHost(networkId) {
  const ipParts = networkId.split(".").map(Number);

  // First usable host is network address + 1
  ipParts[3] += 2;

  return ipParts.join(".");
}

// Helper function to calculate the last usable host address
function calculateLastUsableHost(networkId, cidr) {
  const broadcastAddress = calculateBroadcastAddress(networkId, cidr);
  const ipParts = broadcastAddress.split(".").map(Number);

  // Last usable host is broadcast address - 1
  ipParts[3] -= 1;

  return ipParts.join(".");
}

export default Storynet;
