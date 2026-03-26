import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IoIosArrowDown } from 'react-icons/io';
import img from '../../Asset/LoanModel/fi-rr-cross-circle.png';
import img1 from '../../Asset/PropertyListing/985069493feb4c9e7356013239aafbe3e5dbdab3.jpg';
import img2 from '../../Asset/PropertyListing/9b3e159247606dffe2b72270c05958ec417396e7.jpg';
import img3 from '../../Asset/PropertyListing/e1d0d6ed1957a3104f11e348ecec816268de3e47.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../Context/ContextProvider';
import RangeMenuFeild from './InputField/RangeMenuField/RangeMenuFeild';

gsap.registerPlugin(ScrollTrigger);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    // bgcolor: 'white',
    
    borderRadius: '8px',
    // p: 4,
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))', // Prevent overlap with iOS/Android nav bar
    boxSizing: 'border-box',
    maxWidth: '100vw',
};

function LoanModel({ installmentValues, planData, open, handleClose }) {
    const sectionRef = useRef(null);
    const callingRef = useRef(null);
    const [focus, setFocus] = useState('')
    const [openMenu, setOpenMenu] = useState('')
    const { callingCode, applyForLoan, citiesList, button_loading, setOpen: setSnackbarOpen, setError: setSnackbarError } = useAuth(); // your custom hook
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        cnic: '',
        city: '',
        priceRange: {
            min: "",
            max: "",
            priceValue: ""
        },
    });

    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [selectedCode, setSelectedCode] = useState({
        flag: 'https://flagcdn.com/pk.svg',
        callingCode: '+92'
    });

    useEffect(() => {
        // Guard GSAP setup: modal content/target may not exist until open.
        if (!open || !sectionRef.current) return;
        const triggerEl = sectionRef.current;
        const targetEl = sectionRef.current.querySelector('.detail-code-scroll-side');
        if (!targetEl) return;

        const tween = gsap.fromTo(
            targetEl,
            { y: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top center',
                    end: 'bottom top',
                    scrub: true
                }
            }
        );

        return () => {
            if (tween?.scrollTrigger) tween.scrollTrigger.kill();
            tween?.kill();
        };
    }, [open]);

    const handleClickOutside = (event) => {
        if (callingRef.current && !callingRef.current.contains(event.target)) {
            setShow(false);
            setFocus("")

        }
    };
    const inputRef = useRef(null)
    const input1Ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                inputRef.current,
                input1Ref.current,
            ];
            const clickedInside = refs.some(ref => ref && ref.contains(event.target));
            if (!clickedInside) {
                setFocus('');
                setOpenMenu("");
                // If city is selected, update searchValue to show the city name
                if (typeof data.city === 'object' && data.city?.city) {
                    setSearchValue(data.city.city);
                } else if (!data.city || (typeof data.city === 'string' && !data.city.trim())) {
                    setSearchValue('');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [data.city]);

    // Update searchValue when city is selected
    useEffect(() => {
        if (typeof data.city === 'object' && data.city?.city) {
            setSearchValue(data.city.city);
        } else if (!data.city) {
            // Only clear if not focused (to allow typing)
            if (focus !== "City") {
                setSearchValue('');
            }
        }
    }, [data.city, focus]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const result = await applyForLoan({
                name: data?.name,
                email: data?.email,
                phone: data?.phone,
                city: data?.city?.city,
                salary_range: `${data?.priceRange?.min || ''}-${data?.priceRange?.max || ''}`,
                cnic: data?.cnic,
                monthly_instalment: installmentValues?.monthlyInstalment,
                plan_id: planData?.plan?.id,

            });

            if (result?.success) {
                setSnackbarError({
                    message: result?.data?.message || "Loan application submitted successfully",
                    color: "success"
                });
                setSnackbarOpen(true);
                // Reset form on success
                setData({
                    name: '',
                    email: '',
                    phone: '',
                    cnic: '',
                    city: '',
                    priceRange: {
                        min: "",
                        max: "",
                        priceValue: ""
                    },
                });
                setSearchValue('');
                setErrors({});
                handleClose();
            } else {
                setSnackbarError({
                    message: result?.error?.message || result?.error || "Failed to submit loan application. Please try again.",
                    color: "error"
                });
                setSnackbarOpen(true);
            }
        }
    };

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) return `${(num / 1_00_00_00_000).toFixed(2)} Billion`
        else if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(2)} Crore`
        else if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(2)} Lakh`
        else if (num >= 1_000) return `${(num / 1_000).toFixed(2)} Thousand`
        else if (num >= 1_00) return `${(num / 1_00).toFixed(2)} Hundred`
        return num?.toLocaleString()
    }
    const validate = () => {
        const newErrors = {};
        const cleanedData = { ...data };
        if (data.phone) {
            cleanedData.phone = data.phone.replace(/-/g, "").trim();
        }
        if (data.cnic) {
            cleanedData.cnic = data.cnic.replace(/-/g, "").trim();
        }
        if (!data.name || !data.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (data.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(data.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!data.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!isValidPakistaniPhoneNumber(data.phone)) {
            newErrors.phone = "Enter a valid Pakistani phone number (e.g. 03001234567 or 0300-1234567)";
        }
        if (!data.cnic || !data.cnic.trim()) {
            newErrors.cnic = 'CNIC is required';
        }
        if (!data.city || (typeof data.city === 'string' && !data.city.trim()) || (typeof data.city === 'object' && !data.city?.city)) {
            newErrors.city = 'City is required';
        }
        if (!data.priceRange?.min || data.priceRange.min === "" || data.priceRange.min == null) {
            newErrors.min = 'Minimum salary is required';
        }
        if (!data.priceRange?.max || data.priceRange.max === "" || data.priceRange.max == null) {
            newErrors.max = 'Maximum salary is required';
        }
        if (data.priceRange?.min && data.priceRange?.max && Number(data.priceRange.min) < installmentValues?.monthlyInstalment * 2) {
            newErrors.min = `Your minimum salary must be greater than ${formatNumber(installmentValues?.monthlyInstalment * 2)} `;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
    const [searchValue, setSearchValue] = useState()
    const filteredMenu = useMemo(() => {
        if (!searchValue?.trim()) return citiesList;
        return citiesList?.filter((item) =>
            item?.city?.toLowerCase()?.includes(searchValue?.toLowerCase())
        );
    }, [searchValue, citiesList]);

    return (
        <Modal className="loan-model" open={open} onClose={handleClose} style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        BackdropProps={{
            className: 'global-modal-background-color'
        }}>
            <Box sx={style} className='loan-model-box'>
                <div className="loan-model-popup global-modal-base-color">
                    <div className="d-sm-none d-flex flex-row-reverse justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px", height: '57px' }}>
                        <div className="loan-model-img" style={{ position: 'unset' }}>
                            <img src={img} alt="..." onClick={handleClose} style={{ cursor: 'pointer' }} />
                        </div>

                        <h1 className='loan-model-heading mb-0'>Apply for Loan</h1>
                    </div>
                    <div className="loan-model-img d-sm-block d-none">
                        <img src={img} alt="..." onClick={handleClose} style={{ cursor: 'pointer' }} />
                    </div>

                    <h1 className='loan-model-heading d-sm-block d-none' style={{marginBottom:'20px'}}>Apply for Loan</h1>
                    <div className="col-lg-3 col-md-6 pe-0 w-100 loan-modal-col">
                        <div className="detail-code-sticky-side d-block" ref={sectionRef}>
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
                                        <img src={selectedCode?.flag} alt="flag" />
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
                                                        <img src={item.flag} alt="code" />
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
                                    <input
                                        className={data.cnic ? 'focus_inp' : ''}
                                        onChange={(e) => {
                                            let val = e.target.value
                                            let cnic = val.replace(/\D/g, "");
                                            if (cnic.length > 5 && cnic.length <= 12)
                                                cnic = cnic.slice(0, 5) + "-" + cnic.slice(5);
                                            else if (cnic.length > 12)
                                                cnic = cnic.slice(0, 5) + "-" + cnic.slice(5, 12) + "-" + cnic.slice(12, 13);

                                            setData((prev) => ({
                                                ...prev,
                                                cnic: cnic,
                                            }));
                                            setErrors({ ...errors, cnic: '' })
                                        }
                                        }
                                        placeholder="CNIC"
                                        type="text"
                                        value={data.cnic}
                                        style={{ borderColor: errors.cnic ? '#C94444' : '' }}
                                    />
                                    {errors.cnic && <span className="error-text">{errors.cnic}</span>}
                                </div>
                                <div className='inp_box city-inp-box mb-0  ' style={{borderColor:errors.city ? "#C94444":""}}>
                                    <div className='d-flex align-items-center justify-content-between w-100'  ref={inputRef} onClick={() => { setFocus("City"); setOpenMenu("City") }}>
                                        <input
                                            className={data.city ? 'focus_inp' : ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSearchValue(value);
                                                setErrors({ ...errors, city: '' });
                                                // Clear selected city when user starts typing a different value
                                                if (typeof data.city === 'object' && data.city?.city !== value) {
                                                    setData(prev => ({ ...prev, city: '' }));
                                                }
                                            }}
                                            onFocus={() => {
                                                setFocus("City");
                                                setOpenMenu("City");
                                                // If city is selected, show it in search for editing
                                                if (typeof data.city === 'object' && data.city?.city) {
                                                    setSearchValue(data.city.city);
                                                } else {
                                                    setSearchValue(searchValue || '');
                                                }
                                            }}
                                            onBlur={() => {
                                                // On blur, if city is selected, show the city name
                                                // Use setTimeout to allow menu click to register first
                                                setTimeout(() => {
                                                    if (typeof data.city === 'object' && data.city?.city) {
                                                        setSearchValue(data.city.city);
                                                    } else if (!searchValue || searchValue.trim() === '') {
                                                        setSearchValue('');
                                                    }
                                                }, 200);
                                            }}
                                            placeholder="City"
                                            type="text"
                                            value={searchValue || ''}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFocus("City");
                                                setOpenMenu("City");
                                            }}
                                        />

                                        {
                                            focus === "City" ?
                                                <svg style={{ rotate: '180deg' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        }


                                    </div>
                                    {
                                        openMenu === "City" ?
                                            <div className="menu-box" style={{ maxHeight: "180px", height: "fit-content", overflowY: "scroll" }} onClick={(e) => e.stopPropagation()}>
                                                {filteredMenu?.length > 0 ? (
                                                    filteredMenu.map((city, index) => (
                                                        <div
                                                            key={index}
                                                            className="menu"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // Prevent input blur
                                                                setData(prev => ({
                                                                    ...prev,
                                                                    city: city
                                                                }));
                                                                setSearchValue(city?.city);
                                                                setOpenMenu("");
                                                                setFocus("");
                                                            }}
                                                        >
                                                            {city?.city}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="menu" style={{ color: '#737678', cursor: 'default' }}>
                                                        No city found
                                                    </div>
                                                )}
                                            </div>
                                            : ''
                                    }
                                </div>

                                {errors.city && <span className="error-text">{errors.city}</span>}
                                {/* <div  style={{ borderColor: errors.monthlysalary ? '#C94444' : '' }} className="inp_box city-inp-box" ref={input1Ref} onClick={() => { setFocus("salary"); setOpenMenu("salary") }}>
                                    <input
                                        className={data.monthlysalary ? 'focus_inp' : ''}
                                        onChange={(e) =>
                                            setData({ ...data, monthlysalary: e.target.value }) || setErrors({ ...errors, monthlysalary: '' })
                                        }
                                        placeholder="Monthly Salary"
                                        type="number"
                                        value={data.monthlysalary}
                                       
                                    />

                                    
                                </div>
                                {errors.monthlysalary && <span className="error-text">{errors.monthlysalary}</span>} */}
                                <div className="div" style={{marginTop:"8px"}}>
                                <RangeMenuFeild
                                    newModified={true}
                                    label={"Monthly Salary"}
                                    forcefullyAddedLabel={true}
                                    filterData={data}
                                    setFilterData={setData}
                                    varName={"priceRange"}
                                    min={"min"}
                                    max={"max"}
                                    value={"priceValue"}
                                    design={"simple"}
                                    fixedUnit={true}
                                    placeHolder={" "}
                                    // viewText={"14px"}
                                    menuData={[
                                        { id: 1, name: "USD", code: "$" },
                                        { id: 2, name: "EUR", code: "€" },
                                        { id: 3, name: "GBP", code: "£" },
                                        { id: 4, name: "SAR", code: "ر.س" },
                                        { id: 5, name: "AED", code: "د.إ" },
                                        { id: 6, name: "PKR", code: "Rs" },
                                    ]}
                                    sliderValue={priceSlider}
                                    setSliderValue={setPriceSlider}
                                    maxValue={5000000}
                                    error={errors.min || errors.max}
                                    newErrors= {errors.min || errors.max}
                                />
                                </div>
                                {(errors.min || errors.max) && <div className="error-text">Salary is required</div>}
                                <div className="button-box">
                                    <button type="submit" className="email-btn-loan" disabled={button_loading}>
                                        {button_loading ? (
                                            <div className="spinner-border spinner-border-sm text-light" role="status" />
                                        ) : (
                                            <span className="email-label">APPLY</span>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </Box >
        </Modal >
    );
}

export default LoanModel;
