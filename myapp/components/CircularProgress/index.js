import Image from "next/image";

const CircularProgress = ({ className }) => (
   <div className={`loader ${className} relative`}>
      <Image  src="/images/loader.svg" alt="loader" style={{ height: 60 }} height={60} width={60}/>
   </div>
);
export default CircularProgress;
CircularProgress.defaultProps = {
   className: "",
};
