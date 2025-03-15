import { useSelector } from "react-redux";
import { IMG_URL } from "../../../config";

export function generateMetadata() {
  const { settings } = useSelector(({ settings }) => settings);

  const title = settings?.title || "Default Title";
  const description = settings?.description || "Default Description";
  const keywords = settings?.keywords || "";
  const image = settings?.image || "images/uploads/custom/logo_t.png";
  const author = settings?.company || "Default Company";
  const canonical = settings?.canonical || "";

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      images: [{ url: IMG_URL + image }],
    },
    alternates: {
      canonical,
    },
  };
}

export default function DefaultLayout({ children }) {
  return <>{children}</>;
}