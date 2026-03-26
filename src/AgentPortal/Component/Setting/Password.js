import React, { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { useAuth } from '../../../Context/ContextProvider';

function Password() {
    const {changePassword, button_loading, setButtonLoading}=useAuth()
    const [data, setData] = useState({
        new_password: "",
        old_password: "",
        confim_password: "",
    })
    const [passwordShow, setPasswordShow] = useState({ current_password: false, new_password: false, confirm_password: false });
    const [fieldErrors, setFieldErrors] = React.useState({})
    const validateStep = () => {
        let errors = {

        };
        if (!data.old_password) {
            errors.old_password = "Old Password is required.";
        }
        if (!data.confim_password) {
            errors.confim_password = "Confirm Password is required.";
        }
        if (!data.new_password) {
            errors.new_password = "New Password is required.";
        }
        else if (data.new_password.length < 8 || data.new_password.length > 10) {
            errors.new_password = "Password must be between 8 and 10 characters long.";
        } else if (!hasSpecialCharacter(data.new_password)) {
            errors.new_password = "Password must contain at least one special character.";
        }
        else if (data.new_password !== data.confim_password) {
            errors.confim_password = "Password not match";
        }
        setFieldErrors(errors);
        // Check if there are any errors
        return Object.keys(errors).length === 0;
    };
    const hasSpecialCharacter = (password) => {
        // Regular expression for checking special characters
        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        return specialCharacterRegex.test(password);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateStep()) {
            setButtonLoading(true);
            try {
                let result = await changePassword(data);
                if (result?.success) {
                    setData({
                        new_password: "",
                        old_password: "",
                        confim_password: "",
                    })
                }
            } catch (error) {
                console.error("Password change error:", error);
            } finally {
                setButtonLoading(false);
            }
        }
    };


    return (
        <div className='h-100'>
            <div className='profile_setting_form boxes boxes_1'>
                <h6 className='title_head m-0'>Password</h6>
                <p className='pera m-0'>Manage and update your account password securely</p>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className='inp_box'>
                        <label>Current Password</label>
                        <input className={fieldErrors?.old_password ? "inp_fail" : ""} onChange={(e) => {
                            setData({ ...data, old_password: e.target.value })
                        }} value={data?.old_password} type={passwordShow?.current_password ? "text" : "password"} placeholder='************' />
                        <div className='eye_btn' onClick={() => setPasswordShow({ ...passwordShow, current_password: !passwordShow?.current_password })}>
                            {passwordShow?.current_password ? <IoEyeOutline /> : <IoEyeOffOutline />}
                        </div>
                        {fieldErrors?.old_password && <p className='error_message m-0'>{fieldErrors?.old_password}</p>}
                    </div>
                    <div className='inp_box'>
                        <label>New Password</label>
                        <input className={fieldErrors?.new_password ? "inp_fail" : ""} onChange={(e) => setData({ ...data, new_password: e.target.value })} value={data?.new_password} type={passwordShow?.new_password ? "text" : "password"} placeholder='New Password' />
                        <div className='eye_btn' onClick={() => setPasswordShow({ ...passwordShow, new_password: !passwordShow?.new_password })}>
                            {passwordShow?.new_password ? <IoEyeOutline /> : <IoEyeOffOutline />}
                        </div>
                        {fieldErrors?.new_password && <p className='error_message m-0'>{fieldErrors?.new_password}</p>}
                    </div>
                    <div className='inp_box'>
                        <label>Confirm Password</label>
                        <input className={fieldErrors?.confim_password ? "inp_fail" : ""} onChange={(e) => setData({ ...data, confim_password: e.target.value })} value={data?.confim_password} type={passwordShow?.confirm_password ? "text" : "password"} placeholder='Confirm Password' />
                        <div className='eye_btn' onClick={() => setPasswordShow({ ...passwordShow, confirm_password: !passwordShow?.confirm_password })}>
                            {passwordShow?.confirm_password ? <IoEyeOutline /> : <IoEyeOffOutline />}
                        </div>
                        {fieldErrors?.confim_password && <p className='error_message m-0'>{fieldErrors?.confim_password}</p>}
                    </div>
                </form>

            </div>
            <div className='bottom_btn'>
                <button onClick={handleSubmit}>
                    {button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Save Changes"}
                </button>
            </div>
        </div>


    )
}

export default Password