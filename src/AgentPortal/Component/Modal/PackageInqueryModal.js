import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IoIosArrowDown } from 'react-icons/io';
import img from '../../../Asset/LoanModel/fi-rr-cross-circle.png';
import { useAuth } from '../../../Context/ContextProvider';
import PrimaryButton from '../../../Component/Metiral/Button/PrimaryButton';

import Image from 'next/image';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    // bgcolor: 'white',
    borderRadius: '8px',
    // p: 4,
};

function PackageInqueryModal({ open, setOpen, planID }) {
    const callingRef = useRef(null);
    const inputRef = useRef(null);
    const [focus, setFocus] = useState('');
    const [openMenu, setOpenMenu] = useState('');
    const { callingCode, agencyPackageInquery, citiesList, button_loading, setOpen: setSnackbarOpen, setError: setSnackbarError } = useAuth();

    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [selectedCode, setSelectedCode] = useState({
        flag: 'https://flagcdn.com/pk.svg',
        callingCode: '+92'
    });
    const [searchValue, setSearchValue] = useState('');

    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setData({
            name: '',
            email: '',
            phone: '',
            message: '',
        });
        setSearchValue('');
    };

    const handleClickOutside = (event) => {
        if (callingRef.current && !callingRef.current.contains(event.target)) {
            setShow(false);
            setFocus("");
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isValidPakistaniPhoneNumber = (phoneNumber) => {
        let cleanedPhoneNumber = phoneNumber.replace(/[^\d\+]/g, "");
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        const isValid = pakistaniPhoneRegex.test(cleanedPhoneNumber);
        return isValid;
    };

    const formatPakistaniPhoneNumber = (phoneNumber) => {
        let phone = phoneNumber.replace(/\D/g, "");
        if (phone.startsWith("92")) phone = phone.slice(2);
        else if (phone.startsWith("+92")) phone = phone.slice(3);
        else if (phone.startsWith("0")) phone = phone.slice(1);
        if (phone.length > 10) phone = phone.slice(0, 10);
        return phone;
    };

    const filteredMenu = useMemo(() => {
        if (!searchValue?.trim()) return citiesList;
        return citiesList?.filter((item) =>
            item?.city?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
    }, [searchValue, citiesList]);

    const validate = () => {
        const newErrors = {};
        const cleanedData = { ...data };
        cleanedData.phone = data.phone.replace(/-/g, "").trim();

        if (!data.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (data.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(data.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!data.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!isValidPakistaniPhoneNumber(data.phone)) {
            newErrors.phone = "Enter a valid Pakistani phone number (e.g. 03001234567 or 0300-1234567)";
        }

        if (!data.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const result = await agencyPackageInquery({
                name: data?.name,
                email: data?.email,
                contact_number: "+92" + data?.phone,
                message: data?.message,
                id: planID?.id
            });

            if (result?.success) {
                setSnackbarError({
                    message: result?.data?.message || "Inquiry submitted successfully",
                    color: "success"
                });
                setSnackbarOpen(true);
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                });
                setErrors({});
                handleClose();
            } else {
                setSnackbarError({
                    message: result?.error?.message || result?.error || "Failed to submit inquiry. Please try again.",
                    color: "error"
                });
                setSnackbarOpen(true);
            }
        }
    };

    return (
        <Modal className="loan-model package-inquery-modal" style={{backgroundColor:'unset' , background:'unset'}} open={open} onClose={handleClose}
        BackdropProps={{
            className: 'global-modal-background-color'
        }}
        >
            <Box sx={style} className='loan-model-box '>
                <div className="loan-model-popup global-modal-base-color">
                    <div className="global-mobile-menu-header">
                    <h1 className='loan-model-heading heading mb-0'>Enquire Now</h1>
                    <div className="loan-model-img" style={{position: window?.innerWidth <= 576 ? 'unset' : '' }}>
                        <Image src={img} alt="..." onClick={handleClose} style={{ cursor: 'pointer' }} />
                    </div>
                    </div>
                    <p className='d-sm-flex d-none' style={{marginBottom:"24px" , justifyContent:'center'}}>Want to know more about packages? Fill the form</p>
                    <div className="col-lg-3 col-md-6 pe-0 w-100">
                        <div className="detail-code-sticky-side d-block">
                            <form style={{ border: 'none' }} className="contact-form-loan" onSubmit={handleSubmit}>
                                <div className="inp_box">
                                    <input
                                        className={data.name ? 'focus_inp' : ''}
                                        onChange={(e) =>
                                            setData({ ...data, name: e.target.value }) || setErrors({ ...errors, name: '' })
                                        }
                                        placeholder="Name"
                                        type="text"
                                        value={data.name}
                                        style={{ borderColor: errors.name ? '#C94444' : '' }}
                                    />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>

                                <div className="inp_box">
                                    <input
                                        className={data.email ? 'focus_inp' : ''}
                                        onChange={(e) =>
                                            setData({ ...data, email: e.target.value }) || setErrors({ ...errors, email: '' })
                                        }
                                        placeholder="Email"
                                        type="email"
                                        value={data.email}
                                        style={{ borderColor: errors.email ? '#C94444' : '' }}
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>

                                <div style={{ borderColor: errors.phone ? '#C94444' : '' }} className={errors.phone ? 'contect_inp_box mb-0' : 'contect_inp_box'}>
                                    <div ref={callingRef} onClick={() => setShow(false)} className="flag" style={{ cursor: 'not-allowed' }}>
                                        <Image src={selectedCode?.flag} alt="flag" />
                                        {selectedCode?.callingCode}
                                        <IoIosArrowDown
                                            style={{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                            className="icon"
                                        />
                                        {show && (
                                            <div className="option_code">
                                                {callingCode?.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedCode({
                                                                flag: item.flag,
                                                                callingCode: item.callingCode
                                                            })
                                                        }
                                                        className="d-flex option_value"
                                                    >
                                                        <Image src={item.flag} alt="code" />
                                                        <span>{item.callingCode}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        placeholder="**********"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData({ ...data, phone: formatPakistaniPhoneNumber(e.target.value) }) || setErrors({ ...errors, phone: '' })
                                        }
                                    />
                                </div>
                                {errors.phone && (
                                    <span className="error-text" style={{ marginBottom: errors.phone ? '10px' : 'unset' }}>
                                        {errors.phone}
                                    </span>
                                )}

                                <div className="inp_box">
                                    <textarea
                                        className={data.message ? 'focus_inp' : ''}
                                        onChange={(e) =>
                                            setData({ ...data, message: e.target.value }) || setErrors({ ...errors, message: '' })
                                        }
                                        placeholder="Message"
                                        rows="4"
                                        value={data.message}
                                        style={{ borderColor: errors.message ? '#C94444' : '', resize: 'vertical', minHeight: '100px' }}
                                    />
                                    {errors.message && <span className="error-text">{errors.message}</span>}
                                </div>

                                {window?.innerWidth <= 576 ? (
                                   <div className="global-footer-button-box">
                                    <PrimaryButton 
                                        text={button_loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : 'SUBMIT'}
                                        onFunction={handleSubmit}
                                    />
                                   </div>
                                ) : (
                                    <button type="submit" className="email-btn-loan global-footer-button-box" style={{marginTop:"10px"  , padding:"10px 16px" , height:'40px'}} disabled={button_loading}>
                                        {button_loading ? (
                                            <div className="spinner-border spinner-border-sm text-light" role="status" />
                                        ) : (
                                            <span className="email-label">SUBMIT</span>
                                        )}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default PackageInqueryModal;
