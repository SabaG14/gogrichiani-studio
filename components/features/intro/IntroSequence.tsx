
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Disc } from 'lucide-react';
import { INTRO_AUDIO_URL } from '../../../constants';
import { fetchTracks } from '../../../services/tracksService';
import { Track } from '../../../types';

interface IntroSequenceProps {
  onComplete: (audioElement: HTMLAudioElement) => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'start' | 'playing'>('start');
  const [text, setText] = useState<string>('');
  const [backgroundTrack, setBackgroundTrack] = useState<Track | null>(null);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch background track from Firestore on mount
  useEffect(() => {
    const loadBackgroundTrack = async () => {
      try {
        const tracks = await fetchTracks();
        const bgTrack = tracks.find(t => t.isBackgroundSong === true);
        if (bgTrack) {
          setBackgroundTrack(bgTrack);
        }
      } catch (error) {
        console.error('Error loading background track:', error);
      }
    };
    loadBackgroundTrack();
  }, []);

  const startExperience = () => {
    setStep('playing');

    // Use Firestore track if available, otherwise fallback to constant
    const audioUrl = backgroundTrack?.url || INTRO_AUDIO_URL;
    const startTime = backgroundTrack?.backgroundStartTime ?? 53.5; // Default: 53.5 seconds

    // Start Background Music at low volume
    bgAudioRef.current = new Audio(audioUrl);
    bgAudioRef.current.volume = 0.05; // Start at 5%
    bgAudioRef.current.loop = true; // Loop the background music

    // Set to start from specified time
    bgAudioRef.current.addEventListener('loadedmetadata', () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.currentTime = startTime;
      }
    });

    bgAudioRef.current.play().catch(e => console.error("BG Audio play failed", e));

    // Play local voice file "Are you ready listener?"
    voiceAudioRef.current = new Audio('/areyouready.mp3');
    voiceAudioRef.current.volume = 1.0;
    voiceAudioRef.current.play().catch(e => console.error("Voice play failed", e));

    // Visual Sequence - show text when voice plays
    setTimeout(() => setText("ARE YOU READY LISTENER?"), 500);
    setTimeout(() => setText(""), 3500);

    // When voice finishes, fade background music up to 90%
    voiceAudioRef.current.onended = () => {
      let vol = 0.05;
      const fadeUpInterval = setInterval(() => {
        if (bgAudioRef.current && vol < 0.9) {
          vol += 0.05;
          bgAudioRef.current.volume = Math.min(vol, 0.9);
        } else {
          clearInterval(fadeUpInterval);
        }
      }, 100);
    };

    // Final Transition after 5 seconds (smooth, no sound effect)
    setTimeout(() => {
      // Pass the audio element to the parent (don't stop it!)
      if (bgAudioRef.current) {
        onComplete(bgAudioRef.current);
      }
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}>
      </div>

      <AnimatePresence mode='wait'>
        {step === 'start' && (
          <motion.button
            key="start-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}
            onClick={startExperience}
            className="relative z-10 group bg-black border border-cyan-400 cursor-pointer px-12 py-6 rounded-sm overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
            <div className="flex items-center gap-4 relative z-10">
              <Disc className="w-6 h-6 text-cyan-400 animate-spin-slow" />
              <span className="font-orbitron text-xl tracking-[0.2em] text-white group-hover:text-cyan-50 transition-colors">INITIALIZE SYSTEM</span>
              <Play className="w-5 h-5 text-cyan-400 fill-current" />
            </div>
          </motion.button>
        )}

        {step === 'playing' && (
          <motion.div
            key="sequence"
            className="relative z-10 text-center flex items-center justify-center h-full w-full"
          >
            <AnimatePresence>
              {text && (
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)', transition: { duration: 1.5 } }}
                  className="font-orbitron text-3xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-widest neon-text-cyan drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] px-4"
                >
                  {text}
                </motion.h2>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
