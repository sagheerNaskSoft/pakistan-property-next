import { useEffect, useState } from "react"
import { useAuth } from "../../Context/ContextProvider"
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild"
import SimpleSingleField from "../Metiral/InputField/SingleMenuFeild/SimpleSingleField"
import PrimaryButton from "../Metiral/Button/PrimaryButton"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link } from "react-router-dom"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    boxShadow: 24,
    bgcolor: 'unset',
    boxShadow: 24,
    p: 0,
    outline: 'none',
    border: 'none',       // removes border if any
    borderRadius: '12px', // ✅ rounded corners (adjust value as needed)
    overflow: 'hidden',   // ensures inner content stays within rounded edges
};




const icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_7766_125208)">
        <path d="M7.34447 1.876C7.37304 1.72307 7.45419 1.58495 7.57387 1.48555C7.69355 1.38615 7.84423 1.33174 7.99981 1.33174C8.15538 1.33174 8.30606 1.38615 8.42574 1.48555C8.54542 1.58495 8.62657 1.72307 8.65514 1.876L9.35581 5.58134C9.40557 5.84477 9.53359 6.08708 9.72316 6.27665C9.91273 6.46622 10.155 6.59424 10.4185 6.644L14.1238 7.34467C14.2767 7.37324 14.4149 7.45439 14.5143 7.57407C14.6137 7.69375 14.6681 7.84443 14.6681 8C14.6681 8.15558 14.6137 8.30626 14.5143 8.42594C14.4149 8.54562 14.2767 8.62677 14.1238 8.65534L10.4185 9.356C10.155 9.40577 9.91273 9.53379 9.72316 9.72336C9.53359 9.91293 9.40557 10.1552 9.35581 10.4187L8.65514 14.124C8.62657 14.2769 8.54542 14.4151 8.42574 14.5145C8.30606 14.6139 8.15538 14.6683 7.99981 14.6683C7.84423 14.6683 7.69355 14.6139 7.57387 14.5145C7.45419 14.4151 7.37304 14.2769 7.34447 14.124L6.64381 10.4187C6.59404 10.1552 6.46602 9.91293 6.27645 9.72336C6.08688 9.53379 5.84457 9.40577 5.58114 9.356L1.87581 8.65534C1.72287 8.62677 1.58475 8.54562 1.48535 8.42594C1.38595 8.30626 1.33154 8.15558 1.33154 8C1.33154 7.84443 1.38595 7.69375 1.48535 7.57407C1.58475 7.45439 1.72287 7.37324 1.87581 7.34467L5.58114 6.644C5.84457 6.59424 6.08688 6.46622 6.27645 6.27665C6.46602 6.08708 6.59404 5.84477 6.64381 5.58134L7.34447 1.876Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3335 1.33333V3.99999" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.6667 2.66667H12" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.66683 14.6667C3.40321 14.6667 4.00016 14.0697 4.00016 13.3333C4.00016 12.597 3.40321 12 2.66683 12C1.93045 12 1.3335 12.597 1.3335 13.3333C1.3335 14.0697 1.93045 14.6667 2.66683 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
        <clipPath id="clip0_7766_125208">
            <rect width="16" height="16" fill="white" />
        </clipPath>
    </defs>
</svg>

const calculator = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 14V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 10H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 14H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 18H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

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

