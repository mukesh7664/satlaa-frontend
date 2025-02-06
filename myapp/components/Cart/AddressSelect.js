import { Modal } from "antd";
import { useState } from "react";
import NewAddressForm from "./NewAddressForm";

// Update your AddressSelect component
const AddressSelect = ({
  Data,
  setNewAddress,
  newAddress,
  onDeleteAddress,
  activeRadioValue,
  radioValue,
  onSelectAddressToCheckout,
  onFinishFailedAddress,
  onSubmitAddress,
  form,
  states,
  fields,
  setFields,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [editing, setEditing] = useState(false);
  const EditCurrentAddress = (e) => {
    setEditing(false);
    onSubmitAddress(e);
  };

  return (
    <>
      {!editing ? (
        <div className="w-full ">
          {activeRadioValue === radioValue && (
            <div className="float-right font-xs p-2 cursor-pointer -mb-10 z-10 relative flex  flex-row gap-x-3">
              <span
                className=""
                onClick={() => {
                  setEditing(true);
                  setNewAddress({
                    id: JSON.stringify(Data),
                  });

                  setFields(
                    Object.entries(Data).map(([name, value]) => ({
                      name,
                      value,
                    }))
                    //  seTnewAddress({
                    //                 id: JSON.stringify(Data),
                    //                 open: !newAddress.open,
                    //               });
                  );
                }}
              >
                Edit
              </span>
              <button
                onClick={() => setIsModalVisible(true)} // Replace Data.id with the actual id property of your address
                className="text-red-700"
              >
                Delete
              </button>
            </div>
          )}
          <div className="w-full px-1 md:px-2">
            <span className="font-semibold w-full p-1">{Data.name}</span>
            <span className="font-semibold w-full p-1">{Data.phone}</span>
          </div>
          <div className="w-full">
            <div className=" w-full float-left px-2 md:px-3 pb-0  ">
              {" "}
              {Data.address},
            </div>
            <div className=" w-full p-2 md:p-3 pt-1 ">
              {Data.district},{Data.state}&nbsp;
              <span className="font-semibold">{Data.pin_code}</span>
            </div>
          </div>
          {activeRadioValue === radioValue && (
            <button
              onClick={onSelectAddressToCheckout}
              className="bg-secondary px-4 py-2 md:px-8 rounded-sm text-white text-lg mb-2 ml-2 md:ml-3"
            >
              DELIVER HERE
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="pl-5 font-semibold text-secondary">EDIT ADDRESS</p>
          <NewAddressForm
            onFinishFailedAddress={onFinishFailedAddress}
            onSubmitAddress={EditCurrentAddress}
            initialValues={Data}
            form={form}
            states={states}
            handleCancel={() => {
              setEditing(false);
            }}
          />
        </>
      )}
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={() => {
          setIsModalVisible(false);
          onDeleteAddress(Data._id);
        }} // Replace addressId with the actual ID of the address
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this address?</p>
      </Modal>
    </>
  );
};

export default AddressSelect;
