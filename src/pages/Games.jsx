import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card";
import { Network, Timer, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
          <p className="text-lg text-gray-600">
            Un unico byte, diverse modalità di gioco per impare la logica base
            dell'IP subnetting
          </p>
        </div>

        {/* Games Grid */}
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
                  <div className="pt-2 text-sm text-gray-500">
                    Modalità pratica senza limiti di tempo per imparare le basi
                    del subnetting IP
                  </div>
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
                    Un gioco contro il tempo per imparare a minimizzare gli
                    sprechi di indirizzi IP.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li className="flex items-center gap-2">
                      • Partite da 90 secondi
                    </li>
                    <li className="flex items-center gap-2">
                      • Scegli la rete CIDR più appropriata usando swipe o
                      scroll
                    </li>
                    <li className="flex items-center gap-2">
                      • 100pt se la subnet minimizza gli sprechi o penalità
                      degli indirizzi sprecati
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
// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./../../components/ui/card";
// import { Button } from "./../../components/ui/button";
// import { Network, Timer } from "lucide-react";
// import { Link } from "react-router-dom";

// const SubnettingGames = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h1
//             className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2"
//             style={{ lineHeight: "3rem" }}
//           >
//             OneByte
//           </h1>
//           <p className="text-lg text-gray-600">
//             Un unico byte, diverse modalità di gioco per impare la logica base
//             dell'IP subnetting
//           </p>
//         </div>

//         {/* Games Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Subnettify Card */}
//           <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Network className="h-6 w-6 text-purple-500" />
//                 Subnettify
//               </CardTitle>
//               <CardDescription>
//                 Impara da un unico byte la dinamica del subnetting
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600 mb-6">
//                 Dato un IP scegli la rete corretta in ogni subnet mask. Lo
//                 stesso IP darà luogo a letture diverse.
//               </p>
//               <Link to="/subnettify">
//                 <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
//                   Learn
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Subnettimize Card */}
//           <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Timer className="h-6 w-6 text-purple-500" />
//                 Subnettimize
//               </CardTitle>
//               <CardDescription>
//                 Assegna in modo ottimale le subnet agli host
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600 mb-6">
//                 Un gioco contro il tempo per imparare a minimizzare gli sprechi
//                 di indirizzi IP.
//               </p>
//               <ul className="text-sm text-gray-500 mb-8 space-y-2">
//                 <li className="flex items-center gap-2">
//                   • Partite da 90 secondi
//                 </li>
//                 <li className="flex items-center gap-2">
//                   • Scegli la rete CIDR più appropriata usando swipe o scroll
//                 </li>
//                 <li className="flex items-center gap-2">
//                   • 100pt se la subnet minimizza gli sprechi o penalità degli
//                   indirizzi sprecati
//                 </li>
//               </ul>
//               <Link to="/subnettimize">
//                 <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
//                   Play
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Footer */}
//         <footer className="text-center mt-12 text-gray-500 text-sm">
//           © {new Date().getFullYear()} - Daniele Montesi
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default SubnettingGames;
