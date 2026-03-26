import React, { useEffect, useState } from 'react'
import dummy_profile from '../../Asset/dummy_profile.svg'
import { useAuth } from '../../../Context/ContextProvider';
import SingleInput from '../Inputs/SingleInput';
import Image from 'next/image';
function Profile() {
    const { loginData, citiesList, formatPakistaniPhoneNumber, updateProfile, button_loading, setButtonLoading } = useAuth();

    const [data, setData] = useState({
        name: "",
        email: "",
        whatsapp: "",
        landline: "",
        mobile: "",
        city: "",
        address: "",
        image: "",
    });
    useEffect(() => {
        const userLocalData = loginData?.data?.user;
        if (userLocalData) {
            setData((prev) => ({
                ...prev,
                name: userLocalData?.name || prev?.name,
                mobile: userLocalData?.phone_number
                    ? formatPakistaniPhoneNumber(userLocalData?.phone_number)
                    : prev?.mobile,
                whatsapp: userLocalData?.whatsapp_number
                    ? formatPakistaniPhoneNumber(userLocalData?.whatsapp_number)
                    : prev?.whatsapp,
                landline: userLocalData?.landline
                    ? formatPakistaniPhoneNumber(userLocalData?.landline)
                    : prev?.landline,
                email: userLocalData?.email || prev?.email,
                city: userLocalData?.currentCity || userLocalData?.city ||  prev?.city,
                address: userLocalData?.address || prev?.address,
                image: userLocalData?.avatar || prev?.image,
                description: userLocalData?.description || prev?.description,
            }));
        }
    }, [loginData]);


    const [fieldErrors, setFieldErrors] = React.useState({});
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

        if (!data.city) {
            errors.city = "City is required.";
        }
        if (!data.address) {
            errors.address = "Address is required.";
        }
        if (!data.image) {
            errors.image = "Image is required.";
        }
        if (!data.mobile) {
            errors.mobile = "Mobile is required.";
        }
        if (!data.description) {
            errors.description = "Description is required.";
        }
        else if (!isValidPakistaniPhoneNumber("+92" + data.mobile)) {
            errors.mobile = "Please enter a valid  phone number.";
        }

        if (!data?.landline) {
           errors.landline = "Landline is required.";
        } else if (!isValidPakistaniPhoneNumber("+92" + data.landline)) {
            errors.landline = "Please enter a valid  phone number.";
        }
        if (!data.whatsapp) {
            errors.whatsapp = "Whatsapp is required.";
        } else if (!isValidPakistaniPhoneNumber("+92" + data.whatsapp)) {
            errors.whatsapp = "Please enter a valid  phone number.";
        }
        setFieldErrors(errors);
        // Check if there are any errors
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateStep()) {
            setButtonLoading(true);
            try {
                await updateProfile({
                    ...data,
                    whatsapp_number: "+92" + data?.whatsapp,
                    phone_number: "+92" + data?.mobile,
                    landline: data?.landline ? "+92" + data?.landline : "",
                    city_code: data?.city,
                    city: data?.city
                });
            } catch (error) {
                console.error("Profile update error:", error);
            } finally {
                setButtonLoading(false);
            }
        }
    };


    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
            const maxWidth = 1200;
            const maxHeight = 1200;

            // Clear previous errors
            setFieldErrors((prev) => ({ ...prev, image: undefined }));

            // Check file type
            if (!allowedTypes.includes(file.type)) {
                setFieldErrors((prev) => ({ ...prev, image: "Please upload a valid image format (.png, .jpeg, .jpg, .webp)" }));
                event.target.value = ""; // reset the file input
                return;
            }

            // Check file size
            if (file.size > maxFileSize) {
                setFieldErrors((prev) => ({ ...prev, image: "File size must be less than 1MB" }));
                event.target.value = ""; // reset the file input
                return;
            }

            // Check image dimensions
            const inputElement = event.target;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width > maxWidth || img.height > maxHeight) {
                        setFieldErrors((prev) => ({ 
                            ...prev, 
                            image: `Image resolution must be maximum ${maxWidth}x${maxHeight} pixels. Current: ${img.width}x${img.height}` 
                        }));
                        inputElement.value = ""; // reset input
                        return;
                    }
                    // Image is valid, save it
                    const base64String = e.target.result;
                    setData((prev) => ({
                        ...prev,
                        image: base64String, // store Base64 image
                    }));
                    // Clear any previous errors
                    setFieldErrors((prev) => ({ ...prev, image: undefined }));
                };
                img.onerror = () => {
                    setFieldErrors((prev) => ({ ...prev, image: "Failed to load image. Please try again." }));
                    inputElement.value = ""; // reset input
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                setFieldErrors((prev) => ({ ...prev, image: "Failed to read file. Please try again." }));
                inputElement.value = ""; // reset input
            };
            reader.readAsDataURL(file);
        }
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPakistaniPhoneNumber = (phoneNumber) => {
        let cleanedPhoneNumber = phoneNumber.replace(/[^\d\+]/g, "");
        
        // If number starts with +92, it should be exactly 13 characters (+92 + 10 digits)
        if (cleanedPhoneNumber.startsWith('+92')) {
            return cleanedPhoneNumber.length === 13 && /^\+92\d{10}$/.test(cleanedPhoneNumber);
        }
        
        // If number starts with 92 (without +), it should be exactly 12 characters (92 + 10 digits)
        if (cleanedPhoneNumber.startsWith('92')) {
            return cleanedPhoneNumber.length === 12 && /^92\d{10}$/.test(cleanedPhoneNumber);
        }
        
        // For other formats, check if it's a valid Pakistani number
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        return pakistaniPhoneRegex.test(cleanedPhoneNumber);
    };


    const handleEraseImage = () => {
        setData((prev) => ({
            ...prev,
            image: '', // remove image
        }));
        document.getElementById('profile_image').value = ''; // clear input
    };




    return (
        <div className='h-100'>
            <div className='profile_setting_form boxes boxes_1'>
                <div className='profile_preview'>
                    <div className='profile_img'>
                        <Image src={data?.image ? data?.image : dummy_profile} alt='' />
                    </div>
                    <div className='user_name'>
                        <h6 style={{ textTransform: "capitalize" }} className='name m-0'>{loginData?.data?.user?.name} <p className='m-0'>Individual</p></h6>
                        <span>{loginData?.data?.user?.email}</span>
                    </div>
                </div>
                <hr style={{ margin: "12px 0" }} />
                <form onSubmit={handleSubmit} style={{ overflow: "unset" }}>
                    <div className='row px-3'>
                        <div style={{ marginTop: "8px" }} className='col-md-6 ps-0 pe-xl-3 pe-md-1 pe-0'>
                            <div className='inp_box'>
                                <div className='inp_box city_inp_profile'>
                                    <SingleInput captalizeText={true} errors={fieldErrors?.name} label={"Full Name"} data={data} setData={setData} varName={"name"} input={true} dropDown={false} width={"100%"} inputType={'text'} placeHolder={"Enter your Name"} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 pe-0 ps-xl-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.email} label={"Email"} data={data} setData={setData} varName={"email"} input={true} dropDown={false} width={"100%"} inputType={'email'} placeHolder={"Enter your Email"} />

                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 ps-0 pe-xl-3 pe-md-1 pe-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.landline} label={"Landline"} data={data} setData={setData} varName={"landline"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your Landline 0xx-xxxxxxx"} />

                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 pe-0 ps-xl-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.mobile} label={"Mobile Number"} data={data} setData={setData} varName={"mobile"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your Landline 0xx-xxxxxxx"} />


                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 ps-0 pe-xl-3 pe-md-1 pe-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.whatsapp} label={"Whatsapp Number"} data={data} setData={setData} varName={"whatsapp"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your Landline 0xx-xxxxxxx"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 pe-0 ps-xl-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput forName={"city"} errors={fieldErrors?.city} getVariable={"city"} width={"100%"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />

                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-12 p-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.address} label={"Address"} data={data} setData={setData} varName={"address"} input={true} dropDown={false} width={"100%"} inputType={'text'} placeHolder={"Enter your address"} firstLetterCapitalize={true} />

                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-12 p-0'>
                            <div className='inp_box city_inp_profile'>
                                <label>Describe about Self</label>
                                <textarea className={`${data?.description && "is_data_border"} ${fieldErrors?.description && "error_data_border"}`} onChange={(e) => setData({ ...data, description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} value={data?.description} placeholder='Please Enter Description' />
                                {fieldErrors?.description && <p className='error_message' style={{ bottom: "-29px" }}>{fieldErrors?.description}</p>}
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" , marginBottom: "60px"}} className='col-12 p-0'>
                            <div className='inp_box'>
                                <label>Upload Picture</label>
                                <div style={{ borderColor: `${fieldErrors?.image ? "#C94444" : ""}` , gap:"12px"}} className='upload_profile d-md-flex d-block'>
                                    <label for="profile_image" style={{ gap: "23px" }} className='d-flex align-items-center'>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M25.5 17.5V22.8333C25.5 23.5406 25.219 24.2189 24.719 24.719C24.2189 25.219 23.5406 25.5 22.8333 25.5H4.16667C3.45942 25.5 2.78115 25.219 2.28105 24.719C1.78095 24.2189 1.5 23.5406 1.5 22.8333V17.5M20.1667 8.16667L13.5 1.5M13.5 1.5L6.83333 8.16667M13.5 1.5V17.5" stroke="#447158" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className='pe-2'>
                                            <span>Upload or Drag and Drop your social media content</span>
                                            <ul className='p-0 m-0'>
                                                <li>Maximum File Size: 1MB</li>
                                                <li>Maximum Resolution: 1200x1200 pixels</li>
                                                <li>Supported File Types are .png, .jpeg, .jpg, .webp</li>
                                            </ul>
                                        </div>
                                    </label>
                                    <div className='img_form' style={{ position: "relative", display: "flex", justifyContent: "end" }}>
                                        {data?.image && (
                                            <div style={{ position: 'absolute', top: -2, right: 3, cursor: "pointer" }} onClick={handleEraseImage}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <g clipPath="url(#clip0_663_1178)">
                                                        <rect width="20" height="20" rx="10" fill="white" />
                                                        <path d="M13.3332 6.66684C13.1769 6.51061 12.965 6.42285 12.744 6.42285C12.5231 6.42285 12.3111 6.51061 12.1549 6.66684L9.99987 8.82184L7.84487 6.66684C7.68771 6.51504 7.47721 6.43105 7.25871 6.43295C7.04021 6.43484 6.8312 6.52248 6.67669 6.67699C6.52219 6.8315 6.43455 7.04051 6.43265 7.25901C6.43075 7.4775 6.51475 7.688 6.66654 7.84517L8.82154 10.0002L6.66654 12.1552C6.51475 12.3123 6.43075 12.5228 6.43265 12.7413C6.43455 12.9598 6.52219 13.1688 6.67669 13.3234C6.8312 13.4779 7.04021 13.5655 7.25871 13.5674C7.47721 13.5693 7.68771 13.4853 7.84487 13.3335L9.99987 11.1785L12.1549 13.3335C12.312 13.4853 12.5225 13.5693 12.741 13.5674C12.9595 13.5655 13.1685 13.4779 13.323 13.3234C13.4776 13.1688 13.5652 12.9598 13.5671 12.7413C13.569 12.5228 13.485 12.3123 13.3332 12.1552L11.1782 10.0002L13.3332 7.84517C13.4894 7.6889 13.5772 7.47698 13.5772 7.25601C13.5772 7.03504 13.4894 6.82311 13.3332 6.66684Z" fill="#737678" />
                                                        <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10 18.3333C8.35183 18.3333 6.74066 17.8446 5.37025 16.9289C3.99984 16.0132 2.93174 14.7117 2.30101 13.189C1.67028 11.6663 1.50525 9.99076 1.82679 8.37425C2.14834 6.75774 2.94201 5.27288 4.10745 4.10744C5.27289 2.94201 6.75774 2.14833 8.37425 1.82679C9.99076 1.50525 11.6663 1.67027 13.189 2.301C14.7118 2.93173 16.0132 3.99984 16.9289 5.37025C17.8446 6.74066 18.3333 8.35182 18.3333 10C18.3309 12.2094 17.4522 14.3276 15.8899 15.8899C14.3276 17.4522 12.2094 18.3309 10 18.3333Z" fill="#737678" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_663_1178">
                                                            <rect width="20" height="20" rx="10" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                        )}
                                        <Image src={data?.image ? data?.image : dummy_profile} alt='...' />
                                    </div>
                                </div>
                                {fieldErrors?.image && <p className='error_message' style={{ bottom: "-5px" }}>{fieldErrors?.image}</p>}
                                <input onChange={handleFileInputChange} accept=".png,.jpeg,.jpg,.webp" type='file' id='profile_image' style={{ display: "none" }} />

                            </div>
                        </div>
                   
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

export default Profile