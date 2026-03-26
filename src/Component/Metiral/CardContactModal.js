import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AgencyContactCard from '../AgencyDetail/AgencyContactCard';
import { useActionState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '380px',
};

function submitForm(prevState, formData) {
  const errors = {};

  const name = formData.get("name");
  const email = formData.get("email");
  const phoneCode = formData.get("callingCode");
  const number = formData.get("number");
  const message = formData.get("message");
  const role = formData.get("role");
  const keepInformed = formData.get("keepInformed");
  const subject = formData.get("subject");

  // ---- Validations ----
  if (!name) errors.name = "Name is required!";
  if (!email) errors.email = "Email is required!";
  if (!phoneCode) errors.phoneCode = "Please select phone code!";
  if (!number) errors.number = "Number is required!";
  if (!message) errors.message = "Message is required!";

  if (prevState.radio) {
    // agar radio true hai → role + keepInformed validate hoga
    if (!role) errors.role = "Role is required!";
    if (!keepInformed) errors.keepInformed = "Please select an option!";
  } 

  // email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.email = "Invalid email format!";
  }

  // ---- Return if errors ----
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      values: {
        name,
        email,
        phoneCode,
        number,
        message,
        ...(prevState.radio
          ? { role, keepInformed }
          : { subject }),
      },
    };
  }

  // ---- Success ----
  return {
    success: true,
    message: `Hello ${name}, your message has been received!`,
    values: {
      name: "",
      email: "",
      phoneCode: "",
      number: "",
      message: "",
      ...(prevState.radio
        ? { role: "", keepInformed: "" }
        : { subject: "" }),
    },
  };
}




function CardContactModal({ open, setOpen, subject, radio, modal , propertyData , NoContactInfo }) {
  const [data, formAction, isPending] = useActionState(submitForm, {
    success: null,
    errors: {},
    values: {}
  });
  const handleClose = () => {
    setOpen(false)

  }



  return (
    <>
      {
        modal ?
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            BackdropProps={{
              className: 
                NoContactInfo ? 'global-modal-background-color' : 'true'
              
            }}
          >
            <Box className='card-contact-modal' sx={style}>
              <AgencyContactCard modifyCardState={setOpen} dontShowInfo={NoContactInfo} modifyCard={NoContactInfo} NewpropertyData={propertyData} data={data} formAction={formAction} isPending={isPending} subject={subject} radio={radio} mediaQuery={true} justify={true} image={true} onClose={handleClose} />
            </Box>
          </Modal>
          :
          <AgencyContactCard data={data} formAction={formAction} isPending={isPending} subject={subject} radio={radio} mediaQuery={true} justify={true} image={true} onClose={handleClose} />
      }
    </>
  )
}

export default CardContactModal
