"use client";
import React from "react";
import Video from "next-video";
const VideoPlayer = ({ url, playing }) => {
  return (
    <div className="video-container" >
      <Video
        muted={true}
        src={url}
        loop={true}
        autoPlay={playing}
        playsInline={true}
        className="" // Ensure you have 'video-js' and 'vjs-theme-city' stylesheets linked in your app
        controls={true}
      />
      {/* <ReactPlayer
        url={url}
        muted
        // light is usefull incase of dark mode
        light={false}
        playing={playing}
        // previewTabIndex={index}
        loop={true}
        className="react-player h-full w-full object-contain "
        width="100%"
      />
      <source src={url} type="video/mp4" /> */}
    </div>
  );
};

export default VideoPlayer;
