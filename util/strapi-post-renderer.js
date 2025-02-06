
import ImageSlider from "@/components/Blogs/ImageSlider";
import Quote from "@/components/Blogs/Quote";
import Media from "@/components/Blogs/Media";
import VideoEmbed from "@/components/Blogs/VideoEmbed";

export function postRenderer(section, index) {
  switch (section.__component) {

    case "shared.slider":
      return <ImageSlider key={index} data={section} />;
    case "shared.quote": 
      return <Quote key={index} data={section} />;
    case "shared.media":
      return <Media key={index} data={section} />;
    case "shared.video-embed":
      return <VideoEmbed key={index} data={section} />;
    default:
      return null;
  }
}