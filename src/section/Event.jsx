import React from 'react'
import './Event.css'
import { event } from '../export.js';

const Event = () => {
  // Duplicate the photos array for seamless infinite sliding
  const duplicatedPhotos = [...event, ...event, ...event, ...event];
  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>
      <div className="slider-container">
        <div className="photo-slider">
          {duplicatedPhotos.map((image, index) => (
            <div key={index} className="photo-item">
              <div className="date-overlay">{image.date}</div>
              <img src={image.src} alt={`Event image ${index + 1}`} />
              <div className="about-overlay">{image.about}</div>
            </div>
          ))}
        </div>
    </div>
    </div>
  );
};
export default Event;
