"use client";

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';
import { useEmojiStore } from '../lib/emojiStore';

const EMOJI_API_KEY = process.env.NEXT_PUBLIC_EMOJI_API_KEY;

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const addNewEmoji = useEmojiStore((state) => state.addNewEmoji);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting emoji search');
    if (!isSignedIn) {
      console.log('User not signed in');
      return;
    }
    setIsGenerating(true);
    try {
      console.log('Searching for emoji');
      const response = await fetch(
        `https://emoji-api.com/emojis?search=${encodeURIComponent(prompt)}&access_key=${EMOJI_API_KEY}`
      );
      const emojis = await response.json();
      
      if (emojis && emojis.length > 0) {
        const emoji = emojis[0];
        console.log('Emoji found:', emoji);
        
        const newEmoji = {
          id: emoji.codePoint,
          image_url: `https://cdn.jsdelivr.net/joypixels/assets/6.6/png/unicode/128/${emoji.codePoint.toLowerCase()}.png`,
          prompt: prompt,
          likes_count: 0,
          creator_user_id: userId || 'anonymous'
        };

        addNewEmoji(newEmoji);
        setPrompt('');
      } else {
        throw new Error('No emoji found for this prompt');
      }
    } catch (error) {
      console.error('Error finding emoji:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500">Enter a word to find a matching emoji</p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Was using Replicate SDXL emoji API which was generating iPhone equivalent aesthetic emoji but sadly :( it&apos;s paid now so had to change it to emoji-api.com
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a word (e.g., 'happy', 'cat', 'sun')"
          disabled={isGenerating}
          className="flex-1"
        />
        <Button type="submit" disabled={isGenerating} size="sm">
          {isGenerating ? 'Finding...' : 'Generate'}
        </Button>
      </form>
      {isGenerating && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
    </Card>
  );
}