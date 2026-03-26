import React, { useEffect, useState } from 'react'
import MultiMenuInput from '../Component/Inputs/MultiMenuInputs';
import SingleInput from '../Component/Inputs/SingleInput';
import DropDownField from '../Component/Inputs/DropDownField';
import IOSSwitch from '../Component/Inputs/IOSSwitch';
import logo from '../../Asset/HomePage/Logo.svg'
import { useAuth } from '../../Context/ContextProvider';
import AmenitiesModal from '../Component/Modal/AmenitiesModal';
import dots from '../../Asset/HomePage/Bg.svg'
import { Stepper, Step, StepLabel } from "@mui/material";


import Image from 'next/image';
const stepperIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3.5625 12C3.5625 14.2378 4.45145 16.3839 6.03379 17.9662C7.61612 19.5486 9.76224 20.4375 12 20.4375C14.2378 20.4375 16.3839 19.5486 17.9662 17.9662C19.5486 16.3839 20.4375 14.2378 20.4375 12C20.4375 9.76224 19.5486 7.61612 17.9662 6.03379C16.3839 4.45145 14.2378 3.5625 12 3.5625C9.76224 3.5625 7.61612 4.45145 6.03379 6.03379C4.45145 7.61612 3.5625 9.76224 3.5625 12Z" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.1875 12L11.0625 13.875L14.8125 10.125" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>

