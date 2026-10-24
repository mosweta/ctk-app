/* eslint-disable no-unused-vars, no-useless-escape */
import { useEffect, useRef, useState, useCallback } from 'react';
import YouTube from 'react-youtube';
import {
  SkipForward,
  SkipBack,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

const EdpuzzleVideoPlayer = ({ 
  videoUrl, 
  onNextLesson,
  onPreviousLesson,
  hasNextLesson,
  hasPreviousLesson,
  lessonTitle = "Current Lesson",
  questions = [],
  onQuestionAnswered,
  lessonId,
  onProgressUpdate,
  markLessonComplete,
  isLessonCompleted,
  autoComplete = false,
  onVideoEnd
}) => {
  // Refs
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  // Function refs to prevent re-renders
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const markLessonCompleteRef = useRef(markLessonComplete);
  const onVideoEndRef = useRef(onVideoEnd);
  
  // Completion tracking refs
  const hasEndedRef = useRef(false);
  const hasAutoCompletedRef = useRef(false);
  
  // State
  const [duration, setDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Update function refs when props change
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
    markLessonCompleteRef.current = markLessonComplete;
    onVideoEndRef.current = onVideoEnd;
  }, [onProgressUpdate, markLessonComplete, onVideoEnd]);
  
  // Reset completion flags when video changes
  useEffect(() => {
    hasEndedRef.current = false;
    hasAutoCompletedRef.current = false;
  }, [videoUrl]);

  // Extract YouTube video ID
  const getVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);

  // YouTube player options - ENABLED controls for native YouTube experience
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1, // Enable YouTube controls
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      fs: 1, // Enable fullscreen
      disablekb: 0,
      iv_load_policy: 3, // Hide annotations
      cc_load_policy: 0, // Hide captions by default
      showinfo: 0 // Hide video info
    },
  };

  // YouTube event handlers
  const onReady = useCallback((event) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  }, []);

  const onStateChange = useCallback((event) => {
    const playerState = event.data;
    
    // Handle video end
    if (playerState === 0 && !hasEndedRef.current) {
      hasEndedRef.current = true;
      hasAutoCompletedRef.current = true;
      console.log('🎬 Video playback ended');
      
      setTimeout(() => {
        onVideoEndRef.current?.();
        
        if (onProgressUpdateRef.current && lessonId) {
          onProgressUpdateRef.current(lessonId, 100);
        }
        
        if (autoComplete && markLessonCompleteRef.current && !isLessonCompleted) {
          console.log('🚀 Auto-completing from video end...');
          markLessonCompleteRef.current();
        }
      }, 100);
    }
    
    // Update duration when video starts
    if (playerState === 1 && playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  }, [lessonId, autoComplete, isLessonCompleted]);

  const onError = useCallback((error) => {
    console.error('YouTube Player Error:', error);
  }, []);

  // Progress tracking - only for completion purposes
  useEffect(() => {
    // Don't track progress if video is completed or auto-complete disabled
    if (!playerRef.current || !lessonId || !autoComplete || isLessonCompleted) {
      return;
    }

    const updateProgress = () => {
      if (!playerRef.current || !playerRef.current.getCurrentTime) return;
      
      try {
        const currentTime = playerRef.current.getCurrentTime();
        const currentDuration = playerRef.current.getDuration();
        
        if (currentDuration > 0) {
          const progress = (currentTime / currentDuration) * 100;
          
          // Report progress to parent
          if (onProgressUpdateRef.current && lessonId) {
            onProgressUpdateRef.current(lessonId, progress);
          }
          
          // Auto-complete at 99%
          if (progress >= 99 && 
              !hasAutoCompletedRef.current) {
            
            console.log(`🎯 Video at ${Math.round(progress)}%, auto-completing...`);
            hasAutoCompletedRef.current = true;
            markLessonCompleteRef.current();
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };

    // Start progress tracking
    progressIntervalRef.current = setInterval(updateProgress, 1000);
    updateProgress();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [lessonId, autoComplete, isLessonCompleted]);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds) || seconds === undefined) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Video not available
  if (!videoId) {
    return (
      <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center rounded-xl p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-white text-lg mb-2">Video Not Available</p>
        <p className="text-gray-400 text-sm text-center">
          The YouTube URL is invalid.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden"
    >
      {/* YouTube Player - Full native controls */}
      <div className="aspect-video">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>

      {/* Lesson Navigation Buttons - Only shown at the edges */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        {hasPreviousLesson && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreviousLesson?.();
            }}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full 
                       hover:bg-red-600 transition-colors backdrop-blur-sm
                       hover:scale-110 active:scale-95"
            title="Previous video"
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>
        )}
      </div>

      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        {hasNextLesson && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNextLesson?.();
            }}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full 
                       hover:bg-red-600 transition-colors backdrop-blur-sm
                       hover:scale-110 active:scale-95"
            title="Next video"
          >
            <ChevronRight size={isMobile ? 20 : 24} />
          </button>
        )}
      </div>

      {/* Skip buttons - Small, subtle, at the bottom */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        <button
          onClick={() => {
            if (playerRef.current) {
              const currentTime = playerRef.current.getCurrentTime();
              playerRef.current.seekTo(Math.max(0, currentTime - 10));
            }
          }}
          className="p-1.5 bg-black bg-opacity-40 text-white rounded-lg 
                     hover:bg-red-600 transition-colors backdrop-blur-sm
                     text-xs flex items-center gap-1"
          title="Rewind 10 seconds"
        >
          <SkipBack size={16} />
          <span className="hidden sm:inline">10s</span>
        </button>
        
        <button
          onClick={() => {
            if (playerRef.current) {
              const currentTime = playerRef.current.getCurrentTime();
              const duration = playerRef.current.getDuration();
              playerRef.current.seekTo(Math.min(duration, currentTime + 10));
            }
          }}
          className="p-1.5 bg-black bg-opacity-40 text-white rounded-lg 
                     hover:bg-red-600 transition-colors backdrop-blur-sm
                     text-xs flex items-center gap-1"
          title="Forward 10 seconds"
        >
          <SkipForward size={16} />
          <span className="hidden sm:inline">10s</span>
        </button>
      </div>

      {/* Add minimal styles for better mobile experience */}
      <style jsx>{`
        /* Ensure YouTube iframe is interactive */
        .aspect-video iframe {
          pointer-events: auto !important;
        }
        
        /* Hide YouTube branding slightly (but keep controls) */
        .aspect-video iframe {
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen";
        }
      `}</style>
    </div>
  );
};

EdpuzzleVideoPlayer.defaultProps = {
  onNextLesson: () => {},
  onPreviousLesson: () => {},
  hasNextLesson: false,
  hasPreviousLesson: false,
  lessonTitle: "Current Video",
  questions: [],
  onQuestionAnswered: () => {},
  lessonId: null,
  onProgressUpdate: () => {},
  markLessonComplete: () => {},
  isLessonCompleted: false,
  autoComplete: false,
  onVideoEnd: () => {}
};

export default EdpuzzleVideoPlayer;