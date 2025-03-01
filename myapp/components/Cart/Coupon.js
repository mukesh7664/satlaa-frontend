import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState } from "react";
import { Button, TextField, Alert, Chip } from "@mui/material";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import { IoPricetagsOutline } from "react-icons/io5";
import { cartFetch } from "../../../redux/reducers/Cart";

const Coupon = ({ total_price }) => {
  const cart = useSelector((state) => state.cart);
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
        <div className="w-full px-4 mt-1">
          <span>Discount:</span>
          <span className="float-right font-semibold">
            - <Price data={Math.ceil((total_price * cart.coupon_discount) / 100)} />
          </span>
        </div>
      )}

      <div className="w-full px-4">
        {!couponApplied ? (
          <div className="flex flex-row mt-2 gap-x-2">
            <TextField
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon Code"
              size="small"
              variant="outlined"
              fullWidth
            />
            <Button onClick={handleCouponSubmit} variant="contained" color="primary">
              Apply
            </Button>
          </div>
        ) : (
          <Chip
            icon={<IoPricetagsOutline />}
            label={coupon.toUpperCase()}
            onDelete={removeCoupon}
            color="primary"
            className="mt-2"
          />
        )}
        {error && (
          <Alert severity="error" className="mt-2">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Coupon;