import React from "react";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaEnvelope,
  FaSave,
} from "react-icons/fa";

const GalleryModal = ({
  zoomedGallery,
  closeGallery,
  goToPreviousImage,
  goToNextImage,
  handleShare,
  openEmailClient,
  showShareOptions,
  setShowShareOptions,
}: any) => {
  if (!zoomedGallery) return null;

  return (
    <div
      className="fixed w-full inset-0 bg-black bg-opacity-80 z-50 flex flex-col justify-center items-center"
      onClick={closeGallery}
    >
      <div className="text-white text-2xl absolute top-4 left-4">
        {zoomedGallery.currentIndex + 1}/{zoomedGallery.gallery.length}
      </div>
      <div
        id="gallery"
        className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center mx-auto"
      >
        {zoomedGallery.gallery.map((image: any, idx: number) => (
          <div
            key={idx}
            className={`${
              idx === zoomedGallery.currentIndex ? "block" : "hidden"
            } duration-700 ease-in-out`}
          >
            <img
              src={image.picture}
              alt={image.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryModal;