const medium = <svg xmlns="http://www.w3.org/2000/svg" width="42" height="71" viewBox="0 0 42 71" fill="none">
    <g opacity="0.08">
        <path d="M1.86924 18.8369L9.53311 13.4162C9.90696 13.2292 10.0939 12.8554 10.0939 12.4815V9.67768C10.0939 7.62152 8.41156 6.12613 6.54233 6.12613H3.55155C1.49539 6.12613 0 7.80844 0 9.67768V18.0892C0 18.8369 1.12154 19.3977 1.86924 18.8369Z" fill="#1B573E" />
        <path d="M61.4979 67.8116C64.6756 67.8116 67.1056 65.3815 67.1056 62.2038V24.4453C67.1056 22.576 66.171 20.7068 64.4887 19.7722L35.3286 0.892877C33.4593 -0.415589 30.8424 -0.228664 28.9732 1.0798L2.43001 19.9591C0.934617 21.0806 0 22.7629 0 24.4453V62.0169C0 65.1946 2.43001 67.6246 5.60771 67.6246L61.4979 67.8116Z" fill="#1B573E" />
        <path d="M23.3725 36.7843H26.5502V20.5219H36.2702C36.2702 20.5219 47.1118 22.0173 47.4856 33.7935C47.4856 33.7935 47.6725 44.822 36.2702 46.8782H23.1855V70.8044H26.5502V50.4297L35.3356 50.6167C35.3356 50.6167 49.7287 49.869 50.8503 33.6066C50.8503 33.6066 51.2241 20.5219 37.0179 16.9704H23.1855V36.7843H23.3725Z" fill="white" />
        <path d="M30.101 23.6989H35.8956C35.8956 23.6989 43.9333 25.7551 44.1203 32.8582C44.1203 32.8582 45.4287 41.6436 35.5218 43.6998H20.0071V70.9906H16.4556V23.6989H30.101Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M38.6948 36.7839C37.5733 37.9054 35.7041 39.027 33.2741 38.8401C27.6663 38.6531 24.4886 32.4847 27.2925 27.8116C27.4794 27.4377 27.8533 27.0639 28.0402 26.69C28.414 26.3162 28.601 26.1292 28.9748 25.7554C28.414 25.7554 27.6663 26.3162 27.2925 26.5031C25.7971 27.4377 24.4886 29.12 23.9279 30.8023C21.4979 38.2793 30.4702 44.2608 36.4518 39.4008C37.1995 39.2139 38.5079 37.7185 38.6948 36.7839Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M33.0881 29.8681L30.4712 30.9896L33.0881 31.5504L33.462 34.5412L34.9574 32.1112L37.7612 32.6719L35.892 30.6158L37.3874 27.9989L34.5835 29.1204L32.7143 27.0642L33.0881 29.8681Z" fill="#1B573E" />
    </g>
</svg>

const large = <svg xmlns="http://www.w3.org/2000/svg" width="203" height="215" viewBox="0 0 203 215" fill="none">
    <g opacity="0.06">
        <path d="M5.6546 56.9828L28.8384 40.5845C29.9694 40.0191 30.5348 38.8881 30.5348 37.7572V29.2753C30.5348 23.0553 25.4457 18.5316 19.7911 18.5316H10.7437C4.52367 18.5316 0 23.6207 0 29.2753V54.721C0 56.9828 3.39276 58.6792 5.6546 56.9828Z" fill="#1B573E" />
        <path d="M186.036 205.136C195.649 205.136 203 197.785 203 188.172V73.9489C203 68.2943 200.173 62.6397 195.084 59.8125L106.872 2.70103C101.217 -1.25719 93.3008 -0.691728 87.6462 3.26649L7.35097 60.3779C2.82729 63.7707 0 68.8598 0 73.9489V187.606C0 197.219 7.35097 204.57 16.9638 204.57L186.036 205.136Z" fill="#1B573E" />
        <path d="M70.6919 111.269H80.3047V62.0744H109.709C109.709 62.0744 142.505 66.598 143.636 102.222C143.636 102.222 144.202 135.584 109.709 141.804H70.1265V214.183H80.3047V152.548L106.881 153.113C106.881 153.113 150.422 150.852 153.814 101.657C153.814 101.657 154.945 62.0744 111.97 51.3306H70.1265V111.269H70.6919Z" fill="white" />
        <path d="M91.0325 71.6848H108.562C108.562 71.6848 132.876 77.9048 133.442 99.3923C133.442 99.3923 137.4 125.969 107.431 132.189H60.4976V214.746H49.7539V71.6848H91.0325Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M117.046 111.272C113.653 114.665 107.999 118.058 100.648 117.492C83.6841 116.927 74.0713 98.2667 82.5532 84.1302C83.1186 82.9993 84.2495 81.8684 84.815 80.7375C85.9459 79.6066 86.5114 79.0411 87.6423 77.9102C85.9459 77.9102 83.6841 79.6066 82.5532 80.172C78.0295 82.9993 74.0713 88.0885 72.3749 93.1776C65.0239 115.796 92.166 133.891 110.261 119.189C112.523 118.623 116.481 114.1 117.046 111.272Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M100.08 90.3507L92.1631 93.7434L100.08 95.4398L101.21 104.487L105.734 97.1362L114.216 98.8326L108.561 92.6125L113.085 84.6961L104.603 88.0888L98.9486 81.8688L100.08 90.3507Z" fill="#1B573E" />
    </g>
