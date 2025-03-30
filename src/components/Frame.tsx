"use client";

import { useEffect, useCallback, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFrameSDK } from "~/hooks/useFrameSDK";

// Gallery images based on Emre's recent shares
interface GalleryItem {
  id: number;
  type: string;
  url: string;
  title: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    url: "https://i.imgur.com/JQpIOHh.jpg",
    title: "Farconnect Taipei",
    description: "April 2nd, 2025 - Sponsored by Base",
  },
  {
    id: 2,
    type: "image",
    url: "https://i.imgur.com/mVF8Gj2.jpg",
    title: "Milady NFT",
    description: "Recently shared on Farcaster",
  },
  {
    id: 3,
    type: "image",
    url: "https://i.imgur.com/pK7Nvq3.jpg",
    title: "Highlight NFT Mint",
    description: "Proceeds go towards future meetups",
  },
  {
    id: 4,
    type: "image",
    url: "https://i.imgur.com/L8dHEXf.jpg",
    title: "Solana Starter Pack",
    description: "Curated collection of Solana resources",
  },
  {
    id: 5,
    type: "image",
    url: "https://i.imgur.com/9RtDvAc.jpg",
    title: "Gym Habit Tracker",
    description: "Built with Cursor x Claude",
  },
];

interface GalleryCardProps {
  item: GalleryItem;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
}

function GalleryCard({ item, onPrev, onNext, currentIndex, totalItems }: GalleryCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-full h-[300px] overflow-hidden rounded-md">
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={onPrev} 
          variant="outline"
          className="px-4"
        >
          ← Previous
        </Button>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {totalItems}
        </div>
        <Button 
          onClick={onNext}
          variant="outline" 
          className="px-4"
        >
          Next →
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Frame() {
  const { isSDKLoaded, sdk } = useFrameSDK() || { isSDKLoaded: false, sdk: null };
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  }, []);

  // Signal to the Farcaster parent app that the frame is ready
  useEffect(() => {
    if (sdk) {
      sdk.actions.ready();
    }
  }, [sdk]);

  if (!isSDKLoaded) {
    return <div className="flex justify-center items-center h-[400px]">Loading gallery...</div>;
  }

  const currentItem = galleryItems[currentIndex];

  return (
    <div className="w-full max-w-[500px] mx-auto py-4 px-4">
      <GalleryCard 
        item={currentItem}
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentIndex}
        totalItems={galleryItems.length}
      />
      <div className="mt-4 text-center text-sm text-gray-500">
        Gallery of Emre's recent Farcaster shares
      </div>
    </div>
  );
}
