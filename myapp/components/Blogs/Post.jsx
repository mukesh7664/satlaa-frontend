import { formatDate, getStrapiMedia } from "@/util/strapi-api-helpers";
import { postRenderer } from "@/util/strapi-post-renderer";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
export default function Post({ data }) {
  const { title, description, publishedAt, cover, authorsBio } =
    data.attributes;
  const author = authorsBio.data?.attributes;
  const imageUrl = getStrapiMedia(cover.data?.attributes.url);

  return (
    <div className="flex flex-col justify-center items-center ">
      <article className="w-full mt-10 space-y-8 dark:bg-black dark:text-gray-50 px-5 py-2 mx-auto flex flex-col justify-center items-center prose lg:prose-xl">
        {imageUrl && (
          <Image
            src={imageUrl}
            quality={100}
            alt="article cover image"
            width={400}
            height={400}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}
        <div className="space-y-6">
          <h1 className="font-black sm:text-5xl text-4xl mb-4 text-gray-900 text-center ">
            {title}
          </h1>
          <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center dark:text-gray-400">
            <div className="flex items-center md:space-x-2">
              <p className="text-md dark:text-violet-400">
                <a href={author?.linkedin ? author.linkedin : "/"} target="_blank" rel="noopener">{author && author.name} </a>•{" "}
                {formatDate(publishedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="dark:text-gray-100">
          <p>{description}</p>
          {data.attributes.ckeditor && parse(data.attributes.ckeditor)}
          {data.attributes.blocks.map((section, index) =>
            postRenderer(section, index)
          )}
        </div>
      </article>
      <Link
        href="/blogs"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:text-white"
      >
        Back To All Articles
      </Link>
    </div>
  );
}
