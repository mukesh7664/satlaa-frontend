import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IoPricetagsOutline } from "react-icons/io5";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
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
        <div className="w-full px-4 mt-1 flex justify-between">
          <span>Discount:</span>
          <span className="font-semibold">
            - <Price data={Math.ceil((total_price * cart.coupon_discount) / 100)} />
          </span>
        </div>
      )}

      <div className="w-full px-4">
        {!couponApplied ? (
          <div className="flex flex-row mt-2 gap-x-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon Code"
            />
            <Button onClick={handleCouponSubmit} className="bg-primary">
              Apply
            </Button>
          </div>
        ) : (
          <Badge variant="outline" className="mt-2 flex items-center gap-x-2">
            <IoPricetagsOutline className="text-lg" />
            {coupon.toUpperCase()}
            <Button variant="ghost" size="icon" onClick={removeCoupon}>
              ✕
            </Button>
          </Badge>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Coupon;