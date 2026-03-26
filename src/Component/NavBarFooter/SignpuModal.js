import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Modal from '@mui/material/Modal';
import Button from '../Metiral/Button';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import { IoIosArrowDown } from 'react-icons/io';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    // boxShadow: 24,

};
function SignpuModal({ open, setOpen, handleOpen }) {

    const { callingCode, registar, button_loading, setButtonLoading, socailLogin, setError, setOpen: setSnackbarOpen } = useAuth()
    const [show, setShow] = useState(false)
    const callingRef = React.useRef(null);
    const handleClickOutside = (event) => {
        if (callingRef.current && !callingRef.current.contains(event.target)) {
            setShow(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [selectedCode, setSelectedCode] = useState({
        flag: 'https://flagcdn.com/pk.svg',
        callingCode: '+92'
    });
    const handleClose = (event, reason) => {
        // Prevent closing if there are API errors
        if (hasApiError) {
            return;
        }
        // Prevent closing on backdrop click or ESC if there are validation errors
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            // Allow closing only if no errors exist
            if (Object.keys(errors).length > 0) {
                return;
            }
        }
        setOpen(false)
        setSelectedCode({
            flag: 'https://flagcdn.com/pk.svg',
            callingCode: '+92'
        })
        setShow(false)
        setErrors({}) // Clear errors when closing
        setHasApiError(false) // Reset API error flag
    };
    const [passwordShow, setPasswordShow] = useState({
        password: false,
        confirm: false
    })
    const [data, setData] = useState({
        password: "",
        password_confirmation: "",
        role: "agent",
    })
    const [errors, setErrors] = useState({})
    const [hasApiError, setHasApiError] = useState(false) // Track if there's an API error

    const showSnackbar = (message, severity = 'success') => {
        setError({
            message,
            color: severity === 'success' ? 'success' : 'error'
        });
        setSnackbarOpen(true);
    };
    const validateStep = () => {
        let errors = {};
        if (!data.name) {
            errors.name = "Name is required.";
        }
        if (!data.email) {
            errors.email = "Email is required.";
        } else if (!isValidEmail(data.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!data.password) {
            errors.password = "Password is required.";
        } else if (data.password.length < 8 || data.password.length > 10) {
            errors.password = "Password must be between 8 and 10 characters long.";
        } else if (!hasSpecialCharacter(data.password)) {
            errors.password = "Password must contain at least one special character.";
        }
        if (!data.password_confirmation) {
            errors.password_confirmation = "Confirm Password is required.";
        } else if (data.password !== data.password_confirmation) {
            errors.password_confirmation = "Passwords do not match.";
        }
        if (!data.terms_and_conditions) {
            errors.terms_and_conditions = "Please accept the terms and conditions.";
        }
        if (!data.contact) {
            errors.contact = "Contact is required.";
        } else if (!isValidPakistaniPhoneNumber(data.contact)) {
            errors.contact = "Please enter a valid  phone number.";
        }
        setErrors(errors);

        return Object.keys(errors).length === 0;
    };
    const submit = async (event) => {
        event.preventDefault();
        setButtonLoading(true)
        if (validateStep()) {
            try {
                const result = await registar({
                    name: data?.name,
                    password: data?.password,
                    email: data?.email,
                    phone_number: "+92" + data?.contact,
                    password_confirmation: data?.password_confirmation,
                    guard_name: "api",
                    role: data?.role,
                    terms_and_conditions: data?.terms_and_conditions,
                });

                if (result?.success) {
                    setButtonLoading(false)
                    setHasApiError(false) // Clear error flag on success
                    setShow(false)
                    setData({
                        email: "",
                        password: "",
                        password_confirmation: "",
                        name: "",
                        contact: "",
                        guard_name: "api",
                        role: "agent",
                        terms_and_conditions: false,
                    });
                    showSnackbar('Account created successfully!', 'success');
                    setTimeout(() => {
                        handleClose();
                    }, 1500);
                } else {
                    setButtonLoading(false)
                    setHasApiError(true) // Set error flag to prevent modal from closing
                    const error = result?.error?.errors;
                    const errorMessages = [];

                    // Collect all error messages
                    if (error?.email) {
                        setErrors(prev => ({ ...prev, email: error?.email[0] }));
                        errorMessages.push(error?.email[0]);
                    }
                    if (error?.phone_number) {
                        setErrors(prev => ({ ...prev, contact: error?.phone_number[0] }));
                        errorMessages.push(error?.phone_number[0]);
                    }
                    if (error?.password) {
                        setErrors(prev => ({ ...prev, password: error?.password[0] }));
                        errorMessages.push(error?.password[0]);
                    }
                    if (error?.name) {
                        setErrors(prev => ({ ...prev, name: error?.name[0] }));
                        errorMessages.push(error?.name[0]);
                    }

                    // Show all error messages in snackbar
                    if (errorMessages.length > 0) {
                        showSnackbar(errorMessages.join(' '), 'error');
                    } else {
                        const errorMessage = result?.error?.message || 'Registration failed. Please try again.';
                        showSnackbar(errorMessage, 'error');
                    }
                    // Modal stays open on error - don't close it
                }
            } catch (e) {
                setButtonLoading(false)
                setHasApiError(true) // Set error flag to prevent modal from closing
                showSnackbar('An unexpected error occurred. Please try again.', 'error');
                console.error("Unexpected error during registration:", e);
                // Modal stays open on error - don't close it
            }
        } else {
            setButtonLoading(false)
            setHasApiError(false) // Validation errors don't prevent closing (user can still close manually)
            // Modal stays open on validation error - don't close it
        }

    };
    const isValidPakistaniPhoneNumber = (phoneNumber) => {
        let cleanedPhoneNumber = phoneNumber.replace(/[^\d\+]/g, "");
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        const isValid = pakistaniPhoneRegex.test(cleanedPhoneNumber);

        return isValid;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const hasSpecialCharacter = (password) => {
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharacterRegex.test(password);
    };
    const formatPakistaniPhoneNumber = (phoneNumber) => {
        let phone = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters
        // Handle different input formats
        if (phone.startsWith("92")) {
            phone = phone.slice(2);
        } else if (phone.startsWith("+92")) {
            phone = phone.slice(3);
        } else if (phone.startsWith("0")) {
            phone = phone.slice(1);
        }
        // Ensure the phone number is no longer than 10 digits
        if (phone.length > 10) {
            phone = phone.slice(0, 10);
        }
        return phone; // Return processed phone number
    };
    const navigate = useNavigate()
    const handleLoginSuccessG = async (user) => {

        let obj = {
            name: user?.name,
            email: user?.email,
            provider_id: user?.sub,
            provider: "google",
            avatar: user?.picture,
            role: "agent",
        }
        handleClose();
        setButtonLoading(false);
        const result = await socailLogin(obj);
        if (result?.success) {
            setData({
                email: "",
                password: ""
            })
            showSnackbar('Login successful!', 'success');
            setTimeout(() => {
                navigate('/agent-portal/dashboard');
            }, 1000);
        } else {
            const errorMessages = [];
            if (result?.error?.errors?.email) {
                setErrors({
                    email: result?.error?.errors?.email[0]
                })
                errorMessages.push(result?.error?.errors?.email[0]);
            }
            if (result?.error?.message) {
                setErrors(prev => ({ ...prev, message: result?.error?.message }))
                errorMessages.push(result?.error?.message);
            }

            // Show error message in snackbar
            if (errorMessages.length > 0) {
                showSnackbar(errorMessages.join(' '), 'error');
            } else {
                showSnackbar('Login failed. Please try again.', 'error');
            }
        }

    };
    const handleLoginFailure = (error) => {
        setButtonLoading(false);
        console.error('Login Failed:', error);
        const errorMessage = error?.message || 'Social login failed. Please try again.';
        showSnackbar(errorMessage, 'error');
    };
    const handleLoginSuccessF = async (user) => {
        let obj = {
            name: user?.name,
            email: user?.email ? user?.email : `${user?.id}@facebook.com`,
            provider_id: user?.id ? user?.id : user?.provider_id,
            provider: user?.provider ? user?.provider : "facebook",
            avatar: user?.picture?.data?.url,
            role: "agent",
        };
        handleClose();
        setButtonLoading(false);
        const result = await socailLogin(obj);
        if (result?.success) {
            setData({
                email: "",
                password: "",
            });
            showSnackbar('Login successful!', 'success');
            setTimeout(() => {
                navigate("/agent-portal/dashboard");
            }, 1000);
        } else {
            if (result?.error?.errors?.email) {
                setErrors({
                    email: result?.error?.errors?.email[0],
                });
                showSnackbar(result?.error?.errors?.email[0], 'error');
            }
            if (result?.error?.message) {
                setErrors({
                    message: result?.error?.message,
                });
                showSnackbar(result?.error?.message, 'error');
            } else if (!result?.error?.errors?.email) {
                // Show generic error if no specific error message
                const errorMessage = result?.error?.message || 'Login failed. Please try again.';
                showSnackbar(errorMessage, 'error');
            }
            setButtonLoading(false);
        }
    };

    return (
        <>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableEscapeKeyDown={hasApiError}
                disableBackdropClick={hasApiError}
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box sx={style}>
                    <div style={{ height: "fit-content", padding: '32px' }} className='box_modal global-modal-base-color'>
                        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                            <button
                                onClick={handleClose}
                                style={{ border: "none", background: "none", padding: "0px" }}
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
                        <div>
                            <h4 className='sign_up_heading m-0'>Create account</h4>

                            <form className="sign_up_form" onSubmit={submit}>
                                {/* Name */}
                                <div className="inp_box">
                                    <input
                                        className={`${data.name && "focus_inp"}`}
                                        placeholder="Name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData({ ...data, name: e.target.value });
                                            setErrors({ ...errors, name: "" });
                                        }}
                                        style={{ borderColor: errors.name ? "#C94444" : "" }}
                                    />
                                    {errors.name && <span>{errors.name}</span>}
                                </div>

                                {/* Email */}
                                <div className="inp_box">
                                    <input
                                        className={`${data.email && "focus_inp"}`}
                                        placeholder="Email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData({ ...data, email: e.target.value });
                                            setErrors({ ...errors, email: "" });
                                        }}
                                        style={{ borderColor: errors.email ? "#C94444" : "" }}
                                    />
                                    {errors.email && <span>{errors.email}</span>}
                                </div>

                                {/* Password */}
                                <div className="inp_box">
                                    <input
                                        className={`${!passwordShow.password ? 'remove_faimly' : ''} ${data.password && 'focus_inp'}`}
                                        placeholder="Password"
                                        type={passwordShow.password ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => {
                                            setData({ ...data, password: e.target.value });
                                            setErrors({ ...errors, password: "" });
                                        }}
                                        style={{ borderColor: errors.password ? "#C94444" : "" }}
                                    />
                                    {!passwordShow.password && (
                                        <IoEyeOutline
                                            onClick={() =>
                                                setPasswordShow({ ...passwordShow, password: true })
                                            }
                                            className="icons_pass"
                                        />
                                    )}
                                    {passwordShow.password && (
                                        <IoEyeOffOutline
                                            onClick={() =>
                                                setPasswordShow({ ...passwordShow, password: false })
                                            }
                                            className="icons_pass"
                                        />
                                    )}
                                    {errors.password && <span>{errors.password}</span>}
                                </div>

                                {/* Confirm Password */}
                                <div className="inp_box">
                                    <input
                                        className={`${!passwordShow.confirm ? 'remove_faimly' : ''} ${data.password_confirmation && 'focus_inp'}`}
                                        placeholder="Confirm Password"
                                        type={passwordShow.confirm ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => {
                                            setData({ ...data, password_confirmation: e.target.value });
                                            setErrors({ ...errors, password_confirmation: "" });
                                        }}
                                        style={{ borderColor: errors.password_confirmation ? "#C94444" : "" }}
                                    />
                                    {!passwordShow.confirm && (
                                        <IoEyeOutline
                                            onClick={() =>
                                                setPasswordShow({ ...passwordShow, confirm: true })
                                            }
                                            className="icons_pass"
                                        />
                                    )}
                                    {passwordShow.confirm && (
                                        <IoEyeOffOutline
                                            onClick={() =>
                                                setPasswordShow({ ...passwordShow, confirm: false })
                                            }
                                            className="icons_pass"
                                        />
                                    )}
                                    {errors.password_confirmation && <span>{errors.password_confirmation}</span>}
                                </div>

                                {/* Phone */}
                                <div className='contact-main-inp_box'>
                                    <div style={{ borderColor: errors.contact ? "#C94444" : "", cursor: "not-allowed" }} className="contect_inp_box">
                                        <div
                                            ref={callingRef}
                                            // onClick={() => setShow(!show)}
                                            className="flag"
                                        >
                                            <img src={selectedCode.flag} alt="flag" />
                                            {selectedCode.callingCode}
                                            <IoIosArrowDown
                                                style={{
                                                    transform: `${show ? "rotate(180deg)" : "rotate(0deg)"}`,
                                                    color: "#737678",
                                                }}
                                                className="icon"
                                            />
                                        </div>
                                        <input
                                            placeholder="**********"
                                            type="text"
                                            value={data.contact}
                                            onChange={(e) => {
                                                setData({ ...data, contact: formatPakistaniPhoneNumber(e.target.value), });
                                                setErrors({ ...errors, contact: "" });
                                            }}

                                        />
                                        {show && (
                                            <div className="option_code">
                                                {callingCode.map((item) => (
                                                    <div
                                                        key={item.callingCode}
                                                        onClick={() => {
                                                            setSelectedCode({
                                                                flag: item.flag,
                                                                callingCode: item.callingCode,
                                                            });
                                                            setShow(false);
                                                        }}
                                                        className="d-flex option_value"
                                                    >
                                                        <img src={item.flag} alt="flag" />
                                                        <span>{item.callingCode}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.contact && <span>{errors.contact}</span>}

                                </div>
                                <div
                                    style={{ marginTop: "16px" }}
                                    className="form-check d-flex justify-content-start align-items-start term_check"
                                >
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="flexCheckDefault"
                                        onChange={(e) => {
                                            setData({ ...data, role: e.target.checked ? "agency" : "agent" });

                                        }}
                                    />
                                    <label className="ms-1">
                                        Register as an Agency
                                    </label>
                                </div>
                                {/* Terms */}
                                <div
                                    style={{ position: "relative" }}
                                    className="form-check d-flex justify-content-between align-items-start term_check"
                                >
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="flexCheckDefault"
                                        onChange={(e) => {
                                            setData({ ...data, terms_and_conditions: e.target.checked });
                                            setErrors({ ...errors, terms_and_conditions: "" });
                                        }}
                                    />
                                    <label className="ms-1">
                                        I have read and I agree to the{" "}
                                        <Link className="link">Terms & Conditions</Link> of Pakistan Property
                                    </label>
                                    {errors.terms_and_conditions && <span style={{ position: "absolute", bottom: "-15px", fontSize: "10px", color: "#C94444" }}>{errors.terms_and_conditions}</span>}
                                </div>

                                {/* Submit */}
                                <div style={{ marginTop: "24px" }}>
                                    <Button type="submit" variant="primary w-100" state="hover">
                                        {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "SIGN UP"}
                                    </Button>
                                </div>
                            </form>

                            <div style={{ marginTop: "16px" }} className='row mx-0 align-items-center'>
                                {
                                    data?.role == "agent" &&
                                    <>
                                        <div className='col-4 ps-0 mt-1'>
                                            <hr className='m-0' />
                                        </div>
                                        <div className='col-4 ps-0'>
                                            <span>or continue with</span>
                                        </div>
                                        <div className='col-4 pe-0 mt-1'>
                                            <hr className='m-0' />
                                        </div>
                                        <div style={{ marginTop: "16px" }} className='col-6 d-flex justify-content-center'>
                                            <LoginSocialGoogle
                                                client_id={"233085024947-29k40shskjt0oehab2d0cgev7739ca6f.apps.googleusercontent.com"}
                                                onResolve={({ provider, data }) => {
                                                    handleLoginSuccessG(data);
                                                }}
                                                onReject={(error) => {
                                                    console.error('Login Failed:', error);
                                                    handleLoginFailure(error);
                                                }}
                                                scope="profile email"
                                            >
                                                <button className='mt-0'>
                                                    <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                        <path d="M24.4992 12.2668C24.4992 11.2801 24.4175 10.5601 24.2407 9.81348H12.7441V14.2668H19.4924C19.3564 15.3735 18.6217 17.0401 16.989 18.1601L16.9661 18.3092L20.6011 21.0688L20.8529 21.0935C23.1658 19.0001 24.4992 15.9201 24.4992 12.2668Z" fill="#4285F4" />
                                                        <path d="M12.7454 23.9997C16.0515 23.9997 18.827 22.933 20.8542 21.093L16.9903 18.1596C15.9563 18.8663 14.5685 19.3596 12.7454 19.3596C9.50735 19.3596 6.75908 17.2664 5.7794 14.373L5.6358 14.385L1.85607 17.2517L1.80664 17.3863C3.82022 21.3063 7.95627 23.9997 12.7454 23.9997Z" fill="#34A853" />
                                                        <path d="M5.77884 14.3731C5.52035 13.6265 5.37074 12.8264 5.37074 11.9998C5.37074 11.1731 5.52035 10.3731 5.76524 9.62643L5.7584 9.46741L1.9313 6.55469L1.80609 6.61306C0.976194 8.23974 0.5 10.0664 0.5 11.9998C0.5 13.9331 0.976194 15.7597 1.80609 17.3864L5.77884 14.3731Z" fill="#FBBC05" />
                                                        <path d="M12.7454 4.63997C15.0447 4.63997 16.5957 5.6133 17.4801 6.42669L20.9358 3.12C18.8134 1.18667 16.0515 0 12.7454 0C7.95627 0 3.82022 2.69331 1.80664 6.61328L5.7658 9.62666C6.75908 6.73333 9.50735 4.63997 12.7454 4.63997Z" fill="#EB4335" />
                                                    </svg>
                                                    Google</button>
                                            </LoginSocialGoogle>
                                        </div>
                                        <div style={{ marginTop: "16px" }} className='col-6 d-flex justify-content-center'>
                                            <LoginSocialFacebook
                                                appId={'1108556227732782'} // Replace with your actual Facebook App ID
                                                onResolve={({ provider, data }) => handleLoginSuccessF(data)}
                                                onReject={handleLoginFailure}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setButtonLoading(true);
                                                    }} className='mt-0'>
                                                    <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                        <path d="M24.5 12C24.5 5.37206 19.1279 0 12.5 0C5.87205 0 0.5 5.37206 0.5 12C0.5 17.9901 4.88575 22.9545 10.626 23.8553V15.4718H7.58164V12H10.626V9.35671C10.626 6.35178 12.4145 4.68822 15.1564 4.68822C16.4715 4.68822 17.8458 4.92493 17.8458 4.92493V7.87726H16.3334C14.8408 7.87726 14.3805 8.80438 14.3805 9.75123V12H17.7077L17.1751 15.4718H14.3805V23.8553C20.1142 22.9545 24.5 17.9901 24.5 12Z" fill="#1877F2" />
                                                        <path d="M17.1676 15.472L17.7002 12.0003H14.3731V9.75149C14.3731 8.80464 14.84 7.87752 16.326 7.87752H17.8383V4.92519C17.8383 4.92519 16.4641 4.68848 15.149 4.68848C12.4071 4.68848 10.6186 6.35204 10.6186 9.35697V12.0003H7.57422V15.472H10.6186V23.8556C11.2301 23.9542 11.8548 24.0003 12.4926 24.0003C13.1304 24.0003 13.755 23.9477 14.3665 23.8556V15.472H17.1676Z" fill="white" />
                                                    </svg>
                                                    Facebook</button>
                                            </LoginSocialFacebook>
                                        </div>
                                    </>
                                }
                                <div className='col-12 p-0'>
                                    <p style={{ marginTop: "16px", marginBottom: '0' }} className='account_signup'>Already have an account? <span onClick={() => {
                                        handleClose()
                                        handleOpen()
                                    }}>Login</span></p>
                                </div>

                            </div>

                        </div>
                    </div>

                </Box>
            </Modal>
        </>
    )
}

export default SignpuModal