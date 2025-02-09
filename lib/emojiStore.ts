import { create } from 'zustand';

interface Emoji {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  isLiked?: boolean;
}

interface EmojiStore {
  emojis: Emoji[];
  addNewEmoji: (emoji: Emoji) => void;
  updateEmoji: (updatedEmoji: Emoji) => void;
  toggleLike: (emojiId: string) => void;
}

export const useEmojiStore = create<EmojiStore>((set) => ({
  emojis: [],
  addNewEmoji: (emoji) => set((state) => ({ 
    emojis: [{ ...emoji, isLiked: false }, ...state.emojis] 
  })),
  updateEmoji: (updatedEmoji) => set((state) => ({
    emojis: state.emojis.map((emoji) => 
      emoji.id === updatedEmoji.id ? updatedEmoji : emoji
    )
  })),
  toggleLike: (emojiId) => set((state) => ({
    emojis: state.emojis.map((emoji) => 
      emoji.id === emojiId 
        ? {
            ...emoji,
            isLiked: !emoji.isLiked,
            likes_count: emoji.isLiked ? emoji.likes_count - 1 : emoji.likes_count + 1
          }
        : emoji
    )
  })),
}));