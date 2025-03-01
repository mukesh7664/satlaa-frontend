import parse from "html-react-parser";

const HtmlParser = ({ html }) => {
  return <>{parse(html)}</>; // Wrap the parsed content in a fragment
};

export default HtmlParser;
