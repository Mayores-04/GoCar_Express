import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 space-y-4 max-w-sm mx-auto">
      <div className="text-4xl">{icon}</div>
      <h2 className="text-2xl font-semibold text-[#4169e1]">{title}</h2>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
