import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import AddressSelect from "./AddressSelect";
import NewAddressForm from "./NewAddressForm";
import { cartFetch, getCart as getCart_r, setShippingAddress } from "../../../redux/reducers/Cart";
import router from "next/navigation";

const axios = axiosInstance();

const Default = ({ initalAddress }) => {
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [address, setAddress] = useState(initalAddress || []);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [newAddress, setNewAddress] = useState({ open: false, id: null });
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();

  const getAddress = async () => {
    try {
      const res = await axios.get(`${API_URL}/customerspublic/address`);
      setAddress(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const getState = async () => {
    try {
      const res = await axios.get(`${API_URL}/country/India`);
      setStates(
        res.data[0].states.map((state) => ({
          label: state.name,
          value: state.name,
        }))
      );
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const onDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`${API_URL}/customerspublic/address/${addressId}`);
      setAddress(address.filter((adr) => adr._id !== addressId));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const updateAddress = async (newAddresses) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${API_URL}/customerspublic/address`, newAddresses);
        setTimeout(() => {
          getAddress();
          setNewAddress({ open: false, id: null });
        }, 500);
      } catch (err) {
        console.error("Error updating address:", err);
      }
    } else {
      setNewAddress({ open: false, id: null });
      setAddress(newAddresses);
    }
  };

  const updateCart = async (post) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${API_URL}/cart/${cart._id}`, post);
        dispatch(getCart_r(user.id));
      } catch (err) {
        console.error("Error updating cart:", err);
      }
    } else {
      dispatch(post);
    }
  };

  const onSubmitAddress = (Data) => {
    let updatedCart = {
      created_user: { name: user.name, id: user.id },
      customer_id: user.id,
      ...cart,
    };

    const updatedAddresses = [...address];
    if (newAddress.id) {
      const filteredAddresses = updatedAddresses.filter(
        (x) => JSON.stringify(x) !== newAddress.id
      );
      filteredAddresses.unshift(Data);
      dispatch(setShippingAddress(filteredAddresses[0]));
      updateAddress(filteredAddresses);
      updatedCart.shipping_address = filteredAddresses[0];
    } else {
      updatedAddresses.unshift(Data);
      updatedCart.shipping_address = updatedAddresses[0];
      dispatch(setShippingAddress(updatedAddresses[0]));
      updateAddress(updatedAddresses);
    }
    updateCart(updatedCart);
  };

  const onChangeShippingAddress = (data) => {
    let updatedCart = {
      created_user: { name: user.name, id: user.id },
      customer_id: user.id,
      ...cart,
    };
    updatedCart.shipping_address = data;
    updateCart(updatedCart);
  };

  useEffect(() => {
    getState();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold ml-1">DELIVERY ADDRESS</h2>

      {/* <div className="border rounded-lg p-4 mt-3 bg-white shadow-sm">
        <RadioGroup
          value={selectedRadio.toString()}
          onValueChange={(value) => {
            const index = Number(value);
            setSelectedRadio(index);
            setNewAddress({ ...newAddress, open: false });
            onChangeShippingAddress(address[index]);
          }}
        >
          {address.map((addr, i) => (
            <Card
              key={i}
              className={`flex items-center p-4 mb-2 border cursor-pointer ${
                selectedRadio === i ? "bg-gray-100" : "bg-white"
              }`}
            >
              <RadioGroupItem id={`address-${i}`} value={i.toString()} className="mr-2" />
              <label htmlFor={`address-${i}`} className="w-full">
                <AddressSelect
                  Data={addr}
                  setNewAddress={setNewAddress}
                  onDeleteAddress={onDeleteAddress}
                  onSelectAddressToCheckout={() => {}}
                  onSubmitAddress={onSubmitAddress}
                  states={states}
                />
              </label>
            </Card>
          ))}
        </RadioGroup>

        {!newAddress.open ? (
          <Button
            variant="outline"
            className="mt-3 w-full flex items-center gap-2"
            onClick={() => setNewAddress({ ...newAddress, open: true })}
          >
            <FaPlus /> Add A New Address
          </Button>
        ) : (
          <div className="border rounded-lg p-4 mt-3 bg-blue-50 shadow-sm">
            <h3 className="text-white bg-primary p-2 font-semibold text-center">ADD A NEW ADDRESS</h3>
            <NewAddressForm
              onSubmitAddress={onSubmitAddress}
              states={states}
              handleCancel={() => setNewAddress({ open: false })}
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Default;