</svg>
const small = <svg xmlns="http://www.w3.org/2000/svg" width="41" height="43" viewBox="0 0 41 43" fill="none">
    <g opacity="0.06">
        <path d="M1.13223 11.4096L5.77435 8.12613C6.0008 8.01291 6.11402 7.78647 6.11402 7.56002V5.86168C6.11402 4.61623 5.09502 3.71045 3.96279 3.71045H2.15123C0.905781 3.71045 0 4.72945 0 5.86168V10.9567C0 11.4096 0.679336 11.7493 1.13223 11.4096Z" fill="#1B573E" />
        <path d="M37.2503 41.0745C39.175 41.0745 40.6469 39.6026 40.6469 37.6779V14.8069C40.6469 13.6747 40.0808 12.5424 39.0618 11.9763L21.3991 0.54083C20.2669 -0.251729 18.6817 -0.138506 17.5495 0.654053L1.47189 12.0895C0.566112 12.7689 0 13.7879 0 14.8069V37.5646C0 39.4894 1.47189 40.9613 3.39668 40.9613L37.2503 41.0745Z" fill="#1B573E" />
        <path d="M14.1547 22.2793H16.0795V12.4289H21.9671C21.9671 12.4289 28.534 13.3347 28.7604 20.4677C28.7604 20.4677 28.8737 27.1479 21.9671 28.3933H14.0415V42.8858H16.0795V30.5446L21.401 30.6578C21.401 30.6578 30.1191 30.2049 30.7985 20.3545C30.7985 20.3545 31.0249 12.4289 22.42 10.2777H14.0415V22.2793H14.1547Z" fill="white" />
        <path d="M18.2247 14.354H21.7346C21.7346 14.354 26.6032 15.5995 26.7164 19.9019C26.7164 19.9019 27.509 25.2234 21.5082 26.4688H12.1107V42.9993H9.95947V14.354H18.2247Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M23.4328 22.281C22.7535 22.9603 21.6213 23.6396 20.1494 23.5264C16.7527 23.4132 14.8279 19.6768 16.5263 16.8463C16.6395 16.6198 16.8659 16.3934 16.9791 16.1669C17.2056 15.9405 17.3188 15.8273 17.5453 15.6008C17.2056 15.6008 16.7527 15.9405 16.5263 16.0537C15.6205 16.6198 14.8279 17.6388 14.4883 18.6578C13.0164 23.1867 18.451 26.8099 22.0742 23.8661C22.5271 23.7529 23.3196 22.8471 23.4328 22.281Z" fill="#1B573E" />
        <path fillRule="evenodd" clipRule="evenodd" d="M20.0402 18.0912L18.4551 18.7705L20.0402 19.1102L20.2666 20.9217L21.1724 19.4498L22.8708 19.7895L21.7385 18.5441L22.6443 16.9589L20.946 17.6383L19.8137 16.3928L20.0402 18.0912Z" fill="#1B573E" />
    </g>
</svg>

const bedroomOptions = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" }
];

