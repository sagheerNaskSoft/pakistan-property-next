import React, { useEffect, useState } from 'react'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts';
import img from '../Asset/property-img.png'
import { TiEye } from "react-icons/ti";
import { BsThreeDotsVertical } from 'react-icons/bs';
import basic from '../Asset/basic.svg'
import hot from '../Asset/hot.svg'
import superHot from '../Asset/superhot.svg'
import free from '../Asset/free.svg'
import boost from '../Asset/boost.svg'
import pricing from '../Asset/pricing.svg'
import photo from '../Asset/photo.png'
import video from '../Asset/video.png'
import { useAuth } from '../../Context/ContextProvider';
import { Link } from 'react-router-dom';
import CustomTooltip from '../../Component/Metiral/CustomTooltip';
import PropertyView from '../Component/PropertyView/PropertyView';
import ApplyQuotaModal from '../Component/Modal/ApplyQuota';


import Image from 'next/image';
const images = [basic, hot, superHot, boost, free];
const settingsPie = {
    margin: { right: 5 },
    width: 164,
    height: 164,
    hideLegend: true,
};
function Dashboard() {
    const [itemsToShow, setItemsToShow] = useState(3);
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
        const handleResize = () => {
            if (window.innerWidth >= 1200) { // lg breakpoint (Bootstrap's default)
                setItemsToShow(3);
            } else {
                setItemsToShow(5);
            }
        };

        handleResize(); // check on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [data, setData] = useState([])
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const showTrack = total === 0;

    const [activeTab, setActiveTab] = useState("all");
    const [listingData, setlistingData] = useState()
    const [qoutaData, setQuotaData] = useState()
    const [analyticData, setAnalyticData] = useState()
    const [recentListingData, setRecentListingData] = useState([])
    const { loginData, getDashboradListing, getProductList, getDashboradAnalaytics, recentProperty, changePropertyStatus, getQoutaState } = useAuth()
    const role = loginData?.data?.role
    const [analytics, setAnalytics] = useState();
    const [qoutaPercentage, setQoutaPercentage] = useState()

    // Dropdown toggle function
    const handleToggle = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
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
            console.error("Error changing property status:", error);
        }
    };

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
                    setQuotaData(quotaResult?.data?.data?.products);
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
    useEffect(() => {

        const fetchqouta = async () => {
            try {
                const result = await getQoutaState();
    
                if (result?.success) {
                    setQoutaPercentage(
                        result?.data?.data?.accumulative?.accumulative_percentage.toFixed(0)
                    );
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        };
    
        fetchqouta();  // 👈 call function here
    
    }, []); // 👈 no dependency — runs once
    
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


    const settings = {
        width: 100,
        height: 100,
        value: qoutaPercentage,
    };




    return (
        <div className='dashboard-main portal-page-container'>
            <h4 className='page-main-heading m-0'>
                Dashboard
            </h4>
            <p className='portal-breadCrums' style={{ marginBottom: "12px" }}>Home - <span>Dashboard</span></p>
            <div className={`custom-scroll-bar ${isScrolling ? 'show-scroll' : ''}`}
                onScroll={handleScroll} >
                <div className='dashboard-content m-0'>
                    <div className='welcome-box'>
                        <h3 >Hi, Welcome back <br /> {loginData?.data?.user?.name}!</h3>
                        <p >You have used {qoutaPercentage}% of the<br /> packages. Please upgrade your quota <br /> & credits for a high reach.</p>
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
                            <div className='col-xl-6 col-12 ps-0 d-flex flex-column'>
                                {
                                    qoutaData?.slice(0, itemsToShow)?.map((item) => (
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <span className='type-text'><div />{item?.name}</span>
                                            <span className='value-text'>{item?.is_active ? item?.is_active : "00"}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='col-6 pe-0 d-xl-flex flex-column  d-none'>
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
                <div className='activity-logs-container new-activity-logs-container pb-3'>
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
                                <Link to={`/${role}-portal/property-listing`} style={{ textDecoration: "none" }}><button
                                    style={{ opacity: analyticData?.active == 0 ? 0.5 : 1, cursor: analyticData?.active == 0 ? "not-allowed" : "pointer" }} disabled={analyticData?.active == 0}>See Listings</button></Link>
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
                                <div className='d-flex mt-sm-2 mt-4 flex-sm-row flex-column' style={{ gap: "20px 0" }}>
                                    <div>
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
                                    <div className='w-sm-75 w-100 ps-sm-3 mt-sm-3 mt-2'>
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
                {
                    recentListingData?.length > 0 ? (
                        <div className='table-content'>
                            <div className="d-flex justify-content-between align-items-center">
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

                            <div className="div" style={{ overflow: "scroll" }}>
                                <table className='w-100' style={{ minWidth: "1200px" }}>
                                    <thead>
                                        <tr>
                                            <th>Property ID</th>
                                            <th>Price</th>
                                            <th>Clicks</th>
                                            <th>Leads</th>
                                            <th>Status</th>
                                            <th>Quota</th>
                                            <th style={{ width: "350px" }}>Upgrades</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='mt-5'>
                                        {
                                            recentListingData?.map((data) => (
                                                <tr>
                                                    <td style={{ maxWidth: "400px", width: "400px" }}>
                                                        <Link to={`/property-detail/${data?.slug}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
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
                                                            let totalHotTime = data?.quota_listings?.filter((item) => item?.offer?.label === "Hot Listing") || [];
                                                            let totalSuperHotTime = data?.quota_listings?.filter((item) => item?.offer?.label === "Super Hot Listing") || [];
                                                            let totalRefresh = data?.credits || 0;
                                                            let hasAnyUpgrade = totalHotTime?.length > 0 || totalSuperHotTime?.length > 0 || totalRefresh > 0;

                                                            if (hasAnyUpgrade) {
                                                                let total = totalHotTime.length + totalSuperHotTime.length + totalRefresh;
                                                                let hotCols = totalHotTime.length;
                                                                let superCols = totalSuperHotTime.length;
                                                                let refreshCols = totalRefresh;
                                                                let totalCols = hotCols + superCols + refreshCols;

                                                                return (
                                                                    <div className='upgrade_box' style={{
                                                                        gridTemplateColumns: `${hotCols > 0 ? `repeat(${hotCols}, 1fr)` : ''}${hotCols > 0 && superCols > 0 ? ' 1px' : ''}${superCols > 0 ? ` repeat(${superCols}, 1fr)` : ''}${superCols > 0 && refreshCols > 0 ? ' 1px' : ''}${hotCols > 0 && refreshCols > 0 && superCols === 0 ? ' 1px' : ''}${refreshCols > 0 ? ` repeat(${refreshCols}, 1fr)` : ''}`
                                                                    }}>
                                                                        {Array.from({ length: hotCols }, (_, i) => {
                                                                            const hotListing = totalHotTime[i];
                                                                            const endDate = hotListing?.ended_at ? new Date(hotListing.ended_at).toLocaleDateString('en-GB') : 'No end date';
                                                                            return (
                                                                                <CustomTooltip title={`Expires on ${endDate}`} placement="top" padding="4px 8px">
                                                                                    <div key={`hot-${i}`} className='upgrade hot'></div>
                                                                                </CustomTooltip>
                                                                            );
                                                                        })}
                                                                        {hotCols > 0 && superCols > 0 && <div key="gap-hot-super" className='upgrade-gap'></div>}
                                                                        {Array.from({ length: superCols }, (_, i) => {
                                                                            const superListing = totalSuperHotTime[i];
                                                                            const endDate = superListing?.ended_at ? new Date(superListing.ended_at).toLocaleDateString('en-GB') : 'No end date';
                                                                            return (
                                                                                <CustomTooltip title={`Expires on ${endDate}`} placement="top" padding="4px 8px">
                                                                                    <div key={`super-${i}`} className='upgrade super-hot'></div>
                                                                                </CustomTooltip>
                                                                            );
                                                                        })}
                                                                        {superCols > 0 && refreshCols > 0 && <div key="gap-super-refresh" className='upgrade-gap'></div>}
                                                                        {hotCols > 0 && refreshCols > 0 && superCols === 0 && <div key="gap-hot-refresh" className='upgrade-gap'></div>}
                                                                        {Array.from({ length: refreshCols }, (_, i) => {
                                                                            const refreshDate = data?.refreshed_at && data.refreshed_at[i] ? new Date(data.refreshed_at[i]).toLocaleDateString('en-GB') : 'No date';
                                                                            return (
                                                                                <CustomTooltip title={`Expires on ${refreshDate}`} placement="top" padding="4px 8px">
                                                                                    <div key={`refresh-${i}`} className='upgrade boost'></div>
                                                                                </CustomTooltip>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <button className='apply_upgrade' onClick={() => {
                                                                        setOpenQuota(true);
                                                                        setProperty(data);
                                                                        let activeOfferdata = data?.quota_listings?.find((offers) => offers?.is_active_offer === true);
                                                                        if (!activeOfferdata) {
                                                                            setActiveOffer("");
                                                                        } else {
                                                                            setActiveOffer(activeOfferdata);
                                                                        }
                                                                    }}>
                                                                        Apply from Quota
                                                                    </button>
                                                                );
                                                            }
                                                        })()}
                                                    </td>
                                                    <td>
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
                    ) : ''
                }
                <div className='services-info-section'>
                    <div className='service-box'>
                        <p className='m-0'>Get best offer</p>
                        <h4 className='m-0'>Boost your listings with our premium plans</h4>
                        <div className='row m-0 flex-md-row flex-column' style={{ gap: "20px 0" }}>
                            <div className="col-md-6 col-12">
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
                                            {/* Image block */}
                                            <Image src={item?.image} alt="..." />
                                            {/* Text block */}
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
                            <div className='col-md-6 col-12 d-flex align-items-center justify-content-center'>
                                <Image src={pricing} className='person w-100 h-100 mt-md-5' alt='...' />
                            </div>
                        </div>
                    </div>
                    <div className='service-photography d-flex flex-column justify-content-between'>
                        <div>
                            <h4>
                                Premium Photo & Video Service
                            </h4>
                            <p>Make your listings stand out with high-quality photos and video tours.</p>
                            <div className="d-xl-inline d-flex flex-md-row flex-column" style={{ gap: "0 50px" }}>
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
                            </div>
                        </div>
                        <div className='d-flex justify-content-end align-items-end' style={{ gap: "4px", marginTop: "36px" }}>
                            <button className='try_more_btn'>Try Now</button>
                            <button className='learn_more_btn'> Learn More</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PropertyView
                open={openPropertyView}
                setOpen={setOpenPropertyView}
                data={dataForView}
            />
            <ApplyQuotaModal
                open={openQuota}
                setOpen={setOpenQuota}
                property={property}
                activeOffer={activeOffer}
            />
        </div>
    )
}

export default Dashboard