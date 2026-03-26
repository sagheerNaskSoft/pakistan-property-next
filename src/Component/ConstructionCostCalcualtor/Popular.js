import React, { useState } from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRef } from "react";
import { useAuth } from "../../Context/ContextProvider";
import { useNavigate } from "react-router-dom";
import PrimaryBorderButton from "../Metiral/Button/PrimaryBorderButton";

function Popular() {
    const sliderRef = useRef(null)
    const { buildSearchPayloadCostCalculate, objectToQueryString } = useAuth()
    const navigate = useNavigate()
    const [popularData] = useState([
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "3",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "1215",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "4",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "1620",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "5",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "2025",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "6",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "2295",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "7",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "2678",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "8",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "3060",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "9",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "3240",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "10",
            area_unit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            coverd_area: "3375",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
        {
            city: { app_code: "PP016", city: "Lahore" },
            area_size: "1",
            area_unit: {
                id: 5,
                name: "Kanal",
                code: "kanal"
            },
            coverd_area: "6300",
            construction_type: "complete",
            construction_mode: "with_mterial",
            drowing_rooms: "1",
            living_rooms: "2",
            kitchens: "2",
            bathrooms: "4",
            bedrooms: "3",
        },
    ]);
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };
    return (
        <>
            <div className="main-container construction-popular-container mt-5 mb-5">
                <div>
                    <div className="popular-calculations">
                        <h1>Popular Construction Cost Estimates</h1>

                        <div style={{overflow:'hidden'}}>
                            {
                                window.innerWidth > 576 ?
                                    (
                                        <Slider ref={sliderRef} {...sliderSettings}>
                                            {popularData.map((item, idx) => (
                                                <div style={{ cursor: "pointer" }} onClick={async () => {
                                                    let dataToSearch = await buildSearchPayloadCostCalculate(item)
                                                    const queryString = objectToQueryString(dataToSearch);
                                                    navigate(`/construction-cost-calculator/${item?.area_size}-${item?.area_unit?.code}-house-construction-cost-${item?.city?.city}?${queryString}`)

                                                }} className="popular-box" key={idx}>
                                                    <h3>
                                                        {item.area_size} {item?.area_unit?.name} Construction
                                                        <br /> Cost
                                                    </h3>
                                                    <div className="tab">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <g clipPath="url(#clip0_9279_4839)">
                                                                <path d="M22.6727 11.1871V24H1.22057V11.1871H0L3 4.72612H6.75002L7.00001 4.53284V1.43579H9.50001V2.60005L11.625 0.957195L16.5 4.72612H20.25L24 11.1871H22.6727ZM15.75 5.26453L11.625 2.03403L7.5 5.26453V10.5741H15.75V5.26453ZM21.7686 11.2151H2.12473V23.359H9.20812V23.3688H9.20835V23.359H9.20812V16.2011C9.20812 15.3288 10.4564 14.6216 11.9963 14.6216C13.5362 14.6216 14.7845 15.3288 14.7845 16.2011V23.2118H14.7917V23.359H21.7686V11.2151ZM13.9482 18.2189V16.5338C13.9482 16.0211 13.3322 15.5901 12.4967 15.4649V18.2189H13.9482ZM11.6716 18.2189V15.4437C10.7484 15.5313 10.0447 15.9859 10.0447 16.5338V18.2189H11.6716ZM21.0047 12.7459V13.437H20.6962V16.7784H15.7457V13.437H15.3666V12.7459H21.0047ZM18.5563 16.3757H20.1733V15.2148H18.5563V16.3757ZM18.5563 14.7272H20.1733V13.5664H18.5563V14.7272ZM16.26 16.3757H17.877V15.2148H16.26V16.3757ZM16.26 14.7272H17.877V13.5664H16.26V14.7272ZM20.6962 21.6242H15.7457V17.9716H20.6962V21.6242ZM17.877 18.4121H16.26V19.573H17.877V18.4121ZM17.877 20.0606H16.26V21.2215H17.877V20.0606ZM20.1733 18.4121H18.5563V19.573H20.1733V18.4121ZM20.1733 20.0606H18.5563V21.2215H20.1733V20.0606ZM8.33376 16.7784H3.38326V13.437H3.00825V12.7459H8.64633V13.437H8.33376V16.7784ZM5.51453 13.5664H3.89753V14.7272H5.51453V13.5664ZM5.51453 15.2148H3.89753V16.3757H5.51453V15.2148ZM7.81081 13.5664H6.19382V14.7272H7.81081V13.5664ZM7.81081 15.2148H6.19382V16.3757H7.81081V15.2148ZM8.33376 21.6242H3.38326V17.9716H8.33376V21.6242ZM5.51453 18.4121H3.89753V19.573H5.51453V18.4121ZM5.51453 20.0606H3.89753V21.2215H5.51453V20.0606ZM7.81081 18.4121H6.19382V19.573H7.81081V18.4121ZM7.81081 20.0606H6.19382V21.2215H7.81081V20.0606ZM14.4797 5.95893H14.1546V9.24058H9.20408V5.95893H8.84159V5.26789H14.4797V5.95893ZM11.3354 6.02851H9.71835V7.18933H11.3354V6.02851ZM11.3354 7.67699H9.71835V8.83782H11.3354V7.67699ZM13.6316 6.02851H12.0146V7.18933H13.6316V6.02851ZM13.6316 7.67699H12.0146V8.83782H13.6316V7.67699ZM6.58335 0H9.75001V0.957195H6.58335V0Z" fill="#2D2D2D" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_9279_4839">
                                                                    <rect width="24" height="24" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        <div>
                                                            <h5>Portions</h5>
                                                            <h6>
                                                                Double Story
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="tab">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M3.43609 7.77088L5.01278 6.19336L8.08871 9.26845C8.2458 9.42017 8.45619 9.50412 8.67457 9.50223C8.89296 9.50033 9.10186 9.41273 9.25629 9.25831C9.41072 9.10388 9.49831 8.89497 9.50021 8.67659C9.50211 8.4582 9.41816 8.24781 9.26644 8.09072L6.19135 5.0148L7.76887 3.4381C7.88542 3.32152 7.96475 3.17297 7.99682 3.01127C8.02889 2.84957 8.01226 2.68199 7.94903 2.52975C7.88579 2.37751 7.77881 2.24746 7.64161 2.15606C7.50442 2.06467 7.34319 2.01604 7.17834 2.01633H3.21037C2.89316 2.01633 2.58894 2.14234 2.36463 2.36665C2.14033 2.59095 2.01432 2.89517 2.01432 3.21239V7.18035C2.01402 7.3452 2.06265 7.50643 2.15405 7.64363C2.24545 7.78082 2.3755 7.88781 2.52774 7.95104C2.67998 8.01427 2.84756 8.03091 3.00926 7.99884C3.17096 7.96677 3.31951 7.88743 3.43609 7.77088Z" fill="#2D2D2D" />
                                                            <path d="M17.8073 19.0077L16.2298 20.5852C16.1136 20.7019 16.0345 20.8503 16.0026 21.0119C15.9707 21.1734 15.9874 21.3408 16.0506 21.4929C16.1138 21.645 16.2206 21.7749 16.3576 21.8662C16.4947 21.9576 16.6557 22.0063 16.8204 22.0062H20.7883C21.1055 22.0062 21.4098 21.8802 21.6341 21.6558C21.8584 21.4315 21.9844 21.1273 21.9844 20.8101V16.8421C21.9845 16.6774 21.9358 16.5162 21.8443 16.3792C21.7528 16.2421 21.6228 16.1353 21.4706 16.0721C21.3184 16.009 21.1509 15.9924 20.9892 16.0245C20.8276 16.0566 20.6791 16.1359 20.5626 16.2524L18.9859 17.8291L15.9108 14.754C15.7537 14.6023 15.5433 14.5184 15.3249 14.5203C15.1066 14.5222 14.8977 14.6098 14.7432 14.7642C14.5888 14.9186 14.5012 15.1275 14.4993 15.3459C14.4974 15.5643 14.5814 15.7747 14.7331 15.9318L17.8073 19.0077Z" fill="#2D2D2D" />
                                                            <path d="M20.7978 2.00653H16.8299C16.6651 2.0064 16.504 2.05515 16.3669 2.14661C16.2299 2.23807 16.123 2.36813 16.0599 2.52033C15.9968 2.67254 15.9802 2.84005 16.0123 3.00167C16.0444 3.1633 16.1237 3.31177 16.2402 3.4283L17.8169 5.00499L14.7418 8.08008C14.5855 8.23626 14.4977 8.44813 14.4976 8.66907C14.4975 8.89002 14.5852 9.10194 14.7414 9.25823C14.8976 9.41452 15.1094 9.50236 15.3304 9.50244C15.5513 9.50252 15.7632 9.41482 15.9195 9.25865L18.9954 6.18356L20.5721 7.76108C20.6887 7.87763 20.8373 7.95696 20.999 7.98903C21.1607 8.0211 21.3282 8.00447 21.4805 7.94124C21.6327 7.878 21.7628 7.77102 21.8542 7.63382C21.9456 7.49663 21.9942 7.3354 21.9939 7.17055V3.20258C21.9939 2.88537 21.8679 2.58115 21.6436 2.35684C21.4193 2.13254 21.1151 2.00653 20.7978 2.00653Z" fill="#2D2D2D" />
                                                            <path d="M3.1899 22.0062H7.15787C7.32265 22.0063 7.48376 21.9575 7.62083 21.8661C7.75789 21.7746 7.86475 21.6446 7.92788 21.4924C7.99101 21.3402 8.00758 21.1726 7.97548 21.011C7.94338 20.8494 7.86407 20.7009 7.74757 20.5844L6.17088 19.0077L9.24597 15.9318C9.32552 15.855 9.38897 15.7631 9.43262 15.6614C9.47627 15.5598 9.49925 15.4505 9.50021 15.3399C9.50117 15.2293 9.4801 15.1197 9.43822 15.0173C9.39634 14.9149 9.3345 14.8219 9.25629 14.7437C9.17809 14.6655 9.08509 14.6037 8.98273 14.5618C8.88037 14.5199 8.77069 14.4989 8.6601 14.4998C8.54951 14.5008 8.44021 14.5238 8.3386 14.5674C8.23698 14.6111 8.14507 14.6745 8.06824 14.7541L4.99231 17.8292L3.41479 16.2516C3.29816 16.1354 3.14969 16.0563 2.98813 16.0244C2.82657 15.9925 2.65918 16.0092 2.50711 16.0724C2.35504 16.1356 2.22512 16.2424 2.13376 16.3794C2.04241 16.5165 1.99372 16.6775 1.99385 16.8422V20.8101C1.99385 21.1273 2.11986 21.4315 2.34416 21.6558C2.56847 21.8802 2.87269 22.0062 3.1899 22.0062Z" fill="#2D2D2D" />
                                                        </svg>
                                                        <div>
                                                            <h5>Covered Area</h5>
                                                            <h6>{item.coverd_area} Sq.ft</h6>
                                                        </div>
                                                    </div>
                                                    <div style={{ paddingTop: "4px" }}>
                                                        <PrimaryBorderButton widthSize={"100%"} height={"32px"} text={"View Property"} />
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    )
                                    :
                                    <div className="global-scroll-box d-flex align-items-center" style={{ gap: '16px' , padding:'0 16px'}}>
                                        {
                                            popularData.map((item, idx) => (
                                                <div style={{ cursor: "pointer", minWidth: "180px", width: '100%' }} onClick={async () => {
                                                    let dataToSearch = await buildSearchPayloadCostCalculate(item)
                                                    const queryString = objectToQueryString(dataToSearch);
                                                    navigate(`/construction-cost-calculator/${item?.area_size}-${item?.area_unit?.code}-house-construction-cost-${item?.city?.city}?${queryString}`)

                                                }} className="popular-box" key={idx}>
                                                    <h3>
                                                        {item.area_size} {item?.area_unit?.name} Construction
                                                        <br /> Cost
                                                    </h3>
                                                    <div className="tab">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <g clipPath="url(#clip0_9279_4839)">
                                                                <path d="M22.6727 11.1871V24H1.22057V11.1871H0L3 4.72612H6.75002L7.00001 4.53284V1.43579H9.50001V2.60005L11.625 0.957195L16.5 4.72612H20.25L24 11.1871H22.6727ZM15.75 5.26453L11.625 2.03403L7.5 5.26453V10.5741H15.75V5.26453ZM21.7686 11.2151H2.12473V23.359H9.20812V23.3688H9.20835V23.359H9.20812V16.2011C9.20812 15.3288 10.4564 14.6216 11.9963 14.6216C13.5362 14.6216 14.7845 15.3288 14.7845 16.2011V23.2118H14.7917V23.359H21.7686V11.2151ZM13.9482 18.2189V16.5338C13.9482 16.0211 13.3322 15.5901 12.4967 15.4649V18.2189H13.9482ZM11.6716 18.2189V15.4437C10.7484 15.5313 10.0447 15.9859 10.0447 16.5338V18.2189H11.6716ZM21.0047 12.7459V13.437H20.6962V16.7784H15.7457V13.437H15.3666V12.7459H21.0047ZM18.5563 16.3757H20.1733V15.2148H18.5563V16.3757ZM18.5563 14.7272H20.1733V13.5664H18.5563V14.7272ZM16.26 16.3757H17.877V15.2148H16.26V16.3757ZM16.26 14.7272H17.877V13.5664H16.26V14.7272ZM20.6962 21.6242H15.7457V17.9716H20.6962V21.6242ZM17.877 18.4121H16.26V19.573H17.877V18.4121ZM17.877 20.0606H16.26V21.2215H17.877V20.0606ZM20.1733 18.4121H18.5563V19.573H20.1733V18.4121ZM20.1733 20.0606H18.5563V21.2215H20.1733V20.0606ZM8.33376 16.7784H3.38326V13.437H3.00825V12.7459H8.64633V13.437H8.33376V16.7784ZM5.51453 13.5664H3.89753V14.7272H5.51453V13.5664ZM5.51453 15.2148H3.89753V16.3757H5.51453V15.2148ZM7.81081 13.5664H6.19382V14.7272H7.81081V13.5664ZM7.81081 15.2148H6.19382V16.3757H7.81081V15.2148ZM8.33376 21.6242H3.38326V17.9716H8.33376V21.6242ZM5.51453 18.4121H3.89753V19.573H5.51453V18.4121ZM5.51453 20.0606H3.89753V21.2215H5.51453V20.0606ZM7.81081 18.4121H6.19382V19.573H7.81081V18.4121ZM7.81081 20.0606H6.19382V21.2215H7.81081V20.0606ZM14.4797 5.95893H14.1546V9.24058H9.20408V5.95893H8.84159V5.26789H14.4797V5.95893ZM11.3354 6.02851H9.71835V7.18933H11.3354V6.02851ZM11.3354 7.67699H9.71835V8.83782H11.3354V7.67699ZM13.6316 6.02851H12.0146V7.18933H13.6316V6.02851ZM13.6316 7.67699H12.0146V8.83782H13.6316V7.67699ZM6.58335 0H9.75001V0.957195H6.58335V0Z" fill="#2D2D2D" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_9279_4839">
                                                                    <rect width="24" height="24" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                        <div>
                                                            <h5>Portions</h5>
                                                            <h6>
                                                                Double Story
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="tab">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M3.43609 7.77088L5.01278 6.19336L8.08871 9.26845C8.2458 9.42017 8.45619 9.50412 8.67457 9.50223C8.89296 9.50033 9.10186 9.41273 9.25629 9.25831C9.41072 9.10388 9.49831 8.89497 9.50021 8.67659C9.50211 8.4582 9.41816 8.24781 9.26644 8.09072L6.19135 5.0148L7.76887 3.4381C7.88542 3.32152 7.96475 3.17297 7.99682 3.01127C8.02889 2.84957 8.01226 2.68199 7.94903 2.52975C7.88579 2.37751 7.77881 2.24746 7.64161 2.15606C7.50442 2.06467 7.34319 2.01604 7.17834 2.01633H3.21037C2.89316 2.01633 2.58894 2.14234 2.36463 2.36665C2.14033 2.59095 2.01432 2.89517 2.01432 3.21239V7.18035C2.01402 7.3452 2.06265 7.50643 2.15405 7.64363C2.24545 7.78082 2.3755 7.88781 2.52774 7.95104C2.67998 8.01427 2.84756 8.03091 3.00926 7.99884C3.17096 7.96677 3.31951 7.88743 3.43609 7.77088Z" fill="#2D2D2D" />
                                                            <path d="M17.8073 19.0077L16.2298 20.5852C16.1136 20.7019 16.0345 20.8503 16.0026 21.0119C15.9707 21.1734 15.9874 21.3408 16.0506 21.4929C16.1138 21.645 16.2206 21.7749 16.3576 21.8662C16.4947 21.9576 16.6557 22.0063 16.8204 22.0062H20.7883C21.1055 22.0062 21.4098 21.8802 21.6341 21.6558C21.8584 21.4315 21.9844 21.1273 21.9844 20.8101V16.8421C21.9845 16.6774 21.9358 16.5162 21.8443 16.3792C21.7528 16.2421 21.6228 16.1353 21.4706 16.0721C21.3184 16.009 21.1509 15.9924 20.9892 16.0245C20.8276 16.0566 20.6791 16.1359 20.5626 16.2524L18.9859 17.8291L15.9108 14.754C15.7537 14.6023 15.5433 14.5184 15.3249 14.5203C15.1066 14.5222 14.8977 14.6098 14.7432 14.7642C14.5888 14.9186 14.5012 15.1275 14.4993 15.3459C14.4974 15.5643 14.5814 15.7747 14.7331 15.9318L17.8073 19.0077Z" fill="#2D2D2D" />
                                                            <path d="M20.7978 2.00653H16.8299C16.6651 2.0064 16.504 2.05515 16.3669 2.14661C16.2299 2.23807 16.123 2.36813 16.0599 2.52033C15.9968 2.67254 15.9802 2.84005 16.0123 3.00167C16.0444 3.1633 16.1237 3.31177 16.2402 3.4283L17.8169 5.00499L14.7418 8.08008C14.5855 8.23626 14.4977 8.44813 14.4976 8.66907C14.4975 8.89002 14.5852 9.10194 14.7414 9.25823C14.8976 9.41452 15.1094 9.50236 15.3304 9.50244C15.5513 9.50252 15.7632 9.41482 15.9195 9.25865L18.9954 6.18356L20.5721 7.76108C20.6887 7.87763 20.8373 7.95696 20.999 7.98903C21.1607 8.0211 21.3282 8.00447 21.4805 7.94124C21.6327 7.878 21.7628 7.77102 21.8542 7.63382C21.9456 7.49663 21.9942 7.3354 21.9939 7.17055V3.20258C21.9939 2.88537 21.8679 2.58115 21.6436 2.35684C21.4193 2.13254 21.1151 2.00653 20.7978 2.00653Z" fill="#2D2D2D" />
                                                            <path d="M3.1899 22.0062H7.15787C7.32265 22.0063 7.48376 21.9575 7.62083 21.8661C7.75789 21.7746 7.86475 21.6446 7.92788 21.4924C7.99101 21.3402 8.00758 21.1726 7.97548 21.011C7.94338 20.8494 7.86407 20.7009 7.74757 20.5844L6.17088 19.0077L9.24597 15.9318C9.32552 15.855 9.38897 15.7631 9.43262 15.6614C9.47627 15.5598 9.49925 15.4505 9.50021 15.3399C9.50117 15.2293 9.4801 15.1197 9.43822 15.0173C9.39634 14.9149 9.3345 14.8219 9.25629 14.7437C9.17809 14.6655 9.08509 14.6037 8.98273 14.5618C8.88037 14.5199 8.77069 14.4989 8.6601 14.4998C8.54951 14.5008 8.44021 14.5238 8.3386 14.5674C8.23698 14.6111 8.14507 14.6745 8.06824 14.7541L4.99231 17.8292L3.41479 16.2516C3.29816 16.1354 3.14969 16.0563 2.98813 16.0244C2.82657 15.9925 2.65918 16.0092 2.50711 16.0724C2.35504 16.1356 2.22512 16.2424 2.13376 16.3794C2.04241 16.5165 1.99372 16.6775 1.99385 16.8422V20.8101C1.99385 21.1273 2.11986 21.4315 2.34416 21.6558C2.56847 21.8802 2.87269 22.0062 3.1899 22.0062Z" fill="#2D2D2D" />
                                                        </svg>
                                                        <div>
                                                            <h5>Covered Area</h5>
                                                            <h6>{item.coverd_area} Sq.ft</h6>
                                                        </div>
                                                    </div>
                                                    <div style={{ paddingTop: "4px" }}>
                                                        <PrimaryBorderButton widthSize={"100%"} height={"32px"} text={"View Property"} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="about-construction">
                        <div className="heading">About Construction Cost Calculator</div>
                        <div className="para">One of the biggest challenges when planning to build a house is estimating the construction cost in advance. Construction expenses can vary based on several factors, including material quality, covered area, number of floors, and the city where construction takes place. Without a clear estimate, budgeting becomes difficult. To make planning easier, PakistanProperty offers a Construction Cost Calculator that helps users estimate house construction costs in Pakistan. This tool provides a quick and reliable cost estimate before starting a construction project. Using the calculator is simple. Select the city, enter the covered area in marla or kanal, and choose the construction quality. Based on these details, the calculator displays an estimated construction cost. The estimate includes both grey structure and finishing costs. Grey structure costs cover essential construction work such as foundations, walls, beams, cement, and steel. Finishing costs include tiles, doors, bathroom fittings, and other interior items.</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Popular;
