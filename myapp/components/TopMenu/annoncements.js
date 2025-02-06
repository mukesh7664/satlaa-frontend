import React, { useState, useEffect } from "react";
const AnnouncementHeader = ({ announcements }) => {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!announcements || announcements.length === 0) {
      return;
    }

    // Function to handle setting and clearing timers
    const rotateAnnouncement = () => {
      setIsAnimating(true);
      setCurrentAnnouncementIndex(
        (prevIndex) => (prevIndex + 1) % announcements.length
      );

      setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Stops animating after 2 seconds
    };

    // Immediate call for the first announcement
    rotateAnnouncement();

    // Set interval for subsequent announcements
    const intervalId = setInterval(rotateAnnouncement, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [announcements]);

  if (!announcements || announcements.length === 0) {
    return (
      <div className="py-1 bg-accent ">
        {" "}
        <p className={`text-base text-black w-auto text-center `}>
        Use SATLAA10 to get 10% off on all order.
        </p>
      </div>
    );
  }

  return (
    <div className="py-1 bg-accent">
      {announcements.map((announcement, index) => (
        <p
          key={index}
          className={`text-base text-black w-auto text-center ${
            isAnimating && index === currentAnnouncementIndex
              ? "animate-fade-in"
              : ""
          }`}
          style={{
            display: index === currentAnnouncementIndex ? "block" : "none",
          }}
        >
          {announcement.value}
        </p>
      ))}
    </div>
  );
};

export default AnnouncementHeader;
