"use client";

import Image from 'next/image';
import { Card } from './ui/card';
import { useEmojiStore } from '../lib/emojiStore';
import { Download, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function EmojiGrid() {
  const { emojis, toggleLike } = useEmojiStore();
  const { isSignedIn } = useAuth();

  const handleDownload = (imageUrl: string, prompt: string) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `emoji-${prompt}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading image:', error));
  };

  const handleLike = async (emojiId: string) => {
    if (!isSignedIn) {
      toast.error('Please sign in to like emojis');
      return;
    }

    try {
      toggleLike(emojiId);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="p-2 relative group">
          <div className="relative">
            <Image
              src={emoji.image_url}
              alt={emoji.prompt}
              width={100}
              height={100}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(emoji.image_url, emoji.prompt)}
                className="text-white mr-2"
              >
                <Download size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(emoji.id)}
                className={`text-white hover:bg-red-500/20 ${emoji.isLiked ? 'bg-red-500' : ''}`}
              >
                <Heart 
                  size={20} 
                  className={emoji.isLiked ? 'text-white' : 'text-white'} 
                  fill={emoji.isLiked ? 'currentColor' : 'none'} 
                />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center text-sm">
            <p className="truncate flex-grow">{emoji.prompt}</p>
            <span className="ml-2 flex items-center">
              <Heart 
                size={14} 
                className={`mr-1 ${emoji.isLiked ? 'text-red-500' : ''}`}
                fill={emoji.isLiked ? 'currentColor' : 'none'}
              /> 
              {emoji.likes_count}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}