function AddProperty() {
    const { button_loading, handleAddProperty, loginData, areaUnit, formatPakistaniPhoneNumber, formatPakistaniLandline } = useAuth()
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        purpose: "",
        slug: "sell",
        propertyType: {
            type: '',
            subType: ''
        },
        city: '',
        location: '',
        plot_number: 'p-235',
        areaValue: '',
        areaUnit: {
            id: 4,
            name: "Marla",
            code: "marla"
        },
        priceValue: '',
        priceUnit: {
            name: "PKR",
            id: "PKR"
        },
        installment: false,
        possession: false,
        advanceAmount: '',
        no_of_installment: [],
        monthlyInstallment: '',
        bedroom: '',
        bathroom: '',
        amenities: [],
        listingTitle: '',
        listingDescription: "",
        images: [],
        videos: [""],
        email: loginData?.data?.user?.email,
        landline: formatPakistaniLandline(loginData?.data?.user?.landline),
        contact: [formatPakistaniPhoneNumber(loginData?.data?.user?.phone_number),
            ""
        ],
        platform: true
    })

    const steps = [
        'Location & Purpose',
        'Price & Area',
        'Facilities & Amenities',
        'Information',
        "Images & Videos",
        'Contact Information',
        'Platform Selection'
    ];
    const [subMenu, setSubMenu] = useState([])
    const unit = [{
        name: "PKR",
        id: "PKR"
    },
    {
        name: "USD",
        id: "USD"
    },
    {
        name: "EUR",
        id: "EUR"
    },
    {
        name: "GBP",
        id: "GBP"
    },
    {
        name: "SAR",
        id: "SAR"
    },
    {
        name: "AED",
        id: "AED"
    },
    ]
    const installmentNumber = [
        {
            name: "1 Year",
            id: 1
        },
        {
            name: "2 Year",
            id: 2
        },
        {
            name: "3 Year",
            id: 3
        },
        {
            name: "4 Year",
            id: 4
        },
        {
            name: "5 Year",
            id: 5
        },
        {
            name: "6 Year",
            id: 6
        }]
    const bedMenu = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]
    const bathMenu = ["1", "2", "3", "4", "5", "6+"]
    const adGuidelines = [
        "Ads with images receive 5x more views.",
        "Upload high-quality pictures with proper lighting and dimensions (minimum width: 450px, minimum height: 250px).",
        "Each image should not exceed 10 MB."
    ];

    const videoGuildline = ["Add videos of your property from Youtube.", "Upload on Youtube and paste the link below."]




    const handleRemove = (category_id, amenity_id) => {
        // Since amenities is a flat array, just filter out the specific amenity
        let updatedAmenities = data?.amenities?.filter((amenity) => {
            return !(amenity.category_id == category_id && amenity.id == amenity_id);
        });

        // Update the state with the new array
        setData({ ...data, amenities: updatedAmenities });
    };
    const [images, setImages] = useState([])
    // Handle file selection
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to array
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        const maxImageSize = 10 * 1024 * 1024; // 10 MB
        let validFiles = [];
        let base64Strings = [];
        files.forEach((file) => {
            if (validImageTypes.includes(file.type) && file.size <= maxImageSize) {
                validFiles.push(file);
            } else {
                alert(
                    `${file.name} is invalid. Please upload images under 10 MB (jpeg/png/webp)`
                );
            }
        });
        if (validFiles.length > 0) {
            setData({ ...data, images: [...data.images || [], ...validFiles] });
            const fileReaders = validFiles.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        base64Strings.push(e.target.result);
                        resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(fileReaders)
                .then(() => {
                    setImages([...images, ...base64Strings]);
                })
                .catch((error) => {
                    console.error("Error reading files:", error);
                });
        }
        event.target.value = null; // Reset file input
    };

    const removeImage = (index) => {
        const result = images.filter((_, i) => {
            return i !== index
        })
        setImages(result);
        setData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Add new video input
    const handleAddVideo = () => {
        setData((prev) => ({
            ...prev,
            videos: [...prev.videos, ""],
        }));
    };

    // Update video link value
    const handleVideoChange = (index, value) => {
        const updatedVideos = [...data.videos];
        updatedVideos[index] = value;
        setData((prev) => ({
            ...prev,
            videos: updatedVideos,
        }));
    };

    const handleDeleteVideo = (index) => {
        const updatedVideos = data.videos.filter((_, i) => i !== index);
        setData((prev) => ({
            ...prev,
            videos: updatedVideos,
        }));
    };


    const { propertyType, citiesList, locationList, getAmintites } = useAuth()
    useEffect(() => {
        if (propertyType?.length) {
            setSubMenu(propertyType[0]?.categories)

        }

    }, [propertyType])


    const handlePurposeChange = (value) => {
        let subPropertyType = propertyType?.find((item) => item?.id === value)?.categories
        setSubMenu(subPropertyType)

        setData((prev) => ({
            ...prev,
            purpose: value,
            propertyType: {
                type: '',
                subType: ''
            },
        }));
    };


    const handleCheckValidation = async () => {
        let tempErrors = {};
        if (!data.purpose) tempErrors.purpose = "Purpose is required.";
        if (!data.propertyType.type) tempErrors.propertyTypeType = "Property type is required.";
        if (!data.propertyType.subType) tempErrors.propertyTypeSubType = "Property sub-type is required.";
        if (!data.city) tempErrors.city = "City is required.";
        if (!data.location) tempErrors.location = "Location is required.";
        if (!data.areaValue) tempErrors.areaValue = "Area value is required.";
        if (!data.priceValue) tempErrors.priceValue = "Price value is required.";

        if (data.installment) {
            if (!data.advanceAmount) tempErrors.advanceAmount = "Advance amount is required.";
            if (data.no_of_installment.length == 0) tempErrors.no_of_installment = "Number of installments is required.";
            if (!data.monthlyInstallment) tempErrors.monthlyInstallment = "Monthly installment is required.";
        }

        if (!data.listingTitle) tempErrors.listingTitle = "Listing title is required.";
        if (!data.listingDescription) tempErrors.listingDescription = "Listing description is required.";
        if (data.images.length < 3) tempErrors.images = "At least three images are required.";

        if (!data.email) tempErrors.email = "Email is required.";
        // if (!data.landline) tempErrors.landline = "Landline is required.";

        // At least one contact required
        if (!data.contact || data.contact.length === 0 || !data.contact.some(num => String(num || "").trim())) {
            tempErrors.contact = "At least one contact is required.";
        }




        setErrors(tempErrors);
        if (Object.keys(tempErrors).length === 0) {
            let result = await handleAddProperty(data);
            if (result?.success) {
                setData({
                    purpose: "",
                    slug: "sell",
                    propertyType: {
                        type: '',
                        subType: ''
                    },
                    city: '',
                    location: '',
                    plot_number: 'p-235',
                    areaValue: '',
                    areaUnit: {
                        id: 4,
                        name: "Marla",
                        code: "marla"
                    },
                    priceValue: '',
                    priceUnit: {
                        name: "PKR",
                        id: "PKR"
                    },
                    installment: false,
                    possession: false,
                    advanceAmount: '',
                    no_of_installment: [],
                    monthlyInstallment: '',
                    bedroom: '',
                    bathroom: '',
                    amenities: [],
                    listingTitle: '',
                    listingDescription: "",
                    images: [],
                    videos: [""],
                    email: loginData?.data?.user?.email,
                    landline: formatPakistaniLandline(loginData?.data?.user?.landline),
                    contact: [formatPakistaniPhoneNumber(loginData?.data?.user?.phone_number),
                        ""
                    ],
                    platform: true
                })
                setImages([])
                return true;
            }
            else {
                return false;

            }

        }

        return false;
    };
    const [amenities, setAmenties] = useState([])

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} Thousand`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num.toString();
    };
    function CustomStepIcon(props) {
        const { active, completed, className } = props;

        return (
            <div
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: completed ? "#FFF" : active ? "#FFF" : "#FFF",
                    color: completed || active ? "#fff" : "#FFF",
                    position: "relative",
                }}
            >
                {completed ? stepperIcon : stepperIcon}
            </div>
        );
    }
    return (
        <div className="special-add-property-box">
            <div className='add-propery portal-page-container' style={{borderRadius:"0 0 12px 12px"}}>
            <p className='portal-breadCrums m-0 d-sm-flex d-none'>Home - Property-Management - <span>Add Property</span></p>
        <div className="new-add-property-box">
        <div className='add_property_steps'>
                <div className='d-flex align-items-md-center w-100 flex-md-row flex-column py-md-0 py-3' style={{ gap: "20px", overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
                    <h4 style={{width:"200px" , whiteSpace:"nowrap", flexShrink: 0}}>Add Property</h4>
                  <div className="div w-100" style={{overflowX:"auto", overflowY:"hidden", minWidth: "0", flex: "1"}}>
                  <Stepper
                        sx={{
                            "& .MuiStepLabel-label": {
                                color: "#fff", // make all labels white
                            },
                            "& .MuiStepLabel-label.Mui-active": {
                                color: "#fff !important", // force active white
                            },
                            "& .MuiStepLabel-label.Mui-completed": {
                                color: "#fff !important", // force completed white
                            },
                        }} style={{ minWidth: "1000px", width: "100%" }} activeStep={1} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                  </div>
                </div>
                <div className="img">
                    <Image src={dots} alt="" />
                </div>
            </div>
            <div className="setting-container">
                <div className="add-property-settings">
                    <div className="setting-section">
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 0C6.99844 0 3 3.99844 3 9C3 10.7297 3.51562 12.0656 4.41094 13.4203L11.0531 23.4984C11.2547 23.8031 11.6016 24 12 24C12.3984 24 12.75 23.7984 12.9469 23.4984L19.5891 13.4203C20.4844 12.0656 21 10.7297 21 9C21 3.99844 17.0016 0 12 0ZM12 13.9969C9.23906 13.9969 6.99844 11.7563 6.99844 8.99063C6.99844 6.225 9.23906 3.98438 12 3.98438C14.7609 3.98438 17.0016 6.225 17.0016 8.99063C17.0016 11.7563 14.7609 13.9969 12 13.9969Z" fill="white" />
                                </svg>
                            </div>
                            <div className="title">Location & Purpose</div>
                        </div>
                        <div className="section-inputs">
                            <div className="input-box" style={{ flexWrap: "wrap" }}>
                                <label>Select Purpose</label>
                                <div>
                                    <span>
                                        {propertyType?.map((item) => {
                                            return (

                                                <div className={data?.purpose === item?.id ? "tab active" : "tab"} onClick={() => handlePurposeChange(item?.id)}>{item?.name}</div>
                                            )
                                        })}
                                    </span>
                                </div>
                            </div>
                            <MultiMenuInput errors={errors} label={"Property Type"} data={data} setData={setData} varName={"propertyType"} type="type" subType={"subType"} menuData={subMenu} placeHolder={"Select"} />
                            <SingleInput errors={errors?.city} getVariable={"city"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />
                            <SingleInput errors={errors?.location} getVariable={"name"} label={"Location"} data={data} setData={setData} varName={"location"} menuData={locationList} input={false} dropDown={true} placeHolder={"Enter Location"} />
                        </div>
                    </div>
                    <div className="setting-section price-and-area" style={{ border: 'unset', paddingBottom: "0", gap: 'unset' }}>
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_351_3739)">
                                        <path d="M0.649799 0.650009C1.0707 0.228884 1.64302 -0.00504143 2.23815 0.000208569L9.429 0.0635836C10.0106 0.0686836 10.5669 0.302084 10.9782 0.713384L23.3502 13.0855C24.2166 13.9516 24.2166 15.3564 23.3502 16.2229L16.2229 23.35C15.3565 24.2167 13.9518 24.2167 13.0853 23.35L0.713249 10.9783C0.302025 10.5668 0.0686989 10.0106 0.0635986 9.42891L7.43866e-05 2.23813C-0.00517464 1.64316 0.228973 1.07068 0.649799 0.650009ZM4.94707 8.53258C5.9373 9.52311 7.54268 9.52296 8.5329 8.53273C9.52305 7.54281 9.52305 5.93743 8.53282 4.94691C7.5426 3.95698 5.9373 3.95713 4.94707 4.94691C3.95692 5.93736 3.95685 7.54266 4.94707 8.53258Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_351_3739">
                                            <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="title">Price & Area</div>
                        </div>
                        <span className='d-flex' style={{ gap: ' 30px', margin: '16px 0', flexWrap: 'wrap' }}>
                            <div className="d-flex align-items-end" style={{ gap: '8px' }}>
                                <SingleInput errors={errors?.areaValue} label={"Area"} data={data} setData={setData} varName={"areaValue"} input={true} dropDown={false} width={"481px"} placeHolder={"Enter Value"} />
                                <DropDownField getName={"name"} active={true} data={data} setData={setData} varName={"areaUnit"} menuData={areaUnit} />
                            </div>
                            <div className="d-flex align-items-end" style={{ gap: '8px' }}>
                                <SingleInput priceChanger={formatNumber(data?.priceValue)} errors={errors?.priceValue} label={"Price"} data={data} setData={setData} varName={"priceValue"} input={true} dropDown={false} width={"481px"} placeHolder={"Enter Amount"} />
                                <DropDownField getName={"name"} data={data} setData={setData} varName={"priceUnit"} menuData={unit} />
                            </div>
                        </span>
                        <span className='d-flex optional-box w-100 flex-sm-nowrap flex-wrap' style={{ gap: "20px 320px" }}>
                            <div className="input-box">
                                <label>Installment</label>
                                <div className='d-flex align-items-center' style={{ gap: '12px', marginTop: '10px' }}>
                                    <IOSSwitch
                                        checked={data.installment}
                                        onChange={(e) =>
                                            setData((prev) => ({ ...prev, installment: e.target.checked }))
                                        }
                                    />
                                    <div className='para'>Click if listing available on instalments</div>
                                </div>
                            </div>
                            <div className="input-box">
                                <label>Possession</label>
                                <div className='d-flex align-items-center' style={{ gap: '12px', marginTop: '10px' }}>
                                    <IOSSwitch
                                        checked={data.possession}
                                        onChange={(e) =>
                                            setData((prev) => ({ ...prev, possession: e.target.checked }))
                                        }
                                    />
                                    <div className='para'>Click if listing available on possession</div>
                                </div>
                            </div>
                        </span>
                        {
                            data?.installment &&
                            <>  <div className="seperator-line"></div>
                                <span className='d-flex' style={{ gap: '16px 30px', flexWrap: 'wrap' }}>
                                    <div className="d-flex align-items-end" style={{ gap: '8px' }}>
                                        <SingleInput errors={errors?.advanceAmount} label={"Advance Amount"} data={data} setData={setData} varName={"advanceAmount"} input={true} dropDown={false} width={"481px"} placeHolder={"Enter Amount"} />
                                        <DropDownField data={data} setData={setData} varName={"priceUnit"} menuData={unit} />
                                    </div>
                                    <div className="d-flex align-items-end installment-input" style={{ gap: '8px' }}>
                                        <div className="input-box">
                                            <label style={{ marginBottom: '8px' }}>No. of Installments</label>
                                            <DropDownField active={true} errors={errors?.no_of_installment} data={data} setData={setData} varName={"no_of_installment"} getName={'name'} label={"Enter Value"} menuData={installmentNumber} width={"595px"} />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-end" style={{ gap: '8px' }}>
                                        <SingleInput errors={errors?.monthlyInstallment} label={"Monthly Installments"} data={data} setData={setData} varName={"monthlyInstallment"} input={true} dropDown={false} width={"481px"} placeHolder={"Enter Amount"} />
                                        <DropDownField data={data} setData={setData} varName={"priceUnit"} menuData={unit} />
                                    </div>
                                </span>
                            </>
                        }
                        <div className="seperator-line mb-0"></div>
                    </div>
                    <div className="setting-section">
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.5549 8.16797L12.5549 2.16797C12.3908 2.05814 12.1977 1.99951 12.0002 1.99951C11.8027 1.99951 11.6097 2.05814 11.4455 2.16797L2.44551 8.16797C2.33618 8.24075 2.24228 8.33438 2.16916 8.44348C2.09605 8.55259 2.04515 8.67504 2.0194 8.80383C1.99365 8.93262 1.99353 9.06523 2.01907 9.19406C2.0446 9.3229 2.09528 9.44544 2.16821 9.55467C2.26043 9.68937 2.38484 9.7989 2.53014 9.87331C2.67543 9.94772 2.83702 9.98466 3.00021 9.98077V21C3.00013 21.1313 3.02595 21.2614 3.07617 21.3827C3.1264 21.5041 3.20006 21.6144 3.29293 21.7073C3.3858 21.8001 3.49607 21.8738 3.61744 21.924C3.7388 21.9742 3.86887 22 4.00021 22H20.0002C20.1316 22 20.2616 21.9742 20.383 21.924C20.5044 21.8738 20.6146 21.8001 20.7075 21.7073C20.8004 21.6144 20.874 21.5041 20.9243 21.3827C20.9745 21.2614 21.0003 21.1313 21.0002 21V9.99997C21.2148 9.99995 21.4237 9.93089 21.5961 9.803C21.7684 9.6751 21.895 9.49516 21.9572 9.28976C22.0194 9.08436 22.0139 8.8644 21.9414 8.66238C21.869 8.46037 21.7335 8.28703 21.5549 8.16797ZM16.716 12.7539L15.0685 14.4424L15.4591 16.8389C15.4825 16.9819 15.4744 17.1284 15.4356 17.2681C15.3967 17.4077 15.3279 17.5373 15.234 17.6477C15.1401 17.7582 15.0233 17.8469 14.8917 17.9077C14.7601 17.9685 14.6169 18 14.4719 18C14.3028 18.0002 14.1363 17.9572 13.9885 17.875L12.0002 16.7764L10.0119 17.875C9.84766 17.9657 9.66119 18.0085 9.4738 17.9983C9.28641 17.9881 9.10568 17.9253 8.95226 17.8172C8.79884 17.7092 8.67894 17.5601 8.60625 17.3871C8.53356 17.2141 8.51102 17.0241 8.54121 16.8389L8.93181 14.4424L7.28441 12.7539C7.15614 12.6223 7.0666 12.4579 7.02563 12.2788C6.98466 12.0996 6.99385 11.9127 7.05217 11.7384C7.1105 11.5641 7.21572 11.4093 7.35627 11.291C7.49682 11.1726 7.66727 11.0952 7.84891 11.0674L10.0852 10.7256L11.0952 8.57557C11.1759 8.40363 11.3039 8.25823 11.4642 8.15639C11.6245 8.05454 11.8105 8.00045 12.0005 8.00045C12.1904 8.00045 12.3764 8.05454 12.5367 8.15639C12.697 8.25823 12.825 8.40363 12.9057 8.57557L13.9157 10.7256L16.152 11.0674C16.3336 11.0953 16.504 11.1727 16.6445 11.2911C16.785 11.4095 16.8901 11.5643 16.9484 11.7386C17.0067 11.9128 17.0158 12.0998 16.9748 12.2789C16.9338 12.458 16.8443 12.6223 16.716 12.7539Z" fill="white" />
                                </svg>
                            </div>
                            <div className="title">Features & Amenities</div>
                        </div>
                        <div className="section-input d-flex align-items-center" style={{ gap: '20px 52px', flexWrap: "wrap" }}>
                            <div className="input-box" style={{ flexWrap: "wrap" }}>
                                <label>Bedrooms</label>
                                <div className="tab-box">
                                    {bedMenu.map((item) => (
                                        <div className={data?.bedroom === item ? 'tab active' : 'tab'} onClick={() => setData((prev) => ({ ...prev, bedroom: item }))}>{item}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="input-box">
                                <label>Bathrooms</label>
                                <div className="tab-box">
                                    {bathMenu.map((item) => (
                                        <div className={data?.bathroom === item ? 'tab active' : 'tab'} onClick={() => setData((prev) => ({ ...prev, bathroom: item }))}>{item}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="amenities mt-1">
                            <div className="input-box d-flex align-items-center" style={{ gap: '12px' }}>
                                <label>Add Amenities</label> <span onClick={async () => {
                                    let result = await getAmintites('1')
                                    setAmenties(result?.data?.data?.categories);
                                    setOpen(!open)
                                }} className='primary-button'>Add</span>
                            </div>
                        </div>
                        <div className="features mt-1">
                            {data?.amenities && data?.amenities?.length > 0 ? (
                                // Group amenities by category_id
                                Object.entries(
                                    data.amenities.reduce((groups, amenity) => {
                                        const categoryId = amenity.category_id;
                                        if (!groups[categoryId]) {
                                            groups[categoryId] = [];
                                        }
                                        groups[categoryId].push(amenity);
                                        return groups;
                                    }, {})
                                ).map(([categoryId, categoryAmenities]) => {
                                    // Get category name from first amenity
                                    const categoryName = categoryAmenities[0]?.category_name || `Category ${categoryId}`;
                                    
                                    return (
                                    <div className="input-box" key={categoryId}>
                                        <label>{categoryName}</label>
                                        <div className="tag-box">
                                            {categoryAmenities.map((amenity, idx) => {
                                                const displayValue = amenity?.pivot?.value || amenity?.value;
                                                const displayText = amenity?.input_value_type === "text" || amenity?.input_value_type === "select"
                                                    ? `${amenity?.label} : ${displayValue}`
                                                    : amenity?.label;
                                                    
                                                return (
                                                <div
                                                    key={idx}
                                                    className="tag"
                                                    onClick={() => handleRemove(
                                                        amenity?.category_id,
                                                        amenity?.id
                                                    )}
                                                >
                                                    {displayText}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                    >
                                                        <g clipPath="url(#clip0_663_1058)">
                                                            <rect width="20" height="20" rx="10" fill="white" />
                                                            <path
                                                                d="M13.3332 6.66684C13.1769 6.51061 12.965 6.42285 12.744 6.42285C12.5231 6.42285 12.3111 6.51061 12.1549 6.66684L9.99987 8.82184L7.84487 6.66684C7.68771 6.51504 7.47721 6.43105 7.25871 6.43295C7.04021 6.43484 6.8312 6.52248 6.67669 6.67699C6.52219 6.8315 6.43455 7.04051 6.43265 7.25901C6.43075 7.4775 6.51475 7.688 6.66654 7.84517L8.82154 10.0002L6.66654 12.1552C6.51475 12.3123 6.43075 12.5228 6.43265 12.7413C6.43455 12.9598 6.52219 13.1688 6.67669 13.3234C6.8312 13.4779 7.04021 13.5655 7.25871 13.5674C7.47721 13.5693 7.68771 13.4853 7.84487 13.3335L9.99987 11.1785L12.1549 13.3335C12.312 13.4853 12.5225 13.5693 12.741 13.5674C12.9595 13.5655 13.1685 13.4779 13.323 13.3234C13.4776 13.1688 13.5652 12.9598 13.5671 12.7413C13.569 12.5228 13.485 12.3123 13.3332 12.1552L11.1782 10.0002L13.3332 7.84517C13.4894 7.6889 13.5772 7.47698 13.5772 7.25601C13.5772 7.03504 13.4894 6.82311 13.3332 6.66684Z"
                                                                fill="#737678"
                                                            />
                                                            <path
                                                                d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10 18.3333C8.35183 18.3333 6.74066 17.8446 5.37025 16.9289C3.99984 16.0132 2.93174 14.7117 2.30101 13.189C1.67028 11.6663 1.50525 9.99076 1.82679 8.37425C2.14834 6.75774 2.94201 5.27288 4.10745 4.10744C5.27289 2.94201 6.75774 2.14833 8.37425 1.82679C9.99076 1.50525 11.6663 1.67027 13.189 2.301C14.7118 2.93173 16.0132 3.99984 16.9289 5.37025C17.8446 6.74066 18.3333 8.35182 18.3333 10C18.3309 12.2094 17.4522 14.3276 15.8899 15.8899C14.3276 17.4522 12.2094 18.3309 10 18.3333Z"
                                                                fill="#737678"
                                                            />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_663_1058">
                                                                <rect width="20" height="20" rx="10" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    );
                                })
                            ) : (
                                ''
                            )}
                        </div>


                    </div>
                    <div className="setting-section">
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 5C2 3.34315 3.34315 2 5 2H15C16.6569 2 18 3.34315 18 5V9.28988C17.3663 9.10128 16.695 9 16 9C12.134 9 9 12.134 9 16C9 18.5463 10.3596 20.7751 12.3924 22H5C3.34315 22 2 20.6569 2 19V5ZM6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7H12C12.5523 7 13 6.55228 13 6C13 5.44772 12.5523 5 12 5H6ZM5 12C5 11.4477 5.44772 11 6 11H8C8.55228 11 9 11.4477 9 12C9 12.5523 8.55228 13 8 13H6C5.44772 13 5 12.5523 5 12ZM6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10H10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8H6Z" fill="white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16ZM16 13C16.5523 13 17 13.4477 17 14V15H18C18.5523 15 19 15.4477 19 16C19 16.5523 18.5523 17 18 17H17V18C17 18.5523 16.5523 19 16 19C15.4477 19 15 18.5523 15 18V17H14C13.4477 17 13 16.5523 13 16C13 15.4477 13.4477 15 14 15H15V14C15 13.4477 15.4477 13 16 13Z" fill="white" />
                                </svg>
                            </div>
                            <div className="title">Ad Information</div>
                        </div>
                        <div className="input-box" style={{ position: "relative" }}>
                            <label>Title</label>
                            <input
                                value={data?.listingTitle}
                                className={`${data?.listingTitle ? 'input focus' : 'input'} ${errors?.listingTitle ? 'error' : ''}`}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                                    setData((prev) => ({ ...prev, listingTitle: capitalizedValue }));
                                }}
                                type="text"
                                placeholder="Enter Title of Listing"
                            />

                            {errors?.listingTitle ? <div className="error-message">{errors?.listingTitle}</div> : ""}
                        </div>
                        <div className="input-box" style={{ position: "relative" }}>
                            <label>Description</label>
                            <textarea
                                style={{ height: 'unset' }}
                                rows={5}
                                value={data?.listingDescription}
                                className={`${data?.listingDescription ? 'input focus' : 'input'} ${errors?.listingDescription ? 'error' : ''}`}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                                    setData((prev) => ({ ...prev, listingDescription: capitalizedValue }));
                                }}
                                placeholder="Describe your property here ..."
                            />

                            {errors?.listingDescription ? <div className="error-message">{errors?.listingDescription}</div> : ""}
                        </div>
                    </div>
                    <div className="setting-section">
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.125 6.75C1.4475 6.50813 1.84125 6.375 2.25 6.375H7.785L8.25 5.90887C8.45625 5.70337 8.69626 5.54138 8.95876 5.42963L8.09624 4.5645C7.81499 4.28288 7.4325 4.125 7.035 4.125H2.25C1.6275 4.125 1.125 4.62863 1.125 5.25V6.75Z" fill="white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.25 19.875C11.01 19.5525 10.875 19.158 10.875 18.75C10.875 16.8173 10.875 11.6827 10.875 9.75C10.875 9.25275 11.0737 8.77575 11.4225 8.424C11.775 8.07263 12.2513 7.875 12.75 7.875H21.375V7.125C21.375 6.8265 21.255 6.54037 21.045 6.32962C20.835 6.1185 20.55 6 20.25 6H9.84C9.4425 6 9.06001 6.15788 8.77876 6.4395L8.31377 6.90525C8.17502 7.04587 7.98375 7.125 7.785 7.125H2.25C1.95 7.125 1.665 7.2435 1.455 7.45462C1.245 7.66537 1.125 7.9515 1.125 8.25V18.75C1.125 19.0485 1.245 19.3346 1.455 19.5454C1.665 19.7565 1.95 19.875 2.25 19.875H11.25Z" fill="white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22.875 9.75C22.875 9.4515 22.755 9.16537 22.545 8.95462C22.335 8.7435 22.05 8.625 21.75 8.625C19.8188 8.625 14.6813 8.625 12.75 8.625C12.45 8.625 12.165 8.7435 11.955 8.95462C11.745 9.16537 11.625 9.4515 11.625 9.75V18.75C11.625 19.0485 11.745 19.3346 11.955 19.5454C12.165 19.7565 12.45 19.875 12.75 19.875H21.75C22.05 19.875 22.335 19.7565 22.545 19.5454C22.755 19.3346 22.875 19.0485 22.875 18.75V9.75ZM16.3313 11.0006C15.9863 10.7887 15.5513 10.7812 15.195 10.9804C14.8425 11.1795 14.6212 11.5545 14.6212 11.961V16.539C14.6212 16.9455 14.8425 17.3205 15.195 17.5196C15.5513 17.7188 15.9863 17.7113 16.3313 17.4994L20.085 15.2104C20.4188 15.0064 20.625 14.6423 20.625 14.25C20.625 13.8577 20.4188 13.4936 20.085 13.2896L16.3313 11.0006Z" fill="white" />
                                </svg>
                            </div>
                            <div className="title">Images & Videos</div>
                        </div>
                        <div className={`image-section mt-1 ${errors.images ? "error" : ""}`} style={{ position: "relative" , overflow:"unset" }}>
                            <div className="row m-0">
                                <div className="col-12 p-0 d-flex align-items-center justify-content-md-start justify-content-between" style={{ gap: '20px', flexWrap: "wrap" }}><div className="title">Upload Images of your Property</div>
                                    <span className="ms-3">
                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg , image/webp"
                                            multiple
                                            style={{ display: "none" }}
                                            id="ImagefileInput"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="ImagefileInput" className="primary-button">
                                            Add
                                        </label>
                                        <p>Max size 5MB, .jpg .png only</p>
                                    </span>


                                    <div className="description">
                                        {adGuidelines.map((item) => (
                                            <div className="para"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <g clipPath="url(#clip0_663_1164)">
                                                    <path d="M8.67206 5.93777L2.04081 9.25965C1.85035 9.35148 1.63682 9.3844 1.42754 9.35419C1.21827 9.32399 1.02276 9.23203 0.866048 9.09008C0.709334 8.94813 0.598537 8.76265 0.547834 8.55737C0.497132 8.3521 0.50883 8.13636 0.581432 7.93777L1.70956 5.00027L0.581432 2.06277C0.505377 1.86395 0.491174 1.64678 0.540683 1.43974C0.590192 1.23271 0.701104 1.04546 0.858878 0.902551C1.01665 0.759642 1.21393 0.667741 1.42484 0.638894C1.63575 0.610048 1.85045 0.645602 2.04081 0.740897L8.67206 4.06277C8.8411 4.15412 8.9823 4.28948 9.08071 4.45451C9.17912 4.61955 9.23108 4.80812 9.23108 5.00027C9.23108 5.19242 9.17912 5.38099 9.08071 5.54603C8.9823 5.71107 8.8411 5.84642 8.67206 5.93777Z" fill="#447158" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_663_1164">
                                                        <rect width="10" height="10" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="seperator-line"></div>
                                <div className="div" style={{overflow:"hidden" , maxWidth:"87vw"}}>
                                <div className="posted-images-section">
                                    {images?.map((img, index) => (
                                        <div className="img">
                                            <Image src={img} alt={`upload-${index}`} />
                                            <div className="cancel-btn" onClick={() => removeImage(index)}>
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
                                        </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                            {errors?.images ? <div className="error-message" style={{ bottom: "-17px", left: '0' }}>{errors?.images}</div> : ''}
                        </div>
                        <div className={`image-section mt-1 ${errors.videos ? "error" : ""}`} style={{ position: "relative" }}>
                            <div className="row m-0">
                                <div className="col-12 p-0 d-flex align-items-center justify-content-md-start justify-content-between" style={{ gap: '20px', flexWrap: "wrap" }}><div className="title">Upload Videos of your Property</div>
                                    <span className="ms-3">
                                        <label onClick={handleAddVideo} className="primary-button">
                                            Add
                                        </label>
                                    </span>
                                    <div className="description">
                                        {videoGuildline.map((item) => (
                                            <div className="para"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <g clipPath="url(#clip0_663_1164)">
                                                    <path d="M8.67206 5.93777L2.04081 9.25965C1.85035 9.35148 1.63682 9.3844 1.42754 9.35419C1.21827 9.32399 1.02276 9.23203 0.866048 9.09008C0.709334 8.94813 0.598537 8.76265 0.547834 8.55737C0.497132 8.3521 0.50883 8.13636 0.581432 7.93777L1.70956 5.00027L0.581432 2.06277C0.505377 1.86395 0.491174 1.64678 0.540683 1.43974C0.590192 1.23271 0.701104 1.04546 0.858878 0.902551C1.01665 0.759642 1.21393 0.667741 1.42484 0.638894C1.63575 0.610048 1.85045 0.645602 2.04081 0.740897L8.67206 4.06277C8.8411 4.15412 8.9823 4.28948 9.08071 4.45451C9.17912 4.61955 9.23108 4.80812 9.23108 5.00027C9.23108 5.19242 9.17912 5.38099 9.08071 5.54603C8.9823 5.71107 8.8411 5.84642 8.67206 5.93777Z" fill="#447158" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_663_1164">
                                                        <rect width="10" height="10" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>{item}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="seperator-line"></div>
                                <div className="posted-images-section" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                    {data.videos.map((video, index) => (
                                        <div key={index} className="input-box w-100">
                                            <label>Video Link {index + 1}</label>
                                            <div className="input">
                                                <input className='w-100'
                                                    type="text"
                                                    value={video}
                                                    placeholder={`Enter video link ${index + 1}`}
                                                    onChange={(e) => handleVideoChange(index, e.target.value)}
                                                />
                                                {index !== 0 && (
                                                    <svg
                                                        onClick={() => handleDeleteVideo(index)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <path
                                                            d="M3.33301 5.83325H16.6663"
                                                            stroke="#C94444"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M5 8.33325L6.41784 16.1314C6.56193 16.9239 7.25215 17.4999 8.05763 17.4999H11.9423C12.7478 17.4999 13.4381 16.9238 13.5822 16.1314L15 8.33325"
                                                            stroke="#C94444"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M7.5 4.16667C7.5 3.24619 8.24619 2.5 9.16667 2.5H10.8333C11.7538 2.5 12.5 3.24619 12.5 4.16667V5.83333H7.5V4.16667Z"
                                                            stroke="#C94444"
                                                            strokeWidth="1.66667"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            {errors?.videos ? <div className="error-message" style={{ bottom: "-17px", left: '0' }}>{errors?.videos}</div> : ''}
                        </div>
                    </div>
                    <div className="setting-section last-section">
                        <div className="section-tag">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9.375C11.9925 9.06942 12.0763 8.76856 12.2407 8.51084C12.405 8.25311 12.6425 8.05022 12.9227 7.92808C13.2029 7.80594 13.5131 7.77009 13.8138 7.82511C14.1145 7.88014 14.3919 8.02353 14.6107 8.23699C14.8295 8.45044 14.9797 8.72426 15.0421 9.02349C15.1046 9.32271 15.0764 9.63375 14.9612 9.91689C14.846 10.2 14.649 10.4424 14.3955 10.6131C14.1419 10.7837 13.8432 10.8749 13.5375 10.875C13.3374 10.88 13.1383 10.8449 12.952 10.7718C12.7656 10.6986 12.5958 10.5889 12.4525 10.4491C12.3092 10.3094 12.1954 10.1423 12.1177 9.95782C12.0399 9.77334 11.9999 9.57518 12 9.375ZM13.5375 13.125C12.6627 13.1174 11.8121 13.4116 11.129 13.9581C10.4459 14.5046 9.97209 15.2699 9.7875 16.125H17.25C17.0747 15.2652 16.6034 14.4941 15.9182 13.946C15.233 13.3978 14.3773 13.1073 13.5 13.125H13.5375ZM21.75 3.75V20.25C21.75 20.8467 21.5129 21.419 21.091 21.841C20.669 22.2629 20.0967 22.5 19.5 22.5H6C5.40326 22.5 4.83097 22.2629 4.40901 21.841C3.98705 21.419 3.75 20.8467 3.75 20.25V19.5H6C6.19891 19.5 6.38968 19.421 6.53033 19.2803C6.67098 19.1397 6.75 18.9489 6.75 18.75C6.75 18.5511 6.67098 18.3603 6.53033 18.2197C6.38968 18.079 6.19891 18 6 18H3.75V15H6C6.19891 15 6.38968 14.921 6.53033 14.7803C6.67098 14.6397 6.75 14.4489 6.75 14.25C6.75 14.0511 6.67098 13.8603 6.53033 13.7197C6.38968 13.579 6.19891 13.5 6 13.5H3.75V10.5H6C6.19891 10.5 6.38968 10.421 6.53033 10.2803C6.67098 10.1397 6.75 9.94891 6.75 9.75C6.75 9.55109 6.67098 9.36032 6.53033 9.21967C6.38968 9.07902 6.19891 9 6 9H3.75V6H6C6.19891 6 6.38968 5.92098 6.53033 5.78033C6.67098 5.63968 6.75 5.44891 6.75 5.25C6.75 5.05109 6.67098 4.86032 6.53033 4.71967C6.38968 4.57902 6.19891 4.5 6 4.5H3.75V3.75C3.75 3.15326 3.98705 2.58097 4.40901 2.15901C4.83097 1.73705 5.40326 1.5 6 1.5H19.5C20.0967 1.5 20.669 1.73705 21.091 2.15901C21.5129 2.58097 21.75 3.15326 21.75 3.75ZM18.75 15.8625C18.5627 14.9407 18.1311 14.0861 17.5005 13.3881C16.8698 12.6902 16.0632 12.1745 15.165 11.895C15.5917 11.6266 15.9438 11.255 16.1889 10.8146C16.4341 10.3741 16.5643 9.87905 16.5675 9.375C16.5675 8.56941 16.2475 7.7968 15.6778 7.22716C15.1082 6.65752 14.3356 6.3375 13.53 6.3375C12.7244 6.3375 11.9518 6.65752 11.3822 7.22716C10.8125 7.7968 10.4925 8.56941 10.4925 9.375C10.4957 9.87905 10.6259 10.3741 10.8711 10.8146C11.1162 11.255 11.4683 11.6266 11.895 11.895C10.9857 12.1653 10.1666 12.6769 9.52476 13.3755C8.88295 14.0741 8.44242 14.9336 8.25 15.8625C8.20589 16.0739 8.21066 16.2926 8.26396 16.5019C8.31725 16.7111 8.41765 16.9054 8.5575 17.07C8.70105 17.247 8.88304 17.389 9.08967 17.4852C9.2963 17.5813 9.52213 17.6292 9.75 17.625H17.25C17.4754 17.6269 17.6982 17.578 17.9021 17.4819C18.1059 17.3858 18.2855 17.245 18.4275 17.07C18.57 16.9068 18.6731 16.713 18.729 16.5037C18.7849 16.2944 18.7921 16.075 18.75 15.8625ZM3 9C2.80109 9 2.61032 9.07902 2.46967 9.21967C2.32902 9.36032 2.25 9.55109 2.25 9.75C2.25 9.94891 2.32902 10.1397 2.46967 10.2803C2.61032 10.421 2.80109 10.5 3 10.5H3.75V9H3ZM3 13.5C2.80109 13.5 2.61032 13.579 2.46967 13.7197C2.32902 13.8603 2.25 14.0511 2.25 14.25C2.25 14.4489 2.32902 14.6397 2.46967 14.7803C2.61032 14.921 2.80109 15 3 15H3.75V13.5H3ZM3 18C2.80109 18 2.61032 18.079 2.46967 18.2197C2.32902 18.3603 2.25 18.5511 2.25 18.75C2.25 18.9489 2.32902 19.1397 2.46967 19.2803C2.61032 19.421 2.80109 19.5 3 19.5H3.75V18H3ZM3 4.5C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25C2.25 5.44891 2.32902 5.63968 2.46967 5.78033C2.61032 5.92098 2.80109 6 3 6H3.75V4.5H3Z" fill="white" />
                                </svg>
                            </div>
                            <div className="title">Contact Information</div>
                        </div>
                        <div className="section-inputs" style={{ flexWrap: 'wrap' }}>
                            <SingleInput errors={errors?.email} label={"Email"} data={data} setData={setData} varName={"email"} input={true} dropDown={false} width={"595px"} inputType={'email'} placeHolder={"Enter your Email"} />
                            <SingleInput  label={"Landline"} data={data} setData={setData} varName={"landline"} input={true} dropDown={false} width={"595px"} placeHolder={"Enter your Landline 0xx-xxxxxxx"} />
                            <SingleInput errors={!data?.contact?.[0] ? errors?.contact : errors?.contactSyntax?.[0]} label="Contact no. 1" index={0} data={data} setData={setData} varName="contact" input inputType="text" dropDown={false} width="595px" placeHolder="Enter mobile number" />
                            <SingleInput errors={errors?.contactSyntax?.[1]} label="Contact no. 2" index={1} data={data} setData={setData} varName="contact" input inputType="text" dropDown={false} width="595px" placeHolder="Enter mobile number" />
                        </div>
                    </div>
                    <div className="setting-section" style={{ border: 'unset' }}>
                        <div className="section-tag">
                            <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M17.1562 22.3125C17.5124 22.3125 17.8008 22.0241 17.8008 21.668C17.8008 21.3118 17.5124 21.0234 17.1562 21.0234H14.9766L14.3321 19.7344H9.66794L9.02341 21.0234H6.84375C6.48758 21.0234 6.19922 21.3118 6.19922 21.668C6.19922 22.0241 6.48758 22.3125 6.84375 22.3125H17.1562Z" fill="white" />
                                <path d="M2.93359 18.4453H21.0664C22.1326 18.4453 23 17.5779 23 16.5117V15.8672H1V16.5117C1 17.5779 1.86743 18.4453 2.93359 18.4453Z" fill="white" />
                                <path d="M4.86719 10.7109H7.48828V12H4.86719V10.7109Z" fill="white" />
                                <path d="M15.8853 12.0275L16.8551 11.0576C16.8558 11.0571 16.856 11.0562 16.8565 11.0557C16.857 11.0552 16.8578 11.055 16.8583 11.0545L17.8283 10.0845L15.3994 9.59863L15.8853 12.0275Z" fill="white" />
                                <path d="M4.86719 5.55469H7.48828V6.84375H4.86719V5.55469Z" fill="white" />
                                <path d="M23 3.62109C23 2.55493 22.1326 1.6875 21.0664 1.6875H2.93359C1.86743 1.6875 1 2.55493 1 3.62109V14.5781H23V3.62109ZM15.9452 6.49883L16.8566 5.58742C17.1084 5.33565 17.5163 5.33565 17.7681 5.58742C18.0198 5.83919 18.0198 6.24706 17.7681 6.49883L16.8566 7.41023C16.6049 7.662 16.197 7.662 15.9452 7.41023C15.6935 7.15846 15.6935 6.7506 15.9452 6.49883ZM8.77734 12.6445C8.77734 13.0007 8.48898 13.2891 8.13281 13.2891H4.22266C3.86649 13.2891 3.57812 13.0007 3.57812 12.6445V10.0664C3.57812 9.71024 3.86649 9.42188 4.22266 9.42188H8.13281C8.48898 9.42188 8.77734 9.71024 8.77734 10.0664V12.6445ZM8.77734 7.48828C8.77734 7.84445 8.48898 8.13281 8.13281 8.13281H4.22266C3.86649 8.13281 3.57812 7.84445 3.57812 7.48828V4.91016C3.57812 4.55399 3.86649 4.26562 4.22266 4.26562H8.13281C8.48898 4.26562 8.77734 4.55399 8.77734 4.91016V7.48828ZM10.0664 8.77734C10.0664 8.42117 10.3548 8.13281 10.7109 8.13281H12C12.3562 8.13281 12.6445 8.42117 12.6445 8.77734C12.6445 9.13351 12.3562 9.42188 12 9.42188H10.7109C10.3548 9.42188 10.0664 9.13351 10.0664 8.77734ZM13.211 11.0559L12.2996 11.9673C12.0478 12.219 11.64 12.219 11.3882 11.9673C11.1364 11.7155 11.1364 11.3076 11.3882 11.0559L12.2996 10.1445C12.5514 9.89268 12.9592 9.89268 13.211 10.1445C13.4628 10.3962 13.4628 10.8041 13.211 11.0559ZM13.211 7.41023C12.9592 7.662 12.5514 7.662 12.2996 7.41023L11.3882 6.49883C11.1364 6.24706 11.1364 5.83919 11.3882 5.58742C11.64 5.33565 12.0478 5.33565 12.2996 5.58742L13.211 6.49883C13.4628 6.7506 13.4628 7.15846 13.211 7.41023ZM13.9336 4.91016C13.9336 4.55399 14.222 4.26562 14.5781 4.26562C14.9343 4.26562 15.2227 4.55399 15.2227 4.91016V6.19922C15.2227 6.55539 14.9343 6.84375 14.5781 6.84375C14.222 6.84375 13.9336 6.55539 13.9336 6.19922V4.91016ZM19.5915 13.7908C19.3398 14.0425 18.9319 14.0425 18.6801 13.7908L17.3127 12.4233L15.9452 13.7908C15.7745 13.9615 15.5255 14.02 15.3026 13.9519C15.0753 13.8832 14.9043 13.6944 14.8576 13.4616L13.9462 8.9039C13.9041 8.69241 13.9702 8.47404 14.1224 8.32164C14.2748 8.16873 14.4925 8.10579 14.7047 8.1454L19.2624 9.05681C19.4952 9.10347 19.684 9.27451 19.7527 9.50177C19.8218 9.72971 19.7596 9.97644 19.5915 10.1445L18.2241 11.5119L19.5915 12.8793C19.8433 13.1311 19.8433 13.539 19.5915 13.7908Z" fill="white" />
                            </svg></div>
                            <div className="title">Platform Selection</div>
                        </div>
                        <div
                            className={`logo ${data.platform ? "active" : ""}`}
                            onClick={() => setData({ ...data, platform: !data.platform })}
                        >
                            <Image src={logo} alt="logo" />
                        </div>

                    </div>
                </div>
                <div className='footer' style={{borderRadius:"0 0 12px 12px"}}>
                    <div className="bottom-box" style={{borderRadius:"0 0 12px 12px"}}>
                        <div className="primary-button" onClick={() => {
                            if (!button_loading) {
                                handleCheckValidation()
                            }
                        }}>{button_loading ? <div className="spinner-border text-light" role="status" /> : "Submit"}</div>
                    </div>
                </div>
            </div>
        </div>
            <AmenitiesModal amenitiesData={amenities} open={open} setOpen={setOpen} data={data} setData={setData} />
        </div>
        </div>
    )
}

export default AddProperty