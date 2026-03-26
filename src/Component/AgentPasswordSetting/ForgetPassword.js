import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import logo from '../../Asset/Logo.svg';
import PrimaryButton from '../Metiral/Button/PrimaryButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import Image from 'next/image';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    borderRadius: "12px",
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
    outline: 'none',
};

const eye = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <g clipPath="url(#clip0_372_24141)">
        <path d="M17.4529 7.06409C16.2897 5.16959 13.6437 1.99109 8.99967 1.99109C4.35567 1.99109 1.70967 5.16959 0.546422 7.06409C0.186818 7.64572 -0.00366211 8.31602 -0.00366211 8.99984C-0.00366211 9.68366 0.186818 10.354 0.546422 10.9356C1.70967 12.8301 4.35567 16.0086 8.99967 16.0086C13.6437 16.0086 16.2897 12.8301 17.4529 10.9356C17.8125 10.354 18.003 9.68366 18.003 8.99984C18.003 8.31602 17.8125 7.64572 17.4529 7.06409ZM16.1742 10.1503C15.1752 11.7748 12.9139 14.5086 8.99967 14.5086C5.08542 14.5086 2.82417 11.7748 1.82517 10.1503C1.61152 9.80462 1.49836 9.40624 1.49836 8.99984C1.49836 8.59343 1.61152 8.19506 1.82517 7.84934C2.82417 6.22484 5.08542 3.49109 8.99967 3.49109C12.9139 3.49109 15.1752 6.22184 16.1742 7.84934C16.3878 8.19506 16.501 8.59343 16.501 8.99984C16.501 9.40624 16.3878 9.80462 16.1742 10.1503Z" fill="#444545" />
        <path d="M9 5.24982C8.25832 5.24982 7.5333 5.46975 6.91661 5.88181C6.29993 6.29386 5.81928 6.87953 5.53545 7.56475C5.25162 8.24998 5.17736 9.00398 5.32206 9.73141C5.46675 10.4588 5.8239 11.127 6.34835 11.6515C6.8728 12.1759 7.54098 12.5331 8.26841 12.6778C8.99584 12.8225 9.74984 12.7482 10.4351 12.4644C11.1203 12.1805 11.706 11.6999 12.118 11.0832C12.5301 10.4665 12.75 9.7415 12.75 8.99982C12.7488 8.00562 12.3533 7.05249 11.6503 6.34948C10.9473 5.64648 9.9942 5.25101 9 5.24982ZM9 11.2498C8.55499 11.2498 8.11998 11.1179 7.74997 10.8706C7.37996 10.6234 7.09157 10.272 6.92127 9.86086C6.75098 9.44972 6.70642 8.99732 6.79323 8.56086C6.88005 8.12441 7.09434 7.72349 7.40901 7.40883C7.72368 7.09416 8.12459 6.87987 8.56105 6.79305C8.99751 6.70623 9.44991 6.75079 9.86104 6.92109C10.2722 7.09139 10.6236 7.37977 10.8708 7.74978C11.118 8.11979 11.25 8.55481 11.25 8.99982C11.25 9.59655 11.0129 10.1689 10.591 10.5908C10.169 11.0128 9.59674 11.2498 9 11.2498Z" fill="#444545" />
    </g>
    <defs>
        <clipPath id="clip0_372_24141">
            <rect width="18" height="18" fill="white" />
        </clipPath>
    </defs>
</svg>

const eyeClosed = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <g clipPath="url(#clip0_372_24156)">
        <path d="M17.4529 7.06414C16.7759 5.95543 15.9218 4.96508 14.9247 4.13239L17.0247 2.03239C17.1613 1.89093 17.2369 1.70148 17.2352 1.50484C17.2335 1.30819 17.1546 1.12008 17.0155 0.981022C16.8765 0.841966 16.6884 0.76309 16.4917 0.761381C16.2951 0.759672 16.1056 0.835268 15.9642 0.971886L13.6804 3.25864C12.2647 2.41775 10.6462 1.97948 8.99967 1.99114C4.35642 1.99114 1.71042 5.16964 0.546422 7.06414C0.186818 7.64577 -0.00366211 8.31607 -0.00366211 8.99989C-0.00366211 9.6837 0.186818 10.354 0.546422 10.9356C1.22349 12.0443 2.07754 13.0347 3.07467 13.8674L0.974672 15.9674C0.903039 16.0366 0.845903 16.1193 0.806596 16.2108C0.767289 16.3023 0.7466 16.4008 0.745734 16.5003C0.744869 16.5999 0.763845 16.6987 0.801556 16.7909C0.839267 16.883 0.894956 16.9668 0.965376 17.0372C1.0358 17.1076 1.11953 17.1633 1.21171 17.201C1.30388 17.2387 1.40264 17.2577 1.50222 17.2568C1.60181 17.256 1.70022 17.2353 1.79173 17.196C1.88323 17.1567 1.96599 17.0995 2.03517 17.0279L4.32417 14.7389C5.73812 15.5796 7.35467 16.0187 8.99967 16.0086C13.6429 16.0086 16.2889 12.8301 17.4529 10.9356C17.8125 10.354 18.003 9.6837 18.003 8.99989C18.003 8.31607 17.8125 7.64577 17.4529 7.06414ZM1.82442 10.1504C1.61077 9.80467 1.49761 9.40629 1.49761 8.99989C1.49761 8.59348 1.61077 8.1951 1.82442 7.84939C2.82492 6.22489 5.08617 3.49114 8.99967 3.49114C10.2449 3.48416 11.4726 3.78426 12.5742 4.36489L11.0644 5.87464C10.3444 5.39659 9.4811 5.18238 8.6211 5.26837C7.76109 5.35436 6.95732 5.73524 6.34617 6.34639C5.73503 6.95754 5.35414 7.7613 5.26816 8.62131C5.18217 9.48132 5.39637 10.3446 5.87442 11.0646L4.14192 12.7971C3.22325 12.0544 2.4393 11.1591 1.82442 10.1504ZM11.2497 8.99989C11.2497 9.59662 11.0126 10.1689 10.5907 10.5909C10.1687 11.0128 9.59641 11.2499 8.99967 11.2499C8.66556 11.2486 8.33607 11.1717 8.03592 11.0249L11.0247 8.03614C11.1715 8.33628 11.2484 8.66577 11.2497 8.99989ZM6.74967 8.99989C6.74967 8.40315 6.98672 7.83085 7.40868 7.4089C7.83064 6.98694 8.40294 6.74989 8.99967 6.74989C9.33379 6.75118 9.66327 6.8281 9.96342 6.97489L6.97467 9.96364C6.82789 9.66349 6.75097 9.334 6.74967 8.99989ZM16.1749 10.1504C15.1744 11.7749 12.9132 14.5086 8.99967 14.5086C7.75447 14.5156 6.52674 14.2155 5.42517 13.6349L6.93492 12.1251C7.65497 12.6032 8.51824 12.8174 9.37825 12.7314C10.2383 12.6454 11.042 12.2645 11.6532 11.6534C12.2643 11.0422 12.6452 10.2385 12.7312 9.37846C12.8172 8.51846 12.603 7.65519 12.1249 6.93514L13.8574 5.20264C14.7761 5.94535 15.56 6.84067 16.1749 7.84939C16.3886 8.1951 16.5017 8.59348 16.5017 8.99989C16.5017 9.40629 16.3886 9.80467 16.1749 10.1504Z" fill="#444545" />
    </g>
    <defs>
        <clipPath id="clip0_372_24156">
            <rect width="18" height="18" fill="white" />
        </clipPath>
    </defs>
