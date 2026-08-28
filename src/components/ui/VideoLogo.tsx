'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface VideoLogoProps {
  className?: string;
  videoSrc?: string;
  fallbackSrc?: string;
  alt?: string;
  priority?: boolean;
  /** Background color of the video container */
  bgColor?: string;
  /** Optional backdrop blur (CSS value e.g. 'blur(12px)') */
  backdropBlur?: string;
}

export function VideoLogo({
  className = 'w-20 h-20',
  videoSrc = '/videos/logo.mp4',
  fallbackSrc = '/logo.png',
  alt = 'NextGen LMS Logo',
  priority = true,
  bgColor = '#151515',
  backdropBlur,
}: VideoLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  const wrapperStyle: React.CSSProperties = {
    background: bgColor,
    ...(backdropBlur ? { backdropFilter: backdropBlur, WebkitBackdropFilter: backdropBlur } : {}),
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={wrapperStyle}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain pointer-events-none"
        >
          <source src="/videos/logo.mp4" type="video/mp4" />
          <source src="/videos/logo.mp4.mp4" type="video/mp4" />
          <source src="/logo.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Fallback static image while video loads or on error */}
      {(!isVideoLoaded || hasError) && (
        <Image
          src={fallbackSrc}
          alt={alt}
          fill
          sizes="160px"
          priority={priority}
          className={`object-contain transition-opacity duration-500 ${
            isVideoLoaded && !hasError ? 'opacity-0 absolute' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
}

export default VideoLogo;
