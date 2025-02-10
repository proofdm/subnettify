import { Card, CardContent } from "../../components/ui/card";

const MatchAnalysis = ({ moves }) => {
  const getBinary = (num) => num.toString(2).padStart(8, "0");

  const getNetworkBits = (cidr) => {
    // Convert /24, /25, /26, /27 to number of last byte bits (0,1,2,3)
    return parseInt(cidr.replace("/", "")) - 24;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-purple-600 mb-4">
          Match Analysis
        </h3>
        <div className="space-y-4">
          {moves.map((move, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 ${
                move.wasOptimal
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">
                    Required hosts: {move.requiredHosts}
                  </span>
                  <span className="text-sm text-gray-700">
                    Optimal CIDR: {move.optimalCidr}
                  </span>
                </div>
                {move.wasOptimal ? (
                  <span className="text-sm text-green-600 font-medium">
                    +100
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    -{move.wastedHosts}
                  </span>
                )}
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <div className="text-sm mb-1">IP: {move.ip}</div>
                <div className="text-lg">
                  {getBinary(move.ip)
                    .split("")
                    .map((digit, i) => {
                      const networkBits = getNetworkBits(move.optimalCidr);
                      return (
                        <span
                          key={i}
                          className={
                            i < networkBits
                              ? "text-green-600 font-bold"
                              : "text-yellow-500"
                          }
                        >
                          {digit}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchAnalysis;
