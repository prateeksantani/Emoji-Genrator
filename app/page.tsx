import { AuroraBackground } from "@/components/ui/aurora-background";
import EmojiGenerator from "@/components/EmojiGenerator";
import EmojiGrid from '../components/EmojiGrid';

export default function Home() {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Emoji Generator</h1>
        <EmojiGenerator />
        <EmojiGrid />
      </div>
    </AuroraBackground>
  );
}
