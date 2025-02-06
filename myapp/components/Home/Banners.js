import Image from "next/image";
import { IMG_URL } from "../../../../config";
import Link from "next/link";
const Default = ({ state }) => {
  return (
    <div className="bg-gray-50 flex flex-col justify-center items-center w-full">
      <p className="text-3xl font-bold font-Montserrat mt-8">{state.title}</p>
      <Link href={state.link} className="mt-2">
        {state.image_mobile && (
          <Image
            src={
              state.image_mobile
                ? `${IMG_URL + state.image_mobile}`
                : "/images/nofoto.jpg"
            }
            height="500"
            width="1680"
            quality={100}
            className="block md:hidden"
            priority="true"
            style={{ width: "100%" }}
            alt={state.title? state.title  + ".": "Default Title"}
          
          />
        )}
        <Image
           src={
            state.image
              ? `${IMG_URL + state.image}`
              : "/images/nofoto.jpg"
          }
          className="md:block hidden"
          height="500"
          width="1680"
          quality={100}
          style={{ width: "100%" }}
          alt={state.title? state.title  + ".": "Default Title"}
          
        />
      </Link>
    </div>
  );
};

export default Default;
