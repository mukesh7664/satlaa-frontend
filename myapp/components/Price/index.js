
const Default = ({ data = 0 }) => {
  return <>₹{data.toLocaleString(undefined, { minimumFractionDigits: 0 })}</>;
};

export default Default;