function Banner() {
    const { propertyType, citiesList, getLOcation, setLocationList, locationList, areaUnit, instant, buttonLoading } = useAuth()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [errors, setErrors] = useState({})
    const [filterData, setFilterData] = useState({
        name: "",
        purpose: "",
        city: "",
        location: "",
        bedroom: "",
        email: "",
        phone: "",
        area: {
            value: '',
            unit: 'Marla'
        }
    })
    const isValidPakistaniPhoneNumber = (phoneNumber) => {
        let cleanedPhoneNumber = phoneNumber.replace(/[^\d\+]/g, "");
        const pakistaniPhoneRegex = /^(?:0|\+92)?\s?(?:\d\s?){9,10}$/;
        const isValid = pakistaniPhoneRegex.test(cleanedPhoneNumber);

        return isValid;
    };

    useEffect(() => {
        const updateFilterData = async () => {
            try {
                setFilterData((prev) => ({
                    ...prev,
                    location: "",
                }));

                if (!filterData?.city?.app_code) return;

                const locationResult = await getLOcation({
                    city_code: filterData?.city?.app_code,
                });

                setLocationList(locationResult?.data || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        updateFilterData();
    }, [filterData?.city]);

    const handleSubmit = async () => {
        let newErrors = {};
        if (!filterData.name) newErrors.name = "Name is required";
        if (!filterData.purpose) newErrors.purpose = "Purpose is required";
        if (!filterData.city) newErrors.city = "City is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!filterData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(filterData.email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!filterData.phone?.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (
            !isValidPakistaniPhoneNumber(filterData.phone) ||
            filterData?.phone.length < 10 ||
            filterData?.phone.length > 11
        ) {
            newErrors.phone =
                "Enter a valid Pakistani phone number (e.g. 3001234567)";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const result = await instant({
            name: filterData?.name,
            city_code: filterData?.city?.app_code,
            location_id: filterData?.location?.id,
            phone: `+92${filterData?.phone}`,
            email: filterData?.email,
        });

        if (result?.success) {
            setFilterData({
                nmae: "",
                purpose: "",
                city: "",
                location: "",
                bedroom: "",
                email: "",
                phone: "",
                area: { value: "", unit: "Marla" },
            });
            setErrors({});
        }
    };


    return (
        <>
            <div className="instant-banner">
                <div className="main-container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="text-box">
                                <div className="tag">{icon}<span>AI-Powered Valuation Engine</span></div>
                                <div className="heading">The Most Accurate Online  <span className="heading second">Property Valuation Tool</span></div>

                                <div className="para">Check your property’s true value accurately with the <b>online property valuation </b> tool of Pakistan Property. The valuation information is based on the real market trends to help you make confident decisions.</div>
                                <div className="values-box">
                                    <div className="box">
                                        <div className="number">2M+</div>
                                        <div className="title">Properties Verified</div>
                                    </div>
                                    <div className="box">
                                        <div className="number">98%</div>
                                        <div className="title">Valuation Accuracy</div>
                                    </div>
                                    <div className="box">
                                        <div className="number">95%</div>
                                        <div className="title">Client Trust Score</div>
                                    </div>
                                </div>
                                <div className="get-valuation d-md-none d-flex" onClick={() => setOpen(true)}>Get Valuation</div>
                            </div>
                        </div>
                        <div className="col-6 d-md-inline d-none">
                            <div className="instant-valuation-box">
                                <div className="img small">{small}</div>
                                <div className="img medium">{medium}</div>
                                <div className="img large">{large}</div>
                                <div className="top">
                                    <div className="icon">{calculator}</div>
                                    <div>
                                        <div className="box-title">Get Free Valuation</div>
                                        <div className="sub-title">Instant property estimate</div>
                                    </div>
                                </div>

                                <div className="input-section row m-0" style={{ gap: '12px 0', zIndex: 0 }}>
                                    <div className="col-6 pe-1 ps-0">
                                        <SimpleSingleField error={errors?.name} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"name"} type={"text"} label={"Name*"} placeholder={" "} />
                                        {errors.name && <div className="error-text">{errors.name}</div>}
                                    </div>
                                    <div className="col-6 ps-1 pe-0">
                                        <SingleMenuFeild
                                            error={errors?.purpose}
                                            getVaiable={"name"}
                                            filterData={filterData}
                                            setFilterData={setFilterData}
                                            varName={"purpose"}
                                            label={"Purpose Type*"}
                                            menuData={propertyType}
                                            optionSelect={"single"}
                                            storeKey={"id"}
                                            design={"simple"}
                                        />
                                        {/* {errors.purpose && <div className="error-text">{errors.purpose}</div>} */}
                                    </div>

                                    <div className="col-12 p-0" style={{ marginBottom: errors?.city ? "10px" : "", marginTop: errors?.city && window.innerWidth <= 576 ? "12px" : "" }}>
                                        <SingleMenuFeild
                                            error={errors?.city}
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
                                        {/* {errors.city && <div className="error-text">{errors.city}</div>} */}
                                    </div>

                                    <div className="col-12 p-0">
                                        <SingleMenuFeild
                                            getVaiable={"name"}
                                            filterData={filterData}
                                            setFilterData={setFilterData}
                                            varName={"location"}
                                            label={"Location"}
                                            menuData={locationList}
                                            optionSelect={"single"}
                                            input={true}
                                            storeKey={"id"}
                                            design={"simple"}
                                            clearOnChange={true}
                                        />
                                    </div>

                                    <div className="col-6 pe-1 ps-0">
                                        <SimpleSingleField modified={true} filterData={filterData} setFilterData={setFilterData} varName={"area"} value={"value"} unit={"unit"} type={"number"} label={"Area"} subMenu={areaUnit} placeholder={" "} />
                                    </div>

                                    <div className="col-6 ps-1 pe-0">
                                        <SingleMenuFeild
                                            getVaiable={"name"}
                                            filterData={filterData}
                                            setFilterData={setFilterData}
                                            varName={"bedroom"}
                                            label={"Bedroom"}
                                            menuData={bedroomOptions}
                                            optionSelect={"single"}
                                            storeKey={"id"}
                                            design={"simple"}
                                        />
                                    </div>

                                    <div className="col-12 p-0">
                                        <SimpleSingleField error={errors?.email} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"email"} type={"email"} label={"Email*"} placeholder={" "} />
                                        {errors.email && <div className="error-text">{errors.email}</div>}
                                    </div>

                                    <div className="col-12 p-0">
                                        <div className="d-flex" style={{ gap: '10px' }}>
                                            <div className="country-box">{pakistan} +92
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <rect width="20" height="20" fill="white" />
                                                    <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <SimpleSingleField error={errors?.phone} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"phone"} type={"text"} label={"Phone number (e.g 3327******)*"} placeholder={" "} />
                                        </div>
                                        {errors.phone && <div className="error-text">{errors.phone}</div>}
                                    </div>

                                    <div className="col-12 p-0 my-2">
                                        <PrimaryButton text={buttonLoading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Get Valuation"} widthSize={"100%"} onFunction={handleSubmit} />
                                    </div>
                                    <div className="col-12">
                                        <div className="last-para">
                                            By submitting this form, you confirm that the information provided is accurate and that you agree to our <span><Link to={"/term-and-condition"}>Terms & Conditions</Link></span> and <span><Link to={"/privacy-policy"}>Privacy Policy</Link></span>.
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="valuation-mui">
                    <div className="instant-valuation-box">
                        <div className="d-flex justify-content-between align-items-center w-100"style={{padding: "16px" , borderBottom: "1px solid #BBB"}}>
                            <div className="top">
                                <div className="icon">{calculator}</div>
                                <div>
                                    <div className="box-title">Get Free Valuation</div>
                                    <div className="sub-title">Instant property estimate</div>
                                </div>
                            </div>
                            <div className="input-section-close-btn d-sm-none d-flex justify-content-center align-items-center" onClick={() => setOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                                    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                </svg>
                            </div>
                        </div>

                        <div className="input-section-container">
                            <div className="input-section row m-0" style={{ gap: '12px 0', zIndex: 0 }}>
                                <div className="col-sm-6 pe-sm-1 pe-0 ps-0">
                                    <SimpleSingleField error={errors?.name} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"name"} type={"text"} label={"Name*"} placeholder={"Name*"} newModified={true}/>
                                    {errors.name && <div className="error-text">{errors.name}</div>}
                                </div>
                                <div className="col-sm-6 ps-sm-1 ps-0 pe-0">
                                    <SingleMenuFeild
                                        error={errors?.purpose}
                                        getVaiable={"name"}
                                        filterData={filterData}
                                        setFilterData={setFilterData}
                                        varName={"purpose"}
                                        label={"Purpose Type*"}
                                        menuData={propertyType}
                                        optionSelect={"single"}
                                        storeKey={"id"}
                                        design={"simple"}
                                        placeholder={"Purpose Type*"}
                                        newModified={true}
                                    />
                                    {/* {errors.purpose && <div className="error-text">{errors.purpose}</div>} */}
                                </div>

                                <div className="col-12 p-0" style={{ marginBottom: errors?.city ? "10px" : "", marginTop: errors?.city && window.innerWidth <= 576 ? "12px" : "" }}>
                                    <SingleMenuFeild
                                        error={errors?.city}
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
                                        placeholder={"City*"}
                                        newModified={true}
                                    />
                                    {/* {errors.city && <div className="error-text">{errors.city}</div>} */}
                                </div>

                                <div className="col-12 p-0">
                                    <SingleMenuFeild
                                        getVaiable={"name"}
                                        filterData={filterData}
                                        setFilterData={setFilterData}
                                        varName={"location"}
                                        label={"Location"}
                                        menuData={locationList}
                                        optionSelect={"single"}
                                        input={true}
                                        storeKey={"id"}
                                        design={"simple"}
                                        placeholder={"Location"}
                                        newModified={true}
                                    />
                                </div>

                                <div className="col-sm-6 pe-sm-1 pe-0 ps-0">
                                    <SimpleSingleField modified={true} filterData={filterData} setFilterData={setFilterData} varName={"area"} value={"value"} unit={"unit"} type={"number"} label={"Area"} subMenu={areaUnit} placeholder={"Area*"} newModified={true}/>
                                </div>

                                <div className="col-sm-6 ps-sm-1 ps-0 pe-0">
                                    <SingleMenuFeild
                                        getVaiable={"name"}
                                        filterData={filterData}
                                        setFilterData={setFilterData}
                                        varName={"bedroom"}
                                        label={"Bedroom"}
                                        menuData={bedroomOptions}
                                        optionSelect={"single"}
                                        storeKey={"id"}
                                        design={"simple"}
                                        placeholder={"Bedroom"}
                                        newModified={true}
                                    />
                                </div>

                                <div className="col-12 p-0">
                                    <SimpleSingleField error={errors?.email} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"email"} type={"email"} label={"Email*"} placeholder={"Email*"} newModified={true}/>
                                    {errors.email && <div className="error-text">{errors.email}</div>}
                                </div>

                                <div className="col-12 p-0">
                                    <div className="d-flex" style={{ gap: '10px' }}>
                                        <div className="country-box">{pakistan} +92
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <rect width="20" height="20" fill="white" />
                                                <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg></div>
                                        <SimpleSingleField error={errors?.phone} modified={true} filterData={filterData} setFilterData={setFilterData} varName={"phone"} type={"text"} label={"Phone number (e.g 3327******)*"} placeholder={"Phone number (e.g 3327******)*"} newModified={true}/>
                                    </div>
                                    {errors.phone && <div className="error-text">{errors.phone}</div>}
                                </div>

                                <div className="col-12 d-sm-inline-block d-none p-sm-0 mt-sm-2 ">
                                    <PrimaryButton text={buttonLoading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Get Valuation"} widthSize={"100%"} onFunction={handleSubmit} />
                                </div>
                            </div>
                        </div>
                        <div className="d-sm-none input-section-sticky-buttons">
                            <PrimaryButton text={buttonLoading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Get Valuation"} widthSize={"100%"} onFunction={handleSubmit} />
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default Banner;



