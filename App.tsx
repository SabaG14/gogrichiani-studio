
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

// Components
import { Scanlines } from './components/ui/Scanlines';
import { Background } from './components/ui/Background';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ServicesSection } from './components/features/services/ServicesSection';
import { MusicSection } from './components/features/music/MusicSection';
import { IntroSequence } from './components/features/intro/IntroSequence';

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [sharedAudio, setSharedAudio] = useState<HTMLAudioElement | null>(null);
  const [skeletonAnimation, setSkeletonAnimation] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [skeletonOnLeft, setSkeletonOnLeft] = useState(false);
  const [skeletonAppearanceCount, setSkeletonAppearanceCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load dancing skeleton animation
  useEffect(() => {
    fetch('/dancingSkeleton.json')
      .then(response => response.json())
      .then(data => setSkeletonAnimation(data))
      .catch(error => console.error('Error loading skeleton animation:', error));
  }, []);

  // Show skeleton after portfolio loads, limit to 2 appearances, hide on mobile
  useEffect(() => {
    if (introComplete && !isMobile) {
      // Wait for portfolio to fully load (2.5s transition + 0.5s buffer)
      setTimeout(() => {
        setShowSkeleton(true);
        setSkeletonAppearanceCount(1);

        // Switch sides, limit to 2 total appearances
        const switchInterval = setInterval(() => {
          setSkeletonAppearanceCount(prev => {
            if (prev >= 2) {
              // After 2 appearances, hide permanently
              setShowSkeleton(false);
              clearInterval(switchInterval);
              return prev;
            }

            setShowSkeleton(false);
            setTimeout(() => {
              setSkeletonOnLeft(current => !current); // Toggle between left and right
              setShowSkeleton(true);
            }, 1000); // 1 second delay during transition

            return prev + 1;
          });
        }, 10000); // Switch every 10 seconds

        // Cleanup interval on unmount
        return () => clearInterval(switchInterval);
      }, 3000); // 3 seconds after intro completes
    }
  }, [introComplete, isMobile]);

  const handleIntroComplete = (audioElement: HTMLAudioElement) => {
    setSharedAudio(audioElement);
    setIntroComplete(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <Scanlines />

      {!introComplete && <IntroSequence onComplete={handleIntroComplete} />}

      {introComplete && (
        <>
          <motion.main
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="relative z-0"
          >
            <Background />
            <Header />
            <ServicesSection />
            <MusicSection sharedAudioElement={sharedAudio} />
            <Footer />
          </motion.main>

          {/* Dancing Skeleton - Switches between bottom corners, limited to 2 appearances, hidden on mobile */}
          {skeletonAnimation && showSkeleton && !isMobile && (
            <motion.div
              key={skeletonOnLeft ? 'left' : 'right'}
              initial={{
                x: skeletonOnLeft ? -200 : 200,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: skeletonOnLeft ? -200 : 200,
                opacity: 0
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
              className={`fixed bottom-4 ${skeletonOnLeft ? 'left-4' : 'right-4'} w-24 h-24 z-50`}
            >
              <Lottie
                animationData={skeletonAnimation}
                loop={true}
                autoplay={true}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
