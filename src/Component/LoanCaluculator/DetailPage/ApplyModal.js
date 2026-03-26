
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAuth } from '../../../Context/ContextProvider';
import { useState } from 'react';
import RangeMenuFeild from '../../Metiral/InputField/RangeMenuField/RangeMenuFeild';
import SimpleSingleField from '../../Metiral/InputField/SingleMenuFeild/SimpleSingleField';
import SingleMenuFeild from '../../Metiral/InputField/SingleMenuFeild/SingleMenuFeild';
import PrimaryButton from '../../Metiral/Button/PrimaryButton';

const pakistan = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
    <g clipPath="url(#clip0_7782_141993)">
        <rect width="24" height="18" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M7 0H24V18H7V0Z" fill="#00401A" />
        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H7V18H0V0Z" fill="white" />
        <path d="M13.0474 12.7382C9.53762 10.2009 11.7146 5.14228 13.1013 4.93934C13.0903 4.9733 11.7767 9.05085 14.4237 10.8248C17.0822 12.606 20.432 11.7328 20.432 11.7328C19.921 12.8361 16.5577 15.2758 13.0474 12.7382ZM17.8238 6.41363L19.4549 5.66647L18.5827 7.2982L20.2207 8.52045L18.1298 8.37958L17.0663 9.94157L16.8136 8.10751L14.9367 7.77329L16.7155 6.90322L16.6126 5.27425L17.8238 6.41363Z" fill="white" />
    </g>
    <defs>
        <clipPath id="clip0_7782_141993">
            <rect width="24" height="18" fill="white" />
        </clipPath>
    </defs>
</svg>

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    borderRadius: '8px',
    outline: 'none'
};



