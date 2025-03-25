import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

import AddressSelect from "../Cart/AddressSelect";
import { useSelector } from "react-redux";
import { API_URL } from "../../../config";
import AuthService from "../../../util/services/authservice";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();

const Default = () => {
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [fields, setFields] = useState(
    Object.entries(user.address).map(([name, value]) => ({ name, value }))
  );
  const [address, setAddress] = useState([]);
  const [newAddress, setNewAddress] = useState({ open: false, id: null });
  const [city, setCity] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedO, setSelectedO] = useState({});
  const [cityOption, setCityOption] = useState([]);
  const [countryOption, setCountryOption] = useState([]);
  const [ilceOption, setIlceOption] = useState([]);
  const [semtOption, setSemtOption] = useState([]);
  const [mahalleOption, setMahalleOption] = useState([]);

  function getDataFc() {
    if (user.id) {
      axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
        const data = res.data;
        data["password"] = "";
        setFields(
          Object.entries(data.address).map(([name, value]) => ({ name, value }))
        );
        setAddress(data.address);
      });
    }
  }

  useEffect(() => {
    getDataFc();
    getCountry();
    getCity();
  }, [user]);

  const getCity = () => {
    axios.get(`${API_URL}/turkey`).then((getData) => {
      const dataManipulate = getData.data.map((item) => ({
        label: item.Il,
        value: item.Il,
      }));
      setCityOption(dataManipulate);
      setCity(getData.data);
    });
  };

  const getCountry = () => {
    axios.get(`${API_URL}/country`).then((getData) => {
      const dataManipulate = getData.data.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setCountryOption(dataManipulate);
      setCountry(getData.data);
    });
  };

  const onSubmitAddress = async (data) => {
    const newAddressArr = address.filter((x) => JSON.stringify(x) !== newAddress.id);
    newAddressArr.push(data);
    newAddressArr.reverse();

    if (isAuthenticated) {
      await axios
        .post(`${API_URL}/customerspublic/address`, newAddressArr)
        .then(() => {
          getDataFc();
          setNewAddress({ open: false, id: null });
        })
        .catch((err) => console.log("err", err));
    } else {
      setNewAddress({ open: false, id: null });
      setAddress(newAddressArr);
    }
  };

  return (
    <div className="w-full">
      {address.map((x, i) => (
        <AddressSelect key={i} Data={x} setNewAddress={setNewAddress} setFields={setFields} newAddress={newAddress} />
      ))}

      <Drawer open={newAddress.open} onOpenChange={() => setNewAddress({ ...newAddress, open: !newAddress.open })}>
        <DrawerTrigger asChild>
          <Button className="w-full py-3">New Address</Button>
        </DrawerTrigger>
        <DrawerContent className="p-6">
          <h2 className="text-lg font-semibold">Address</h2>
          <Form onSubmit={onSubmitAddress}>
            <FormField name="name" label="Name">
              <Input required />
            </FormField>

            <FormField name="type" label="Type">
              <Select defaultValue="billing">
                <SelectTrigger>
                  <SelectValue placeholder="Select Address Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing Address</SelectItem>
                  <SelectItem value="shipping">Shipping Address</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="country_id" label="Country">
              <Select onValueChange={(selected) => setSelectedO({ ...selectedO, selectedCountry: selected })}>
                <SelectTrigger>
                  <SelectValue placeholder="Search Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOption.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="city_id" label="City">
              <Select onValueChange={(selected) => setSelectedO({ ...selectedO, selectedCity: selected })}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cityOption.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="town_id" label="Town">
              <Input required placeholder="Town" />
            </FormField>

            <FormField name="district_id" label="District">
              <Input required placeholder="District" />
            </FormField>

            <FormField name="village_id" label="Village">
              <Input required placeholder="Village" />
            </FormField>

            <FormField name="address" label="Address">
              <Textarea required placeholder="Address" />
            </FormField>

            <Button type="submit" className="w-full mt-4">
              Save
            </Button>
          </Form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Default;