</svg>


function ForgetPassword() {
    const navigate = useNavigate()
    const {parseQueryParams,passwordReset}=useAuth()
    const [open, setOpen] = useState(true)
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        passwordFocused: false,
        confirmPasswordFocused: false,
        showPassword: false,
        showConfirmPassword: false
    })
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

    const validatePassword = (password) => {
        if (password.length < 8) return 'Password must be at least 8 characters long'
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character'
        return ''
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleFocus = (field) => {
        setFormData(prev => ({ ...prev, [field]: true }))
    }

    const handleBlur = (field) => {
        setFormData(prev => ({ ...prev, [field]: false }))
    }

    const toggleVisibility = (field) => {
        setFormData(prev => ({ ...prev, [field]: !prev[field] }))
    }
    const location=useLocation()

    const handleSubmit = async () => {
        const newErrors = { password: '', confirmPassword: '' }
        
        // Validate password
        newErrors.password = validatePassword(formData.password)
        
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)

        // Submit if no errors
        if (!newErrors.password && !newErrors.confirmPassword) {
            const token=parseQueryParams(location.search).token
            const result=await passwordReset({
                password:formData.password,
                password_confirmation:formData.confirmPassword,
                data:token
            })
            if(result.success){
                navigate('/password-changed')
            }else{
                setErrors(result.error)
            }
            // navigate('/password-changed')
            // Add your API call here
        }
    }

    const passwordClassName = `input ${formData.passwordFocused || formData.password ? 'active' : ''} ${errors.password ? 'error' : ''}`
    const confirmPasswordClassName = `input ${formData.confirmPasswordFocused || formData.confirmPassword ? 'active' : ''} ${errors.confirmPassword ? 'error' : ''}`

    return (
        <>
            <div className="agent-email-page">
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} className='new-password-setup-box'>
                        <div className="new-password-setup">
                            <div className="logo">
                                <Image src={logo} alt="" />
                            </div>
                            <div className="text-box">
                                <div className="title">Setup new password</div>
                                <div className="para">Your new password must be different
                                    from the previous one</div>
                            </div>
                            <div className="input-box">
                                <div className={passwordClassName}>
                                    <input
                                        type={formData.showPassword ? "text" : "password"}
                                        placeholder='Password'
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onClick={() => handleFocus('passwordFocused')}
                                        onBlur={() => handleBlur('passwordFocused')}
                                    />
                                    <div className="eye" onClick={() => toggleVisibility('showPassword')}>
                                        {formData.showPassword ? eyeClosed : eye}
                                    </div>
                                </div>
                                {errors.password && <div className="error-message1">{errors.password}</div>}
                                
                                <div className={confirmPasswordClassName}>
                                    <input
                                        type={formData.showConfirmPassword ? "text" : "password"}
                                        placeholder='Confirm Password'
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        onClick={() => handleFocus('confirmPasswordFocused')}
                                        onBlur={() => handleBlur('confirmPasswordFocused')}
                                    />
                                    <div className="eye" onClick={() => toggleVisibility('showConfirmPassword')}>
                                        {formData.showConfirmPassword ? eyeClosed : eye}
                                    </div>
                                </div>
                                {errors.confirmPassword && <div className="error-message1">{errors.confirmPassword}</div>}
                            </div>
                            <div className="button w-100" style={{margin:"28px 0"}}>
                                <PrimaryButton 
                                    widthSize={"100%"} 
                                    text={"Reset Password"}
                                    onFunction={handleSubmit}
                                />
                            </div>
                            <div className="back-to-login">
                                <span className="line"></span>
                                <Link to="/" style={{textDecoration:"none"}}><span className="text">Back to Login</span></Link>
                                <span className="line"></span>
                            </div>
                        </div>
                    </Box>
                </Modal>


            </div>
        </>
    )
}

export default ForgetPassword


