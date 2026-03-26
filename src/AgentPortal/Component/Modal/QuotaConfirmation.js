import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PrimaryBorderButton from "../../../Component/Metiral/Button/PrimaryBorderButton";
import PrimaryButton from "../../../Component/Metiral/Button/PrimaryButton";
// import "./QuotaConfirmation.css";

export default function QuotaConfirmation({
  open,
  onClose,
  onConfirm,
  title = "Apply Quota?",
  message = " to theAre you sure you want to apply this quota listing?",
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        className: 'global-modal-background-color'
      }}
    >
      <Box className="qc-box quota-confirmation-box global-modal-base-color">
        {/* Warning Icon */}
        <div className="qc-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
  <path d="M86.0235 62.2189L55.9797 11.5674C50.5828 2.45801 37.4172 2.45801 32.0031 11.5674L1.97658 62.2189C-3.54061 71.5002 3.16252 83.2564 13.9563 83.2564H74.0438C84.8375 83.2564 91.5406 71.5002 86.0235 62.2189ZM44 72.0502C40.4422 72.0502 37.5547 69.1627 37.5547 65.6049C37.5547 62.0471 40.4422 59.1596 44 59.1596C47.5578 59.1596 50.4453 62.0471 50.4453 65.6049C50.4453 69.1627 47.5578 72.0502 44 72.0502ZM50.6172 31.0236L49.8266 49.6549C49.6891 52.8689 46.9735 55.3611 43.7594 55.2236C40.7344 55.1033 38.311 52.6799 38.1906 49.6549L37.4 31.0236C37.211 27.3627 40.0297 24.2518 43.6735 24.0627C47.3344 23.8736 50.4453 26.6924 50.6344 30.3361C50.6344 30.5768 50.6344 30.8002 50.6172 31.0236Z" fill="#C94444"/>
</svg>
        </div>
        {/* Title */}
        <div className="title">
          {title}
        </div>

        {/* Message */}
       <div className="para">
       Are you sure you want to apply this quota to the listing?
       </div>

        {/* Buttons */}
        <div className="qc-buttons">
         <PrimaryBorderButton text="No" height="32px" onFunction={onClose} padding={"8px 12px"} widthSize={"102px"} />
         <PrimaryButton text="Yes" height="32px" onFunction={onConfirm} padding={"8px 12px"} widthSize={"102px"} />
        </div>
      </Box>
    </Modal>
  );
}
