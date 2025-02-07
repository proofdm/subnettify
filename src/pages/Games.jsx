import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card";
import { Button } from "./../../components/ui/button";
import { Network, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const SubnettingGames = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            Subnetting Games
          </h1>
          <p className="text-lg text-gray-600">
            Impara il subnetting IP giocando con due diverse modalità
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subnettify Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-6 w-6 text-purple-500" />
                Subnettify
              </CardTitle>
              <CardDescription>
                Esplora le subnet mask e scopri come dividere le reti IP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Sfida le tue abilità nel subnetting scegliendo il Network ID
                corretto per ogni maschera di sottorete. Un gioco per imparare
                le basi del subnetting IP.
              </p>
              <ul className="text-sm text-gray-500 mb-8 space-y-2">
                <li className="flex items-center gap-2">
                  • Impara le subnet mask classiche
                </li>
                <li className="flex items-center gap-2">
                  • Calcola Network ID e Host ID
                </li>
                <li className="flex items-center gap-2">
                  • Modalità pratica senza limiti di tempo
                </li>
              </ul>
              <Link to="/subnettify">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  Gioca Ora
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Subnettimize Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-6 w-6 text-purple-500" />
                Subnettimize
              </CardTitle>
              <CardDescription>
                Ottimizza le tue scelte di subnet in base agli host richiesti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Metti alla prova la tua velocità nel scegliere la subnet mask
                ottimale. Un gioco contro il tempo per imparare a minimizzare
                gli sprechi di indirizzi IP.
              </p>
              <ul className="text-sm text-gray-500 mb-8 space-y-2">
                <li className="flex items-center gap-2">
                  • Sfida a tempo di 90 secondi
                </li>
                <li className="flex items-center gap-2">
                  • Ottimizza le scelte delle subnet
                </li>
                <li className="flex items-center gap-2">
                  • Compete per il miglior punteggio
                </li>
              </ul>
              <Link to="/subnettimize">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  Gioca Ora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          Created for learning IP Subnetting - {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default SubnettingGames;
