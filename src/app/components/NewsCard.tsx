"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  picture: string;
  readmore: string;
  onMoreInfo?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  date,
  picture,
  readmore,
  onMoreInfo,
}) => (
  <div className="elements justify-around bg-white grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-left rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
    <div className="px-4 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-md font-bold text-gray-400 mb-2">{date}</h2>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </div>

      <div className="flex gap-4 mt-auto">
        <Link
          href={readmore}
          className="text-blue-500 font-semibold hover:underline"
        >
          Read More
        </Link>

        {onMoreInfo && (
          <button
            onClick={onMoreInfo}
            className="text-blue-500 font-semibold hover:underline"
          >
            More Info
          </button>
        )}
      </div>
    </div>

    <div className="w-full px-24 items-center justify-center">
      {picture && (
        <Image
          src={picture}
          alt={title}
          width={500}  
          height={300}  
          className="rounded-lg object-contain"  
        />
      )}
    </div>
  </div>
);

export default NewsCard;
