// FullScreenLoader.js
import { BeatLoader } from "react-spinners";

const FullScreenLoader = ({ loading }) => {
  return (
    loading && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          background: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <BeatLoader color="#B76E79" loading={true} size={17} />
      </div>
    )
  );
};
export default FullScreenLoader;
