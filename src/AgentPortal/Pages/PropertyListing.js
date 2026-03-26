import React, { useEffect, useRef, useState } from 'react'
import SingleInput from '../Component/Inputs/SingleInput'
import { useAuth } from '../../Context/ContextProvider'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { TiEye } from 'react-icons/ti'
import img from '../Asset/property-img.png'
import { MdModeEditOutline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'
import Pagination from "../Component/Pagination/Pagination";
import EditPropertyModal from '../Component/EditPropertyModal/EditPropertyModal'
import PropertyView from '../Component/PropertyView/PropertyView'
import DropDownInput from '../Component/Inputs/DropDownInput'
import "react-datepicker/dist/react-datepicker.css";
import RangeMenuFeild from '../../Component/Metiral/InputField/RangeMenuField/RangeMenuFeild'
import noData from '../Asset/No data.svg'
import PrimaryButton from '../../Component/Metiral/Button/PrimaryButton'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import ApplyQuotaModal from '../Component/Modal/ApplyQuota'
import CustomTooltip from '../../Component/Metiral/CustomTooltip'
import { LuFilter } from 'react-icons/lu'

import Image from 'next/image';
function PropertyListing() {
    const { areaUnit, loginData, getQoutaState, setLocationList, getLOcation, citiesList, propertyType, formatPakistaniPhoneNumber, locationList, getProprtey, formatPriceWithCommas, formatDate, loading, changePropertyStatus } = useAuth()
    const role = loginData?.data?.role
    const [productData, setProductData] = useState([]);
    const [typeMenu, setTypeMenu] = useState([])
    const [subCategoryMenu, setSubCategoryMenu] = useState([])
    const [openQuota, setOpenQuota] = useState(false)
    const [data, setData] = useState({
        property_id: "",
        city: "",
        location: '',
        purpose: "",
        property_type: '',
        property_sub_category: "",
        priceRange: {
            min: "",
            max: "",
            priceValue: {
                id: 3,
                name: "PKR",
                code: "pkr"
            },
        },
        areaRange: {
            min: "",
            max: "",
            areaValue: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
        },
        listedDate: '',
    })
    const [property, setProperty] = useState({})
    const [openFilter, setOpenFilter] = useState(false)
    const [listData, setList] = useState([])
    const [propertyData, setPropertyData] = useState({})
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [areaSlider, setAreaSlider] = useState([0, 100]);
    const [activeOffer, setActiveOffer] = useState("")
    const [paginationData, setPaginationData] = useState({
        perPage: 10,
        toPaginate: "active"
    });
    const [open, setOpen] = React.useState(false);
    const handleOpen = (item) => {
        setOpen(true)

    };
    useEffect(() => {

        const fetchData2 = async () => {
            try {
                let result = await getQoutaState();
                if (result?.success) {
                    setProductData(result?.data?.data?.offer_logs);
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchData2()

        // eslint-disable-next-line
    }, []);
    const [status, setstatus] = useState("active");
    const [tableList, settableList] = useState([]);

    let statusesToInclude = [
        "active",
        "pending",
        "rejected",
        "expired",
        "deleted",
        "downgraded",
        "sold",
        "inactive",
    ];
    const fetchData = async (paginationData) => {
        try {
            let result = await getProprtey(paginationData);
            let tabData = [];
            if (result?.success) {
                result?.data?.data?.statuses?.filter((item) => {
                    if (item?.status?.toLowerCase() === status) {
                        setList(item?.properties);
                        setPaginationData({
                            ...paginationData,
                            total_pages: item.total_pages,
                            current_page: item.current_page,
                            total_items: item.total,
                        });
                    }
                    return null;
                });

                // Filter the data based on the status and populate the tabData array
                result?.data?.data?.statuses?.forEach((item) => {
                    if (statusesToInclude?.includes(item?.status?.toLowerCase())) {
                        tabData.push({
                            name: item?.status?.toLowerCase(),
                            total: item?.total,
                            properties: item?.properties,
                            total_pages: item?.total_pages,
                            current_page: item?.current_page,
                        });
                    }
                    return null;
                });

                // Log the filtered data to the console

                // Update the state with the filtered data
                settableList(tabData);
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData(paginationData)
        // eslint-disable-next-line
    }, [])
    const navigate = useNavigate()
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const handleToggle = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };
    // Close dropdown when clicking outside
    // remove dropdownRef and instead rely on event target path
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Check if clicked element does NOT belong to any dropdown or its button
            if (!e.target.closest(".dropdown_menu") && !e.target.closest(".icon")) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [openPropertyView, setOpenPropertyView] = useState(false)
    const [dataForView, setPropertyView] = useState()
    const storeData = (item) => {
        setPropertyView(item)
        const formattedContacts =
            item?.contacts?.length === 2
                ? [
                    formatPakistaniPhoneNumber(item?.contacts[0]),
                    formatPakistaniPhoneNumber(item?.contacts[1]),
                ]
                : item?.contacts?.length === 1
                    ? [formatPakistaniPhoneNumber(item?.contacts[0]), ""]
                    : ["", ""];
        setPropertyData({
            id: item?.id,
            purpose: item?.property_type_id,
            slug: item?.slug,
            propertyType: {
                type: item?.category_id,
                subType: item?.sub_category_id
            },
            city: item?.city || item?.city_code,
            location: item?.location || item?.location_id,
            plot_number: item?.plot_number,
            areaValue: item?.area_size,
            areaUnit: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
            priceValue: item?.price,
            priceUnit: {
                name: item?.currency,
                id: item?.currency
            },
            installment: item?.installments_available ? true : false,
            possession: item?.ready_for_possession ? true : false,
            advanceAmount: item?.advanced_amount,
            no_of_installment: item?.number_of_installments,
            monthlyInstallment: item?.monthly_installments,
            bedroom: item?.bedrooms,
            bathroom: item?.bathrooms,
            amenities: item?.amenities || [],
            listingTitle: item?.title,
            listingDescription: item?.description,
            images: item?.images,
            videos: item?.video_links?.length ? item?.video_links : [""],
            email: item?.email,
            landline: formatPakistaniPhoneNumber(item?.land_line),
            contact: formattedContacts,
            platform: true
        })
    }
    const handleOpenPropertyView = (data) => {

        storeData(data)
        setOpenPropertyView(true)
    }

    useEffect(() => {
        if (openFilter) {
            if (propertyType?.length) {
                setTypeMenu(propertyType[0]?.categories)

            }
        }
    }, [propertyType])


    const handlePurposeChange = () => {
        let subPropertyType = propertyType?.find((item) => item?.id === data?.purpose)?.categories
        setTypeMenu(subPropertyType)
        let subCategoryType = subPropertyType?.find((item) => item?.id === data?.property_type)?.sub_categories
        setSubCategoryMenu(subCategoryType)
    };
    const handleErase = () => {
        setData({
            property_id: "",
            city: "",
            location: "",
            purpose: "",
            property_type: "",
            property_sub_category: "",
            priceRange: {
                min: "",
                max: "",
                priceValue: {
                    id: 3,
                    name: "PKR",
                    code: "pkr",
                },
            },
            areaRange: {
                min: "",
                max: "",
                areaValue: {
                    id: 4,
                    name: "Marla",
                    code: "marla",
                },
            },
            listedDate: "",
        });
    };
    const handleChanagePropertyStatus = async (data) => {
        try {
            let result = await changePropertyStatus(data);
            if (result?.success) {
                fetchData(paginationData)
            }
        } catch (error) {
            console.error("An error occurred while deleting property:", error);
        }
    };


    return (
        <div className='property-listing portal-page-container'>
            <div className="d-flex align-items-center justify-content-between g-2">
                <h3 className='page-portal-heading m-0'>Property Listings</h3>
                <div className="global-filter-button d-sm-none d-flex align-items-center gap-2 ms-auto" onClick={() => setOpenFilter(!open)}>
                    Filter <LuFilter />
                </div>
            </div>
            <p className='portal-breadCrums m-0'>Home - Property-Management - <span>Add Property</span></p>
            {loading ? <div className='table_box'>
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                            <th><span className="placeholder rounded" style={{ width: "100%", height: "20px", display: "block" }}></span></th>
                        </tr>
                    </thead>
                    <tbody>


                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="placeholder rounded me-2" style={{ width: "60px", height: "60px" }}></span>
                                        <div>
                                            <p className="placeholder-glow m-0">
                                                <span className="placeholder col-6"></span>
                                            </p>
                                            <p className="placeholder-glow m-0">
                                                <span className="placeholder col-8"></span>
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="placeholder col-6"></span></td>
                                <td><span className="placeholder col-3"></span></td>
                                <td><span className="placeholder col-3"></span></td>
                                <td><span className="placeholder col-4"></span></td>
                                <td><span className="placeholder col-6"></span></td>
                                <td><span className="placeholder col-8"></span></td>
                                <td><span className="placeholder col-2"></span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> :
                <> {
                    !tableList.every(item => item.total === 0) ?
                        <>
                            <div className='search-section d-sm-grid d-none' style={{ border: openFilter ? 'none' : '', padding: openFilter ? 0 : '' }}>
                                <SingleInput label={"Property ID"} data={data} width={"auto"} setData={setData} varName={"property_id"} input={true} dropDown={false} placeHolder={"Enter ID"} />
                                <SingleInput getVariable={"city"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />
                                <SingleInput getVariable={"name"} label={"Location"} data={data} setData={setData} varName={"location"} menuData={locationList} input={false} dropDown={true} placeHolder={"Enter Location"} />
                                <DropDownInput getVariable={"name"} label={"Purpose"} data={data} width={"auto"} setData={setData} varName={"purpose"} menuData={propertyType} input={false} dropDown={true} placeHolder={"Select"} />
                                <div className='d-flex align-items-sm-center align-items-start btn-section1 flex-sm-row flex-column'>
                                    <button onClick={() => setOpenFilter(true)} className='more_btn'>More Filters</button>
                                    <span className='d-flex align-items-center gap-2'>
                                        <div
                                            className="button btn-primary-button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                                            </svg>
                                            Search
                                        </div>
                                        <div onClick={handleErase}
                                            className="button save btn-secondary-button"

                                        >

                                            Reset
                                        </div>
                                    </span>
                                </div>
                                {
                                    openFilter &&
                                    <div className="filter-menu">
                                        <div className="title">
                                            All Filters
                                        </div>
                                        <div className="filter-search-section">
                                            <SingleInput label={"Property ID"} data={data} width={"auto"} setData={setData} varName={"property_id"} input={true} dropDown={false} placeHolder={"Enter ID"} />
                                            <SingleInput getVariable={"city"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />
                                            <SingleInput getVariable={"name"} label={"Location"} data={data} setData={setData} varName={"location"} menuData={locationList} input={false} dropDown={true} placeHolder={"Enter Location"} />
                                            <DropDownInput getVariable={"name"} label={"Purpose"} data={data} width={"auto"} setData={setData} varName={"purpose"} menuData={propertyType} input={false} dropDown={true} placeHolder={"Select"} />
                                            <span onClick={() => handlePurposeChange()}>
                                                <DropDownInput getVariable={"name"} label={"Property Type"} data={data} width={"auto"} setData={setData} varName={"property_type"} menuData={typeMenu} placeHolder={"Select"} />
                                            </span>
                                            <span onClick={() => handlePurposeChange()}>
                                                <DropDownInput getVariable={"name"} label={"Property Sub Type"} data={data} width={"auto"} setData={setData} varName={"property_sub_category"} menuData={subCategoryMenu} placeHolder={"Select"} />
                                            </span>
                                            <div className="date-input" >
                                                <label style={{ fontSize: "14px" }}>Listed Date</label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            maxHeight: "32px",
                                                            height: '32px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            backgroundColor: "white",
                                                        }}
                                                    >
                                                        <DesktopDatePicker
                                                            sx={{
                                                                width: '100%',

                                                                // FIX INPUT HEIGHT
                                                                '& .MuiOutlinedInput-root': {
                                                                    backgroundColor: 'white',
                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                    borderRadius: '8px',
                                                                    height: "32px !important",
                                                                    maxHeight: "32px !important",

                                                                    '& fieldset': {
                                                                        borderColor: '#BBBBBB',
                                                                    },
                                                                    '&:hover fieldset': {
                                                                        borderColor: '#447158',
                                                                    },
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: '#447158',
                                                                    }
                                                                },

                                                                '& .MuiInputBase-input': {
                                                                    padding: "0 10px !important",
                                                                    height: "32px !important",
                                                                    boxSizing: "border-box",
                                                                },
                                                            }}

                                                            slotProps={{
                                                                field: { clearable: true },
                                                                popper: {
                                                                    sx: {
                                                                        "& .MuiPaper-root": {
                                                                            width: '330px',
                                                                            margin: 0,
                                                                            borderRadius: "8px",
                                                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                                            border: "1px solid #BBBBBB",
                                                                            // background:
                                                                            //     "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))",
                                                                            // backdropFilter: "blur(8px)",
                                                                            "& .MuiPickersDay-root": {
                                                                                fontFamily: "DM Sans",
                                                                                fontSize: "14px",
                                                                                color: "#447158",
                                                                            },
                                                                            "& .MuiPickersDay-root.Mui-selected": {
                                                                                backgroundColor: "#007bff",
                                                                                color: "#fff",
                                                                                borderRadius: '5px'
                                                                            },
                                                                            "& .MuiPickersDay-root:hover": {
                                                                                backgroundColor: "#447158",
                                                                                color: "#fff",
                                                                                borderRadius: '5px'
                                                                            },
                                                                            "& .MuiPickersCalendarHeader-label": {
                                                                                fontFamily: "DM Sans",
                                                                                fontWeight: 600,
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                </LocalizationProvider>

                                            </div>
                                            <RangeMenuFeild
                                                label={"Price Range"}
                                                filterData={data}
                                                setFilterData={setData}
                                                varName={"priceRange"}
                                                min={"min"}
                                                max={"max"}
                                                value={"priceValue"}
                                                placeHolder={"Select Currency"}
                                                design={"simple"}
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
                                                maxValue={10000}
                                                viewText={true}
                                            />
                                            <RangeMenuFeild
                                                label={"Area Range"}
                                                filterData={data}
                                                setFilterData={setData}
                                                varName={"areaRange"}
                                                min={"min"}
                                                max={"max"}
                                                value={"areaValue"}
                                                placeHolder={"Select Unit"}
                                                design={"simple"}
                                                menuData={areaUnit}
                                                sliderValue={areaSlider}
                                                setSliderValue={setAreaSlider}
                                                maxValue={100}
                                                viewText={true}
                                            />
                                            <div className='d-flex align-items-center btn-section1 mt-lg-1 mt-3'>
                                                <button onClick={() => setOpenFilter(false)} className='more_btn mt-0'>Close</button>        <div
                                                    className="button btn-primary-button"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                                                    </svg>
                                                    Search
                                                </div>
                                                <div onClick={handleErase}
                                                    className="button save btn-secondary-button"

                                                >

                                                    Reset
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="search-section mobile-filter-section d-sm-none d-inline-block" style={{ left: openFilter ? "0" : "-100%" }}>
                                <div className="global-mobile-menu-header">
                                    <div className="heading">Filter</div>
                                    <div className="input-section-close-btn d-lg-none d-flex justify-content-center align-items-center" onClick={() => setOpenFilter(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="filter-menu">
                                    <div className="filter-search-section">
                                        <SingleInput label={"Property ID"} data={data} width={"auto"} setData={setData} varName={"property_id"} input={true} dropDown={false} placeHolder={"Enter ID"} />
                                        <SingleInput getVariable={"city"} label={"City"} data={data} setData={setData} varName={"city"} menuData={citiesList} input={true} dropDown={true} placeHolder={"Select"} />
                                        <SingleInput getVariable={"name"} label={"Location"} data={data} setData={setData} varName={"location"} menuData={locationList} input={false} dropDown={true} placeHolder={"Enter Location"} />
                                        <DropDownInput getVariable={"name"} label={"Purpose"} data={data} width={"auto"} setData={setData} varName={"purpose"} menuData={propertyType} input={false} dropDown={true} placeHolder={"Select"} />
                                        <span onClick={() => handlePurposeChange()}>
                                            <DropDownInput getVariable={"name"} label={"Property Type"} data={data} width={"auto"} setData={setData} varName={"property_type"} menuData={typeMenu} placeHolder={"Select"} />
                                        </span>
                                        <span onClick={() => handlePurposeChange()}>
                                            <DropDownInput getVariable={"name"} label={"Property Sub Type"} data={data} width={"auto"} setData={setData} varName={"property_sub_category"} menuData={subCategoryMenu} placeHolder={"Select"} />
                                        </span>
                                        <div className="date-input" >
                                            <label style={{ fontSize: "14px" }}>Listed Date</label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        maxHeight: "32px",
                                                        height: '32px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    <DesktopDatePicker
                                                        sx={{
                                                            width: '100%',

                                                            // FIX INPUT HEIGHT
                                                            '& .MuiOutlinedInput-root': {
                                                                backgroundColor: 'white',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                borderRadius: '8px',
                                                                height: "32px !important",
                                                                maxHeight: "32px !important",

                                                                '& fieldset': {
                                                                    borderColor: '#BBBBBB',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#447158',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#447158',
                                                                }
                                                            },

                                                            '& .MuiInputBase-input': {
                                                                padding: "0 10px !important",
                                                                height: "32px !important",
                                                                boxSizing: "border-box",
                                                            },
                                                        }}

                                                        slotProps={{
                                                            field: { clearable: true },
                                                            popper: {
                                                                sx: {
                                                                    "& .MuiPaper-root": {
                                                                        width: '330px',
                                                                        margin: 0,
                                                                        borderRadius: "8px",
                                                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                                        border: "1px solid #BBBBBB",
                                                                        background:
                                                                            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,240,240,0.95))",
                                                                        backdropFilter: "blur(8px)",
                                                                        "& .MuiPickersDay-root": {
                                                                            fontFamily: "DM Sans",
                                                                            fontSize: "14px",
                                                                            color: "#447158",
                                                                        },
                                                                        "& .MuiPickersDay-root.Mui-selected": {
                                                                            backgroundColor: "#007bff",
                                                                            color: "#fff",
                                                                            borderRadius: '5px'
                                                                        },
                                                                        "& .MuiPickersDay-root:hover": {
                                                                            backgroundColor: "#447158",
                                                                            color: "#fff",
                                                                            borderRadius: '5px'
                                                                        },
                                                                        "& .MuiPickersCalendarHeader-label": {
                                                                            fontFamily: "DM Sans",
                                                                            fontWeight: 600,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </LocalizationProvider>

                                        </div>
                                        <RangeMenuFeild
                                            label={"Price Range"}
                                            filterData={data}
                                            setFilterData={setData}
                                            varName={"priceRange"}
                                            min={"min"}
                                            max={"max"}
                                            value={"priceValue"}
                                            placeHolder={"Select Currency"}
                                            design={"simple"}
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
                                            maxValue={10000}
                                            viewText={true}
                                        />
                                        <RangeMenuFeild
                                            label={"Area Range"}
                                            filterData={data}
                                            setFilterData={setData}
                                            varName={"areaRange"}
                                            min={"min"}
                                            max={"max"}
                                            value={"areaValue"}
                                            placeHolder={"Select Unit"}
                                            design={"simple"}
                                            menuData={areaUnit}
                                            sliderValue={areaSlider}
                                            setSliderValue={setAreaSlider}
                                            maxValue={100}
                                            viewText={true}
                                        />
                                        <div className='align-items-center btn-section1 global-footer-button-box mt-lg-1 mt-3' style={{ display: openFilter ? "flex" : "none" }}>
                                            <div
                                                className="button btn-primary-button"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                                                </svg>
                                                Search
                                            </div>
                                            <div onClick={handleErase}
                                                className="button save btn-secondary-button"

                                            >

                                                Reset
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-section d-sm-none d-block" style={{ border: 'none', height: 'fit-content' }}>
                                <div className='table-tab'>
                                    {tableList?.map((item) => {
                                        return (
                                            <div onClick={() => {
                                                setList(item?.properties);
                                                setstatus(item?.name);
                                                setPaginationData({
                                                    toPaginate: item?.name,
                                                    total_pages: item?.total_pages,
                                                    current_page: item?.current_page
                                                });
                                            }} className={`tab_btn ${item?.name === status ? "active" : ""}`}>
                                                <span>{item?.name}      </span>
                                                <span className='number'>  ({item?.total})</span>

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='table-section'>
                                <div className="div" style={{ minWidth: '1200px', height:'-webkit-fill-available' }}>
                                    <div className='table-tab d-sm-flex d-none'>
                                        {tableList?.map((item) => {
                                            return (
                                                <div onClick={() => {
                                                    setList(item?.properties);
                                                    setstatus(item?.name);
                                                    setPaginationData({
                                                        toPaginate: item?.name,
                                                        total_pages: item?.total_pages,
                                                        current_page: item?.current_page
                                                    });
                                                }} className={`tab_btn ${item?.name === status ? "active" : ""}`}>
                                                    <span>{item?.name} <div>
                                                        <span>{item?.total}</span>
                                                    </div></span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className='table_box' style={{ height: Pagination`calc(63vh - 50px)` }}>
                                        <table className='w-100'>
                                            <thead>
                                                <tr>
                                                    <th className='d-sm-none d-flex' >Actions</th>
                                                    <th>Property ID & Name</th>
                                                    <th>Price</th>
                                                    <th>Clicks</th>
                                                    <th>Leads</th>
                                                    <th>Posted On</th>
                                                    <th className='qouta-head'>Quota
                                                        <div className='d-flex'>
                                                            <p className='m-0 hot'>H<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                <path d="M9.09031 3.23052C8.85648 2.68407 8.5307 2.20727 8.11236 1.80023C7.69381 1.39319 7.19452 1.07491 6.61416 0.844886C6.0337 0.615065 5.40053 0.5 4.71477 0.5C4.02109 0.5 3.38619 0.615065 2.80963 0.844886C2.23287 1.07491 1.73717 1.39319 1.32283 1.80023C0.908085 2.20727 0.584055 2.68407 0.350433 3.23052C0.116811 3.77718 0 4.36689 0 5.00005C0 5.63321 0.116708 6.22302 0.350433 6.76948C0.584055 7.31614 0.908085 7.79273 1.32283 8.19977C1.73717 8.60681 2.23287 8.9254 2.80963 9.15522C3.38619 9.38504 4.02109 9.5 4.71477 9.5C5.40064 9.5 6.0337 9.38504 6.61416 9.15522C7.19452 8.9254 7.69381 8.60681 8.11236 8.19977C8.5307 7.79273 8.85648 7.31614 9.09031 6.76948C9.32383 6.22313 9.44074 5.63321 9.44074 5.00005C9.44074 4.36679 9.32383 3.77718 9.09031 3.23052ZM6.32311 2.77879C6.41372 2.65839 6.47629 2.6326 6.47629 2.6326C6.47629 2.6326 6.38999 2.69568 6.41588 2.81609C6.44177 2.93649 6.48276 3.16878 6.29074 3.20032C6.29074 3.20032 6.31879 3.18028 6.28643 3.10858C6.25407 3.03687 6.23249 2.8993 6.32311 2.77879ZM4.38797 2.10495C4.38797 2.10495 4.27146 2.2197 4.3103 2.36877C4.34913 2.51784 4.46132 2.73575 4.23695 2.88492C4.23695 2.88492 4.32324 2.77591 4.25852 2.60959C4.1938 2.44336 4.18516 2.20244 4.38797 2.10495ZM3.80545 2.74725C3.80545 2.74725 3.69326 2.89632 3.7623 3.0569C3.83134 3.21748 3.89175 3.38956 3.74504 3.54438C3.74504 3.54438 3.79251 3.4698 3.70189 3.3609C3.61138 3.25199 3.57686 2.98242 3.80545 2.74725ZM2.79155 4.82324C2.76134 4.88632 2.79155 4.77732 2.72682 4.71999C2.63857 4.64181 2.44204 4.4275 2.68368 4.15227C2.68368 4.15227 2.60169 4.28419 2.68368 4.37018C2.76566 4.45627 2.88278 4.63287 2.79155 4.82324ZM6.71166 5.52442L6.71155 5.52472C6.71052 5.5314 6.7095 5.53818 6.70826 5.54496C6.70806 5.54609 6.70785 5.54723 6.70775 5.54836C6.70662 5.55473 6.70549 5.56109 6.70426 5.56757C6.70395 5.56911 6.70364 5.57065 6.70333 5.57219C6.7021 5.57835 6.70087 5.58452 6.69953 5.59068C6.69912 5.59243 6.69881 5.59428 6.6984 5.59602C6.69707 5.60209 6.69573 5.60815 6.69429 5.61421C6.69388 5.61606 6.69337 5.61801 6.69296 5.61986C6.69152 5.62592 6.68998 5.63198 6.68833 5.63804C6.68782 5.63989 6.68741 5.64164 6.6869 5.64349C6.68525 5.64965 6.68351 5.65582 6.68176 5.66208C6.68135 5.66352 6.68083 5.66506 6.68042 5.6666C6.67847 5.67318 6.67652 5.67975 6.67446 5.68623L6.67436 5.68643C6.66748 5.70811 6.65967 5.72979 6.65104 5.75146C6.65032 5.75331 6.6496 5.75516 6.64888 5.75701C6.64683 5.76215 6.64457 5.76739 6.64231 5.77252C6.64108 5.7755 6.63974 5.77848 6.6384 5.78146C6.63635 5.78619 6.63409 5.79102 6.63193 5.79574C6.63039 5.79913 6.62885 5.80252 6.62721 5.80591C6.62505 5.81043 6.62279 5.81496 6.62053 5.81948C6.61878 5.82307 6.61693 5.82667 6.61508 5.83026C6.61282 5.83458 6.61056 5.83889 6.6083 5.84321C6.60625 5.84701 6.60429 5.85071 6.60214 5.85451C6.59977 5.85872 6.59741 5.86293 6.59505 5.86704C6.59279 5.87095 6.59053 5.87475 6.58827 5.87865C6.5858 5.88276 6.58344 5.88677 6.58087 5.89088C6.57841 5.89478 6.57594 5.89879 6.57347 5.90269C6.57091 5.9066 6.56844 5.9106 6.56587 5.91451C6.5632 5.91862 6.56032 5.92273 6.55755 5.92673C6.55498 5.93043 6.55252 5.93413 6.54984 5.93793C6.54676 5.94235 6.54348 5.94666 6.54029 5.95108C6.53783 5.95447 6.53536 5.95786 6.53279 5.96115C6.52868 5.96659 6.52426 5.97214 6.51995 5.97759C6.5182 5.97974 6.51656 5.982 6.51481 5.98416C6.50875 5.99166 6.50238 5.99916 6.49601 6.00656C6.49375 6.00913 6.49139 6.0118 6.48903 6.01437C6.48471 6.0193 6.48029 6.02423 6.47577 6.02906C6.473 6.03204 6.47012 6.03502 6.46725 6.038C6.46303 6.04241 6.45882 6.04683 6.45451 6.05115C6.45142 6.05423 6.44824 6.05731 6.44516 6.06039C6.44084 6.0646 6.43653 6.06882 6.43211 6.07293C6.42882 6.07601 6.42543 6.07909 6.42204 6.08217C6.41917 6.08484 6.41629 6.08751 6.41341 6.09008C6.40221 6.14361 6.38619 6.19426 6.36338 6.23843C6.34499 6.27408 6.32239 6.30675 6.29773 6.33716C6.30431 6.3349 6.31088 6.33295 6.31715 6.33151C6.36399 6.32052 6.43776 6.35494 6.45451 6.41894C6.33019 6.37497 6.23044 6.50935 6.16592 6.63664C6.09667 6.77338 6.05199 6.928 5.94956 7.03074C5.8684 7.1121 5.71142 7.18422 5.58556 7.22213C5.58433 7.22244 5.5832 7.22285 5.58197 7.22316C5.57591 7.22501 5.56995 7.22676 5.56399 7.2284C5.5608 7.22922 5.55782 7.23004 5.55474 7.23087C5.54776 7.23272 5.54098 7.23446 5.5343 7.23611C5.52916 7.23734 5.52413 7.23847 5.51919 7.2396C5.51642 7.24021 5.51375 7.24083 5.51108 7.24134C5.50358 7.24289 5.49629 7.24432 5.4894 7.24545C5.30776 7.27566 5.16876 7.29323 5.02894 7.30586C4.92939 7.32662 4.821 7.3374 4.70737 7.33751H4.70727C4.67152 7.33751 4.63587 7.33638 4.60063 7.33422C4.58635 7.33494 4.57217 7.33566 4.55789 7.33617C4.5506 7.33648 4.5433 7.33648 4.53601 7.33668C4.52327 7.33699 4.51053 7.3374 4.49779 7.33761C4.48885 7.33771 4.47992 7.33771 4.47098 7.33771C4.45988 7.33771 4.44879 7.33781 4.43759 7.33771C4.42783 7.33761 4.41807 7.3373 4.40821 7.3371C4.39783 7.33689 4.38756 7.33658 4.37718 7.33627C4.3668 7.33586 4.35643 7.33535 4.34605 7.33483C4.33619 7.33432 4.32643 7.33381 4.31657 7.33319C4.30578 7.33247 4.29499 7.33165 4.2842 7.33073C4.27475 7.33001 4.2653 7.32918 4.25575 7.32826C4.24465 7.32723 4.23345 7.326 4.22225 7.32477C4.21311 7.32374 4.20397 7.32261 4.19482 7.32148C4.18332 7.32004 4.17181 7.3185 4.1602 7.31675C4.15136 7.31552 4.14243 7.31408 4.13359 7.31264C4.12178 7.31079 4.10996 7.30874 4.09805 7.30668C4.08942 7.30514 4.08079 7.3035 4.07216 7.30175C4.05993 7.29939 4.0477 7.29693 4.03548 7.29436C4.02726 7.29261 4.01894 7.29066 4.01072 7.28871C3.99808 7.28573 3.98545 7.28285 3.97271 7.27956C3.9649 7.27761 3.95709 7.27545 3.94939 7.2733C3.93613 7.2697 3.92288 7.26621 3.90963 7.2623C3.90264 7.26025 3.89576 7.25799 3.88877 7.25583C3.87459 7.25152 3.86042 7.2472 3.84614 7.24237C3.84141 7.24083 3.83668 7.23898 3.83196 7.23734C3.77792 7.21884 3.72347 7.19727 3.6684 7.17231C3.66501 7.17076 3.66162 7.16943 3.65823 7.16778C3.63378 7.15648 3.60912 7.14467 3.58447 7.13203C3.4392 7.05765 3.3003 6.93375 3.19849 6.76886C3.16931 6.74143 3.14404 6.71061 3.12369 6.67568C3.11321 6.6576 3.10315 6.63993 3.09329 6.62246C3.09061 6.61763 3.08784 6.61291 3.08517 6.60808C3.07705 6.59359 3.06925 6.57942 3.06164 6.56544C3.06 6.56236 3.05825 6.55918 3.05661 6.5562C3.04787 6.54007 3.03955 6.52435 3.03144 6.50884C3.02897 6.50411 3.02651 6.49938 3.02414 6.49466C3.01808 6.48295 3.01233 6.47144 3.00657 6.46014C3.00431 6.45562 3.00195 6.45099 2.99979 6.44647C2.99281 6.43219 2.98603 6.41822 2.97956 6.40446C2.97729 6.39973 2.97524 6.39511 2.97308 6.39038C2.96856 6.38062 2.96415 6.37086 2.95993 6.36131C2.95757 6.35607 2.95521 6.35072 2.95295 6.34548C2.9474 6.33285 2.94206 6.32032 2.93702 6.30799C2.93517 6.30336 2.93343 6.29884 2.93158 6.29422C2.92819 6.28569 2.9248 6.27716 2.92161 6.26884C2.91946 6.26319 2.9174 6.25765 2.91534 6.2521C2.91226 6.24388 2.90939 6.23566 2.90661 6.22754C2.90404 6.22015 2.90158 6.21285 2.89911 6.20556C2.89655 6.19765 2.89398 6.18984 2.89161 6.18213C2.88987 6.17648 2.88822 6.17073 2.88648 6.16518C2.88453 6.15861 2.88278 6.15214 2.88093 6.14566C2.80203 5.8581 2.86799 5.65797 2.96846 5.31073C3.11948 4.78883 3.18852 4.46192 3.01592 4.33576C3.01592 4.33576 3.25325 4.33576 3.29208 4.6225C3.29208 4.6225 3.37406 4.45041 3.25324 4.23251C3.13243 4.01461 3.21872 3.75078 3.30502 3.61311C3.39132 3.47545 3.54235 3.42192 3.54235 3.42192C3.54235 3.42192 3.41002 3.49075 3.43879 3.64373C3.46046 3.7591 3.58365 3.78746 3.69224 3.83379C3.69255 3.83389 3.69275 3.834 3.69306 3.8342C3.70148 3.8378 3.7098 3.8415 3.71802 3.8454C3.71833 3.8455 3.71864 3.84571 3.71895 3.84581C3.72727 3.84971 3.73539 3.85382 3.7433 3.85814C3.74361 3.85824 3.74381 3.85845 3.74402 3.85855C3.75203 3.86297 3.75973 3.86749 3.76723 3.87232C3.76744 3.87242 3.76754 3.87252 3.76775 3.87262C3.77535 3.87756 3.78265 3.8828 3.78963 3.88834C3.9047 3.98009 3.94497 4.11775 3.91045 4.23241C3.91045 4.23241 4.12332 4.14066 4.10606 3.94187C4.0888 3.74307 3.9536 3.76598 3.99387 3.51366C4.03414 3.26134 4.14633 3.23453 4.14633 3.23453C4.14633 3.23453 4.01894 3.38946 4.10894 3.53493C4.12558 3.50729 4.16369 3.46754 4.20458 3.45531C4.24917 3.44185 4.31883 3.43394 4.36218 3.45541C4.38108 3.46476 4.40101 3.47822 4.42023 3.49497C4.37307 3.32833 4.38417 3.13755 4.43605 2.97296C4.48474 2.81804 4.60782 2.62993 4.73645 2.59161C4.68344 2.64092 4.65857 2.7342 4.63926 2.81311C4.61265 2.9257 4.61563 3.04611 4.64553 3.15707C4.69402 3.33665 4.7911 3.46353 4.90565 3.57243C4.94336 3.60839 4.98076 3.64393 5.01764 3.67999C5.0802 3.59791 5.13054 3.51366 5.15592 3.43322C5.16085 3.41771 5.16527 3.4024 5.16958 3.38709C5.17051 3.3837 5.17143 3.38031 5.17236 3.37682C5.17636 3.36182 5.18017 3.34682 5.18366 3.33203C5.18407 3.33018 5.18448 3.32843 5.18489 3.32668C5.18797 3.31312 5.19075 3.29966 5.19332 3.28631C5.19393 3.28333 5.19445 3.28035 5.19506 3.27747C5.19773 3.26309 5.2001 3.24891 5.20215 3.23484C5.20256 3.23227 5.20287 3.2297 5.20318 3.22713C5.20493 3.2145 5.20647 3.20196 5.2077 3.18963C5.2079 3.18748 5.20821 3.18522 5.20842 3.18306C5.20965 3.1695 5.21068 3.15614 5.2113 3.14299C5.2114 3.14012 5.2115 3.13734 5.2116 3.13457C5.21212 3.12214 5.21242 3.10991 5.21232 3.09789C5.21232 3.09697 5.21232 3.09594 5.21232 3.09491C5.21222 3.08227 5.21171 3.06995 5.21099 3.05782C5.21078 3.05505 5.21068 3.05228 5.21047 3.0496C5.20965 3.03758 5.20852 3.02587 5.20698 3.01447C5.20688 3.01375 5.20677 3.01303 5.20667 3.01221C5.20523 3.00142 5.20338 2.99105 5.20133 2.98077C5.20082 2.97841 5.2004 2.97594 5.19989 2.97358C5.19763 2.9631 5.19517 2.95293 5.19229 2.94307C5.19178 2.94142 5.19126 2.93988 5.19085 2.93834C5.18818 2.92961 5.1853 2.92129 5.18212 2.91317C5.1814 2.91132 5.18078 2.90947 5.18006 2.90773C5.17647 2.89889 5.17246 2.89036 5.16825 2.88225C5.16732 2.8805 5.1664 2.87886 5.16547 2.87721C5.16147 2.86992 5.15736 2.86304 5.15284 2.85646C5.15212 2.85543 5.1515 2.8543 5.15078 2.85328C5.14575 2.84608 5.1403 2.83951 5.13476 2.83324C5.13342 2.8318 5.13219 2.83047 5.13085 2.82903C5.1251 2.82297 5.11904 2.81711 5.11267 2.81198C5.07969 2.78537 5.0386 2.77098 4.98928 2.77181C4.98928 2.77181 5.01805 2.64945 5.19064 2.68006C5.36324 2.71068 5.41214 2.93618 5.41214 2.93618C5.41214 2.93618 5.39201 2.1371 6.03051 2.05306C6.03051 2.05306 5.8234 2.16392 5.75723 2.47367C5.69107 2.78331 5.81189 2.99741 5.90682 3.13128C6.00175 3.26504 6.14845 3.5939 6.11106 3.83852C6.11106 3.83852 6.20599 3.58239 6.38146 3.57849C6.38146 3.57849 6.20311 3.68174 6.22037 4.0067C6.23763 4.33165 6.37858 4.29343 6.4879 4.58787C6.59721 4.88232 6.6346 5.17665 6.60008 5.31432C6.60008 5.31432 6.68063 5.20347 6.67775 4.99317C6.67755 4.99348 6.7545 5.23758 6.71166 5.52442ZM6.83001 4.32723C6.85374 4.47343 6.88179 4.73725 6.68546 4.82612C6.68546 4.82612 6.73292 4.75729 6.71566 4.5852C6.6984 4.41312 6.70919 4.2096 6.87316 4.13501C6.87316 4.13501 6.80627 4.18094 6.83001 4.32723Z" fill="#EC8900" />
                                                            </svg>t</p>
                                                            <p className='m-0 super'>SuperH<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                <path d="M9.59031 3.23052C9.35648 2.68407 9.0307 2.20727 8.61236 1.80023C8.19381 1.39319 7.69452 1.07491 7.11416 0.844886C6.5337 0.615065 5.90053 0.5 5.21477 0.5C4.52109 0.5 3.88619 0.615065 3.30963 0.844886C2.73287 1.07491 2.23717 1.39319 1.82283 1.80023C1.40809 2.20727 1.08406 2.68407 0.850433 3.23052C0.616811 3.77718 0.5 4.36689 0.5 5.00005C0.5 5.63321 0.616708 6.22302 0.850433 6.76948C1.08406 7.31614 1.40809 7.79273 1.82283 8.19977C2.23717 8.60681 2.73287 8.9254 3.30963 9.15522C3.88619 9.38504 4.52109 9.5 5.21477 9.5C5.90064 9.5 6.5337 9.38504 7.11416 9.15522C7.69452 8.9254 8.19381 8.60681 8.61236 8.19977C9.0307 7.79273 9.35648 7.31614 9.59031 6.76948C9.82383 6.22313 9.94074 5.63321 9.94074 5.00005C9.94074 4.36679 9.82383 3.77718 9.59031 3.23052ZM6.82311 2.77879C6.91372 2.65839 6.97629 2.6326 6.97629 2.6326C6.97629 2.6326 6.88999 2.69568 6.91588 2.81609C6.94177 2.93649 6.98276 3.16878 6.79074 3.20032C6.79074 3.20032 6.81879 3.18028 6.78643 3.10858C6.75407 3.03687 6.73249 2.8993 6.82311 2.77879ZM4.88797 2.10495C4.88797 2.10495 4.77146 2.2197 4.8103 2.36877C4.84913 2.51784 4.96132 2.73575 4.73695 2.88492C4.73695 2.88492 4.82324 2.77591 4.75852 2.60959C4.6938 2.44336 4.68516 2.20244 4.88797 2.10495ZM4.30545 2.74725C4.30545 2.74725 4.19326 2.89632 4.2623 3.0569C4.33134 3.21748 4.39175 3.38956 4.24504 3.54438C4.24504 3.54438 4.29251 3.4698 4.20189 3.3609C4.11138 3.25199 4.07686 2.98242 4.30545 2.74725ZM3.29155 4.82324C3.26134 4.88632 3.29155 4.77732 3.22682 4.71999C3.13857 4.64181 2.94204 4.4275 3.18368 4.15227C3.18368 4.15227 3.10169 4.28419 3.18368 4.37018C3.26566 4.45627 3.38278 4.63287 3.29155 4.82324ZM7.21166 5.52442L7.21155 5.52472C7.21052 5.5314 7.2095 5.53818 7.20826 5.54496C7.20806 5.54609 7.20785 5.54723 7.20775 5.54836C7.20662 5.55473 7.20549 5.56109 7.20426 5.56757C7.20395 5.56911 7.20364 5.57065 7.20333 5.57219C7.2021 5.57835 7.20087 5.58452 7.19953 5.59068C7.19912 5.59243 7.19881 5.59428 7.1984 5.59602C7.19707 5.60209 7.19573 5.60815 7.19429 5.61421C7.19388 5.61606 7.19337 5.61801 7.19296 5.61986C7.19152 5.62592 7.18998 5.63198 7.18833 5.63804C7.18782 5.63989 7.18741 5.64164 7.1869 5.64349C7.18525 5.64965 7.18351 5.65582 7.18176 5.66208C7.18135 5.66352 7.18083 5.66506 7.18042 5.6666C7.17847 5.67318 7.17652 5.67975 7.17446 5.68623L7.17436 5.68643C7.16748 5.70811 7.15967 5.72979 7.15104 5.75146C7.15032 5.75331 7.1496 5.75516 7.14888 5.75701C7.14683 5.76215 7.14457 5.76739 7.14231 5.77252C7.14108 5.7755 7.13974 5.77848 7.1384 5.78146C7.13635 5.78619 7.13409 5.79102 7.13193 5.79574C7.13039 5.79913 7.12885 5.80252 7.12721 5.80591C7.12505 5.81043 7.12279 5.81496 7.12053 5.81948C7.11878 5.82307 7.11693 5.82667 7.11508 5.83026C7.11282 5.83458 7.11056 5.83889 7.1083 5.84321C7.10625 5.84701 7.10429 5.85071 7.10214 5.85451C7.09977 5.85872 7.09741 5.86293 7.09505 5.86704C7.09279 5.87095 7.09053 5.87475 7.08827 5.87865C7.0858 5.88276 7.08344 5.88677 7.08087 5.89088C7.07841 5.89478 7.07594 5.89879 7.07347 5.90269C7.07091 5.9066 7.06844 5.9106 7.06587 5.91451C7.0632 5.91862 7.06032 5.92273 7.05755 5.92673C7.05498 5.93043 7.05252 5.93413 7.04984 5.93793C7.04676 5.94235 7.04348 5.94666 7.04029 5.95108C7.03783 5.95447 7.03536 5.95786 7.03279 5.96115C7.02868 5.96659 7.02426 5.97214 7.01995 5.97759C7.0182 5.97974 7.01656 5.982 7.01481 5.98416C7.00875 5.99166 7.00238 5.99916 6.99601 6.00656C6.99375 6.00913 6.99139 6.0118 6.98903 6.01437C6.98471 6.0193 6.98029 6.02423 6.97577 6.02906C6.973 6.03204 6.97012 6.03502 6.96725 6.038C6.96303 6.04241 6.95882 6.04683 6.95451 6.05115C6.95142 6.05423 6.94824 6.05731 6.94516 6.06039C6.94084 6.0646 6.93653 6.06882 6.93211 6.07293C6.92882 6.07601 6.92543 6.07909 6.92204 6.08217C6.91917 6.08484 6.91629 6.08751 6.91341 6.09008C6.90221 6.14361 6.88619 6.19426 6.86338 6.23843C6.84499 6.27408 6.82239 6.30675 6.79773 6.33716C6.80431 6.3349 6.81088 6.33295 6.81715 6.33151C6.86399 6.32052 6.93776 6.35494 6.95451 6.41894C6.83019 6.37497 6.73044 6.50935 6.66592 6.63664C6.59667 6.77338 6.55199 6.928 6.44956 7.03074C6.3684 7.1121 6.21142 7.18422 6.08556 7.22213C6.08433 7.22244 6.0832 7.22285 6.08197 7.22316C6.07591 7.22501 6.06995 7.22676 6.06399 7.2284C6.0608 7.22922 6.05782 7.23004 6.05474 7.23087C6.04776 7.23272 6.04098 7.23446 6.0343 7.23611C6.02916 7.23734 6.02413 7.23847 6.01919 7.2396C6.01642 7.24021 6.01375 7.24083 6.01108 7.24134C6.00358 7.24289 5.99629 7.24432 5.9894 7.24545C5.80776 7.27566 5.66876 7.29323 5.52894 7.30586C5.42939 7.32662 5.321 7.3374 5.20737 7.33751H5.20727C5.17152 7.33751 5.13587 7.33638 5.10063 7.33422C5.08635 7.33494 5.07217 7.33566 5.05789 7.33617C5.0506 7.33648 5.0433 7.33648 5.03601 7.33668C5.02327 7.33699 5.01053 7.3374 4.99779 7.33761C4.98885 7.33771 4.97992 7.33771 4.97098 7.33771C4.95988 7.33771 4.94879 7.33781 4.93759 7.33771C4.92783 7.33761 4.91807 7.3373 4.90821 7.3371C4.89783 7.33689 4.88756 7.33658 4.87718 7.33627C4.8668 7.33586 4.85643 7.33535 4.84605 7.33483C4.83619 7.33432 4.82643 7.33381 4.81657 7.33319C4.80578 7.33247 4.79499 7.33165 4.7842 7.33073C4.77475 7.33001 4.7653 7.32918 4.75575 7.32826C4.74465 7.32723 4.73345 7.326 4.72225 7.32477C4.71311 7.32374 4.70397 7.32261 4.69482 7.32148C4.68332 7.32004 4.67181 7.3185 4.6602 7.31675C4.65136 7.31552 4.64243 7.31408 4.63359 7.31264C4.62178 7.31079 4.60996 7.30874 4.59805 7.30668C4.58942 7.30514 4.58079 7.3035 4.57216 7.30175C4.55993 7.29939 4.5477 7.29693 4.53548 7.29436C4.52726 7.29261 4.51894 7.29066 4.51072 7.28871C4.49808 7.28573 4.48545 7.28285 4.47271 7.27956C4.4649 7.27761 4.45709 7.27545 4.44939 7.2733C4.43613 7.2697 4.42288 7.26621 4.40963 7.2623C4.40264 7.26025 4.39576 7.25799 4.38877 7.25583C4.37459 7.25152 4.36042 7.2472 4.34614 7.24237C4.34141 7.24083 4.33668 7.23898 4.33196 7.23734C4.27792 7.21884 4.22347 7.19727 4.1684 7.17231C4.16501 7.17076 4.16162 7.16943 4.15823 7.16778C4.13378 7.15648 4.10912 7.14467 4.08447 7.13203C3.9392 7.05765 3.8003 6.93375 3.69849 6.76886C3.66931 6.74143 3.64404 6.71061 3.62369 6.67568C3.61321 6.6576 3.60315 6.63993 3.59329 6.62246C3.59061 6.61763 3.58784 6.61291 3.58517 6.60808C3.57705 6.59359 3.56925 6.57942 3.56164 6.56544C3.56 6.56236 3.55825 6.55918 3.55661 6.5562C3.54787 6.54007 3.53955 6.52435 3.53144 6.50884C3.52897 6.50411 3.52651 6.49938 3.52414 6.49466C3.51808 6.48295 3.51233 6.47144 3.50657 6.46014C3.50431 6.45562 3.50195 6.45099 3.49979 6.44647C3.49281 6.43219 3.48603 6.41822 3.47956 6.40446C3.47729 6.39973 3.47524 6.39511 3.47308 6.39038C3.46856 6.38062 3.46415 6.37086 3.45993 6.36131C3.45757 6.35607 3.45521 6.35072 3.45295 6.34548C3.4474 6.33285 3.44206 6.32032 3.43702 6.30799C3.43517 6.30336 3.43343 6.29884 3.43158 6.29422C3.42819 6.28569 3.4248 6.27716 3.42161 6.26884C3.41946 6.26319 3.4174 6.25765 3.41534 6.2521C3.41226 6.24388 3.40939 6.23566 3.40661 6.22754C3.40404 6.22015 3.40158 6.21285 3.39911 6.20556C3.39655 6.19765 3.39398 6.18984 3.39161 6.18213C3.38987 6.17648 3.38822 6.17073 3.38648 6.16518C3.38453 6.15861 3.38278 6.15214 3.38093 6.14566C3.30203 5.8581 3.36799 5.65797 3.46846 5.31073C3.61948 4.78883 3.68852 4.46192 3.51592 4.33576C3.51592 4.33576 3.75325 4.33576 3.79208 4.6225C3.79208 4.6225 3.87406 4.45041 3.75324 4.23251C3.63243 4.01461 3.71872 3.75078 3.80502 3.61311C3.89132 3.47545 4.04235 3.42192 4.04235 3.42192C4.04235 3.42192 3.91002 3.49075 3.93879 3.64373C3.96046 3.7591 4.08365 3.78746 4.19224 3.83379C4.19255 3.83389 4.19275 3.834 4.19306 3.8342C4.20148 3.8378 4.2098 3.8415 4.21802 3.8454C4.21833 3.8455 4.21864 3.84571 4.21895 3.84581C4.22727 3.84971 4.23539 3.85382 4.2433 3.85814C4.24361 3.85824 4.24381 3.85845 4.24402 3.85855C4.25203 3.86297 4.25973 3.86749 4.26723 3.87232C4.26744 3.87242 4.26754 3.87252 4.26775 3.87262C4.27535 3.87756 4.28265 3.8828 4.28963 3.88834C4.4047 3.98009 4.44497 4.11775 4.41045 4.23241C4.41045 4.23241 4.62332 4.14066 4.60606 3.94187C4.5888 3.74307 4.4536 3.76598 4.49387 3.51366C4.53414 3.26134 4.64633 3.23453 4.64633 3.23453C4.64633 3.23453 4.51894 3.38946 4.60894 3.53493C4.62558 3.50729 4.66369 3.46754 4.70458 3.45531C4.74917 3.44185 4.81883 3.43394 4.86218 3.45541C4.88108 3.46476 4.90101 3.47822 4.92023 3.49497C4.87307 3.32833 4.88417 3.13755 4.93605 2.97296C4.98474 2.81804 5.10782 2.62993 5.23645 2.59161C5.18344 2.64092 5.15857 2.7342 5.13926 2.81311C5.11265 2.9257 5.11563 3.04611 5.14553 3.15707C5.19402 3.33665 5.2911 3.46353 5.40565 3.57243C5.44336 3.60839 5.48076 3.64393 5.51764 3.67999C5.5802 3.59791 5.63054 3.51366 5.65592 3.43322C5.66085 3.41771 5.66527 3.4024 5.66958 3.38709C5.67051 3.3837 5.67143 3.38031 5.67236 3.37682C5.67636 3.36182 5.68017 3.34682 5.68366 3.33203C5.68407 3.33018 5.68448 3.32843 5.68489 3.32668C5.68797 3.31312 5.69075 3.29966 5.69332 3.28631C5.69393 3.28333 5.69445 3.28035 5.69506 3.27747C5.69773 3.26309 5.7001 3.24891 5.70215 3.23484C5.70256 3.23227 5.70287 3.2297 5.70318 3.22713C5.70493 3.2145 5.70647 3.20196 5.7077 3.18963C5.7079 3.18748 5.70821 3.18522 5.70842 3.18306C5.70965 3.1695 5.71068 3.15614 5.7113 3.14299C5.7114 3.14012 5.7115 3.13734 5.7116 3.13457C5.71212 3.12214 5.71242 3.10991 5.71232 3.09789C5.71232 3.09697 5.71232 3.09594 5.71232 3.09491C5.71222 3.08227 5.71171 3.06995 5.71099 3.05782C5.71078 3.05505 5.71068 3.05228 5.71047 3.0496C5.70965 3.03758 5.70852 3.02587 5.70698 3.01447C5.70688 3.01375 5.70677 3.01303 5.70667 3.01221C5.70523 3.00142 5.70338 2.99105 5.70133 2.98077C5.70082 2.97841 5.7004 2.97594 5.69989 2.97358C5.69763 2.9631 5.69517 2.95293 5.69229 2.94307C5.69178 2.94142 5.69126 2.93988 5.69085 2.93834C5.68818 2.92961 5.6853 2.92129 5.68212 2.91317C5.6814 2.91132 5.68078 2.90947 5.68006 2.90773C5.67647 2.89889 5.67246 2.89036 5.66825 2.88225C5.66732 2.8805 5.6664 2.87886 5.66547 2.87721C5.66147 2.86992 5.65736 2.86304 5.65284 2.85646C5.65212 2.85543 5.6515 2.8543 5.65078 2.85328C5.64575 2.84608 5.6403 2.83951 5.63476 2.83324C5.63342 2.8318 5.63219 2.83047 5.63085 2.82903C5.6251 2.82297 5.61904 2.81711 5.61267 2.81198C5.57969 2.78537 5.5386 2.77098 5.48928 2.77181C5.48928 2.77181 5.51805 2.64945 5.69064 2.68006C5.86324 2.71068 5.91214 2.93618 5.91214 2.93618C5.91214 2.93618 5.89201 2.1371 6.53051 2.05306C6.53051 2.05306 6.3234 2.16392 6.25723 2.47367C6.19107 2.78331 6.31189 2.99741 6.40682 3.13128C6.50175 3.26504 6.64845 3.5939 6.61106 3.83852C6.61106 3.83852 6.70599 3.58239 6.88146 3.57849C6.88146 3.57849 6.70311 3.68174 6.72037 4.0067C6.73763 4.33165 6.87858 4.29343 6.9879 4.58787C7.09721 4.88232 7.1346 5.17665 7.10008 5.31432C7.10008 5.31432 7.18063 5.20347 7.17775 4.99317C7.17755 4.99348 7.2545 5.23758 7.21166 5.52442ZM7.33001 4.32723C7.35374 4.47343 7.38179 4.73725 7.18546 4.82612C7.18546 4.82612 7.23292 4.75729 7.21566 4.5852C7.1984 4.41312 7.20919 4.2096 7.37316 4.13501C7.37316 4.13501 7.30627 4.18094 7.33001 4.32723Z" fill="#E3460A" />
                                                            </svg>t</p>
                                                            <p className='m-0 refresh'>Refresh</p>
                                                        </div>
                                                    </th>
                                                    {status === "active" || status === "inactive" ? <th>Upgrades</th> : ""}
                                                    <th className='d-sm-flex d-none'>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    // Show loading skeleton
                                                    [...Array(5)].map((_, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="placeholder rounded me-2" style={{ width: "60px", height: "60px" }}></span>
                                                                    <div>
                                                                        <p className="placeholder-glow m-0">
                                                                            <span className="placeholder col-6"></span>
                                                                        </p>
                                                                        <p className="placeholder-glow m-0">
                                                                            <span className="placeholder col-8"></span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className="placeholder col-6"></span></td>
                                                            <td><span className="placeholder col-3"></span></td>
                                                            <td><span className="placeholder col-3"></span></td>
                                                            <td><span className="placeholder col-4"></span></td>
                                                            <td><span className="placeholder col-6"></span></td>
                                                            <td><span className="placeholder col-8"></span></td>
                                                            <td><span className="placeholder col-2"></span></td>
                                                        </tr>
                                                    ))
                                                ) : listData?.length ? (
                                                    listData.map((item) => {
                                                        let totalHotTime = item?.quota_listings?.filter((item => item?.offer?.label === "Hot Listing"))
                                                        let totalSuperHotTime = item?.quota_listings?.filter((item => item?.offer?.label === "Super Hot Listing"))
                                                        return (
                                                            <tr key={item?.id}>
                                                                <td className="d-sm-none">
                                                                    <div className='action_buttons d-flex align-items-center'>
                                                                        {/* {status !== "deleted" && status !== "sold" && status !== "pending" && (
                                                                            <CustomTooltip title="Edit" placement="top" padding="4px 8px">
                                                                                <button onClick={async () => {
                                                                                    storeData(item)
                                                                                    const locationResult = await getLOcation({ city_code: item?.city_code });
                                                                                    setLocationList(locationResult?.data);
                                                                                    handleOpen()
                                                                                }}>
                                                                                    <MdModeEditOutline className='icon' />
                                                                                </button>
                                                                            </CustomTooltip>
                                                                        )} */}
                                                                        {/* <CustomTooltip title="View" placement="top" padding="4px 8px">
                                                                            <button onClick={() => handleOpenPropertyView(item)}>
                                                                                <TiEye className='icon' />
                                                                            </button>
                                                                        </CustomTooltip> */}
                                                                        {status !== "deleted" && status !== "sold" && status !== "inactive" && status !== "pending" && (
                                                                            <CustomTooltip title="More" placement="top" padding="4px 8px">
                                                                                <button onClick={() => handleToggle(item?.id)}>
                                                                                    <BsThreeDotsVertical className='icon' />
                                                                                </button>
                                                                            </CustomTooltip>
                                                                        )}
                                                                        {openDropdown === item?.id &&
                                                                            <div
                                                                                className='dropdown_menu' style={{ left: '0', right: '0' }}>
                                                                                <ul className='w-100 mb-0'>
                                                                                    {status !== "deleted" && status !== "sold" && status !== "pending" && (
                                                                                        <li onClick={async () => {
                                                                                            storeData(item)
                                                                                            const locationResult = await getLOcation({ city_code: item?.city_code });
                                                                                            setLocationList(locationResult?.data);
                                                                                            handleOpen()
                                                                                        }}>
                                                                                            Edit
                                                                                        </li>
                                                                                    )}
                                                                                    <Link to={`/property-detail/${item?.slug}`} style={{textDecoration:'none'}}>
                                                                                    <li >
                                                                                        View
                                                                                    </li>
                                                                                    </Link>
                                                                                    
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: status === "downgraded" ? "active" : "downgraded"
                                                                                    })}>{status === "downgraded" ? "Upgraded" : "Downgraded"}</li>
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: "sold"
                                                                                    })}>Mark as sold</li>
                                                                                    {status === "rejected" || status === "inactive" ?
                                                                                        <li onClick={() => {
                                                                                            setOpenQuota(true)
                                                                                            setProperty(item)
                                                                                        }}>Re-Post</li>
                                                                                        : ""}
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: "deleted"
                                                                                    })}>Delete Property</li>
                                                                                </ul>
                                                                            </div>}
                                                                    </div>
                                                                </td>
                                                                <td style={{ maxWidth: "200px" }}>
                                                                    <Link to={window?.innerWidth >= 576 && `/property-detail/${item?.slug}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                                                        <div className='d-flex align-items-center property'>
                                                                            <Image
                                                                                style={{ borderRadius: "8px" }}
                                                                                src={item?.images?.length ? item?.images[0]?.url : img}
                                                                                alt='...'
                                                                            />
                                                                            <div>
                                                                                <h6 className='m-0'>PP0{item?.id}</h6>
                                                                                <p className='m-0'>
                                                                                    {item?.title?.split(" ").length > 6
                                                                                        ? item?.title?.split(" ").slice(0, 6).join(" ") + "..."
                                                                                        : item?.title}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                                <td><p className='m-0'>PKR {formatPriceWithCommas(item?.price)}</p></td>
                                                                <td><p className='m-0'>{item?.total_clicks}</p></td>
                                                                <td><p className='m-0'>{item?.total_leads}</p></td>
                                                                <td><p className='m-0'>{formatDate(item?.created_at)}</p></td>
                                                                <td>
                                                                    <div className='qouta_value'>
                                                                        <p className='m-0 hot'>{totalHotTime?.length > 0 ? totalHotTime?.length : "-"}</p>
                                                                        <p className='m-0 super'>{totalSuperHotTime?.length ? totalSuperHotTime?.length : "-"}</p>
                                                                        <p className='m-0 refresh'>{item?.credits ? item?.credits : "-"}</p>
                                                                    </div>
                                                                </td>
                                                                {status === "active" ? <td>
                                                                    <button className='apply_upgrade' onClick={() => {
                                                                        setOpenQuota(true)
                                                                        setProperty(item)
                                                                        let activeOfferdata = item?.quota_listings?.find((offers) => offers?.is_active_offer === true)
                                                                        if (!activeOfferdata) {
                                                                            setActiveOffer("")
                                                                        } else {
                                                                            setActiveOffer(activeOfferdata)
                                                                        }
                                                                    }}>Apply from Quota</button>
                                                                </td> : ""}
                                                                {status === "rejected" || status === "inactive" ? <td>
                                                                    <button className='apply_upgrade d-sm-flex d-none' onClick={() => {
                                                                        setOpenQuota(true)
                                                                        setProperty(item)
                                                                    }}>Re-Post</button>
                                                                </td> : ""}
                                                                <td className="global-web-action-box">
                                                                    <div className='action_buttons d-flex'>
                                                                        {status !== "deleted" && status !== "sold" && status !== "pending" && (
                                                                            <CustomTooltip title="Edit" placement="top" padding="4px 8px">
                                                                                <button onClick={async () => {
                                                                                    storeData(item)
                                                                                    const locationResult = await getLOcation({ city_code: item?.city_code });
                                                                                    setLocationList(locationResult?.data);
                                                                                    handleOpen()
                                                                                }}>
                                                                                    <MdModeEditOutline className='icon' />
                                                                                </button>
                                                                            </CustomTooltip>
                                                                        )}
                                                                        <CustomTooltip title="View" placement="top" padding="4px 8px">
                                                                            <button onClick={() => handleOpenPropertyView(item)}>
                                                                                <TiEye className='icon' />
                                                                            </button>
                                                                        </CustomTooltip>
                                                                        {status !== "deleted" && status !== "sold" && status !== "inactive" && status !== "pending" && (
                                                                            <CustomTooltip title="More" placement="top" padding="4px 8px">
                                                                                <button onClick={() => handleToggle(item?.id)}>
                                                                                    <BsThreeDotsVertical className='icon' />
                                                                                </button>
                                                                            </CustomTooltip>
                                                                        )}
                                                                        {openDropdown === item?.id &&
                                                                            <div
                                                                                className='dropdown_menu'>
                                                                                <ul className='w-100 mb-0'>
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: status === "downgraded" ? "active" : "downgraded"
                                                                                    })}>{status === "downgraded" ? "Upgraded" : "Downgraded"}</li>
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: "sold"
                                                                                    })}>Mark as sold</li>
                                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                                        property_id: item?.id,
                                                                                        status: "deleted"
                                                                                    })}>Delete Property</li>
                                                                                </ul>
                                                                            </div>}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }

                                                    )
                                                ) : (
                                                    <tr>
                                                        <td className="text-center p-5" colSpan={12}>
                                                            <span>Data Not Found!</span>
                                                        </td>
                                                    </tr>
                                                )}


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {paginationData?.total_pages > 1 ? <div className='table-footer d-flex justify-content-center'>
                                    <div className='pagination'>
                                        <Pagination
                                            fetchData={fetchData}
                                            paginationData={paginationData}
                                            setPaginationData={setPaginationData}
                                        />
                                    </div>
                                </div> : ""}
                            </div>
                        </>
                        : <>
                            <div className="no-list-data d-flex align-items-center w-100 h-100" style={{ flexDirection: "column", gap: "13px", paddingTop: '86px' }}>
                                <Image src={noData} alt="" />
                                <Link to="/agent-portal/add-property" style={{ textDecoration: 'none' }}>
                                    <PrimaryButton text={"Add Property"} />
                                </Link>
                            </div>
                        </>
                }

                </>}

            <EditPropertyModal data={propertyData} setList={setList} list={listData} setData={setPropertyData} open1={open} setOpen1={setOpen} />
            <PropertyView data={dataForView} open={openPropertyView} setOpen={setOpenPropertyView} />
            <ApplyQuotaModal
                open={openQuota}
                setOpen={setOpenQuota}
                data={property}
                productData={productData}
                fetchData={fetchData}
                paginationData={paginationData}
                activeOffer={activeOffer}
            />

        </div>
    )
}

export default PropertyListing