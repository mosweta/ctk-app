import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EdpuzzleVideoPlayer from './videoplayer'; // Adjust path as needed
import './Livestream.css';
import { FiYoutube, FiCalendar, FiEye } from 'react-icons/fi';


const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Livestream = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);


  // Just 4 videos for now
  const pastVideos = [
    {
      id: 1,
      title: "Blessing of the groto on Easter Monday",
      date: "April 21st 2025",
      views: "5.5K views",
      duration: "4:22:34",
      videoUrl: "https://www.youtube.com/watch?v=Lch5tUvXgaE",
      preacher: "Main Celebrant: H.E Archbishop Phillip Anyolo",
      thumbnail: "https://img.youtube.com/vi/Lch5tUvXgaE/mqdefault.jpg"
    },
    
    {
      id: 2,
      title: "Family Day and Confirmation Mass 2024",
      date: "November 24, 2024",
      views: "4.8k views",
      duration: "4:11:42",
      videoUrl: "https://www.youtube.com/embed/XJcYW2pLTq8?si=ewzjsoy6RiGRCiMN",
      preacher: "Main Celebrant: H.E. Auxiliary Bishop David Kamau",
      thumbnail: "https://img.youtube.com/vi/XJcYW2pLTq8/mqdefault.jpg"
    },
    {
      id: 3,
      title: "SECAM Bishops Mass at Christ the King",
      date: "January 24th 2024",
      views: "1k views",
      duration: "2:35:59",
      videoUrl: "https://youtu.be/G2pp-PfKIhk?si=iazaXHXgyay6ZYxF",
      preacher: "Main Celebrant: H.E Archbishop Phillip Anyolo",
      thumbnail: "https://img.youtube.com/vi/G2pp-PfKIhk/mqdefault.jpg"
    },
    {
      id: 4,
      title: "Family Day Mass 2023",
      date: "November 26th, 2023",
      views: "1.3K views",
      duration: "4:29:07",
      videoUrl: "https://youtu.be/EO2AN6IxsrE?si=O2jh-VyrMZM6OOS3",
      preacher: "Main Celebrant: H.E Bishop George Muthaka",
      thumbnail: "https://img.youtube.com/vi/EO2AN6IxsrE/mqdefault.jpg"
    }
  ];

  // Handle video completion
  const handleVideoEnd = () => {
    console.log('Video completed');
    // You could auto-play next video or show a message
  };

  // Handle progress updates
  const handleProgressUpdate = (lessonId, progress) => {
    console.log(`Video ${lessonId} progress: ${progress}%`);
  };

  // Navigate to next video
  const handleNextVideo = () => {
    if (currentVideoIndex < pastVideos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setSelectedVideo(pastVideos[nextIndex]);
    }
  };

  // Navigate to previous video
  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedVideo(pastVideos[prevIndex]);
    }
  };

  // Select a video to play
  const handleVideoSelect = (video, index) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
  };

  return (
    <motion.section
      className="livestream-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      <div className="livestream-container">
        {/* Header - Matching Mission section */}
        <motion.div className="section-header" variants={slideUpVariants}>
          
          <h2 className="section-title">Livestreams</h2>
          <p className="section-subtitle">
            Catch up on recent masses and events you may have missed
          </p>
        </motion.div>

        {/* Video Player (shown when a video is selected) */}
        {selectedVideo ? (
          <motion.div className="featured-video" variants={slideUpVariants}>
            <button className="back-button" onClick={() => window.location.reload()}>
              ← Back to all videos
            </button>
            
            <div className="video-player-container">
              <EdpuzzleVideoPlayer
                videoUrl={selectedVideo.videoUrl}
                lessonTitle={selectedVideo.title}
                onNextLesson={handleNextVideo}
                onPreviousLesson={handlePreviousVideo}
                hasNextLesson={currentVideoIndex < pastVideos.length - 1}
                hasPreviousLesson={currentVideoIndex > 0}
                onVideoEnd={handleVideoEnd}
                onProgressUpdate={handleProgressUpdate}
                lessonId={selectedVideo.id}
                autoComplete={false}
              />
              
              {/* Video Info */}
              <div className="video-info">
                <h3>{selectedVideo.title}</h3>
                <div className="video-meta">
                  <span><FiCalendar /> {selectedVideo.date}</span>
                  <span><FiEye /> {selectedVideo.views}</span>
                </div>
                <p className="video-preacher">Celebrant: {selectedVideo.preacher}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Video Grid - Just 4 videos */
          <motion.div className="video-grid" variants={slideUpVariants}>
            {pastVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="video-card"
                variants={slideUpVariants}
                whileHover={{ y: -5 }}
                onClick={() => handleVideoSelect(video, index)}
              >
                <div className="video-thumbnail">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                  />
                  <span className="video-duration">{video.duration}</span>
                  <div className="play-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="video-card-info">
                  <h4>{video.title}</h4>
                  <p className="video-preacher">{video.preacher}</p>
                  <div className="video-card-meta">
                    <span><FiCalendar /> {video.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        
      </div>
    </motion.section>
  );
};

export default Livestream;