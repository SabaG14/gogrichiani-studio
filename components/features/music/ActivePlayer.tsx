
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Track } from '../../../types';

interface ActivePlayerProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (percentage: number) => void;
}

export const ActivePlayer: React.FC<ActivePlayerProps> = ({ 
  track, 
  isPlaying, 
  progress, 
  onPlayPause, 
  onSeek 
}) => {
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    onSeek(x / width);
  };

  return (
    <div className="mb-8 bg-gray-900/80 p-4 border border-fuchsia-500/30 rounded flex flex-col md:flex-row items-center gap-6">
      {/* Cover Art */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <img src={track.coverArt} alt="Cover" className="w-full h-full object-cover rounded opacity-80" />
        <div className="absolute inset-0 bg-fuchsia-500/20 animate-pulse" />
      </div>
      
      {/* Track Info & Controls */}
      <div className="flex-grow w-full">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="font-orbitron text-xl text-fuchsia-400">{track.title}</h3>
            <p className="text-xs text-cyan-300 font-mono">{track.genre}</p>
          </div>
          <div className="text-right font-mono text-xs text-gray-400">
            LIVE PLAYBACK
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className="h-2 bg-gray-800 rounded-full overflow-hidden w-full relative cursor-pointer" 
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="flex gap-4 items-center">
        <button 
          onClick={onPlayPause}
          className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
      </div>
    </div>
  );
};
