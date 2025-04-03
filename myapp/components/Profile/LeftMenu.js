import Link from "next/link";

import { useSelector } from "react-redux";
const Defaut = () => {
  let { user } = useSelector((state) => state.login);
  let name = "User";
  if (user.name !== ' undefined') {
    name = user.name;
  }
  return (
    <>
      <div className="text-xl font-semibold col-span-12 text-primary  mb-5 mt-5 sm:mt-0">
      <p>  Hi {name}</p>
      </div>

      <Link
        href="/profile/orders"
        className="w-full py-3 border-b float-left hover:pl-1  transform-all"
      >
        Orders
      </Link>
      <Link
        href="/profile"
        className="w-full py-3 border-b float-left hover:pl-1  transform-all"
      >
        Profile
      </Link>
      <Link
        href="/profile/address"
        className="w-full py-3 border-b float-left hover:pl-1  transform-all"
      >
        Addreses
      </Link>
    </>
  );
};

export default Defaut;
