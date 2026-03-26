import React from 'react'
import dummy_profile from '../../Asset/dummy_profile.svg'
import { useAuth } from '../../../Context/ContextProvider';
import SingleInput from '../Inputs/SingleInput';
import Image from 'next/image';
function AgencyProfile({ data, setData, onSaveSuccess }) {
    const { citiesList, agencyProfile, buttonLoading, getagency, formatPakistaniPhoneNumber, loginData } = useAuth();
    
    // Helper function to format phone number for saving (removes leading 0, 92, +92)
    const formatPhoneForSave = (phone) => {
        if (!phone) return "";
        return formatPakistaniPhoneNumber(phone);
    };
    
    // Helper function to format phone number for display (ensures exactly 10 digits)
    const formatPhoneForDisplay = (phone) => {
        if (!phone || phone === "") return "";
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, "");
        
        // Remove country code if present (+92 or 92)
        if (cleaned.startsWith("92")) {
            cleaned = cleaned.slice(2);
        }
        
        // Remove leading 0 if present (to normalize to 10 digits)
        if (cleaned.startsWith("0")) {
            cleaned = cleaned.slice(1);
        }
        
        // Take only first 10 digits
        cleaned = cleaned.slice(0, 10);
        
        // Return exactly 10 digits (user can type leading 0 if needed)
        return cleaned;
    };

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
        if (!data.mobile) {
            errors.mobile = "Mobile is required.";
        } else if (data.mobile.replace(/\D/g, "").length !== 10) {
            errors.mobile = "Mobile number must be exactly 10 digits.";
        } else if (!isValidPakistaniPhoneNumber("+92" + data.mobile)) {
            errors.mobile = "Please enter a valid phone number.";
        }
        if (!data.description) {
            errors.description = "Description is required.";
        }
        if (!data.agency_image) {
            errors.agency_image = "Image is required.";
        }

        if (data?.landline) {
            const landlineDigits = data.landline.replace(/\D/g, "").length;
            if (landlineDigits !== 9 && landlineDigits !== 10) {
                errors.landline = "Landline number must be 9 or 10 digits.";
            }
        }
        if (!data.whatsapp) {
            errors.whatsapp = "Whatsapp is required.";
        } else if (data.whatsapp.replace(/\D/g, "").length !== 10) {
            errors.whatsapp = "Whatsapp number must be exactly 10 digits.";
        } else if (!isValidPakistaniPhoneNumber("+92" + data.whatsapp)) {
            errors.whatsapp = "Please enter a valid phone number.";
        }
        setFieldErrors(errors);
        // Check if there are any errors
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async () => {
        if (validateStep()) {
            // Format phone numbers properly before saving (strip leading 0, 92, +92)
            const formattedMobile = formatPhoneForSave(data?.mobile);
            const formattedWhatsapp = formatPhoneForSave(data?.whatsapp);
            const formattedLandline = data?.landline ? formatPhoneForSave(data?.landline) : "";
            
            const result = await agencyProfile({
                whatsapp_number: formattedWhatsapp ? "+92" + formattedWhatsapp : "",
                phone_number: formattedMobile ? "+92" + formattedMobile : "",
                landline: formattedLandline ? "+92" + formattedLandline : "",
                city_code: data?.city,
                agency_name: data?.name,
                email: data?.email,
                address: data?.address,
                description: data?.description,
                agency_image: data?.agency_image,
            });
            
            // Reload data after successful save
            if (result?.success) {
                try {
                    const userLOcalData = loginData?.data?.user;
                    const agencyResult = await getagency();
                    if (agencyResult?.success) {
                        let profileData = agencyResult?.data?.data;
                        setData((prevData) => ({
                            ...prevData,
                            name: profileData?.agency_name ? profileData?.agency_name : userLOcalData?.name,
                            mobile: profileData?.phone_number
                                ? formatPhoneForDisplay(profileData?.phone_number)
                                : userLOcalData?.phone_number ? formatPhoneForDisplay(userLOcalData?.phone_number) : "",
                            whatsapp: profileData?.whatsapp_number
                                ? formatPhoneForDisplay(profileData?.whatsapp_number)
                                : userLOcalData?.phone_number ? formatPhoneForDisplay(userLOcalData?.phone_number) : "",
                            landline: profileData?.landline
                                ? formatPhoneForDisplay(profileData?.landline)
                                : "",
                            email: profileData?.email ? profileData?.email : userLOcalData?.email,
                            city: profileData?.city_code
                                ? profileData?.city_code
                                : userLOcalData?.currentCity?.app_code,
                            address: profileData?.address ? profileData?.address : userLOcalData?.address,
                            agency_image: profileData?.agency_image ? profileData?.agency_image : "",
                            description: profileData?.description ? profileData?.description : "",
                        }));
                    }
                } catch (error) {
                    console.error('Error reloading agency data:', error);
                }
                if (onSaveSuccess) {
                    onSaveSuccess();
                }
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
            setFieldErrors((prev) => ({ ...prev, agency_image: undefined }));

            // Check file type
            if (!allowedTypes.includes(file.type)) {
                setFieldErrors((prev) => ({ ...prev, agency_image: "Please upload a valid image format (.png, .jpeg, .jpg, .webp)" }));
                event.target.value = ""; // reset the file input
                return;
            }

            // Check file size
            if (file.size > maxFileSize) {
                setFieldErrors((prev) => ({ ...prev, agency_image: "File size must be less than 1MB" }));
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
                            agency_image: `Image resolution must be maximum ${maxWidth}x${maxHeight} pixels. Current: ${img.width}x${img.height}` 
                        }));
                        inputElement.value = ""; // reset input
                        return;
                    }
                    // Image is valid, save it
                    const base64String = e.target.result;
                    setData((prev) => ({
                        ...prev,
                        agency_image: base64String, // store Base64 image
                    }));
                    // Clear any previous errors
                    setFieldErrors((prev) => ({ ...prev, agency_image: undefined }));
                };
                img.onerror = () => {
                    setFieldErrors((prev) => ({ ...prev, agency_image: "Failed to load image. Please try again." }));
                    inputElement.value = ""; // reset input
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                setFieldErrors((prev) => ({ ...prev, agency_image: "Failed to read file. Please try again." }));
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
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        const isValid = pakistaniPhoneRegex.test(cleanedPhoneNumber);

        return isValid;
    };

    // ✅ Erase / remove image handler
    const handleEraseImage = () => {
        setData((prev) => ({
            ...prev,
            agency_image: '', // remove image
        }));
        document.getElementById('profile_image').value = ''; // clear input
    };

    return (
        <div className='h-100'>
            <div className='profile_setting_form boxes boxes_1 pb-0'>
                <div className='form' style={{ height: "570px" }}>
                    <div className='row m-0'>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 ps-0 pe-lg-3 pe-md-1 pe-0'>
                            <div className='inp_box'>
                                <div className='inp_box city_inp_profile'>
                                    <SingleInput captalizeText={true} errors={fieldErrors?.name} label={"Agency Name"} data={data} setData={setData} varName={"name"} input={true} dropDown={false} width={"100%"} inputType={'text'} placeHolder={"Enter your Name"} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 pe-0 ps-lg-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.email} label={"Email"} data={data} setData={setData} varName={"email"} input={true} dropDown={false} width={"100%"} inputType={'email'} placeHolder={"Enter your Email"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 ps-0 pe-lg-3 pe-md-1 pe-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput forName={"city"} errors={fieldErrors?.city} getVariable={"city"} width={"100%"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 pe-0 ps-lg-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.mobile} label={"Mobile Number"} data={data} setData={setData} varName={"mobile"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your Mobile 0xx-xxxxxxx"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 ps-0 pe-lg-3 pe-md-1 pe-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.landline} label={"Landline Number"} data={data} setData={setData} varName={"landline"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your Landline 0xx-xxxxxxx"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-md-6 col-12 pe-0 ps-lg-3 ps-md-1 ps-0'>
                            <div className='inp_box city_inp_profile'>
                                <SingleInput errors={fieldErrors?.whatsapp} label={"Whatsapp Number"} data={data} setData={setData} varName={"whatsapp"} input={true} dropDown={false} width={"100%"} placeHolder={"Enter your whatsapp 0xx-xxxxxxx"} />
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-12 p-0'>
                            <div className='inp_box city_inp_profile'>
                                <label>Address</label>
                                <textarea className={`${data?.address && "is_data_border"} ${fieldErrors?.address && "error_data_border"}`} onChange={(e) => setData({ ...data, address: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} value={data?.address} placeholder='Please Enter Address' />
                                {fieldErrors?.address && <p className='error_message' style={{ bottom: "-29px" }}>{fieldErrors?.address}</p>}
                            </div>
                        </div>
                        <div style={{ marginTop: "8px" }} className='col-12 p-0'>
                            <div className='inp_box city_inp_profile'>
                                <label>Describe about Agency</label>
                                <textarea className={`${data?.description && "is_data_border"} ${fieldErrors?.description && "error_data_border"}`} onChange={(e) => setData({ ...data, description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })} value={data?.description} placeholder='Please Enter Description' />
                                {fieldErrors?.description && <p className='error_message' style={{ bottom: "-29px" }}>{fieldErrors?.description}</p>}
                            </div>
                        </div>

                        <div style={{ marginTop: "8px" }} className='col-12 p-0'>
                            <div className='inp_box'>
                                <label>Upload Picture</label>
                                <div style={{ borderColor: `${fieldErrors?.agency_image ? "#C94444" : ""}` , gap:"12px"}} className='upload_profile flex-md-row flex-column align-items-md-center align-items-start justify-content-md-between justify-content-start'>
                                    <label for="profile_image" style={{ gap: "23px" }} className='d-flex align-items-sm-center align-items-start  flex-sm-row flex-column'>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                                                <path d="M25.5 17.5V22.8333C25.5 23.5406 25.219 24.2189 24.719 24.719C24.2189 25.219 23.5406 25.5 22.8333 25.5H4.16667C3.45942 25.5 2.78115 25.219 2.28105 24.719C1.78095 24.2189 1.5 23.5406 1.5 22.8333V17.5M20.1667 8.16667L13.5 1.5M13.5 1.5L6.83333 8.16667M13.5 1.5V17.5" stroke="#447158" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span>Upload or Drag and Drop your social media content</span>
                                            <ul className='p-0 m-0'>
                                                <li>Maximum File Size: 1MB</li>
                                                <li>Maximum Resolution: 1200x1200 pixels</li>
                                                <li>Supported File Types are .png, .jpeg, .jpg, .webp</li>
                                            </ul>
                                        </div>
                                    </label>
                                    <div className='img_form' style={{ position: "relative", display: "flex", justifyContent: "end" }}>
                                        <Image src={data?.agency_image ? data?.agency_image : dummy_profile} alt='...' />
                                        {data?.agency_image && (
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
                                    </div>
                                </div>
                                {fieldErrors?.agency_image && <p className='error_message' style={{ bottom: "-5px" }}>{fieldErrors?.agency_image}</p>}
                                <input onChange={handleFileInputChange} accept=".png,.jpeg,.jpg,.webp" type='file' id='profile_image' style={{ display: "none" }} />

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='bottom_btn'>
                <button type="button" onClick={handleSubmit}>{buttonLoading ? <div className="spinner-border text-light" role="status">
                </div> : "Save Changes"}</button>
            </div>
        </div>
    )
}

export default AgencyProfile