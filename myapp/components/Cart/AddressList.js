import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Card,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import AddressSelect from "./AddressSelect";
import NewAddressForm from "./NewAddressForm";
import { cartFetch, getCart as getCart_r, setShippingAddress } from "../../../redux/reducers/Cart";
import router from "next/router";
import { FaPlus } from "react-icons/fa";

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
    <Box width="100%">
      <Typography variant="h6" fontWeight="bold" ml={1}>
        DELIVERY ADDRESS
      </Typography>

      <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
        <RadioGroup
          value={selectedRadio}
          onChange={(e) => {
            const index = Number(e.target.value);
            setSelectedRadio(index);
            setNewAddress({ ...newAddress, open: false });
            onChangeShippingAddress(address[index]);
          }}
        >
          {address.map((addr, i) => (
            <Card
              key={i}
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 1,
                cursor: "pointer",
                bgcolor: selectedRadio === i ? "grey.100" : "white",
              }}
            >
              <FormControlLabel
                value={i}
                control={<Radio />}
                label={
                  <AddressSelect
                    Data={addr}
                    setNewAddress={setNewAddress}
                    onDeleteAddress={onDeleteAddress}
                    onSelectAddressToCheckout={() => {}}
                    onSubmitAddress={onSubmitAddress}
                    states={states}
                  />
                }
                sx={{ width: "100%" }}
              />
            </Card>
          ))}
        </RadioGroup>

        {!newAddress.open ? (
          <Button
            variant="outlined"
            startIcon={<FaPlus />}
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setNewAddress({ ...newAddress, open: true })}
          >
            Add A New Address
          </Button>
        ) : (
          <Paper elevation={3} sx={{ mt: 2, p: 2, bgcolor: "#f5fafe" }}>
            <Typography variant="body1" fontWeight="bold" bgcolor="primary.main" color="white" p={1}>
              ADD A NEW ADDRESS
            </Typography>
            <NewAddressForm
              onSubmitAddress={onSubmitAddress}
              states={states}
              handleCancel={() => setNewAddress({ open: false })}
            />
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default Default;