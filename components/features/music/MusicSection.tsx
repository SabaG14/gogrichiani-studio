
import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../../../types';
import { ActivePlayer } from './ActivePlayer';
import { TrackList } from './TrackList';
import { useTracks } from '../../../hooks/useTracks';

interface MusicSectionProps {
  sharedAudioElement?: HTMLAudioElement | null;
}

export const MusicSection: React.FC<MusicSectionProps> = ({ sharedAudioElement }) => {
  const { tracks, loading } = useTracks();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set the first track when tracks are loaded
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
    }
  }, [tracks, currentTrack]);

  // Use shared audio from intro if available
  useEffect(() => {
    if (sharedAudioElement) {
      audioRef.current = sharedAudioElement;
      // Attach event listeners to shared audio
      sharedAudioElement.addEventListener('timeupdate', handleTimeUpdate);
      sharedAudioElement.addEventListener('ended', () => setIsPlaying(false));
      // Audio is already playing vanilla.mp3 from intro
      setIsPlaying(true);
      setProgress(0);

      return () => {
        sharedAudioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [sharedAudioElement]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleTrackSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);

      // If using shared audio, update its src
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        audioRef.current.play().catch(e => console.log("Play prevented:", e));
      }
    }
  };

  const handleSeek = (percentage: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-black via-cyan-950/10 to-black relative">
        <div className="container mx-auto px-6">
          <div className="w-full max-w-4xl mx-auto text-center">
            <div className="animate-pulse text-cyan-400 font-orbitron">Loading tracks...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-black via-cyan-950/10 to-black relative">
      <div className="container mx-auto px-6">
        <div className="w-full max-w-4xl mx-auto bg-black/40 border border-cyan-900/50 backdrop-blur-sm p-6 rounded-lg relative overflow-hidden group">

          {/* Decoration: Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

          <h2 className="font-orbitron text-3xl text-white mb-8 text-center tracking-widest neon-text-cyan">
            Work
          </h2>

          {currentTrack && (
            <ActivePlayer
              track={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onSeek={handleSeek}
            />
          )}

          <TrackList
            tracks={tracks}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
          />

          {/* Only create new audio element if not using shared one from intro */}
          {currentTrack && !sharedAudioElement && (
            <audio
              ref={audioRef}
              src={currentTrack.url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
};
