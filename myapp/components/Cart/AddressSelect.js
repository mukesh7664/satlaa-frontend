import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import NewAddressForm from "./NewAddressForm";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const EditCurrentAddress = (e) => {
    setEditing(false);
    onSubmitAddress(e);
  };

  return (
    <>
      {!editing ? (
        <div className="w-full border rounded-md p-3 bg-white shadow-sm">
          {activeRadioValue === radioValue && (
            <div className="float-right text-xs p-2 cursor-pointer -mb-10 z-10 relative flex flex-row gap-x-3">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setEditing(true);
                  setNewAddress({ id: JSON.stringify(Data) });
                  setFields(
                    Object.entries(Data).map(([name, value]) => ({
                      name,
                      value,
                    }))
                  );
                }}
              >
                Edit
              </span>
              <button
                onClick={() => setIsDialogOpen(true)}
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
            <div className="w-full float-left px-2 md:px-3 pb-0">{Data.address},</div>
            <div className="w-full p-2 md:p-3 pt-1">
              {Data.district}, {Data.state}&nbsp;
              <span className="font-semibold">{Data.pin_code}</span>
            </div>
          </div>

          {activeRadioValue === radioValue && (
            <Button
              onClick={onSelectAddressToCheckout}
              className="bg-secondary px-4 py-2 md:px-8 rounded-sm text-white text-lg mb-2 ml-2 md:ml-3"
            >
              DELIVER HERE
            </Button>
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

      {/* ShadCN Dialog for deletion confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this address?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDialogOpen(false);
                onDeleteAddress(Data._id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressSelect;