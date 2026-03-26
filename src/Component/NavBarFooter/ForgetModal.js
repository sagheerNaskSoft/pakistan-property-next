import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '../Metiral/Button';
import SignpuModal from './SignpuModal';
import { useAuth } from '../../Context/ContextProvider';
import { Spinner } from 'react-bootstrap';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
};
function ForgetModal({ open, setOpen, setOpen1 }) {
    const handleClose = () => setOpen(false);
    const { forgetPassword,button_loading , setOpenSignUp } = useAuth()
    const [data, setData] = useState({
        email: '',
    })
    const [errors, setErrors] = useState({})
    const validate = () => {
        let errors = {};
        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Enter a valid email';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            
          let result = await forgetPassword(data)
          if (result?.success) {
            handleClose()
            setOpen1(true)
          } else {
            setErrors({
              email: result?.error?.message
            })
          }
        }
    }
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box sx={style}>
                    <div className='box_modal forget-modal global-modal-base-color'>
                        <div className='d-flex justify-content-end'>
                            <button
                                onClick={handleClose}
                                style={{ border: "none", background: "none", padding: "0px", margin: "12px" }}
                            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_2343_173415)">
                                        <path d="M15.9994 7.99982C15.8119 7.81235 15.5576 7.70703 15.2924 7.70703C15.0273 7.70703 14.773 7.81235 14.5854 7.99982L11.9995 10.5858L9.41346 7.99982C9.22486 7.81766 8.97226 7.71687 8.71006 7.71914C8.44786 7.72142 8.19705 7.82659 8.01164 8.012C7.82623 8.19741 7.72107 8.44822 7.71879 8.71042C7.71651 8.97261 7.8173 9.22522 7.99946 9.41382L10.5855 11.9998L7.99946 14.5858C7.8173 14.7744 7.71651 15.027 7.71879 15.2892C7.72107 15.5514 7.82623 15.8022 8.01164 15.9876C8.19705 16.173 8.44786 16.2782 8.71006 16.2805C8.97226 16.2828 9.22486 16.182 9.41346 15.9998L11.9995 13.4138L14.5854 15.9998C14.7741 16.182 15.0267 16.2828 15.2888 16.2805C15.551 16.2782 15.8019 16.173 15.9873 15.9876C16.1727 15.8022 16.2778 15.5514 16.2801 15.2892C16.2824 15.027 16.1816 14.7744 15.9994 14.5858L13.4135 11.9998L15.9994 9.41382C16.1869 9.22629 16.2922 8.97198 16.2922 8.70682C16.2922 8.44165 16.1869 8.18735 15.9994 7.99982Z" fill="#2D2D2D" />
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2343_173415">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg></button>
                        </div>
                        <div style={{ marginTop: "124px" }} className='w-100 email-box'>
                            <h4 className='sign_in_heading'>Please enter E-mail</h4>
                            <form onSubmit={handleSubmit} className='login_form'>
                                <div className='inp_box'>
                                    <input style={{ borderColor: `${errors.email ? "#C94444" : ""}` }} onChange={(e) => setData({ ...data, email: e.target.value })} value={data.email} placeholder='Email' type='email' />
                                    {errors.email && <span>{errors.email}</span>}
                                </div>
                                <Button type='submit' variant="primary mt-sm-5 mt-3 w-100" state='hover'>
                                    {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : 'Send E-mail'}
                                </Button>
                            </form>
                            <div className='row mx-0 align-items-center'>
                                <div className='col-12'>
                                    <p style={{ marginTop: "24px" }} className='account_signup'>Don’t have an account? <span style={{ cursor: "pointer" }} onClick={() => {
                                        setOpen1(true)
                                        setOpenSignUp(true)
                                        handleClose()
                                    }} >Sign Up</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default ForgetModal