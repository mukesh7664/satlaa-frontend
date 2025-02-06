import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import { Button, Divider, Input, Alert } from "@mui/material";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { TagsOutlined } from "@ant-design/icons";
import { cartFetch } from "../../../redux/reducers/Cart";
const Coupon = ({ total_price }) => {
  const cart= useSelector((state) => state.cart);
  const [coupon, setCoupon] = useState(cart.coupon);
  const [couponApplied, setCouponApplied] = useState(cart.coupon);
  const { user } = useSelector((state) => state.login);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleCouponSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/coupon/validate`, {
        cartValue: total_price,
        user: user,
        coupon: coupon,
      });

      if (response.data.value) {
        // setDiscountRate(response.data.value);
        dispatch(
          cartFetch({
            ...cart,
            coupon: coupon,
            coupon_type: coupon.type,
            coupon_discount: response.data.value,
          })
        );
        setCouponApplied(true);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    dispatch(cartFetch({ ...cart, coupon: "", coupon_discount: 0 }));
    setCoupon("");
  };

  return (
    <div className="flex flex-wrap justify-around items-start my-2">
      {couponApplied && (
        <>
          <div className="w-full px-4 mt-1">
            <span>Discount:</span>
            <span className="float-right  font-semibold">
              -{" "}
              <Price
                data={Math.ceil((total_price * cart.coupon_discount) / 100)}
              />
            </span>
          </div>
        </>
      )}
      <div className="w-full px-4">
        {!couponApplied ? (
          <div className="flex flex-row mt-2 gap-x-1">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon Code"
            />
            <Button onClick={handleCouponSubmit} className="">
              Apply
            </Button>
          </div>
        ) : (
          <>
            {/* <div className="text-lg mb-4">Your discount: {discountRate}%</div> */}
            <div className=" bg-gray-300 px-4 py-2  rounded inline-block">
              <div className="flex gap-x-2">
                <TagsOutlined />

                <p className="uppercase">{coupon}</p>
                <button className="text-red-600" onClick={removeCoupon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1.2em"
                    className="text-red-600"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="rgb(220 38 38 / var(--tw-text-opacity))"
                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
        {error && <p className="text-red-600 ml-2 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default Coupon;