function ApplyModal({ open, setOpen, filterData, setFilterData }) {
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const { citiesList, applyForLoan } = useAuth();
    const [errors, setErrors] = useState({});


    const isValidPakistaniPhoneNumber = (phoneNumber) => {
        let cleanedPhoneNumber = phoneNumber.replace(/[^\d\+]/g, "");
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        const isValid = pakistaniPhoneRegex.test(cleanedPhoneNumber);

        return isValid;
    };

    const handleCheckValidation = async() => {
        const newErrors = {};
        const cleanedData = { ...filterData };

        // 🧹 Remove "-" from CNIC and phone before checking
        cleanedData.phone = filterData.phone.replace(/-/g, "").trim();
        cleanedData.cnic = filterData.cnic.replace(/-/g, "").trim();

        // 🟢 Name
        if (!filterData.name.trim()) newErrors.name = "Name is required";

        // 🟢 Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!filterData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(filterData.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!filterData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!isValidPakistaniPhoneNumber(filterData.phone)) {
            newErrors.phone = "Enter a valid Pakistani phone number (e.g. 03001234567 or 0300-1234567)";
        }

        // 🧹 Remove "-" from CNIC and phone before checking
        cleanedData.phone = filterData.phone.replace(/-/g, "").trim();
        cleanedData.cnic = filterData.cnic.replace(/-/g, "").trim();

        // 🟢 CNIC Validation
        const cleanedCnic = filterData.cnic.replace(/-/g, "").trim();
        const cnicRegex = /^[0-9]{13}$/;
        if (!cleanedCnic) {
            newErrors.cnic = "CNIC is required";
        } else if (!cnicRegex.test(cleanedCnic)) {
            newErrors.cnic = "Enter a valid CNIC (13 digits)";
        }
        // ✅ Store CNIC without hyphens for backend if valid
        if (!newErrors.cnic) {
            setFilterData((prev) => ({
                ...prev,
                cnic: cleanedCnic
            }));
        }
        // 🟢 City validation
        if (!filterData.city || !filterData.city.city) {
            newErrors.city = "City is required";
        }

        // 🟢 Price range validation
        if (filterData.priceRange.min === "" || filterData.priceRange.min == null)
            newErrors.min = "Minimum price is required";

        if (filterData.priceRange.max === "" || filterData.priceRange.max == null)
            newErrors.max = "Maximum price is required";

        // ✅ Apply errors
        setErrors(newErrors);

        // ✅ Return cleaned data or log success
        if (Object.keys(newErrors).length === 0) {
           let result =await applyForLoan({
                name: filterData?.name,
                email: filterData?.email,
                phone: filterData?.phone,
                city: filterData?.city?.city,
                salary_range: `${filterData?.priceRange?.min}-${filterData?.priceRange?.max}`,
                cnic: filterData?.cnic,
                plan_id:filterData?.id,
                monthly_installment:filterData?.monthly_installment
            })
            if(result?.success){
                setFilterData({
                    name:"",
                    email:"",
                    phone:"",
                    city:"",
                    salary_range:"",
                    cnic:""
                })
                setOpen(false)
            }
        }
    };


    return (
        <>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="loan-apply-modal">
                        <div className="top-box">
                            <div className="button" onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_2042_49999)">
                                        <path d="M15.9994 7.99982C15.8119 7.81235 15.5576 7.70703 15.2924 7.70703C15.0273 7.70703 14.773 7.81235 14.5854 7.99982L11.9995 10.5858L9.41346 7.99982C9.22486 7.81766 8.97226 7.71687 8.71006 7.71914C8.44786 7.72142 8.19705 7.82659 8.01164 8.012C7.82623 8.19741 7.72107 8.44822 7.71879 8.71042C7.71651 8.97261 7.8173 9.22522 7.99946 9.41382L10.5855 11.9998L7.99946 14.5858C7.8173 14.7744 7.71651 15.027 7.71879 15.2892C7.72107 15.5514 7.82623 15.8022 8.01164 15.9876C8.19705 16.173 8.44786 16.2782 8.71006 16.2805C8.97226 16.2828 9.22486 16.182 9.41346 15.9998L11.9995 13.4138L14.5854 15.9998C14.7741 16.182 15.0267 16.2828 15.2888 16.2805C15.551 16.2782 15.8019 16.173 15.9873 15.9876C16.1727 15.8022 16.2778 15.5514 16.2801 15.2892C16.2824 15.027 16.1816 14.7744 15.9994 14.5858L13.4135 11.9998L15.9994 9.41382C16.1869 9.22629 16.2922 8.97198 16.2922 8.70682C16.2922 8.44165 16.1869 8.18735 15.9994 7.99982Z" fill="#2D2D2D" />
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2042_49999">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="title">Apply for Loan</div>
                        </div>
                        <div className="input-section row m-0" style={{ gap: "12px 0", zIndex: 0 }}>
                            <div className="col-12 p-0">
                                <SimpleSingleField error={errors.name} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"name"} type={"text"} label={"Name*"} placeholder={" "} />
                                {errors.name && <div className="error-para">{errors.name}</div>}
                            </div>
                            <div className="col-12 p-0">
                                <SimpleSingleField error={errors.email} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"email"} type={"email"} label={"Email*"} placeholder={" "} />
                                {errors.email && <div className="error-para">{errors.email}</div>}
                            </div>
                            <div className="col-12 p-0">
                                <div className="d-flex flex-class">
                                    <div className={`country-box ${errors.phone ? "error" : ""}`}>{pakistan} +92</div>
                                    <SimpleSingleField error={errors.phone} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"phone"} type={"text"} label={"Phone number (e.g 3327******)*"} placeholder={" "} />
                                </div>
                                {errors.phone && <div className="error-para">{errors.phone}</div>}
                            </div>
                            <div className="col-12 p-0">
                                <SimpleSingleField error={errors.cnic} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"cnic"} type={"text"} label={"CNIC*"} placeholder={" "} />
                                {errors.cnic && <div className="error-para">{errors.cnic}</div>}
                            </div>
                            <div className="col-12 p-0 city-class">
                                <SingleMenuFeild
                                    error={errors.city}
                                    getVaiable={"city"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"city"}
                                    label={"City*"}
                                    menuData={citiesList}
                                    optionSelect={"single"}
                                    input={true}
                                    storeKey={"app_code"}
                                    design={"simple"}
                                />
                                {errors.city && <div className="error-para">{errors.city}</div>}
                            </div>
                            <div className="col-12 p-0 city-class">
                                <RangeMenuFeild
                                modified={true}
                                    label={"Salary*"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"priceRange"}
                                    min={"min"}
                                    max={"max"}
                                    value={"priceValue"}
                                    design={"simple"}
                                    fixedUnit={true}
                                    placeHolder={" "}
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
                                    maxValue={200000}
                                    error={errors.min || errors.max}
                                />
                                {(errors.min || errors.max) && <div className="error-para">Salary is required</div>}
                            </div>
                            <div className="col-12 p-0 " style={{marginTop: "20px"}} onClick={() => handleCheckValidation()}>
                                <PrimaryButton text={"Apply for Loan"} widthSize={"100%"} />
                            </div>
                        </div>
                    </div>
                </Box >
            </Modal >
        </>
    )
}

export default ApplyModal
