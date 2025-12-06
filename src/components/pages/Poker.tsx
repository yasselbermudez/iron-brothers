import { useState } from "react";
import { Trophy, DollarSign, User } from 'lucide-react';

const PokerRanking = () => {
  const [players] = useState([
    {
      id: 1,
      photo: "./assets/javier.png",
      nickname: "Javi",
      games: 3,
      finales: 4,
      money: 60000
    },
    {
      id: 2,
      photo: "./assets/luis.png",
      nickname: "AllInKing",
      games: 2,
      finales: 2,
      money: 40000
    },
    {
      id: 3,
      photo: "./assets/tejon.png",
      nickname: "Tejon",
      games: 2,
      finales: 3,
      money: 40000
    },
    {
      id: 4,
      photo: "./assets/pollo.png",
      nickname: "Pollo",
      games: 0,
      finales: 0,
      money: 0
    },
    {
      id: 5,
      photo: "./assets/marquitos.png",
      nickname: "Quesudo",
      games: 3,
      finales: 1,
      money: 60000
    }
  ]);

  const sortedPlayers = [...players].sort((a, b) => (b.money - a.money) || (b.finales - a.finales));

  const getMedalColor = (position:number) => {
    if (position === 0) return 'text-yellow-400';
    if (position === 1) return 'text-gray-300';
    if (position === 2) return 'text-amber-600';
    return 'text-green-400';
  };

  const formatMoney = (amount:number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Poker pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">♠</div>
        <div className="absolute top-32 right-20 text-7xl">♥</div>
        <div className="absolute bottom-20 left-32 text-9xl">♣</div>
        <div className="absolute bottom-40 right-16 text-8xl">♦</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">♠</div>
        <div className="absolute top-1/3 right-1/3 text-7xl">♥</div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">
              Ranking
            </h1>
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
          </div>
          <p className="text-green-200 text-lg md:text-xl">Top Players del Torneo</p>
        </div>

        {/* Ranking Cards */}
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 md:p-6 shadow-2xl border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Position */}
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-yellow-600 shadow-lg">
                  {index < 3 ? (
                    <Trophy className={`w-8 h-8 md:w-10 md:h-10 ${getMedalColor(index)}`} />
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-green-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Photo */}
                <div className="relative">
                  <img
                    src={player.photo}
                    alt={player.nickname}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-yellow-600 shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Player Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {player.nickname}
                  </h3>
                  <p className="text-green-300 text-sm md:text-base">
                    {player.games} partidas ganadas
                  </p>
                  <p className="text-green-300 text-sm md:text-base">
                    {player.finales} finales
                  </p>
                </div>

                

                {/* Money */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg px-4 md:px-6 py-3 md:py-4 shadow-lg min-w-[160px] md:min-w-[200px]">
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <span className="text-xl md:text-2xl font-bold text-white">
                      {formatMoney(player.money)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer decorations */}
        <div className="mt-12 flex justify-center gap-8 text-6xl md:text-7xl text-yellow-600/20">
          <span>♠</span>
          <span>♥</span>
          <span>♦</span>
          <span>♣</span>
        </div>
      </div>
    </div>
  );
};

export default PokerRanking;