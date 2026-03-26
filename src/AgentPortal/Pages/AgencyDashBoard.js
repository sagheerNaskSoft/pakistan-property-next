import React, { useEffect, useState, useRef } from 'react'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts';
import { TiEye } from "react-icons/ti";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAuth } from '../../Context/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import img from '../Asset/user_img.svg'
import PackageInqueryModal from '../Component/Modal/PackageInqueryModal';
import CustomTooltip from '../../Component/Metiral/CustomTooltip';
import PropertyView from '../Component/PropertyView/PropertyView';
import ApplyQuotaModal from '../Component/Modal/ApplyQuota';

import Image from 'next/image';
const settingsPie = {
    margin: { right: 5 },
    width: 164,
    height: 164,
    hideLegend: true,
};
function AgencyDashBoard() {
    const [data, setData] = useState([])
    const [qoutaPercentage, setQoutaPercentage] = useState(0);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const showTrack = total === 0;
    const [activeTab, setActiveTab] = useState("all");
    const [listingData, setlistingData] = useState()
    const [qoutaData, setQuotaData] = useState()
    const [analyticData, setAnalyticData] = useState()
    const [recentListingData, setRecentListingData] = useState([])
    const [planList, setPlanList] = useState([])
    const { loginData, getDashboradListing, getProductList, formatPriceWithCommas, addToCart, getPackagesAgency, getDashboradAnalaytics, recentProperty, getQoutaState, getAgencyStaff, changePropertyStatus } = useAuth()
    const role = loginData?.data?.role
    const [analytics, setAnalytics] = useState();
    const [products, setProducts] = useState([])
    const [productLogs, setproductLogs] = useState([]);
    const [open, setOpen] = useState(false)
    const [planID, setPlanID] = useState()
    const [itemsToShow, setItemsToShow] = useState(3);
    const [agencyStaff, setAgencyStaff] = useState([])
    const [isScrolling, setIsScrolling] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openPropertyView, setOpenPropertyView] = useState(false);
    const [dataForView, setPropertyView] = useState();
    const [openQuota, setOpenQuota] = useState(false);
    const [property, setProperty] = useState({});
    const [activeOffer, setActiveOffer] = useState("");

    // Timeout to remove the scroll class after the user stops scrolling
    let timeout;

    const handleScroll = () => {
        // Show scrollbar when scrolling starts
        setIsScrolling(true);

        // Clear the previous timeout (to avoid flickering when scrolling continuously)
        clearTimeout(timeout);

        // Hide the scrollbar after 200ms of inactivity (scroll stop)
        timeout = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    useEffect(() => {
        // Clean up the timeout if the component unmounts
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    useEffect(() => {
        const fetchAgencyStaff = async () => {
            try {
                let result = await getAgencyStaff()
                if (result?.success) {
                    setAgencyStaff(result?.data?.data)
                }
            }
            catch {

            }
        }
        fetchAgencyStaff()
    }, [])
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) { // lg breakpoint (Bootstrap's default)
                setItemsToShow(3);
            } else {
                setItemsToShow(5);
            }
        };

        handleResize(); // check on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {

        const fetchqouta = async () => {
            try {
                let result = await getQoutaState();

                if (result?.success) {
                    setproductLogs(result?.data?.data?.offer_logs);
                    setQoutaPercentage(result?.data?.data?.accumulative?.accumulative_percentage.toFixed(0));
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        const fetchProduct = async () => {
            try {
                let result = await getProductList();
                if (result?.success) {
                    let product = result?.data?.data?.products;
                    const listingsHeaders = product.filter(
                        (header) => header.type === "listings"
                    );
                    const creditsHeaders = product.filter(
                        (header) => header.type === "credits"
                    );
                    setProducts([...listingsHeaders, ...creditsHeaders])



                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        const fetchPackage = async () => {
            try {
                let result = await getPackagesAgency();
                if (result?.success) {
                    let product = result?.data?.data?.packages;
                    setPlanList(product)




                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
        fetchProduct();
        fetchqouta();
        fetchPackage();
        // eslint-disable-next-line
    }, []);

    // Dropdown toggle function
    const handleToggle = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside
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

    // Fetch recent properties
    const fetchRecentProperty = async () => {
        try {
            const recentListing = await recentProperty();
            if (recentListing.success) {
                setRecentListingData(recentListing?.data?.data?.properties);
            }
        } catch (error) {
            console.error("An error occurred while fetching recent properties:", error);
        }
    };

    // Handle property view modal
    const handleOpenPropertyView = (data) => {
        setPropertyView(data);
        setOpenPropertyView(true);
    };

    // Handle property status change
    const handleChanagePropertyStatus = async (data) => {
        try {
            let result = await changePropertyStatus(data);
            if (result?.success) {
                // Refresh the data after status change
                await fetchRecentProperty();
                setOpenDropdown(null); // Close dropdown after action
            }
        } catch (error) {
            console.error("An error occurred while changing property status:", error);
        }
    };



    useEffect(() => {
        const getData = async () => {
            try {
                const result = await getDashboradListing();
                const quotaResult = await getProductList();
                const analyticResult = await getDashboradAnalaytics();
                const recentListing = await recentProperty()
                if (result.success) {
                    setlistingData(result?.data?.data?.listings);
                }

                if (quotaResult.success) {
                    let product = quotaResult?.data?.data?.products;
                    setQuotaData(product);
                    const listingsHeaders = product.filter(
                        (header) => header.type === "listings"
                    );
                    const creditsHeaders = product.filter(
                        (header) => header.type === "credits"
                    );
                    setProducts([...listingsHeaders, ...creditsHeaders])
                }
                if (analyticResult.success) {
                    setAnalytics(analyticResult?.data?.data?.analytics);
                }
                if (recentListing.success) {
                    setRecentListingData(recentListing?.data?.data?.properties)
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };

        getData();
    }, []);

    // ✅ React to tab change or analytics update
    useEffect(() => {
        if (analytics && analytics[activeTab]) {
            const selectedData = analytics[activeTab];
            setAnalyticData(selectedData);
            setData([
                { label: "WhatsApp", value: selectedData?.whatsapp || 0, color: "#43a047" },
                { label: "Call", value: selectedData?.call || 0, color: "#1e88e5" },
                { label: "Email", value: selectedData?.email || 0, color: "#fdd835" },
            ]);

        } else {
            setAnalyticData({});
            setData([]);
        }
    }, [analytics, activeTab]);
    const cleanProductName = (name) => {
        if (!name || typeof name !== 'string') {
            return '';
        }

        const trimmedName = name.trim();

        // Agar naam exactly "Listing" ya "Credits" hai, to use change na karein.
        if (trimmedName.toLowerCase() === 'listing' || trimmedName.toLowerCase() === 'credits') {
            return trimmedName;
        }

        // Regular Expression ka use karke "Listing" ya "Credits" ko case-insensitive tareeke se hatayein.
        // \s* ka matlab hai ki shabd ke aage ya peeche ki extra spaces bhi hat jayengi.
        let cleanedName = trimmedName.replace(/\s*(Listing|Credits)\s*/gi, ' ');

        // Multiple spaces ko single space se replace karein aur shuru/aakhir ki space hatayein.
        return cleanedName.replace(/\s+/g, ' ').trim();
    };

    const settings = {
        width: 100,
        height: 100,
        value: qoutaPercentage || 0,
    };
    const navigate = useNavigate()

    return (
        <div className='dashboard-main portal-page-container'>
            <h4 className='page-main-heading m-0'>
                Dashboard
            </h4>
            <p className='portal-breadCrums' style={{ marginBottom: "12px" }}>Home - <span>Dashboard</span></p>
            <div className={`custom-scroll-bar ${isScrolling ? 'show-scroll' : ''}`}
                onScroll={handleScroll} style={{paddingBottom: window?.innerWidth <= 576 ? '140px !important' : ''}}>
                <div className='dashboard-content agency_dashboard_sectionOne'>
                    <div>
                        <div className='welcome_pakeage'>
                            <div className='welcome-box'>
                                <h3 >Hi, Welcome back <br /> {loginData?.data?.user?.name}!</h3>
                                <p className='mb-0'>You have used {qoutaPercentage}% of the<br /> packages. Please upgrade your quota <br /> & credits for a high reach.</p>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <Link to={`/${role}-portal/products`} style={{ textDecoration: "none" }}><button>Buy Now</button></Link>
                                    <Gauge
                                        {...settings}
                                        cornerRadius="50%"
                                        text={({ value }) => `${Math.round(value)}%`}
                                        sx={{
                                            /* target the value text */
                                            [`& .${gaugeClasses.valueText}`]: {
                                                fontSize: 15,
                                                fill: '#ffffff',   // main text color
                                                fontWeight: 600,
                                            },
                                            /* if the text is wrapped in a <tspan>, style it too */
                                            [`& .${gaugeClasses.valueText} tspan`]: {
                                                fill: '#ffffff',
                                            },
                                            [`& .${gaugeClasses.valueArc}`]: {
                                                fill: '#7BCFA0',
                                            },
                                            [`& .${gaugeClasses.referenceArc}`]: {
                                                fill: '#ffffff',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='listing-boxes qouta_credit'>
                                <h3 className='m-0'>Platinum packages</h3>
                                <p>Platinum package includes multiple things described below</p>
                                <div className='listing-header'>
                                    {products.map((product) => {
                                        const log = productLogs?.find(
                                            (log) => log.offer_slug === product.offer_slug
                                        );
                                        return (
                                            <div className={`card_quota ${product?.offer_slug}`}>
                                                <div className='d-flex justify-content-between w-100 align-items-center'>
                                                    <Image src={product?.image} alt='...' />
                                                    <h5 className='m-0 total'>{log?.total || 0}</h5>
                                                </div>
                                                <div className='w-100'>
                                                    <h5 className='productName'>{cleanProductName(product?.name)}</h5>
                                                    <div className='d-none d-sm-block' style={{ width: '100%', height: '1px', background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.00) -12.06%, #000 50.01%, rgba(255, 255, 255, 0.00) 112.07%)', margin: '8px 0' }}></div>
                                                    <div className='data_qouta d-flex justify-content-between w-100  flex-column'>
                                                        <div className='border_gr d-flex justify-content-between w-100 align-items-center'>
                                                            <h5>Available</h5>
                                                            <h6>{log?.available || 0}</h6>
                                                        </div>
                                                        <div className='d-sm-none seperator'></div>
                                                        <div className='d-flex justify-content-between w-100 align-items-center'>
                                                            <h5>Used</h5>
                                                            <h6>{log?.used || 0}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='welcome_pakeage1' style={{ marginTop: "20px" }}>
                            <div className='listing-boxes'>
                                <h3 className='m-0'>Listings by Type</h3>
                                <p >Indicates the kind of property listed</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M50.625 45H43.9012L37.5 38.5988V24.375L35.625 22.5H30V15H31.875L33.75 13.125V5.625L31.875 3.75H24.375L22.5 5.625V13.125L24.375 15H26.25V22.5H20.625L18.75 24.375V38.5988L12.3488 45H5.625L3.75 46.875V54.375L5.625 56.25H13.125L15 54.375V47.6512L21.4012 41.25H34.8488L41.25 47.6512V54.375L43.125 56.25H50.625L52.5 54.375V46.875L50.625 45ZM26.25 7.5H30V11.25H26.25V7.5ZM22.5 26.25H33.75V37.5H22.5V26.25ZM11.25 52.5H7.5V48.75H11.25V52.5ZM48.75 52.5H45V48.75H48.75V52.5Z" fill="#447158" />
                                </svg>
                                <div className='row mx-0' style={{ marginTop: "18px" }}>
                                    <div className='col-6 p-0 d-flex flex-column '>
                                        <span className='type-text'><div />For Rent</span>
                                        <span className='type-text'><div />For Sale</span>
                                        <span className='type-text'><div />For Lease</span>
                                    </div>
                                    <div className='col-6 p-0 d-flex flex-column '>
                                        <span className='value-text'>{listingData?.rent ? listingData?.rent : "00"}</span>
                                        <span className='value-text'>{listingData?.sale ? listingData?.sale : "00"}</span>
                                        <span className='value-text'>{listingData?.lease ? listingData?.lease : "00"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='listing-boxes'>
                                <h3 className='m-0'>Quota & Credits</h3>
                                <p >Manage your purchased packages, available quota, and remaining credits</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="54" viewBox="0 0 60 54" fill="none">
                                    <g clipPath="url(#clip0_294_2677)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M44.1362 26.9039C44.178 30.3157 42.712 33.6027 40.0609 36.0416C37.4097 38.4806 33.7905 39.8717 29.9996 39.9089V43.4099L31.5729 49.8389C44.8779 48.9459 55.1279 38.911 54.9996 26.9039C55.2226 16.0679 46.8049 6.63833 34.9996 4.49988H31.6662L31.5862 13.9844C38.8072 14.799 44.2038 20.3544 44.1362 26.9039Z" fill="#99BBA5" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M29.9999 49.9125C30.5316 49.9125 31.0499 49.869 31.5733 49.839L29.9999 43.41V39.909C22.1404 39.7571 15.857 33.9793 15.857 26.904C15.857 19.8288 22.1404 14.051 29.9999 13.899C30.5286 13.901 31.0567 13.93 31.5816 13.986L31.6666 10.5C31.6666 10.5 32.7633 3.90002 29.9999 3.90002C16.0394 4.04173 4.84814 14.3395 4.99994 26.904C4.84536 39.4703 16.0374 49.7708 29.9999 49.9125Z" fill="#447158" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M26.6585 54V33L38.3335 43.5L26.6585 54Z" fill="#447158" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M33.3516 0V19.5L23.3116 9.759L33.3516 0Z" fill="#99BBA5" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_294_2677">
                                            <rect width="60" height="54" fill="white" transform="matrix(-1 0 0 1 60 0)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div className='row mx-0' style={{ marginTop: "18px" }}>
                                    <div className='col-lg-6 ps-0 d-flex flex-column'>
                                        {
                                            qoutaData?.slice(0, itemsToShow)?.map((item) => (
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <span className='type-text'><div />{item?.name}</span>
                                                    <span className='value-text'>{item?.is_active ? item?.is_active : "00"}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='col-6 pe-0 d-lg-flex flex-column d-none'>
                                        {
                                            qoutaData?.slice(3, 5)?.map((item) => (
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <span className='type-text'><div />{item?.name}</span>
                                                    <span className='value-text'>{item?.is_active ? item?.is_active : "00"}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='agency-members-dashborad mt-xl-0' style={{ marginTop: "20px" }}>
                        <h1>Agency Members</h1>
                        <h5>List of members/ Staff</h5>
                        <div className="agency-dashboard-card custom-scroll-bar">
                            {
                                agencyStaff?.map((item) => (
                                    <CustomTooltip title={item?.email} placement="bottom">
                                        <div className="agency-portal-cards">
                                            <div className='d-flex align-items-center' style={{ maxWidth: "calc(100% - 90px)", gap: "8px" }}>
                                                <div >
                                                    <Image style={{ borderRadius: '4px', border: '1px solid white', overflow: 'hidden' }} src={item?.avatar || img} alt='...' />
                                                </div>
                                                <div style={{ maxWidth: "calc(100% - 40px)" }} >
                                                    <h5>{item?.name}</h5>
                                                    <h5 style={{ width: "100%" }}>{item?.email}</h5>
                                                </div>
                                            </div>
                                            <div style={{ width: "90px" }}>
                                                <h6>Properties</h6>
                                                <h4 className="agency-bold">{item?.properties_count}</h4>
                                            </div>
                                        </div>
                                    </CustomTooltip>
                                ))
                            }
                            {/* <div className="agency-portal-cards">
                            <div>
                                <Image src={img} alt='...' />
                            </div>
                            <div>
                                <h5>Staff-001</h5>
                                <h5>Ahmed Khan</h5>
                            </div>
                        </div>
                        <div>
                            <h6>Properties</h6>
                            <h4 className="agency-bold">100</h4>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className='activity-logs-container pb-3'>
                    <div className='tab-section'>
                        <div className='tabs'>
                            <ul >
                                <li className={`${activeTab === "all" && "active-tab"}`} onClick={() => setActiveTab("all")}>All</li>
                                <li className={`${activeTab === "sell" && "active-tab"}`} onClick={() => setActiveTab("sell")}>Buy</li>
                                <li className={`${activeTab === "rent" && "active-tab"}`} onClick={() => setActiveTab("rent")}>Rent</li>
                                <li className={`${activeTab === "lease" && "active-tab"}`} onClick={() => setActiveTab("lease")}>Lease</li>
                            </ul>
                        </div>
                        <div className='tabs-content'>
                            <div className='activety'>
                                <h3 className='m-0'>Active</h3>
                                <h1 className='m-0'>{analyticData?.active}</h1>
                                <p className='m-0'>Count of properties that are live</p>
                                <Link to={`/${role}-portal/property-listing`} style={{ textDecoration: "none", }}><button style={{ opacity: analyticData?.active == 0 ? 0.5 : 1, cursor: analyticData?.active == 0 ? "not-allowed" : "pointer" }} disabled={analyticData?.active == 0}>See Listings</button></Link>
                            </div>
                            <div className='activety'>
                                <h3 className='m-0'>Active</h3>
                                <p className='m-0'>Total clicks on your listings</p>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Gauge
                                        width={200}
                                        height={158}
                                        value={analyticData?.clicks}
                                        outerRadius={100}     // pixel value
                                        innerRadius={90}      // 100 - 85 = 15px thickness
                                        startAngle={-90}
                                        endAngle={90}
                                        // text={({ value }) => `${Math.round(value)} / 400`} // 👈 custom text
                                        sx={{
                                            [`& .${gaugeClasses.valueText}`]: {
                                                fontSize: 48,
                                                fontWeight: 600,
                                            },

                                            [`& .${gaugeClasses.valueArc}`]: {
                                                fill: '#E2B93B',
                                                width: "20px"
                                            },
                                            [`& .${gaugeClasses.referenceArc}`]: {
                                                fill: '#cccccc',
                                                height: "20px",


                                            },
                                        }}
                                    />

                                </div>
                            </div>
                            <div className='activety'>
                                <h3 className='m-0'>Leads</h3>
                                <p className='m-0'>Potential clients interested in your property</p>
                                <div className='d-sm-flex mt-2 w-100' style={{ gap: "30px 0" }}>
                                    <div className='mt-sm-0 mt-3'>
                                        <PieChart
                                            series={[
                                                ...(showTrack
                                                    ? [
                                                        {
                                                            innerRadius: 70,
                                                            outerRadius: 80,
                                                            data: [
                                                                { label: "Track", value: 1, color: "#e0e0e0" },
                                                            ],
                                                        },
                                                    ]
                                                    : []),

                                                {
                                                    innerRadius: 70,
                                                    outerRadius: 80,
                                                    data: data,
                                                },
                                            ]}
                                            {...settingsPie}
                                        />

                                    </div>
                                    <div className='w-100 ps-sm-3 mt-3'>
                                        {Array.isArray(data) && data.map((item, index) => {
                                            return (
                                                <div className='leads-data py-2'>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div className='leadeType d-flex align-items-center '>
                                                            <div className='color_dot me-1' style={{ background: item?.color }}></div><p className='m-0'>{item?.label}</p>
                                                        </div>
                                                        <div className='leadValue'>
                                                            <p className='m-0'>{item?.value}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="agency-packges-offer mt-sm-4" style={{ overflow: "hidden", marginTop: window?.innerWidth <= 576 ? '20px' : '' }}>
                    <h1>Packages Offered by Pakistan Property</h1>
                    <h5>You can select any package and enquire about it also</h5>
                    <div className="agency-pakges-card w-100" style={{ overflow: 'auto' }}>
                        {planList?.map((item) => {
                            return (
                                <div className="pkg-card">
                                    {/* Badge */}
                                    <div className="pkg-badge" style={{background: item?.name === "Platinum" ? ' linear-gradient(90deg, #E5E4E2 0%, #CDCDCD 25%, #D0CFCC 50%, #CDCDCD 75%, #E5E4E2 100%)' : item?.name === "Gold" ? ' linear-gradient(90deg, #AE8626 0%, #F7EF8A 28.16%, #D1AC49 63.01%, #ECCA68 100%)' : ' linear-gradient(90deg, #734404 0%, #80500B 34.26%, #8D5C11 75%, #9A6817 100%)'}}>
                                        <h5 className="m-0" style={{color: item?.name === "Bronze" ? '#fff' : ''}}>{item?.name}</h5>
                                    </div>

                                    {/* Price */}
                                    <div className="pkg-price">
                                        {(() => {
                                            const price = item?.package_price;
                                            if (price && typeof price === 'object' && price.price !== undefined) {
                                                return formatPriceWithCommas(price.price);
                                            } else if (typeof price === 'number' || typeof price === 'string') {
                                                return formatPriceWithCommas(price);
                                            }
                                            return '';
                                        })()}
                                    </div>

                                    {/* Features */}

                                    <ul className="pkg-list">
                                        {item?.offers?.map((items) => {
                                            const pivotValue = items?.pivot?.value;
                                            const displayValue = typeof pivotValue === 'object' ? '' : (pivotValue || '');
                                            return (
                                                <li key={items?.id || items?.label}>
                                                    <div className="line-main">
                                                        <div className="pagesc-line"></div>
                                                        <span className="label">{items?.label}</span>
                                                    </div>
                                                    <span className="val">{displayValue}</span>
                                                </li>
                                            )
                                        })}


                                    </ul>

                                    <div className="lowe-lineagency"></div>
                                    {/* Actions */}
                                    <div className="pkg-actions">
                                        <button onClick={() => {
                                            setOpen(true)
                                            setPlanID(item)
                                        }} className="btn-btn1">Enquire</button>
                                        <button onClick={() => {
                                            navigate(`/${role}-portal/packages`, { state: { packageId: item?.id } })
                                        }} className="btn-btn2">Purchase Now</button>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
                {
                    recentListingData?.length > 0 && <div className='table-content' style={{marginBottom: "60px"}}>
                        <div className="d-flex justify-content-between align-items-center" style={{ flexWrap: "wrap-reverse", gap: "10px" }}>
                            <h4 className='m-0'>Recent Listings</h4>
                            <div className="info">
                                <div className="tab">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#FEA01F" />
                                    </svg>
                                    <div className="text">
                                        Hot
                                    </div>
                                </div>
                                <div className="tab">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#EF561C" />
                                    </svg>
                                    <div className="text">
                                        SuperHot
                                    </div>
                                </div>
                                <div className="tab">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#A3C5DE" />
                                    </svg>
                                    <div className="text">
                                        Refresh
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="div recent-listing-table" style={{ overflowX: 'auto', overflowY: 'visible' }}>
                            <table className='w-100' style={{ minWidth: '1200px' }}>
                                <thead>
                                    <tr>
                                        <th className='d-sm-none'>Action</th>
                                        <th>Property ID</th>
                                        <th>Price</th>
                                        <th>Clicks</th>
                                        <th>Leads</th>
                                        <th>Status</th>
                                        <th>Quota</th>
                                        <th style={{ width: "350px" }}>Upgrades</th>
                                        <th className='action-head-global'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='mt-5'>
                                    {
                                        recentListingData?.map((data) => (
                                            <tr>
                                                <td className='d-sm-none'>
                                                    <div className='action_buttons'>
                                                        {
                                                            window?.innerWidth > 576 &&
                                                            <CustomTooltip title="View" placement="top" padding="4px 8px">
                                                                <button onClick={() => handleOpenPropertyView(data)}>
                                                                    <TiEye className='icon' />
                                                                </button>
                                                            </CustomTooltip>
                                                        }
                                                        {window?.innerWidth <= 576 ? (

                                                            <button onClick={() => handleToggle(data?.id)}>
                                                                <BsThreeDotsVertical className='icon' />
                                                            </button>
                                                        ) :
                                                            (
                                                                data?.status !== "deleted" && data?.status !== "sold" && data?.status !== "inactive" && data?.status !== "pending" && (
                                                                    <CustomTooltip title="More" placement="top" padding="4px 8px">
                                                                        <button onClick={() => handleToggle(data?.id)}>
                                                                            <BsThreeDotsVertical className='icon' />
                                                                        </button>
                                                                    </CustomTooltip>
                                                                ))
                                                        }
                                                        {openDropdown === data?.id &&
                                                            <div
                                                                className='dropdown_menu' style={{left:'0' , right:'unset'}}>
                                                                <ul className='w-100 mb-0'>
                                                                        <Link to={`/property-detail/${data?.slug}`}>
                                                                    <li>
                                                                            View
                                                                    </li>
                                                                        </Link>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: data?.status === "downgraded" ? "active" : "downgraded"
                                                                    })}>{data?.status === "downgraded" ? "Upgraded" : "Downgraded"}</li>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: "sold"
                                                                    })}>Mark as sold</li>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: "deleted"
                                                                    })}>Delete Property</li>
                                                                </ul>
                                                            </div>}
                                                    </div>
                                                </td>
                                                <td style={{ maxWidth: window?.innerWidth <= 576 ? '260px' : '400px', width: window?.innerWidth <= 576 ? '260px' : '400px' }}>
                                                    <Link to={window?.innerWidth > 576 ? `/property-detail/${data?.slug}` : `#`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                                        <div className='d-flex align-items-center property'>
                                                            <Image src={data?.cover_image} alt='...' />

                                                            <div>
                                                                <h6 className='m-0'>{data?.property_number}</h6>
                                                                <p className="m-0 recent-property-title">
                                                                    {data?.title
                                                                        ?.split(" ")
                                                                        .slice(0, 10)
                                                                        .join(" ") + (data?.title?.split(" ").length > 10 ? "..." : "")}
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td><p className='m-0'>PKR {data?.price}</p></td>
                                                <td><p className='m-0'>{data?.total_clicks}</p></td>
                                                <td><p className='m-0'>{data?.total_leads}</p></td>
                                                <td><p className='m-0' style={{ textTransform: "capitalize" }}>{data?.status}</p></td>
                                                <td><p className='m-0'>{data?.quota}</p></td>
                                                <td>
                                                    {(() => {

                                                        // ✅ Show only ACTIVE Hot Listings
                                                        let totalHotTime = data?.quota_listings?.filter(
                                                            (item) => item?.offer?.label === "Hot Listing" && item?.is_active_offer === true
                                                        ) || [];

                                                        // ✅ Show only ACTIVE Super Hot Listings
                                                        let totalSuperHotTime = data?.quota_listings?.filter(
                                                            (item) => item?.offer?.label === "Super Hot Listing" && item?.is_active_offer === true
                                                        ) || [];

                                                        // ✅ Show only ACTIVE Refresh credits (if it's an array)
                                                        let totalRefresh = data?.credits?.filter?.(
                                                            (item) => item?.is_active_offer === true
                                                        ) || [];

                                                        let hasAnyUpgrade =
                                                            totalHotTime?.length > 0 ||
                                                            totalSuperHotTime?.length > 0 ||
                                                            totalRefresh?.length > 0;

                                                        if (hasAnyUpgrade) {

                                                            let hotCols = totalHotTime.length;
                                                            let superCols = totalSuperHotTime.length;
                                                            let refreshCols = totalRefresh.length;

                                                            return (
                                                                <div
                                                                    className="upgrade_box"
                                                                    style={{
                                                                        gridTemplateColumns: `
                    ${hotCols > 0 ? `repeat(${hotCols}, 1fr)` : ""}
                    ${hotCols > 0 && superCols > 0 ? " 1px" : ""}
                    ${superCols > 0 ? ` repeat(${superCols}, 1fr)` : ""}
                    ${superCols > 0 && refreshCols > 0 ? " 1px" : ""}
                    ${hotCols > 0 && refreshCols > 0 && superCols === 0 ? " 1px" : ""}
                    ${refreshCols > 0 ? ` repeat(${refreshCols}, 1fr)` : ""}
                `,
                                                                    }}
                                                                >
                                                                    {/* HOT LISTING */}
                                                                    {totalHotTime.map((hotListing, i) => {
                                                                        const endDate = hotListing?.ended_at
                                                                            ? new Date(hotListing.ended_at).toLocaleDateString("en-GB")
                                                                            : "No end date";

                                                                        return (
                                                                            <CustomTooltip
                                                                                key={`hot-${i}`}
                                                                                title={`Expires on ${endDate}`}
                                                                                placement="top"
                                                                            >
                                                                                <div className="upgrade hot"></div>
                                                                            </CustomTooltip>
                                                                        );
                                                                    })}

                                                                    {hotCols > 0 && superCols > 0 && (
                                                                        <div className="upgrade-gap"></div>
                                                                    )}

                                                                    {/* SUPER HOT LISTING */}
                                                                    {totalSuperHotTime.map((superListing, i) => {
                                                                        const endDate = superListing?.ended_at
                                                                            ? new Date(superListing.ended_at).toLocaleDateString("en-GB")
                                                                            : "No end date";

                                                                        return (
                                                                            <CustomTooltip
                                                                                key={`super-${i}`}
                                                                                title={`Expires on ${endDate}`}
                                                                                placement="top"
                                                                            >
                                                                                <div className="upgrade super-hot"></div>
                                                                            </CustomTooltip>
                                                                        );
                                                                    })}

                                                                    {superCols > 0 && refreshCols > 0 && (
                                                                        <div className="upgrade-gap"></div>
                                                                    )}

                                                                    {hotCols > 0 && refreshCols > 0 && superCols === 0 && (
                                                                        <div className="upgrade-gap"></div>
                                                                    )}

                                                                    {/* REFRESH BOOST */}
                                                                    {totalRefresh.map((refreshItem, i) => {
                                                                        const refreshDate =
                                                                            data?.refreshed_at?.[i]
                                                                                ? new Date(data.refreshed_at[i]).toLocaleDateString("en-GB")
                                                                                : "No date";

                                                                        return (
                                                                            <CustomTooltip
                                                                                key={`refresh-${i}`}
                                                                                title={`Expires on ${refreshDate}`}
                                                                                placement="top"
                                                                            >
                                                                                <div className="upgrade boost"></div>
                                                                            </CustomTooltip>
                                                                        );
                                                                    })}

                                                                </div>
                                                            );

                                                        } else {
                                                            // NO ACTIVE UPGRADES
                                                            return (
                                                                <button
                                                                    className="apply_upgrade"
                                                                    onClick={() => {
                                                                        setOpenQuota(true);
                                                                        setProperty(data);

                                                                        let activeOfferdata = data?.quota_listings?.find(
                                                                            (offers) => offers?.is_active_offer === true
                                                                        );

                                                                        setActiveOffer(activeOfferdata || "");
                                                                    }}
                                                                >
                                                                    Apply from Quota
                                                                </button>
                                                            );
                                                        }
                                                    })()}

                                                </td>
                                                <td className='action-head-global'>
                                                    <div className='action_buttons'>
                                                        <CustomTooltip title="View" placement="top" padding="4px 8px">
                                                            <button onClick={() => handleOpenPropertyView(data)}>
                                                                <TiEye className='icon' />
                                                            </button>
                                                        </CustomTooltip>
                                                        {data?.status !== "deleted" && data?.status !== "sold" && data?.status !== "inactive" && data?.status !== "pending" && (
                                                            <CustomTooltip title="More" placement="top" padding="4px 8px">
                                                                <button onClick={() => handleToggle(data?.id)}>
                                                                    <BsThreeDotsVertical className='icon' />
                                                                </button>
                                                            </CustomTooltip>
                                                        )}
                                                        {openDropdown === data?.id &&
                                                            <div
                                                                className='dropdown_menu'>
                                                                <ul className='w-100 mb-0'>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: data?.status === "downgraded" ? "active" : "downgraded"
                                                                    })}>{data?.status === "downgraded" ? "Upgraded" : "Downgraded"}</li>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: "sold"
                                                                    })}>Mark as sold</li>
                                                                    <li onClick={() => handleChanagePropertyStatus({
                                                                        property_id: data?.id,
                                                                        status: "deleted"
                                                                    })}>Delete Property</li>
                                                                </ul>
                                                            </div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
            <PackageInqueryModal open={open} setOpen={setOpen} planID={planID} />
            {/* <div className='services-info-section'>
                <div className='service-box'>
                    <p className='m-0'>Get best offer</p>
                    <h4 className='m-0'>Boost your listings with our premium plans</h4>
                    <div className='row m-0'>
                        <div className="col-6">
                            {qoutaData?.map((item, index) => (
                                <>

                                    <div
                                        key={index}
                                        className={`d-flex align-items-center ${index === 2 ? "super-hot" : index == 0 ? "free-listing" : ''
                                            }`}
                                        style={{
                                            marginTop: index === 0 ? "34px" : "",
                                            marginBottom: index === 3 ? "32px" : "",
                                            paddingTop: index === 3 ? "16px" : "",
                                            paddingBottom: index === 2 ? "16px" : "",
                                        }}
                                    >
                                        <Image src={item?.image} alt="..." />
                                        {index === 0 && <Image className="freeTag" src={free} alt="..." />}
                                        <div>
                                            <span>{item?.name}</span>
                                            <h5>Rs, {item?.price}</h5>
                                        </div>
                                    </div>
                                </>
                            ))}
                            <button className='upgrade-btn'>upgrade Plan</button>
                            <button className='detail-btn'>View Details</button>
                        </div>
                        <div className='col-6 d-flex align-items-center justify-content-center'>
                            <Image src={pricing} className='w-100 h-100 mt-5' alt='...' />
                        </div>
                    </div>
                </div>
                <div className='service-photography'>
                    <h4>
                        Premium Photo & Video Service
                    </h4>
                    <p>Make your listings stand out with high-quality photos and video tours.</p>
                    <div style={{ gap: "16px", marginBottom: "12px" }} className='d-flex align-items-center'>
                        <Image src={photo} alt='...' />
                        <div>
                            <h6>Verified <br />Photography</h6>
                            <p className='status'>Recommended</p>
                        </div>
                    </div>
                    <div style={{ gap: "16px" }} className='d-flex align-items-center'>
                        <Image src={video} alt='...' />
                        <div>
                            <h6>Verified <br />Videography</h6>
                            <p className='status'>Recommended</p>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end align-items-center' style={{ gap: "4px", marginTop: "36px" }}>
                        <button className='try_more_btn'>Try Now</button>
                        <button className='learn_more_btn'> Learn More</button>
                    </div>
                </div>
            </div> */}

            {/* Property View Modal */}
            <PropertyView open={openPropertyView} setOpen={setOpenPropertyView} data={dataForView} />

            {/* Apply Quota Modal */}
            <ApplyQuotaModal
                open={openQuota}
                setOpen={setOpenQuota}
                data={property}
                productData={productLogs}
                fetchData={fetchRecentProperty}
                paginationData={{}}
                activeOffer={activeOffer}
            />
        </div>
    )
}

export default AgencyDashBoard