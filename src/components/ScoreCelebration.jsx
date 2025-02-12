import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

const ScoreCelebration = ({ onClose }) => {
  const [showLyrics, setShowLyrics] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Set timer to show lyrics after 10 seconds
    const timer = setTimeout(() => {
      setShowLyrics(true);
    }, 11000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  const handleInfoClick = () => {
    setShowMessage(!showMessage);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-4 right-4 text-amber-300 hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </Button>

        <div
          className="max-w-3xl w-full mx-auto rounded-xl p-6 mt-8 
          bg-gradient-to-br from-white via-amber-50 to-amber-100
          shadow-[0_0_15px_rgba(251,191,36,0.1)]
          border border-amber-200/30"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-8 
            bg-gradient-to-r from-yellow-500 to-purple-600 
            bg-clip-text text-transparent
            drop-shadow-sm"
          >
            Hai fatto più di 1000 pt, <br />
            sei un* dur*!
          </h2>

          <div
            className="relative w-full rounded-lg overflow-hidden 
            border border-amber-200/30
            shadow-[0_4px_20px_rgba(251,191,36,0.1)]"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube-nocookie.com/embed/Bk8WsYLyVZc?autoplay=1&modestbranding=1&rel=0&controls=1&fs=1&playsinline=1&showinfo=0"
              title="Celebration Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
            />
          </div>

          {/* Lyrics section with transition */}
          <div
            className={`mt-8 text-gray-900/90 space-y-4 transition-all duration-1000 
              ${
                showLyrics
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none"
              }`}
            style={{ paddingLeft: "8px", paddingBottom: "16px" }}
          >
            <p className="font-medium">
              {/* Replace with your song lyrics */}
              Volevo essere un duro <br /> Che non gli importa del futuro
              <br /> Un robot
              <br /> Un lottatore di sumo
              <br /> Uno spaccino in fuga da un cane lupo <br />
              Alla stazione di Bolo <br />
              Una gallina dalle uova d’oro <br />
              <br />
              Però non sono nessuno <br />
              Non sono nato con la faccia da duro <br />
              Ho anche paura del buio <br />
              Se faccio a botte le prendo <br />
              Così mi truccano gli occhi di nero <br />
              Ma non ho mai perso tempo
              <br /> È lui che mi ha lasciato indietro
              <br />
              <br />
              Vivere la vita è un gioco da ragazzi
              <br /> Me lo diceva mamma ed io <br />
              Cadevo giù dagli alberi <br />
              Quanto è duro il mondo <br />
              Per quelli normali <br />
              Che hanno poco amore intorno <br />O troppo sole negli occhiali
              <br />
              <br />
              Volevo essere un duro <br />
              Che non gli importa del futuro no <br />
              Un robot
              <br />
              Medaglia d’oro di sputo <br />
              Lo scippatore che t’aspetta nel buio <br />
              Il Re di Porta Portese <br />
              La gazza ladra che ti ruba la fede
              <br />
              <br /> Vivere la vita è un gioco da ragazzi
              <br /> Me lo diceva mamma ed io <br />
              Cadevo giù dagli alberi <br />
              Quanto è duro il mondo <br />
              Per quelli normali <br />
              Che hanno poco amore intorno <br />O troppo sole negli occhiali
              <br /> Colevo essere un duro <br />
              Però non sono nessuno <br />
              Cintura bianca di Judo <br />
              Invece che una stella uno starnuto
              <br />
              <br /> I girasoli con gli occhiali mi hanno detto “Stai attento
              alla luce” <br />E che le lune senza buche sono fregature
              <br /> Perché in fondo è inutile fuggire <br />
              Dalle tue paure
              <br />
              <br /> Vivere la vita è un gioco da ragazzi
              <br /> Io, Io volevo essere un duro
              <br /> Però non sono nessuno
              <br /> Non sono altro che ______ <br />
              Non sono altro che ______
            </p>
          </div>

          {/* Info button */}
          <button
            onClick={handleInfoClick}
            className="mt-24 ml-4 bg-gradient-to-r from-yellow-500 via-yellow-00 to-purple-600 
            bg-clip-text text-transparent
            drop-shadow-sm transition-colors
                 h-5 rounded-full border-2 border-current flex items-center justify-center
                text-xs font-semibold"
          >
            alla fine apri
          </button>

          {/* Message popup */}
          <div
            className={`
              grid transition-all duration-1000 ease-in-out mt-4
              ${showMessage ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
            `}
          >
            <div className="overflow-hidden">
              <div
                className={`w-full max-w-md
                  transition-opacity duration-1000 
                  ${showMessage ? "opacity-100" : "opacity-0"}
                `}
              >
                <p className="text-sm text-gray-900/80 leading-relaxed">
                  Bella canzone uscita proprio ieri sera... <br />
                  <br />
                  Tu <strong>che nome metteresti nelle righe?</strong> <br />
                  Il tuo? Di altri? Entrambi? O quello di due compagn*... <br />
                  <br />
                  Se ti va di prenderlo come un nuovo gioco, <br />
                  qua basta già un punto solo <br /> <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCelebration;
