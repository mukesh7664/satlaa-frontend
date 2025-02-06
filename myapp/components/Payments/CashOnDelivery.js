import { useState } from "react";
import { Radio } from '@mui/material';
const CashOnDelivery = ({ value }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value={value}>
      Cash on Delivery
    </Radio>
  );
};
export default CashOnDelivery 