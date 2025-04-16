'use client';

import React, { useState } from 'react';

interface TopicCardProps {
  topicNumber: string;
  bgColor: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topicNumber, bgColor }) => {
  return (
    <div
      className="w-48 h-64 rounded-xl flex items-center justify-center border border-blue-300 shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      <p className="text-white text-lg font-medium">Topic {topicNumber}</p>
    </div>
  );
};

const Page: React.FC = () => {
  const [totalScore] = useState<number>(45);

  const topicColors = [
    '#0d2641', // Topic 01
    '#0a3056', // Topic 02
    '#1e4a78', // Topic 03
    '#0d2c4d', // Topic 04
    '#091d3a', // Topic 05
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header with score */}
      <div className="flex justify-between items-center p-6">
        <div className="flex-grow"></div>
       
       
      </div>

      {/* Challenges Section */}
      <div className="text-center py-8">
        <h1 className="text-align-left  text-3xl font-semibold mb-12">Challenges</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <TopicCard
              key={num}
              topicNumber={num.toString().padStart(2, '0')}
              bgColor={topicColors[idx]}
            />
          ))}
        </div>
        <h1 className="text-3xl font-semibold mb-12 ">Social engeneering</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <TopicCard
              key={num}
              topicNumber={num.toString().padStart(2, '0')}
              bgColor={topicColors[idx]}
            />
          ))}
        </div>
        <h1 className="text-3xl font-semibold mb-12">Cryptography</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl hover:pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <TopicCard
              key={num}
              topicNumber={num.toString().padStart(2, '0')}
              bgColor={topicColors[idx]}
            />
          ))}
        </div>
      </div>

      {/* Hackathon Info Section */}
   
    </div>
  );
};

export default Page;