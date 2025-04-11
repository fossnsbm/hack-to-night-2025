'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getTeams } from '@/lib/getTeams';
import { Team } from '@/lib/getTeams';

const Scoreboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getTeams().then((r) => setTeams(r));
  }, []);

  if (teams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading teams...
      </div>
    );
  }

  const podium = teams.slice(0, 3);
  const others = teams.slice(3);

  const sortedPodium = [
    podium.find((t) => t.rank === 2)!,
    podium.find((t) => t.rank === 1)!,
    podium.find((t) => t.rank === 3)!,
  ];

  return (
    <div className="min-h-screen bg-[url('/images/space-bg.jpg')] bg-cover bg-center text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Podium */}
        <div className="border border-cyan-400 p-8 rounded-md shadow-xl mb-8">
          <div className="flex justify-center gap-8 items-end">
            {sortedPodium.map((team) => (
              <div
                key={team.rank}
                className={`relative flex flex-col items-center text-center ${
                  team.rank === 1 ? 'scale-110 z-10' : 'scale-90'
                }`}
              >
                <div className="hexagon-podium bg-[#0d1b2a] border-10 border-cyan-400 p-6">
                  <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 border-cyan-400">
                    <Image
                      src={team.image || '/images/default-avatar.png'}
                      alt={team.teamname}
                      width={112}
                      height={112}
                    />
                  </div>
                  <p className="text-xl font-bold mb-1">
                    {team.rank === 1 ? '1st' : team.rank === 2 ? '2nd' : '3rd'}
                  </p>
                  <p className="text-md">{team.teamname}</p>
                  <p className="text-sm text-cyan-200">{team.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower ranks */}
        <div className="space-y-6">
          {others.map((team) => (
            <div
              key={team.rank}
              className="flex justify-between items-center bg-[#0d1b2a] border border-cyan-400 rounded-md shadow-xl overflow-hidden relative"
            >
              <div className="flex items-center">
                <div className="hexagon-left-rank bg-cyan-700 text-white font-bold px-6 py-2">
                  {team.rank}th
                </div>
                <div className="text-lg px-6 py-4 font-semibold tracking-wide">
                  {team.teamname}
                </div>
              </div>
              <div className="px-6 text-lg font-bold text-cyan-300">{team.score}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hexagon-podium {
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
        }
        .hexagon-left-rank {
          clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 50%);
        }
      `}</style>
    </div>
  );
};

export default Scoreboard;



