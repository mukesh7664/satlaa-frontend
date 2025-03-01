import Head from "next/head";
import { useSelector } from "react-redux";
import { IMG_URL } from "../../../config";

const Default = ({
  title = "",
  description = "",
  keywords = "",
  image = "",
  author = "",
  canonical=""

}) => {
  const { settings } = useSelector(({ settings }) => settings);

  if (title == "") {
    title = settings.title;
  }
  if (description == "") {
    description = settings.description;
  }
  if (keywords == "") {
    keywords = settings.keywords;
  }
  if (image == "") {
    image = 'images/uploads/custom/logo_t.png';
  }
  if (author == "") {
    author = settings.company;
  }


  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="author" content={author} />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1.0, width=device-width, shrink-to-fit=no, user-scalable=yes, maximum-scale=5.0, viewport-fit=cover"/>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={IMG_URL + image} />
    </Head>
  );
};

export default Default;
