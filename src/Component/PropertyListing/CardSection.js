import React, { useEffect, useRef, useState } from 'react'
import HorizontalCard from '../Metiral/HorizontalCard';
import HorizontalCardMobile from '../Metiral/HorizontalCardMobile';
import Card from '../Metiral/Card';
import Line from '../Metiral/Line';
import { useAuth } from '../../Context/ContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import ListingCardLoading from '../Metiral/ListingCardLoading';
import CardLoding from '../Metiral/CardLoding';
import HorizontalCardMobileLoading from '../Metiral/HorizontalCardMobileLoading';
import NotFound from '../../Component/Metiral/NoResultFound';
import BreadCrumb from '../Metiral/BreadCrumb';
import { LuFilter } from 'react-icons/lu';
import NewsLetter from '../Metiral/NewsLetter';
import CustomTooltip from '../Metiral/CustomTooltip';
import ad from '../../Asset/Ads/PP.gif'
import ad1 from '../../Asset/Ads/3.gif'

function CardSection({backtoSearchContent, open, setOpen, nearCities, agency, propertyData, data, pagination, filterData, setFilterData, setSaveBlink, noPropertyFound,locationSummery, nearestTowns }) {
    const { propertyCountLisitng, loading, addData, buildSearchPayloadProperty, adsClick, adsImpression } = useAuth()
    const num = ["05", "10", "15", "20", "25", "30"]
    const [showCard, setShowCard] = useState(false)
    const [menu, setMenu] = useState(false)
    const [grid, setGrid] = useState(false)
    const [order, setOrder] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [newsLetterOpen, setNewsLetterOpen] = useState(false)
    const [showNearbyTown, setShowNearbyTown] = useState(false)
    const [filterReady, setFilterReady] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);
    const prevLoadingRef = useRef(loading);
    const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
    const trackedImpressionsRef = useRef(new Set()); // Track which ad IDs have already been tracked

    // Track loading state to ensure loading shows until data is ready
    // This handles the case where context loading becomes false before propertyData is ready
    useEffect(() => {
        if (loading) {
            setLocalLoading(true);
            prevLoadingRef.current = loading;
        } else if (prevLoadingRef.current && !loading) {
            // Loading just changed from true to false
            if (propertyData?.length > 0) {
                // Delay hiding loading to ensure data is fully rendered
                const timer = setTimeout(() => {
                    setLocalLoading(false);
                }, 500);
                prevLoadingRef.current = loading;
                return () => clearTimeout(timer);
            } else {
                // No data - allow NotFound to show by setting localLoading to false
                const timer = setTimeout(() => {
                    setLocalLoading(false);
                }, 300);
                prevLoadingRef.current = loading;
                return () => clearTimeout(timer);
            }
        } else {
            setLocalLoading(false);
        }
    }, [loading, propertyData]);

    // Prevent initial flash of old property type on filter change
    useEffect(() => {
        setFilterReady(false);
        const t = setTimeout(() => setFilterReady(true), 200);
        return () => clearTimeout(t);
    }, [data]);
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            if (width <= 568) {
                setGrid(true);
            } else {
                setGrid(false);
            }
            // Detect device type for ad filtering
            // Bootstrap breakpoints: xs < 576, sm >= 576, md >= 768, lg >= 992
            if (width < 576) {
                setDeviceType('mobile');
            } else if (width < 992) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Smart pagination: limit visible page numbers - responsive based on screen size
    const number = React.useMemo(() => {
        const totalPages = pagination?.total_pages || 1;
        const currentPage = pagination?.current_page || 1;
        // On small screens (≤576px), show fewer pages (3), otherwise show 7
        const maxVisible = windowWidth <= 576 ? 3 : 7;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (v, i) => i + 1);
        }

        const pages = [];

        // For small screens (≤576px), show compact pagination: [1] ... [prev] [current] [next] ... [last]
        // For larger screens, show more pages around current
        if (windowWidth <= 576) {
            // Always show first page
            pages.push(1);

            // Show pages around current page
            // Case 1: Current page is 1
            if (currentPage === 1) {
                if (totalPages > 1) {
                    if (totalPages > 2) {
                        pages.push(2);
                        if (totalPages > 3) {
                            pages.push('...');
                        }
                    }
                    pages.push(totalPages);
                }
            }
            // Case 2: Current page is last
            else if (currentPage === totalPages) {
                if (totalPages > 2) {
                    pages.push('...');
                    pages.push(totalPages - 1);
                }
                pages.push(totalPages);
            }
            // Case 3: Current page is 2
            else if (currentPage === 2) {
                pages.push(2);
                if (totalPages > 3) {
                    pages.push(3);
                    if (totalPages > 4) {
                        pages.push('...');
                    }
                }
                if (totalPages > 2) {
                    pages.push(totalPages);
                }
            }
            // Case 4: Current page is second to last
            else if (currentPage === totalPages - 1) {
                pages.push('...');
                pages.push(totalPages - 2);
                pages.push(totalPages - 1);
                pages.push(totalPages);
            }
            // Case 5: Current page is in the middle
            else {
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        } else {
            // Larger screen: original logic
            const sidePages = Math.floor((maxVisible - 3) / 2);
            pages.push(1);

            let startPage = Math.max(2, currentPage - sidePages);
            let endPage = Math.min(totalPages - 1, currentPage + sidePages);
            if (currentPage <= sidePages + 1) {
                endPage = Math.min(maxVisible - 1, totalPages - 1);
            }
            if (currentPage >= totalPages - sidePages) {
                startPage = Math.max(2, totalPages - maxVisible + 2);
            }
            if (startPage > 2) {
                pages.push('...');
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    }, [pagination?.total_pages, pagination?.current_page, windowWidth]);

    const dropDown = useRef(null)
    const inputRef = useRef(null)
    const pageRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                inputRef.current,
                dropDown.current,
                pageRef.current,
            ];

            const clickedInside = refs.some(ref => ref && ref.contains(event.target));

            if (!clickedInside) {
                setOrder(false)
                setMenu(false)
                setShowCard(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const navigate = useNavigate()
    const param = useParams()
    useEffect(() => {
        setMenu(false)
    }, [param])
    const { getAd, propertyType, locationList, objectToQueryString, citiesList } = useAuth();
    const [adData, setAdData] = useState([])
    const [cityName, setCityName] = useState("")
    
    // Match city_code with citiesList and store city name
    useEffect(() => {
        if (data?.city_code && citiesList?.length) {
            const matchedCity = citiesList.find(
                (item) => item?.app_code === data?.city_code
            );
            setCityName(matchedCity?.city || "");
        } else {
            setCityName("");
        }
    }, [data?.city_code, citiesList]);
    
    useEffect(() => {
        const fetchAds = async () => {
            const result = await getAd()
            if (result?.success) {
                setAdData(result?.data?.data);
            }
        }
        fetchAds()
    }, [])

    // Filter ads based on device type and ad type, sorted by priority
    const getFilteredAds = React.useMemo(() => {
        if (!adData || adData.length === 0) return { vertical: [], horizontal: [] };

        const filtered = adData.filter(ad => {
            // Check if ad is active
            if (ad.status !== 1) return false;

            // Check date validity
            const now = new Date();
            const startDate = new Date(ad.start_date);
            const endDate = new Date(ad.end_date);
            if (now < startDate || now > endDate) return false;

            // Check device type
            const deviceTypes = ad.device_type || [];
            if (deviceTypes.includes('all') || deviceTypes.includes(deviceType)) {
                return true;
            }
            return false;
        });

        // Separate by ad type and sort by priority (lower number = higher priority)
        const verticalAds = filtered
            .filter(ad => ad.ad_type === 'vertical')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        
        const horizontalAds = filtered
            .filter(ad => ad.ad_type === 'horizontal')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        return {
            vertical: verticalAds,
            horizontal: horizontalAds
        };
    }, [adData, deviceType]);

    // Track ad impressions when ads are displayed
    useEffect(() => {
        const trackImpressions = async () => {
            // Track horizontal ad impressions (all ads will be in mixed content)
            getFilteredAds.horizontal.forEach(async (ad) => {
                if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                    trackedImpressionsRef.current.add(ad.id);
                    await adsImpression(ad.id);
                }
            });
            
            // Track vertical ad impressions
            getFilteredAds.vertical.forEach(async (ad) => {
                if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                    trackedImpressionsRef.current.add(ad.id);
                    await adsImpression(ad.id);
                }
            });
        };

        if (getFilteredAds.horizontal.length > 0 || getFilteredAds.vertical.length > 0) {
            trackImpressions();
        }
    }, [getFilteredAds.horizontal, getFilteredAds.vertical, adsImpression]);

    // Handle ad click
    const handleAdClick = (adId, adUrl) => {
        // Track click without blocking navigation
        if (adId) {
            adsClick(adId).catch(err => console.error('Error tracking ad click:', err));
        }
        // Open the ad URL in a new tab
        window.open(adUrl, '_blank', 'noopener,noreferrer');
    };

    // Mix properties with horizontal ads
    // Ads won't repeat until all ads have been shown
    const getMixedContent = React.useMemo(() => {
        if (!propertyData || propertyData.length === 0) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const adsForMixing = horizontalAds.length > 0 ? horizontalAds : [];
        const items = [];
        let adIndex = 0;

        propertyData.forEach((property, index) => {
            // CRITICAL: Always add property first - this ensures ads never appear before properties
            items.push({ type: 'property', data: property, index });

            // Insert horizontal ad after 1st property (index 0), then after 5th (index 4), 10th (index 9), 15th (index 14), etc.
            // Only insert if there are ads available and not all ads have been used
            // IMPORTANT: Only insert ONE ad per iteration, and only after a property has been added
            if (adsForMixing.length > 0 && adIndex < adsForMixing.length) {
                // Insert ad after 1st property, then after every 5th property (5th, 10th, 15th, etc.)
                const shouldInsertAd = index === 0 || (index >= 4 && (index - 4) % 5 === 0);
                if (shouldInsertAd) {
                    // Double-check: ensure we have at least one property before inserting ad
                    if (items.length > 0 && items[items.length - 1].type === 'property') {
                        items.push({ type: 'ad', data: adsForMixing[adIndex], index: `ad-${adIndex}` });
                        adIndex++; // Move to next ad, don't cycle (no repeat until all ads shown)
                    }
                }
            }
        });

        // Final safety check: ensure first item is always a property, never an ad
        if (items.length > 0 && items[0].type === 'ad') {
            // If somehow an ad got to the front, move it after the first property
            const firstAd = items.shift();
            const firstPropertyIndex = items.findIndex(item => item.type === 'property');
            if (firstPropertyIndex !== -1) {
                items.splice(firstPropertyIndex + 1, 0, firstAd);
            }
        }

        return items;
    }, [propertyData, getFilteredAds.horizontal]);

    // Mix properties with horizontal ads for grid view
    // First horizontal ad after 3rd card (index 2), then every 6 cards after that (index 8, 14, 20, etc.)
    const getGridMixedContent = React.useMemo(() => {
        if (!propertyData || propertyData.length === 0) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const adsForMixing = horizontalAds.length > 0 ? horizontalAds : [];
        const items = [];
        let adIndex = 0;

        propertyData.forEach((property, index) => {
            // CRITICAL: Always add property first - this ensures ads never appear before properties
            items.push({ type: 'property', data: property, index });

            // Insert horizontal ad after 3rd card (index 2), then every 6 cards after that (index 8, 14, 20, etc.)
            // Only insert if there are ads available and not all ads have been used
            if (adsForMixing.length > 0 && adIndex < adsForMixing.length) {
                const shouldInsertAd = index === 2 || (index > 2 && (index - 2) % 6 === 0);
                if (shouldInsertAd) {
                    // Double-check: ensure we have at least one property before inserting ad
                    if (items.length > 0 && items[items.length - 1].type === 'property') {
                        items.push({ type: 'ad', data: adsForMixing[adIndex], index: `ad-${adIndex}` });
                        adIndex++; // Move to next ad, don't cycle (no repeat until all ads shown)
                    }
                }
            }
        });

        // Final safety check: ensure first item is always a property, never an ad
        if (items.length > 0 && items[0].type === 'ad') {
            // If somehow an ad got to the front, move it after the first property
            const firstAd = items.shift();
            const firstPropertyIndex = items.findIndex(item => item.type === 'property');
            if (firstPropertyIndex !== -1) {
                items.splice(firstPropertyIndex + 1, 0, firstAd);
            }
        }

        return items;
    }, [propertyData, getFilteredAds.horizontal]);

    // Render horizontal ad component
    const renderHorizontalAd = (ad, renderKey) => {
        return (
            <a 
                key={renderKey || `ad-${ad?.id}`}
                href={ad.url} 
                onClick={(e) => {
                    e.preventDefault();
                    handleAdClick(ad.id, ad.url);
                }}
                className="global-horizontal-ad-box w-100 mt-4"
            >
                <img src={ad.image} alt={ad.title || 'Advertisement'} className="w-100 h-100" />
            </a>
        );
    };

    // Render horizontal ad component for grid view (full width)
    const renderHorizontalAdGrid = (ad, renderKey) => {
        return (
            <div key={renderKey || `grid-ad-${ad?.id}`} style={{ gridColumn: '1 / -1', width: '100%' }}>
                <a 
                    href={ad.url} 
                    onClick={(e) => {
                        e.preventDefault();
                        handleAdClick(ad.id, ad.url);
                    }}
                    className="global-horizontal-ad-box w-100 mt-4"
                >
                    <img src={ad.image} alt={ad.title || 'Advertisement'} className="w-100 h-100" />
                </a>
            </div>
        );
    };

    // Render vertical ad component for grid view
    const renderVerticalAd = (ad) => {
        return (
            <a 
                key={ad.id} 
                href={ad.url} 
                onClick={(e) => {
                    e.preventDefault();
                    handleAdClick(ad.id, ad.url);
                }}
                className="d-block mb-3"
                style={{ padding: '0' }}
            >
                <img
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    src={ad.image}
                    alt={ad.title || 'Advertisement'}
                />
            </a>
        );
    };
    const handlePageChange = async (pageAction) => {
        let goPage = filterData?.current_page || 1;

        if (pageAction?.action === "next" && filterData?.current_page < pagination?.total_pages) {
            goPage = filterData?.current_page + 1;
        }

        if (pageAction?.action === "back" && filterData?.current_page > 1) {
            goPage = filterData?.current_page - 1;
        }

        if (pageAction?.action === "pageChange") {
            goPage = pageAction?.page_number;
        }

        // Update current page in state
        setFilterData((prev) => ({ ...prev, current_page: goPage }));

        // Build search payload
        const payload = await buildSearchPayloadProperty({ ...filterData, current_page: goPage });
        const queryString = objectToQueryString(payload);

        // Navigate to new page with updated query string
        navigate(`/properties?${queryString}`);
    }

    return (
        <>
            <div className="card-section">
                <div className="main-container">
                    <div className="row mx-0" style={{ gap: '10px 0' }}>
                        <div className="col-12 d-flex align-items-center justify-content-between p-0">
                            <BreadCrumb items={["Home", `Properties ${cityName ? "in" : ""} ${cityName}`]} paths={["/"]} />
                            <div className="filter d-lg-none d-flex align-items-center gap-2 ms-auto" onClick={() => setOpen(!open)}>
                                Filter <LuFilter />
                            </div>
                        </div>

                        <div className="col-12 p-0 d-flex justify-content-between align-items-center flex-wrap-reverse" style={{ gap: '10px' }} >
                            {agency ? <div className="heading">
                                House for <span style={{ textTransform: "capitalize" }}>{param?.id === "sell" ? "Buy" : param?.id}</span> by Makeen <span className='count'>(25)</span>
                            </div> : <div className="heading">
                                <p className='m-0'>{data?.sub_category_id?.length ? propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.categories?.find((item) => item?.id === parseInt(data?.category_id))?.sub_categories?.filter((item) => data?.sub_category_id.map(Number).includes(item?.id)).map((item) => item?.name).join(", ") : "Properties"} for <span style={{ textTransform: "capitalize" }}>{data?.property_type_id ? propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.name === "Sell" ? "Sale" : propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.name : ""}</span> in {data?.location_id?.length ? locationList?.filter((item) => data?.location_id.map(Number).includes(item?.id)).map((item) => item?.name).join(", ") : ""}{data?.location_id?.length && cityName ? ', ' : ''}{cityName} <span className='count d-sm-none d-inline'>({ !noPropertyFound ? pagination?.total : 0})</span> </p>
                                <span className='count d-sm-inline d-none'>({ !noPropertyFound ? pagination?.total : 0})</span>
                            </div>}

                        </div>
                        {!agency && locationSummery?.length > 0 && <div className="col-12 p-0">
                            <div className="city-area-selector" ref={dropDown} style={{ height: menu ? "fit-content" : '42px' }}>
                                <div className="top" onClick={() => setMenu(!menu)}>
                                    <div className="city-area-name"
                                    >

                                        {data?.sub_category_id?.length ? propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.categories?.find((item) => item?.id === parseInt(data?.category_id))?.name : "Properties"} for <span style={{ textTransform: "capitalize" }}>{data?.property_type_id ? propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.name === "Sell" ? "Sale" : propertyType?.find((item) => item?.id === parseInt(data?.property_type_id))?.name : ""}</span> {cityName ? "in" : ""} {cityName}</div>
                                    <div className="button" >
                                        {
                                            menu ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6.85742 14.5715L12.0003 9.42868L17.1431 14.5715" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6.85742 9.42871L12.0003 14.5716L17.1431 9.42871" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                        }
                                    </div>
                                </div>
                                <Line margin={'0 0 4px 0'} />
                                <div className="menu-box">
                                    <div className="row m-0">
                                        {locationSummery?.slice(0, 44)?.map((group, colIndex) => (
                                            <div
                                                key={colIndex}
                                                className={`col-lg-3 col-md-6 col-12 `}
                                            >
                                                <div
                                                    onClick={() => {
                                                        if (data?.location_id?.length > 0) {
                                                            const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, group?.area_id] });
                                                            navigate(`/properties?${queryString}`)
                                                        } else {
                                                            const queryString = objectToQueryString({ ...data, location_id: [group?.area_id] });
                                                            navigate(`/properties?${queryString}`)
                                                        }
                                                    }}
                                                    className="location mb-2"
                                                >
                                                    {group.area_name} ({group.count})
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div className="col-lg-9 col-12 ps-0 pe-lg-2 pe-0">
                            <div className="option-box">
                                <div className='d-flex align-items-center justify-content-md-start justify-content-between  option-box-row' style={{ gap: '12px' }}>
                                    <div className="total-num">{(pagination?.current_page - 1) * pagination?.per_page + 1}-{pagination?.current_page * pagination?.per_page > pagination?.total ? pagination?.total : pagination?.current_page * pagination?.per_page} of {pagination?.total} properties</div>
                                    <div className="card-order" ref={inputRef}>
                                        <div className="input" onClick={() => setOrder(!order)}>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M8.66667 6.16699H17.3333C17.5101 6.16699 17.6797 6.08797 17.8047 5.94732C17.9298 5.80667 18 5.6159 18 5.41699C18 5.21808 17.9298 5.02731 17.8047 4.88666C17.6797 4.74601 17.5101 4.66699 17.3333 4.66699H8.66667C8.48986 4.66699 8.32029 4.74601 8.19526 4.88666C8.07024 5.02731 8 5.21808 8 5.41699C8 5.6159 8.07024 5.80667 8.19526 5.94732C8.32029 6.08797 8.48986 6.16699 8.66667 6.16699Z" fill="#737678" />
                                                    <path d="M17.3333 9.33301H8.66667C8.48986 9.33301 8.32029 9.41203 8.19526 9.55268C8.07024 9.69333 8 9.8841 8 10.083C8 10.2819 8.07024 10.4727 8.19526 10.6133C8.32029 10.754 8.48986 10.833 8.66667 10.833H17.3333C17.5101 10.833 17.6797 10.754 17.8047 10.6133C17.9298 10.4727 18 10.2819 18 10.083C18 9.8841 17.9298 9.69333 17.8047 9.55268C17.6797 9.41203 17.5101 9.33301 17.3333 9.33301Z" fill="#737678" />
                                                    <path d="M17.3333 14H8.66667C8.48986 14 8.32029 14.079 8.19526 14.2197C8.07024 14.3603 8 14.5511 8 14.75C8 14.9489 8.07024 15.1397 8.19526 15.2803C8.32029 15.421 8.48986 15.5 8.66667 15.5H17.3333C17.5101 15.5 17.6797 15.421 17.8047 15.2803C17.9298 15.1397 18 14.9489 18 14.75C18 14.5511 17.9298 14.3603 17.8047 14.2197C17.6797 14.079 17.5101 14 17.3333 14Z" fill="#737678" />
                                                    <path d="M5.69647 6.24444C5.75654 6.24443 5.81526 6.22604 5.86519 6.19161C5.91513 6.15718 5.95403 6.10826 5.97698 6.05103C5.99992 5.9938 6.00589 5.93084 5.99411 5.87011C5.98233 5.80939 5.95334 5.75363 5.91081 5.7099L4.42928 4.18326C4.31542 4.06592 4.161 4 4 4C3.839 4 3.68459 4.06592 3.57072 4.18326L2.0898 5.7099C2.04727 5.75363 2.01828 5.80939 2.0065 5.87011C1.99472 5.93084 2.00068 5.9938 2.02363 6.05103C2.04658 6.10826 2.08548 6.15718 2.13541 6.19161C2.18535 6.22604 2.24406 6.24443 2.30414 6.24444H3.39342V13.7556H2.30414C2.24401 13.7554 2.18521 13.7737 2.13518 13.8081C2.08516 13.8425 2.04616 13.8914 2.02314 13.9487C2.00012 14.0059 1.9941 14.069 2.00586 14.1297C2.01762 14.1905 2.04662 14.2463 2.08919 14.2901L3.57072 15.8167C3.68459 15.9341 3.839 16 4 16C4.161 16 4.31542 15.9341 4.42928 15.8167L5.91081 14.2901C5.95334 14.2464 5.98233 14.1906 5.99411 14.1299C6.00589 14.0692 5.99992 14.0062 5.97698 13.949C5.95403 13.8917 5.91513 13.8428 5.86519 13.8084C5.81526 13.774 5.75654 13.7556 5.69647 13.7556H4.60779V6.24444H5.69647Z" fill="#737678" />
                                                </svg>
                                                <span>
                                                    {!filterData?.sorting ? "Default" : filterData?.sorting === "popular" && "Popular" || filterData?.sorting === "high_price" && "High Price" || filterData?.sorting === "low_price" && "Low Price"}
                                                </span>
                                            </span>
                                            <span>
                                                {
                                                    !order ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                            <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                }
                                            </span>
                                        </div>
                                        {order ?
                                            <>
                                                <div className="input-drop-menu">
                                                    <div className={filterData?.sorting === "popular" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "popular" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "popular" });
                                                        navigate(`/properties?${queryString}`)
                                                    }}>Popular</div>
                                                    <div className={filterData?.sorting === "low_price" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "low_price" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "low_price" });
                                                        navigate(`/properties?${queryString}`)
                                                    }}>Low Price</div>
                                                    <div className={filterData?.sorting === "high_price" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "high_price" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "high_price" });
                                                        navigate(`/properties?${queryString}`)
                                                    }}>High Price</div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                        }
                                    </div>
                                </div>
                                <div className="card-format d-md-inline d-none">
                                    {
                                        !grid ?
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20.25 11.25H3.75C3.33579 11.25 3 11.5858 3 12C3 12.4142 3.33579 12.75 3.75 12.75H20.25C20.6642 12.75 21 12.4142 21 12C21 11.5858 20.6642 11.25 20.25 11.25Z" fill="#2D2D2D" />
                                                    <path d="M20.25 6H3.75C3.33579 6 3 6.33579 3 6.75C3 7.16421 3.33579 7.5 3.75 7.5H20.25C20.6642 7.5 21 7.16421 21 6.75C21 6.33579 20.6642 6 20.25 6Z" fill="#2D2D2D" />
                                                    <path d="M20.25 16.5H3.75C3.33579 16.5 3 16.8358 3 17.25C3 17.6642 3.33579 18 3.75 18H20.25C20.6642 18 21 17.6642 21 17.25C21 16.8358 20.6642 16.5 20.25 16.5Z" fill="#2D2D2D" />
                                                </svg>
                                                <svg onClick={() => setGrid(!grid)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M17.25 3H6.75C5.7558 3.00119 4.80267 3.39666 4.09966 4.09966C3.39666 4.80267 3.00119 5.7558 3 6.75L3 17.25C3.00119 18.2442 3.39666 19.1973 4.09966 19.9003C4.80267 20.6033 5.7558 20.9988 6.75 21H17.25C18.2442 20.9988 19.1973 20.6033 19.9003 19.9003C20.6033 19.1973 20.9988 18.2442 21 17.25V6.75C20.9988 5.7558 20.6033 4.80267 19.9003 4.09966C19.1973 3.39666 18.2442 3.00119 17.25 3ZM15 11.25H12.75V9H15V11.25ZM16.5 9H19.5V11.25H16.5V9ZM12.75 7.5V4.5H15V7.5H12.75ZM11.25 7.5H9V4.5H11.25V7.5ZM11.25 9V11.25H9V9H11.25ZM7.5 11.25H4.5V9H7.5V11.25ZM4.5 12.75H7.5V15H4.5V12.75ZM9 12.75H11.25V15H9V12.75ZM11.25 16.5V19.5H9V16.5H11.25ZM12.75 16.5H15V19.5H12.75V16.5ZM12.75 15V12.75H15V15H12.75ZM16.5 12.75H19.5V15H16.5V12.75ZM19.5 6.75V7.5H16.5V4.5H17.25C17.8467 4.5 18.419 4.73705 18.841 5.15901C19.2629 5.58097 19.5 6.15326 19.5 6.75ZM6.75 4.5H7.5V7.5H4.5V6.75C4.5 6.15326 4.73705 5.58097 5.15901 5.15901C5.58097 4.73705 6.15326 4.5 6.75 4.5ZM4.5 17.25V16.5H7.5V19.5H6.75C6.15326 19.5 5.58097 19.2629 5.15901 18.841C4.73705 18.419 4.5 17.8467 4.5 17.25ZM17.25 19.5H16.5V16.5H19.5V17.25C19.5 17.8467 19.2629 18.419 18.841 18.841C18.419 19.2629 17.8467 19.5 17.25 19.5Z" fill="#BBBBBB" />
                                                </svg>
                                            </>
                                            :
                                            <>
                                                <svg onClick={() => setGrid(!grid)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20.25 11.25H3.75C3.33579 11.25 3 11.5858 3 12C3 12.4142 3.33579 12.75 3.75 12.75H20.25C20.6642 12.75 21 12.4142 21 12C21 11.5858 20.6642 11.25 20.25 11.25Z" fill="#BBBBBB" />
                                                    <path d="M20.25 6H3.75C3.33579 6 3 6.33579 3 6.75C3 7.16421 3.33579 7.5 3.75 7.5H20.25C20.6642 7.5 21 7.16421 21 6.75C21 6.33579 20.6642 6 20.25 6Z" fill="#BBBBBB" />
                                                    <path d="M20.25 16.5H3.75C3.33579 16.5 3 16.8358 3 17.25C3 17.6642 3.33579 18 3.75 18H20.25C20.6642 18 21 17.6642 21 17.25C21 16.8358 20.6642 16.5 20.25 16.5Z" fill="#BBBBBB" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M17.25 3H6.75C5.7558 3.00119 4.80267 3.39666 4.09966 4.09966C3.39666 4.80267 3.00119 5.7558 3 6.75L3 17.25C3.00119 18.2442 3.39666 19.1973 4.09966 19.9003C4.80267 20.6033 5.7558 20.9988 6.75 21H17.25C18.2442 20.9988 19.1973 20.6033 19.9003 19.9003C20.6033 19.1973 20.9988 18.2442 21 17.25V6.75C20.9988 5.7558 20.6033 4.80267 19.9003 4.09966C19.1973 3.39666 18.2442 3.00119 17.25 3ZM15 11.25H12.75V9H15V11.25ZM16.5 9H19.5V11.25H16.5V9ZM12.75 7.5V4.5H15V7.5H12.75ZM11.25 7.5H9V4.5H11.25V7.5ZM11.25 9V11.25H9V9H11.25ZM7.5 11.25H4.5V9H7.5V11.25ZM4.5 12.75H7.5V15H4.5V12.75ZM9 12.75H11.25V15H9V12.75ZM11.25 16.5V19.5H9V16.5H11.25ZM12.75 16.5H15V19.5H12.75V16.5ZM12.75 15V12.75H15V15H12.75ZM16.5 12.75H19.5V15H16.5V12.75ZM19.5 6.75V7.5H16.5V4.5H17.25C17.8467 4.5 18.419 4.73705 18.841 5.15901C19.2629 5.58097 19.5 6.15326 19.5 6.75ZM6.75 4.5H7.5V7.5H4.5V6.75C4.5 6.15326 4.73705 5.58097 5.15901 5.15901C5.58097 4.73705 6.15326 4.5 6.75 4.5ZM4.5 17.25V16.5H7.5V19.5H6.75C6.15326 19.5 5.58097 19.2629 5.15901 18.841C4.73705 18.419 4.5 17.8467 4.5 17.25ZM17.25 19.5H16.5V16.5H19.5V17.25C19.5 17.8467 19.2629 18.419 18.841 18.841C18.419 19.2629 17.8467 19.5 17.25 19.5Z" fill="#444545" />
                                                </svg>
                                            </>
                                    }
                                </div>
                            </div>
                            {/* <div className="global-horizontal-ad-box w-100 mt-4" style={{height:'90px'}}>
                                <Image className='w-100 h-100' src={ad} alt="" />
                            </div> */}
                            {/* Show first horizontal ad (index 0) at the top */}
                            {/* {getFilteredAds.horizontal.length > 0 && getFilteredAds.horizontal[0] ? (
                                <a 
                                    href={getFilteredAds.horizontal[0].url} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAdClick(getFilteredAds.horizontal[0].id, getFilteredAds.horizontal[0].url);
                                    }}
                                    className="global-horizontal-ad-box w-100 mt-3"
                                >
                                    <Image  src={getFilteredAds.horizontal[0].image} alt={getFilteredAds.horizontal[0].title || 'Advertisement'} />
                                </a>
                            ) : (!loading&&
                                <div className="global-ad-box w-100 mt-3" style={{ height: "90px" }}>
                                    Advertisement Space
                                </div>
                            )} */}
                            {
                                noPropertyFound &&
                                <>
                                    <div style={{ marginTop: "10px", marginBottom: "16px" }}>
                                        <NotFound message={noPropertyFound} />
                                    </div>
                                    <div className="near-by-heading" style={{ marginBottom: "16px" }}>
                                        Nearby Properties <span className='count' style={{fontSize:'16px',fontWeight:'500', color:"#737678"}}>({pagination?.total})</span>
                                    </div>
                                </>
                            }
                            {
                                loading ? <div> { windowWidth > 400 && windowWidth <= 576 ? (
                                    [...Array(4)].map((_, index) => {
                                        return (
                                            <HorizontalCardMobileLoading key={index} />
                                        )
                                    })
                                ) : grid ? <div className="grid mt-3">
                                    {[...Array(6)].map((_, index) => (
                                        <CardLoding key={`loading-grid-${index}`} />
                                    ))}


                                </div>  : [...Array(4)].map((_, index) => {
                                    return (
                                        <ListingCardLoading key={index} />
                                    )
                                })}</div> : <>
                                    {propertyData?.length > 0 ? (
                                        // Above 576px: use grid state to decide
                                        windowWidth >= 576 ? (
                                            !grid ? (
                                                <>
                                                    {getMixedContent.map((item) => {
                                                        if (item.type === 'property') {
                                                            return <HorizontalCard backtoSearchContent={backtoSearchContent} key={`property-${item.index}`} label={item.data.label} data={item.data} />;
                                                        } else if (item.type === 'ad') {
                                                            return renderHorizontalAd(item.data, `mixed-ad-${item.data?.id ?? item.index}`);
                                                        }
                                                        return null;
                                                    })}
                                                </>
                                            ) : 
                                            (
                                                <div className="grid mt-3" style={{gridTemplateColumns: `repeat(3, 1fr)`}}>
                                                    {getGridMixedContent.map((item) => {
                                                        if (item.type === 'property') {
                                                            return <Card backtoSearchContent={backtoSearchContent} newWidth={true}  key={`grid-property-${item.index}`} data={item.data} temporarily={true} />;
                                                        } else if (item.type === 'ad') {
                                                            return renderHorizontalAdGrid(item.data, `grid-mixed-ad-${item.data?.id ?? item.index}`);
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            )
                                        ) : (
                                            // 576px and below: check if 400px or below
                                            windowWidth <= 400 ? (
                                                // 400px and below: use grid Card
                                                <div className="grid mt-3">
                                                    {getGridMixedContent.map((item) => {
                                                        if (item.type === 'property') {
                                                            return <Card backtoSearchContent={backtoSearchContent} newWidth={window?.innerWidth <= 400 && true} mobileChanged={true} letFullWidth={true} key={`mobile-grid-property-${item.index}`} data={item.data} temporarily={true} />;
                                                        } else if (item.type === 'ad') {
                                                            return renderHorizontalAdGrid(item.data, `mobile-grid-ad-${item.data?.id ?? item.index}`);
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            ) : (
                                                // Between 400px and 576px: use HorizontalCardMobile
                                                <>
                                                    {getMixedContent.map((item) => {
                                                        if (item.type === 'property') {
                                                            return <HorizontalCardMobile key={`mobile-property-${item.index}`} label={item.data.label} data={item.data} />;
                                                        } else if (item.type === 'ad') {
                                                            return renderHorizontalAd(item.data, `mobile-mixed-ad-${item.data?.id ?? item.index}`);
                                                        }
                                                        return null;
                                                    })}
                                                </>
                                            )
                                        )
                                    ) : (
                                        !localLoading && !loading && filterReady && <NotFound marginTop={"10px"} />
                                    )}
                                </>}


                            {pagination?.total_pages > 1 ? <div className="col-12 mt-4">
                                <div className="row w-100 m-0 justify-content-end flex-md-row flex-column-reverse align-items-center" style={{ gap: '20px 80px' }}>
                                    <div className="col-md-4 col-12 order-sm-first order-last p-0">
                                        <div className="pagination w-lg-unset w-100   justify-content-center">
                                            <div className="move-btn back" onClick={() => handlePageChange({ action: "back" })}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2329 4.18414C10.4626 4.423 10.4551 4.80282 10.2163 5.0325L7.06605 8L10.2163 10.9675C10.4551 11.1972 10.4626 11.577 10.2329 11.8159C10.0032 12.0547 9.62339 12.0622 9.38452 11.8325L5.78452 8.4325C5.66688 8.31938 5.60039 8.16321 5.60039 8C5.60039 7.83679 5.66688 7.68062 5.78452 7.5675L9.38452 4.1675C9.62339 3.93782 10.0032 3.94527 10.2329 4.18414Z" fill="#737678" />
                                                </svg>
                                                Back
                                            </div>

                                            {number?.map((num, index) => (
                                                num === '...' ? (
                                                    <div key={`ellipsis-${index}`} className="page-number ellipsis">
                                                        ...
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={`page-${num}`}
                                                        className={`page-number ${pagination?.current_page === num ? 'active' : ''}`}
                                                        onClick={() => handlePageChange({ action: "pageChange", page_number: num })}
                                                    >
                                                        {num}
                                                    </div>
                                                )
                                            ))}

                                            <div className="move-btn next" onClick={() => handlePageChange({ action: "next" })}>
                                                Next
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.76711 11.8159C5.53743 11.577 5.54488 11.1972 5.78374 10.9675L8.93395 8L5.78374 5.0325C5.54488 4.80282 5.53743 4.423 5.76711 4.18413C5.99679 3.94527 6.37661 3.93782 6.61548 4.1675L10.2155 7.5675C10.3331 7.68062 10.3996 7.83679 10.3996 8C10.3996 8.16321 10.3331 8.31938 10.2155 8.4325L6.61548 11.8325C6.37661 12.0622 5.99679 12.0547 5.76711 11.8159Z" fill="#737678" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-4 d-sm-inline d-none p-0">
                                        <div className="card-showing-box">
                                            <div className="text" onClick={() => setShowCard(!showCard)}>Result per page</div>
                                            <div className="box" ref={pageRef} onClick={() => setShowCard(!showCard)}>{pagination?.per_page || 15}
                                                {
                                                    !showCard ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.71484 7.85742L10.0006 12.1431L14.2863 7.85742" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                            <path d="M13.6094 12.1426L9.56673 7.85686L5.52409 12.1426" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                }
                                                {
                                                    showCard ?
                                                        <>
                                                            <div className="input-drop-menu">
                                                                {
                                                                    num?.map((item) => (
                                                                        <div key={`per-page-${item}`} className={filterData?.per_page === item ? "title active" : "title"} onClick={async () => {
                                                                            setFilterData({ ...filterData, per_page: item, current_page: 1 }); setShowCard(false)
                                                                            const data = await buildSearchPayloadProperty({ ...filterData, per_page: item, current_page: 1 })
                                                                            const queryString = objectToQueryString(data);
                                                                            navigate(`/properties?${queryString}`)

                                                                        }}>{item}</div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </>
                                                        :
                                                        ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : ""}
                        </div>
                        <div className="col-lg-3 col-12 mt-lg-0 mt-4 pe-0 ps-lg-2 ps-0">
                            <div className="card-side">
                                <div className="row mx-0 mb-lg-0 mb-4" style={{ gap: "12px 0" }}>
                                    <div className="col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-2 p-0 d-sm-inline d-none">
                                        <div className="message-box h-100">
                                            <div className='tab-box'>
                                                <CustomTooltip title='Alert me of new properties' placement='left'>
                                                    <div className="message btn-secondary-button" onClick={() => setNewsLetterOpen(true)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                                            <g clipPath="url(#clip0_2657_66850)">
                                                                <path d="M11.5833 0.583008H3.41667C2.6434 0.583934 1.90208 0.891522 1.3553 1.4383C0.808515 1.98508 0.500926 2.72641 0.5 3.49967L0.5 10.4997C0.500926 11.2729 0.808515 12.0143 1.3553 12.561C1.90208 13.1078 2.6434 13.4154 3.41667 13.4163H11.5833C12.3566 13.4154 13.0979 13.1078 13.6447 12.561C14.1915 12.0143 14.4991 11.2729 14.5 10.4997V3.49967C14.4991 2.72641 14.1915 1.98508 13.6447 1.4383C13.0979 0.891522 12.3566 0.583934 11.5833 0.583008ZM3.41667 1.74967H11.5833C11.9326 1.75036 12.2737 1.85556 12.5627 2.05173C12.8517 2.2479 13.0754 2.52606 13.205 2.85042L8.73783 7.31817C8.40908 7.64561 7.96399 7.82945 7.5 7.82945C7.03601 7.82945 6.59092 7.64561 6.26217 7.31817L1.795 2.85042C1.92459 2.52606 2.14827 2.2479 2.43728 2.05173C2.72628 1.85556 3.06738 1.75036 3.41667 1.74967ZM11.5833 12.2497H3.41667C2.95254 12.2497 2.50742 12.0653 2.17923 11.7371C1.85104 11.4089 1.66667 10.9638 1.66667 10.4997V4.37467L5.43733 8.14301C5.98487 8.68916 6.72665 8.99586 7.5 8.99586C8.27335 8.99586 9.01513 8.68916 9.56267 8.14301L13.3333 4.37467V10.4997C13.3333 10.9638 13.149 11.4089 12.8208 11.7371C12.4926 12.0653 12.0475 12.2497 11.5833 12.2497Z" fill="#698B75" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_2657_66850">
                                                                    <rect width="14" height="14" fill="white" transform="translate(0.5)" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                        <div  >Alert me of new properties</div>
                                                    </div>
                                                </CustomTooltip>
                                                <CustomTooltip title='Want to save your search?' placement='left'>
                                                    <div onClick={() => setSaveBlink(true)} className="message btn-secondary-button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                            <path d="M13.8364 13.0122L10.3573 9.53317C11.3054 8.37364 11.7716 6.89406 11.6593 5.40048C11.5471 3.9069 10.8651 2.51358 9.75441 1.50874C8.64371 0.503889 7.18928 -0.0356119 5.69195 0.00182585C4.19463 0.0392636 2.76897 0.650775 1.70987 1.70987C0.650775 2.76897 0.0392636 4.19463 0.00182585 5.69195C-0.0356119 7.18928 0.503889 8.64371 1.50874 9.75441C2.51358 10.8651 3.9069 11.5471 5.40048 11.6593C6.89406 11.7716 8.37364 11.3054 9.53317 10.3573L13.0122 13.8364C13.1222 13.9426 13.2694 14.0013 13.4222 14C13.575 13.9987 13.7212 13.9374 13.8293 13.8293C13.9374 13.7212 13.9987 13.575 14 13.4222C14.0013 13.2694 13.9426 13.1222 13.8364 13.0122ZM5.8472 10.51C4.92498 10.51 4.02347 10.2366 3.25667 9.72421C2.48987 9.21185 1.89222 8.48361 1.5393 7.63159C1.18638 6.77957 1.09404 5.84203 1.27396 4.93753C1.45388 4.03302 1.89797 3.20219 2.55008 2.55008C3.20219 1.89797 4.03302 1.45388 4.93753 1.27396C5.84203 1.09404 6.77957 1.18638 7.63159 1.5393C8.48361 1.89222 9.21185 2.48987 9.72421 3.25667C10.2366 4.02347 10.51 4.92498 10.51 5.8472C10.5086 7.08343 10.0169 8.26864 9.14279 9.14279C8.26864 10.0169 7.08343 10.5086 5.8472 10.51Z" fill="#698B75" />
                                                        </svg>
                                                        <div >Want to save your search?</div>
                                                    </div>
                                                </CustomTooltip>
                                            </div>
                                            <Line color={'#353535ff'} />
                                            <div className="title-box">
                                                <div onClick={() => window.open('/property-index', '_blank')} className="title">View Property indexes</div>
                                                <div onClick={() => window.open('/property-trend', '_blank')} className="title">View Property trends</div>
                                                <div onClick={() => window.open('/news', '_blank')} className="title">Read our News</div>
                                                <div onClick={() => window.open('/blogs', '_blank')} className="title">Read our Blogs</div>
                                            </div>
                                        </div>
                                    </div>
                                    {getFilteredAds.vertical.length > 0 && (
                                        <div className={"col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-2 p-0 d-sm-inline order-lg-unset order-last d-none"}>
                                            {getFilteredAds.vertical.slice(0, 1).map((item, i) => (
                                                <a 
                                                    key={item.id || i} 
                                                    className='p-0 mb-3 d-block' 
                                                    href={item?.url} 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAdClick(item?.id, item?.url);
                                                    }}
                                                >
                                                    <img className='w-100 h-100' style={{ objectFit: 'cover', borderRadius: 4 }} src={item?.image} alt={item?.title || 'Advertisement'} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    <div className="col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-2 p-0 d-sm-inline d-none">
                                        <div className="locations-box h-100">
                                            <div className="title">Nearby Town & cities</div>
                                            <div className="row m-0">
                                                {nearestTowns?.length > 0 &&
                                                    <div className="col-6 p-0">
                                                        <div className="area-box">
                                                            {nearestTowns?.map((item) => {
                                                                return (
                                                                    <div onClick={() => {
                                                                        if (data?.location_id?.length > 0) {
                                                                            const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.id] });
                                                                            navigate(`/properties?${queryString}`)
                                                                        } else {
                                                                            const queryString = objectToQueryString({ ...data, location_id: [item?.id] });
                                                                            navigate(`/properties?${queryString}`)
                                                                        }
                                                                    }} key={`near-town-${item?.id || item?.name}`} className="area-name">{item?.name}</div>
                                                                )
                                                            })}

                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    nearCities?.length > 0 &&
                                                    <div className="col-6 p-0">
                                                        <div className="area-box">
                                                            {nearCities?.map((item) => (
                                                                <div onClick={() => {
                                                                    setFilterData({ ...filterData, city_code: item?.city_code, location_id: [] });
                                                                    const queryString = objectToQueryString({ ...data, city_code: item?.city_code, location_id: [] });
                                                                    navigate(`/properties?${queryString}`)
                                                                }} key={item?.id} className="area-name">{item?.name}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-2 p-0">
                                        <div className="locations-box h-100">
                                            <div className="title">Popular Searches</div>
                                            <div className="row m-0">
                                                <div className="col-12 p-0">
                                                    <div className="area-box">
                                                        <div className="area-name">10 marla house for sale</div>
                                                        <div className="area-name">1 kanal house for rent</div>
                                                        <div className="area-name">5 marla home for sale</div>
                                                        <div className="area-name">7 marla home for rent</div>
                                                        <div className="area-name">Shop for rent</div>
                                                        <div className="area-name">5 marla home for rent</div>
                                                        <div className="area-name">10 marla upper portion for rent</div>
                                                        <div className="area-name">Rs 80,000 home for rent</div>
                                                        <div className="area-name">Luxury flats for rent</div>
                                                        <div className="area-name">Furnished rooms for rent</div>
                                                        <div className="area-name">8 marla home for sale</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    {getFilteredAds.vertical.length > 1 && (
                                        <div className={"col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-3 p-0 d-sm-inline order-lg-unset order-last d-none"}>
                                            {getFilteredAds.vertical.slice(1).map((item, i) => (
                                                <a 
                                                    key={item.id || i} 
                                                    href={item?.url} 
                                                    style={{ padding: '0' }} 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAdClick(item?.id, item?.url);
                                                    }}
                                                    className="d-block mb-3"
                                                >
                                                    <img className='w-100 h-100' style={{ objectFit: 'cover', borderRadius: '4px' }} src={item?.image} alt={item?.title || 'Advertisement'} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {
                                        showNearbyTown &&

                                        <div className="col-lg-12 col-sm-6 col-12 px-lg-0 px-sm-3 p-0">
                                            {/* <div className="locations-box h-100">
                                            <div className="title">For Sale in Lahore</div>
                                            <div className="area-box" style={{ display: 'grid', gap: '8px' }}>
                                                <span>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">House for Sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">3 bedroom 4 bath house for sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">2 bedroom house for sale</div>
                                                </span>
                                                <Line color={'#353535ff'} />
                                                <span>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">All flat for sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">2 bedroom flat for sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">3 bedroom flat for sale</div>
                                                </span>
                                                <Line color={'#353535ff'} />
                                                <span>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">All property for sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">5 bedrooms for sale</div>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">3+2 bedroom for sale</div>
                                                </span>
                                                <Line color={'#353535ff'} />
                                                <span>
                                                    <div onClick={() => {
                                                        const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                        navigate(`/properties?${queryString}`)
                                                    }} className="area-name">All studios for sale</div>
                                                </span>
                                            </div>
                                        </div> */}

                                            <div className="locations-box h-100 d-sm-none" style={{ padding: showNearbyTown ? '' : '0', borderBottom: showNearbyTown ? '' : 'none', overflow: showNearbyTown ? 'unset' : 'hidden' }}>
                                                <div className="title d-flex align-items-center justify-content-between" onClick={() => setShowNearbyTown(!showNearbyTown)}>Nearby Town & cities

                                                    {
                                                        window.innerWidth <= 576 && showNearbyTown ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M6.85742 14.5715L12.0003 9.42868L17.1431 14.5715" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M6.85742 9.42871L12.0003 14.5716L17.1431 9.42871" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    showNearbyTown && (
                                                        <div className="row m-0">
                                                            <div className="col-12 p-0">
                                                                <div className="area-box" style={{ padding: "6px 16px" }}>
                                                                    {propertyCountLisitng?.areas?.slice(0, 20)?.map((item) => {
                                                                        return (
                                                                            <div onClick={() => {
                                                                                if (data?.location_id?.length > 0) {
                                                                                    const queryString = objectToQueryString({ ...data, location_id: [...data?.location_id, item?.area_id] });
                                                                                    navigate(`/properties?${queryString}`)
                                                                                } else {
                                                                                    const queryString = objectToQueryString({ ...data, location_id: [item?.area_id] });
                                                                                    navigate(`/properties?${queryString}`)
                                                                                }

                                                                            }} key={`mobile-near-town-${item?.area_id || item?.area_name}`} className="area-name">{item?.area_name}</div>
                                                                        )
                                                                    })}

                                                                </div>
                                                            </div>
                                                            {/* <div className="col-6 p-0">
                                                            {nearCities?.map((item) => (
                                                                <div onClick={() => {
                                                                    setFilterData({ ...filterData, city_code: item?.city_code, location_id: [] });
                                                                    const queryString = objectToQueryString({ ...data, city_code: item?.city_code, location_id: [] });
                                                                    navigate(`/properties?${queryString}`)
                                                                }} key={item?.id} className="area-name">{item?.name}</div>
                                                            ))}
                                                        </div> */}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-12 p-0" style={{ margin: '10px 0 20px' }}>
                            <Line />
                        </div>
                    </div>
                </div>
            </div >
            <NewsLetter open={newsLetterOpen} setOpen={setNewsLetterOpen} />
        </>
    )
}

export default CardSection

