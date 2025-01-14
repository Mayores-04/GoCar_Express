import React from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryItem {
  title: string;
  date: string;
  gallery_picture: string;
}

interface NewsCardProps {
  _id: string;
  title: string;
  main_picture: string;
  description: string;
  date: string;
  location: string;
  duration?: string;
  contact?: string;
  gallery?: GalleryItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({
  _id,
  title,
  main_picture,
  description,
  date,
  location,
  duration,
  contact,
  gallery,
}) => {
  return (
    <div className="elements justify-center items-center bg-white grid grid-cols-1 md:grid-cols-2 gap-10 p-6 text-left rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      {/* Text Section */}
      <div className="px-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-md font-bold text-gray-400 mb-2">{date}</h2>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{description}</p>
          <p className="text-gray-500 text-sm mt-1">{location}</p>
          {duration && <p className="text-gray-500 text-sm">Duration: {duration}</p>}
          {contact && <p className="text-gray-500 text-sm">Contact: {contact}</p>}
        </div>
        <div className="flex gap-4 mt-auto">
          <Link
            href={`/news/${_id}`}
            className="text-blue-500 font-semibold hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full flex items-center justify-center">
        {main_picture ? (
          <Image
            src={main_picture}
            alt={title}
            width={500}
            height={300}
            className="rounded-lg object-contain"
            priority
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
