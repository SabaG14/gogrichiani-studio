import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

export const MusicPortfolio: React.FC = () => {
  // Initialize with the first track and set playing to true for auto-start
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked until user interaction (or resumed from intro):", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black/40 border border-cyan-900/50 backdrop-blur-sm p-6 rounded-lg relative overflow-hidden group">
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

      <h2 className="font-orbitron text-3xl text-white mb-8 text-center tracking-widest neon-text-cyan">
        Portfolio
      </h2>

      {/* Active Player */}
      {currentTrack && (
        <div className="mb-8 bg-gray-900/80 p-4 border border-fuchsia-500/30 rounded flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <img src={currentTrack.coverArt} alt="Cover" className="w-full h-full object-cover rounded opacity-80" />
            <div className="absolute inset-0 bg-fuchsia-500/20 animate-pulse" />
          </div>

          <div className="flex-grow w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="font-orbitron text-xl text-fuchsia-400">{currentTrack.title}</h3>
                <p className="text-xs text-cyan-300 font-mono">{currentTrack.genre}</p>
              </div>
              <div className="text-right font-mono text-xs text-gray-400">
                LIVE PLAYBACK
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden w-full relative cursor-pointer" onClick={(e) => {
              if (!audioRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const width = rect.width;
              const percentage = x / width;
              audioRef.current.currentTime = percentage * audioRef.current.duration;
            }}>
              <div
                className="h-full bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}

      {/* Track List */}
      <div className="space-y-3">
        {TRACKS.map((track) => (
          <div
            key={track.id}
            onClick={() => handlePlay(track)}
            className={`
              flex items-center justify-between p-4 cursor-pointer transition-all duration-300 border-b border-white/5
              hover:bg-white/5 hover:pl-6
              ${currentTrack?.id === track.id ? 'bg-white/5 border-l-4 border-l-cyan-400' : 'border-l-4 border-l-transparent'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 flex items-center justify-center ${currentTrack?.id === track.id ? 'text-cyan-400' : 'text-gray-600'}`}>
                {currentTrack?.id === track.id && isPlaying ? (
                  <div className="flex gap-1 h-4 items-end">
                    <div className="w-1 bg-current animate-[bounce_1s_infinite]" />
                    <div className="w-1 bg-current animate-[bounce_1.2s_infinite]" />
                    <div className="w-1 bg-current animate-[bounce_0.8s_infinite]" />
                  </div>
                ) : (
                  <span className="font-mono text-sm">0{track.id}</span>
                )}
              </div>
              <div>
                <h4 className={`font-bold font-rajdhani text-lg ${currentTrack?.id === track.id ? 'text-cyan-400' : 'text-gray-300'}`}>
                  {track.title}
                </h4>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{track.genre}</p>
              </div>
            </div>
            <div className="text-sm font-mono text-gray-500">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};