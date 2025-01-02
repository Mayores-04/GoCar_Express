import React from "react";
import Image from "next/image";

interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  picture: string;  
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  date,
  picture,
}) => (
  <div className="elements justify-around bg-white grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-left  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    {/* Left Column: Text Content */}
    <div className="px-4">
      {/* Date Section */}
      <h2 className="text-md font-bold text-gray-400 mb-2">{date}</h2>

      {/* Title Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>

      {/* Description Section */}
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </div>

    <div className="w-full px-24">
      {/* Picture Section */}
      {picture && (
        <div className="">
          <Image
            src={picture}
            alt={title}
            width={500}
            height={300}
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  </div>
);

export default NewsCard;
