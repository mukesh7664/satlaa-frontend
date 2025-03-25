import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const CashOnDelivery = ({ value }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <RadioGroup defaultValue={value} onValueChange={() => setIsChecked(!isChecked)}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={value} id="cash-on-delivery" />
        <Label htmlFor="cash-on-delivery" className="cursor-pointer">
          Cash on Delivery
        </Label>
      </div>
    </RadioGroup>
  );
};

export default CashOnDelivery;