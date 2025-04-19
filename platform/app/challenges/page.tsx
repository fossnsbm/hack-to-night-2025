'use client';

import Link from 'next/link';
import React from 'react';

interface TopicCardProps {
  topicNumber: string;
  bgColor: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topicNumber, bgColor }) => {
  return (
    <div
      className="w-48 h-64 rounded-xl flex items-center justify-center border border-blue-300 shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ backgroundColor: bgColor }}
    >
      <p className="text-white text-lg font-medium">Question {topicNumber}</p>
    </div>
  );
};

const topics = [
  {
    title: 'Ethical Hacking',
    slug: 'ethical-hacking',
  },
  {
    title: 'Social Engineering',
    slug: 'social-engineering',
  },
  {
    title: 'Cryptography',
    slug: 'cryptography',
  },
];

const Page: React.FC = () => {
  const topicColors = [
    '#0d2641', // Topic 01
    '#0a3056', // Topic 02
    '#1e4a78', // Topic 03
    '#0d2c4d', // Topic 04
    '#091d3a', // Topic 05
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex-grow"></div>
      </div>

      {/* Ethical hacking Section */}
      <div className="text-left pl-12">
        <h1 className="text-3xl font-semibold mb-12">Ethical Hacking</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <Link
              key={num}
              href={`/challenges/general/${num.toString().padStart(2, '0')}`}
            >
              <TopicCard
                topicNumber={num.toString().padStart(2, '0')}
                bgColor={topicColors[idx]}
              />
            </Link>
          ))}
        </div>

        <h1 className="text-3xl font-semibold mb-12 pt-8">Social Engineering</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <Link
              key={num}
              href={`/challenges/social/${num.toString().padStart(2, '0')}`}
            >
              <TopicCard
                topicNumber={num.toString().padStart(2, '0')}
                bgColor={topicColors[idx]}
              />
            </Link>
          ))}
        </div>

        <h1 className="text-3xl font-semibold mb-12 pt-8">Cryptography</h1>
        <div className="flex justify-center gap-6 flex-wrap mx-auto max-w-6xl pb-2">
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <Link
              key={num}
              href={`/challenges/crypto/${num.toString().padStart(2, '0')}`}
            >
              <TopicCard
                topicNumber={num.toString().padStart(2, '0')}
                bgColor={topicColors[idx]}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;