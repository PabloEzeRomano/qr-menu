'use client';

import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
// import {
//   createBlobAnimations,
//   createParticleAnimations,
// } from './animationConfig';

// Register the MotionPath plugin
// gsap.registerPlugin(MotionPathPlugin);

export default function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !bgRef.current) {
      console.error('AnimatedBackground: Window or ref not available');
      return;
    }

    try {
      // const q = gsap.utils.selector(bgRef);

      // Create animations using the configuration
      // const blobTimelines = createBlobAnimations(q);
      // createParticleAnimations(q);

      return () => {
        // Cleanup all timelines
        // Object.values(blobTimelines).forEach((timeline) => timeline.kill());
      };
    } catch (error) {
      // console.error('AnimatedBackground: GSAP error:', error);
    }
  }, []);

  return (
    <div
      ref={bgRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
    >
      {/* Mesmerizing animated blobs with organic shapes - High contrast colors against black background */}
      <div className="blob-1 absolute -top-20 -left-20 h-96 w-96 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-indigo-500/60 blur-2xl" />
      <div className="blob-2 absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-[30%_60%_70%_40%/50%_60%_30%_60%] bg-gradient-to-br from-fuchsia-300/80 via-pink-400/70 to-rose-500/60 blur-2xl" />
      <div className="blob-3 absolute bottom-0 right-1/6 h-80 w-80 rounded-[70%_30%_40%_60%/40%_70%_60%_30%] bg-gradient-to-br from-emerald-300/80 via-green-400/70 to-teal-500/60 blur-2xl" />

      {/* Floating particles for extra mesmerization - Bright contrasting colors against black */}
      <div className="particle particle-1 absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-cyan-200/90" />
      <div className="particle particle-2 absolute top-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-fuchsia-200/90" />
      <div className="particle particle-3 absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-emerald-200/90" />
      <div className="particle particle-4 absolute bottom-1/3 right-1/3 h-2.5 w-2.5 rounded-full bg-blue-200/90" />
      <div className="particle particle-5 absolute bottom-1/4 left-1/5 h-1.5 w-1.5 rounded-full bg-pink-200/90" />
      <div className="particle particle-6 absolute top-1/6 left-1/6 h-1.5 w-1.5 rounded-full bg-yellow-200/90" />
      <div className="particle particle-7 absolute top-2/3 right-1/6 h-2.5 w-2.5 rounded-full bg-orange-200/90" />
      <div className="particle particle-8 absolute top-1/2 left-2/3 h-1 w-1 rounded-full bg-red-200/90" />
      <div className="particle particle-9 absolute bottom-1/6 left-1/2 h-1.5 w-1.5 rounded-full bg-teal-200/90" />
      <div className="particle particle-10 absolute top-1/3 left-1/5 h-2 w-2 rounded-full bg-indigo-200/90" />
      <div className="particle particle-11 absolute bottom-1/4 right-1/5 h-1.5 w-1.5 rounded-full bg-violet-200/90" />
      <div className="particle particle-12 absolute top-3/4 left-3/4 h-1 w-1 rounded-full bg-lime-200/90" />
      <div className="particle particle-13 absolute bottom-1/3 left-1/3 h-2 w-2 rounded-full bg-amber-200/90" />
      <div className="particle particle-14 absolute top-1/5 right-1/3 h-1.5 w-1.5 rounded-full bg-sky-200/90" />
      <div className="particle particle-15 absolute bottom-1/6 right-2/3 h-1 w-1 rounded-full bg-rose-200/90" />
      <div className="particle particle-16 absolute top-2/3 left-1/4 h-2.5 w-2.5 rounded-full bg-purple-200/90" />
      <div className="particle particle-17 absolute bottom-1/5 left-2/3 h-1.5 w-1.5 rounded-full bg-green-200/90" />
      <div className="particle particle-18 absolute top-1/4 right-1/5 h-1 w-1 rounded-full bg-cyan-300/90" />
      <div className="particle particle-19 absolute bottom-2/3 right-1/4 h-2 w-2 rounded-full bg-fuchsia-300/90" />
      <div className="particle particle-20 absolute top-1/2 right-1/2 h-1.5 w-1.5 rounded-full bg-emerald-300/90" />

      {/* Subtle glow orbs - Bright accent colors against black background */}
      <div
        className="absolute top-1/6 left-1/6 h-16 w-16 rounded-full bg-cyan-100/40 blur-md animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div
        className="absolute bottom-1/6 right-1/6 h-12 w-12 rounded-full bg-fuchsia-100/50 blur-md animate-pulse"
        style={{ animationDuration: '8s', animationDelay: '2s' }}
      />
    </div>
  );
}
