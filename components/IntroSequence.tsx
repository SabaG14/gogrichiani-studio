import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Disc, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { INTRO_AUDIO_URL, TRANSITION_SFX } from '../constants';

interface IntroSequenceProps {
  onComplete: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'start' | 'playing'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>('');
  
  // Audio refs
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const sfxAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startExperience = async () => {
    setIsLoading(true);
    
    try {
      // 1. Initialize Audio Context (must be done on user gesture)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext({ sampleRate: 24000 });
      audioCtxRef.current = ctx;

      // 2. Generate AI Voice using Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: {
          parts: [{ text: `Say in a slow, seductive, whispering female voice: "Are you ready, listener?"` }]
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Failed to generate AI voice");

      // 3. Decode Raw PCM Audio
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);

      // 4. Start Playback Sequence
      setStep('playing');
      setIsLoading(false);

      // A. Start Background Music (Fade In)
      bgAudioRef.current = new Audio(INTRO_AUDIO_URL);
      bgAudioRef.current.volume = 0.0;
      bgAudioRef.current.play().catch(e => console.error("BG Audio play failed", e));
      
      let vol = 0;
      const fadeInterval = setInterval(() => {
        if (bgAudioRef.current && vol < 0.6) {
          vol += 0.05;
          bgAudioRef.current.volume = vol;
        } else {
          clearInterval(fadeInterval);
        }
      }, 200);

      // B. Play AI Voice (Delayed slightly to let music start)
      const voiceSource = ctx.createBufferSource();
      voiceSource.buffer = audioBuffer;
      voiceSource.connect(ctx.destination);
      voiceSource.start(ctx.currentTime + 1.0);

      // C. Sync Visuals
      setTimeout(() => {
        setText("ARE YOU READY LISTENER?");
      }, 1000);

      // D. Transition (End)
      // Start fading out text before the scene switch for smoothness
      setTimeout(() => {
        setText(""); 
      }, 4000);

      setTimeout(() => {
        // Play SFX
        sfxAudioRef.current = new Audio(TRANSITION_SFX);
        sfxAudioRef.current.volume = 1.0;
        sfxAudioRef.current.play();
        
        // Stop intro music (Fade out quickly)
        if (bgAudioRef.current) {
          const fadeOut = setInterval(() => {
             if(bgAudioRef.current && bgAudioRef.current.volume > 0.05) {
                 bgAudioRef.current.volume -= 0.1;
             } else {
                 clearInterval(fadeOut);
                 bgAudioRef.current?.pause();
             }
          }, 100);
        }
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
        }
        
        onComplete();
      }, 5000); 

    } catch (error) {
      console.error("Error in intro sequence:", error);
      setIsLoading(false);
      // Fallback
      setStep('playing');
      bgAudioRef.current = new Audio(INTRO_AUDIO_URL);
      bgAudioRef.current.play();
      
      setTimeout(() => setText("ARE YOU READY LISTENER?"), 1000);
      setTimeout(() => setText(""), 3500);
      setTimeout(() => {
         sfxAudioRef.current = new Audio(TRANSITION_SFX);
         sfxAudioRef.current.play();
         onComplete();
      }, 4500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Grid Background */}
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
            whileHover={!isLoading ? { scale: 1.05, boxShadow: "0 0 30px rgba(0,229,255,0.4)" } : {}}
            onClick={startExperience}
            disabled={isLoading}
            className={`relative z-10 group bg-black border ${isLoading ? 'border-fuchsia-500 cursor-wait' : 'border-cyan-400 cursor-pointer'} px-12 py-6 rounded-sm overflow-hidden transition-all`}
          >
            <div className={`absolute inset-0 ${isLoading ? 'bg-fuchsia-900/20' : 'bg-cyan-400/10 translate-y-full group-hover:translate-y-0'} transition-transform duration-300 ease-out`} />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
            <div className="flex items-center gap-4 relative z-10">
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 text-fuchsia-500 animate-spin" />
                  <span className="font-orbitron text-xl tracking-[0.2em] text-fuchsia-500 animate-pulse">ACCESSING NEURAL NET...</span>
                </>
              ) : (
                <>
                  <Disc className="w-6 h-6 text-cyan-400 animate-spin-slow" />
                  <span className="font-orbitron text-xl tracking-[0.2em] text-white group-hover:text-cyan-50 transition-colors">INITIALIZE SYSTEM</span>
                  <Play className="w-5 h-5 text-cyan-400 fill-current" />
                </>
              )}
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

// --- Audio Helper Functions ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}