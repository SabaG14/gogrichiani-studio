
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioElement, isPlaying }) => {
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(20).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isSetupRef = useRef<boolean>(false);

  useEffect(() => {
    if (!audioElement || isSetupRef.current) return;

    const setupAudioContext = async () => {
      try {
        // Create Audio Context and Analyser
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();

        // Resume audio context if suspended (required by some browsers)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const analyser = audioContext.createAnalyser();

        // Configure analyser for better frequency resolution and responsiveness
        analyser.fftSize = 128; // Better resolution for 20 bars
        analyser.smoothingTimeConstant = 0.75; // More responsive
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Create source from audio element
        const source = audioContext.createMediaElementSource(audioElement);

        // Connect: source → analyser → destination
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Store references
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceNodeRef.current = source;
        dataArrayRef.current = dataArray;
        isSetupRef.current = true;

        console.log('✓ Audio visualizer initialized and synced with audio stream');
      } catch (error) {
        console.error('✗ Error setting up audio visualizer:', error);
      }
    };

    setupAudioContext();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement]);

  useEffect(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const updateVisualization = () => {
      if (!analyserRef.current || !dataArrayRef.current || !isPlaying) {
        if (!isPlaying) {
          // Gradually decrease bars when paused
          setFrequencyData(prev => prev.map(v => v * 0.85));
        }
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
        return;
      }

      // Get real-time frequency data from the audio stream
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Take 20 frequency bins and normalize for visualization
      const bars = Array.from(dataArrayRef.current.slice(0, 20)).map(value => {
        // Normalize to 0-1 range
        const normalized = value / 255;
        // Apply power curve to amplify mid-range frequencies for better visualization
        return Math.pow(normalized, 0.5);
      });

      setFrequencyData(bars);

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-1 h-16 w-full overflow-hidden">
      {frequencyData.map((value, i) => {
        const height = Math.max(value * 60, 10); // Scale to 60px max, 10px min
        return (
          <motion.div
            key={i}
            className="w-1 bg-cyan-400 rounded-t"
            animate={{
              height: height,
              opacity: Math.max(value, 0.5)
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};
