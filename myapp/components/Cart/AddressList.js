import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import { message, Button, Input, Row, Col } from "antd";
import router from "next/router";
import AddressSelect from "./AddressSelect";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../../config";
import NewAddressForm from "./NewAddressForm";
// import { getCart_r, updateCart_r } from "../../../redux/actions";

import {
  cartFetch,
  getCart as getCart_r,
  setShippingAddress,
} from "../../../redux/reducers/Cart";

import AuthService from "../../../util/services/authservice";
import func from "../../../util/helpers/func";
import { FaPlus } from "react-icons/fa";
const axios = axiosInstance();
const Default = ({ initalAddress }) => {
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [fields, setFields] = useState([]);

  const [address, seTaddress] = useState(initalAddress);
  console.log("initaddr", initalAddress);
  const [selectedRadio, setSelectedRadio] = useState();
  const [newAddress, setNewAddress] = useState({ open: false, id: null });
  const [states, setStates] = useState([]);

  const dispatch = useDispatch();

  const onDeleteAddress = (addressId) => {
    axios
      .delete(`${API_URL}/customerspublic/address/${addressId}`)
      .then(() => {
        seTaddress(address.filter((adr) => adr._id !== addressId));
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    setNewAddress(false);
  };
  const updateAddress = async (newAddresArr) => {
    if (isAuthenticated) {
      await axios
        .post(`${API_URL}/customerspublic/address`, newAddresArr)
        .then(() => {
          setTimeout(() => {
            getAddress();
            setNewAddress({ open: false, id: null });
          }, 500);
        })
        .catch((err) => console.log("err", err));
    } else {
      // message.success({ content: "Next Stage :)", duration: 3 });
      setNewAddress({ open: false, id: null });
      seTaddress(newAddresArr);
    }
  };

  const updateCart = async (post) => {
    console.log(post, "selected data3");
    if (isAuthenticated) {
      axios
        .post(`${API_URL}/cart/${cart._id}`, post)
        .then(async () => {
          await dispatch(getCart_r(user.id));
        })
        .catch((err) => {
          message.error({
            content: "Some Error, Please Try Again",
            duration: 3,
          });
          console.log(err);
        });
    } else {
      // message.success({ content: "Next Stage :)", duration: 3 });
      dispatch(post);
    }
  };

  const getState = () => {
    axios.get(`${API_URL}/country/India`).then((getData) => {
      const dataManipulate = getData.data[0].states.map((state) => {
        return {
          label: state.name,
          value: state.name,
        };
      });
      setStates(dataManipulate);
    });
  };

  const getAddress = async () => {
    await axios
      .get(`${API_URL}/customerspublic/address`)
      .then(async (res) => {
        console.log(res.data);
        await seTaddress(res.data);
      })
      .catch((err) => console.log("err", err));
    // if (isAuthenticated) {
    //   AuthService.isAuthenticated().then(async (auth) => {
    //     await seTaddress(auth.user.address);
    //   });
    // }
  };

  const onSubmitAddress = async (Data) => {
    let newCartPost = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      ...cart,
    };

    if (newAddress.id) {
      const newAddresArr = address.filter(
        (x) => JSON.stringify(x) !== newAddress.id
      );
      newAddresArr.push(Data);
      newAddresArr.reverse();
      console.log("onSubmitAddress if", newAddresArr);

      dispatch(setShippingAddress(newAddresArr[0]));

      updateAddress(newAddresArr);

      newCartPost.shipping_address = newAddresArr[0];
      updateCart(newCartPost);
      // onSelectAddressToCheckout();
    } else {
      const newAddresArr = address;
      newAddresArr.push(Data);
      newAddresArr.reverse();
      console.log("onSubmitAddress else", newAddresArr);
      newCartPost.shipping_address = newAddresArr[0];
      updateCart(newCartPost);
      dispatch(setShippingAddress(newAddresArr[0]));
      updateAddress(newAddresArr);
      setNewAddress(newAddresArr);
      // onSelectAddressToCheckout();
    }
  };
  // const updatShippingAddress = async (data) => {
  //   dispatch(setShippingAddress(data));
  // };
  const onFinishFailedAddress = (errorInfo) => {
    console.log(errorInfo);
  };

  // const getSelectedAddress = () => {
  //   if (cart.products?.length > 0) {
  //     if (cart.shipping_address) {
  //       dispatch(setShippingAddress(JSON.stringify(cart.shipping_address)));
  //     }

  //     const stringifShippingAddres = JSON.stringify(cart.shipping_address);
  //   }
  // };

  useEffect(() => {
    getState();
    // getSelectedAddress();
  }, [cart]);

  const onChangeShppingAddress = (data) => {
    console.log(data, "selected data2.1");
    console.log(cart, "selected data2.2");

    let newCartPost = {
      created_user: {
        name: user.name,
        id: user.id,
      },
      customer_id: user.id,
      ...cart,
    };
    newCartPost.shipping_address = data;
    console.log(newCartPost, "selected data2");
    updateCart(newCartPost);
  };

  const onSelectAddressToCheckout = async () => {
    const errorArray = [];
    const arrayId = [];

    cart.products?.map((x) => {
      arrayId.push(x.product_id);
    });

    await axios
      .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
      .then((res) => {
        const data = res.data;
        const products = cart.products;
        let cartTotalPrice = 0;
        let cartTotalDiscountPrice = 0;

        products?.map((x) => {
          const array = data.find((y) => y._id == x.product_id);

          if (array) {
            const resData = array;
            if (x.selectedVariants !== undefined) {
              const priceMath = func.filter_array_in_obj(
                resData.variant_products,
                x.selectedVariants
              );

              if (priceMath[0].visible === false) {
                errorArray.push(true);
              } else if (Number(priceMath[0].qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice = cartTotalPrice + x.qty * priceMath[0].price;
              cartTotalDiscountPrice =
                cartTotalDiscountPrice + x.qty * priceMath[0].before_price;
            } else {
              if (resData.isActive === false) {
                errorArray.push(true);
              } else if (Number(resData.qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice = cartTotalPrice + x.qty * resData.price;
              cartTotalDiscountPrice =
                cartTotalDiscountPrice + x.qty * resData.before_price;
            }
          }
        });
      });

    let control = false;
    control = errorArray.find((x) => x == true);
    if (control === undefined) {
      router.push("/cart/payment");
    } else {
      dispatchEvent(getCart_r(user.id));
    }
  };
  console.log(newAddress.open);
  return (
    <>
      <div className="w-full">
        <div className={"col-span-12 sm:col-span-6"}>
          <div className="text-lg  font-semibold w-full ml-2">
            DELIVERY ADDRESS
          </div>
          <div className="w-full mt-3">
            {address &&
              address.map((x, i) => (
                <div
                  key={i}
                  className={`w-full border px-4 py-2 flex cursor-pointer ${
                    selectedRadio === i ? "bg-gray-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id={`radio_${i}`}
                    name="address"
                    value={i}
                    checked={selectedRadio === i}
                    onChange={(e) => {
                      setNewAddress({ ...newAddress, open: false });
                      setFields([]);
                      const selectedData = address[Number(e.target.value)];
                      console.log(selectedData, "selected data");
                      setSelectedRadio(Number(e.target.value));

                      onChangeShppingAddress &&
                        onChangeShppingAddress(selectedData);
                    }}
                    className="form-radio "
                  />
                  <label
                    htmlFor={`radio_${i}`}
                    className="ml-2 w-full cursor-pointer"
                  >
                    <AddressSelect
                      Data={x}
                      setNewAddress={setNewAddress}
                      setFields={setFields}
                      fields={fields}
                      newAddress={newAddress}
                      activeRadioValue={selectedRadio}
                      radioValue={i}
                      onDeleteAddress={onDeleteAddress}
                      onSelectAddressToCheckout={onSelectAddressToCheckout}
                      onFinishFailedAddress={onFinishFailedAddress}
                      onSubmitAddress={onSubmitAddress}
                      states={states}
                    />
                  </label>
                </div>
              ))}
          </div>
          {!newAddress.open && (
            <button
              className="text-left flex  content-center font-semibold text-sm w-full py-4 md:pl-4 h-full mb-5 mt-2 text-blue-500 bg-white border mx-2"
              onClick={() => {
                setSelectedRadio(null);
                setFields(
                  Object.entries(address[0] ? address[0] : {}).map(
                    ([name]) => ({
                      name,
                      value: null,
                    })
                  )
                );
                setNewAddress({ ...newAddress, open: !newAddress.open });
              }}
            >
              <FaPlus className="text-xl text-center pl-1" />
              <span className="ml-4">Add A New Address</span>
            </button>
          )}
          {newAddress.open && (
            <div className="shadow-md bg-[#f5fafe]">
              <p className="mt-4 text-lg w-full bg-blue-500 text-white px-2 py-2">
                ADD A NEW ADDRESS
              </p>
              <NewAddressForm
                onFinishFailedAddress={onFinishFailedAddress}
                onSubmitAddress={onSubmitAddress}
                states={states}
                handleCancel={handleCancel}
              />
            </div>
          )}
        </div>{" "}
      </div>
    </>
  );
};

export default Default;
