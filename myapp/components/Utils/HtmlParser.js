import parse from "html-react-parser"; // Import normally since this is not the exported component

const HtmlParser = ({ html }) => {
  return <div>{parse(html)}</div>; // Parse HTML content and return it
};

export default HtmlParser;
