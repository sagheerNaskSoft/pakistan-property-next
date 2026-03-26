import React, { useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from '../Context/ContextProvider';
import Button from '../Component/Metiral/Button';
import { useLocation, useNavigate } from 'react-router-dom';
function SetAgentPassword() {
    const {button_loading,staffPasswordSet,parseQueryParams}=useAuth()
    const location=useLocation()
    const [passwordShow, setPasswordShow] = useState({
        password: false,
        confirm: false
    })
    const token=parseQueryParams(location?.search)?.token
   
    const [data, setData] = useState({
        password: "",
        password_confirmation: "",
    })
    const [errors, setErrors] = useState({})
    const validateStep = () => {
        let errors = {};
    
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
       
        setErrors(errors);

        return Object.keys(errors).length === 0;
    };
    const navigate = useNavigate();

    const submit = async (event) => {
        event.preventDefault();
        if (validateStep()) {
            setErrors({});
            try {
                const result = await staffPasswordSet({
                    password: data?.password,
                    password_confirmation:data?.password_confirmation,
                    token:token
                });

                if (result?.success) {
                    setData({
                        password: "",
                        password_confirmation: "",
                    });
                    navigate(`/agent-portal/dashboard`);
                } else {
                 
                }
            } catch (e) {
                console.error("Unexpected error during registration:", e);
            }
        }

    };
    const hasSpecialCharacter = (password) => {
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharacterRegex.test(password);
    };
    return (
        <div>
            <NavBar />
            <div className='secondary-color'>
                <div className='main-container py-5'>
                    <div className='agent-staff-form box_modal py-5' style={{height:"max-content"}}>
                    <h4 className='sign_up_heading m-0'>Create Password</h4>
                        <form onSubmit={submit} className="sign_up_form">
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
                            <div style={{ marginTop: "24px" }}>
                                    <Button type="submit" variant="primary w-100" state="hover">
                                        {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "SUBMIT"}
                                    </Button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className='main-container'>
                <Footer />
            </div>
        </div>
    )
}

export default SetAgentPassword