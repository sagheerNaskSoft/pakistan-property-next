import React, { useEffect, useRef, useState, useMemo } from 'react'
import ListCard from '../Metiral/ListCard';
import GridCard from '../Metiral/GridCard';
import Breadcrumb from '../Metiral/BreadCrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import { LuFilter } from 'react-icons/lu';
import NotFound from '../Metiral/NoResultFound';
import ListingCardLoading from '../Metiral/ListingCardLoading';
import ProjectListCardLoading from '../Metiral/ProjectListCardLoading';
import CardLoding from '../Metiral/CardLoding';
function LisitngSection({ data, pagination, projectList, cityName, filterData, setFilterData, currencyRates, loadingRates, open, setOpen }) {
    const { projectTypeData, buildSearchPayload, objectToQueryString, getAd, addData, setAdData, adsClick, adsImpression , locationList } = useAuth()
    useEffect(() => {
        const fetchAds = async () => {
            if (!addData?.length) {
                const result = await getAd()
                if (result?.success) {
                    setAdData(result?.data?.data);

                }
            }
        }
        fetchAds()
    }, [])
    const inputRef = useRef(null)
    const trackedImpressionsRef = useRef(new Set()); // Prevent duplicate impression calls
    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInside = inputRef.current && inputRef.current.contains(event.target);

            if (!clickedInside) {
                setOrder(false)
                setShowCard(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const params = useParams()
    const selectedTypes = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === params?.slug)
    const [order, setOrder] = useState(false)
    const [grid, setGrid] = useState(false)
    const [cardNumber, setCardNumber] = useState("15")
    const [showCard, setShowCard] = useState(false)
    const navigate = useNavigate()
    const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setGrid(width <= 768);
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
        const payload = await buildSearchPayload({ ...filterData, current_page: goPage });
        const queryString = objectToQueryString(payload);

        // Navigate to new page with updated query string
        navigate(`/project-listing/${params.slug}?${queryString}`);
    };

    // Filter ads based on device type and ad type, sorted by priority
    const getFilteredAds = useMemo(() => {
        if (!addData || addData.length === 0) return { vertical: [], horizontal: [] };

        const filtered = addData.filter(ad => {
            if (ad.status !== 1) return false;
            const now = new Date();
            const startDate = new Date(ad.start_date);
            const endDate = new Date(ad.end_date);
            if (now < startDate || now > endDate) return false;
            const deviceTypes = ad.device_type || [];
            if (deviceTypes.includes('all') || deviceTypes.includes(deviceType)) {
                return true;
            }
            return false;
        });

        const verticalAds = filtered
            .filter(ad => ad.ad_type === 'vertical')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        const horizontalAds = filtered
            .filter(ad => ad.ad_type === 'horizontal')
            .sort((a, b) => (a.priority || 999) - (b.priority || 999));

        return { vertical: verticalAds, horizontal: horizontalAds };
    }, [addData, deviceType]);

    // Track ad impressions when ads are displayed
    useEffect(() => {
        const trackImpressions = async () => {
            // Top horizontal ad (index 0)
            if (getFilteredAds.horizontal.length > 0) {
                const ad = getFilteredAds.horizontal[0];
                if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                    trackedImpressionsRef.current.add(ad.id);
                    await adsImpression(ad.id);
                }
            }

            // Remaining horizontal ads
            if (getFilteredAds.horizontal.length > 1) {
                getFilteredAds.horizontal.slice(1).forEach(async (ad) => {
                    if (ad?.id && !trackedImpressionsRef.current.has(ad.id)) {
                        trackedImpressionsRef.current.add(ad.id);
                        await adsImpression(ad.id);
                    }
                });
            }

            // Vertical ads
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
        if (adId) {
            adsClick(adId).catch(err => console.error('Error tracking ad click:', err));
        }
        window.open(adUrl, '_blank', 'noopener,noreferrer');
    };

    // Mix projects with horizontal ads for list view
    // First ad after 1st card (index 0), then every 2-3 cards after that (alternating)
    const getMixedContent = useMemo(() => {
        const projects = projectList?.data || [];
        if (!projects.length) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const adsForMixing = horizontalAds.length > 0 ? horizontalAds : [];
        const items = [];
        let adIndex = 0;
        let nextAdAt = 0; // First ad after index 0
        let useTwoCards = true; // Start with 2 cards gap after first ad

        projects.forEach((proj, index) => {
            items.push({ type: 'project', data: proj, index });
            
            // Insert ad after current card if it's time
            if (index === nextAdAt && adIndex < adsForMixing.length) {
                items.push({ type: 'ad', data: adsForMixing[adIndex], index: `ad-${adIndex + 1}` });
                adIndex++;
                // Calculate next ad position: alternate between 2 and 3 cards
                if (adIndex === 1) {
                    // After first ad, next is 2 cards later
                    nextAdAt = index + 2;
                    useTwoCards = false; // Next will be 3 cards
                } else {
                    // Alternate: 2 cards or 3 cards
                    nextAdAt = index + (useTwoCards ? 2 : 3);
                    useTwoCards = !useTwoCards; // Toggle for next time
                }
            }
        });

        return items;
    }, [projectList?.data, getFilteredAds.horizontal]);

    // Mix projects with horizontal ads for grid view
    // First ad after 2 cards (index 1), then every 4 cards after that (index 5, 9, 13, etc.)
    const getGridMixedContent = useMemo(() => {
        const projects = projectList?.data || [];
        if (!projects.length) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const adsForMixing = horizontalAds.length > 0 ? horizontalAds : [];
        const items = [];
        let adIndex = 0;

        projects.forEach((proj, index) => {
            items.push({ type: 'project', data: proj, index });
            if (adsForMixing.length > 0 && adIndex < adsForMixing.length) {
                // First ad after 2nd card (index 1), then every 4 cards after that (index 5, 9, 13, etc.)
                const shouldInsertAd = index === 1 || (index > 1 && (index - 1) % 4 === 0);
                if (shouldInsertAd) {
                    items.push({ type: 'ad', data: adsForMixing[adIndex], index: `ad-${adIndex + 1}` });
                    adIndex++;
                }
            }
        });

        return items;
    }, [projectList?.data, getFilteredAds.horizontal]);

    const renderHorizontalAd = (ad) => (
        <div className="col-12 px-lg-3 px-2">
            <a
                href={ad.url}
                onClick={(e) => {
                    e.preventDefault();
                    handleAdClick(ad.id, ad.url);
                }}
                className="global-horizontal-ad-box w-100 mt-3 d-block"
            >
                <img src={ad.image} alt={ad.title || 'Advertisement'} className="w-100" />
            </a>
        </div>
    );

    return (
        <div className='listing_project_section'>
            {/* <Breadcrumb /> */}
            <div className='row m-0'>
                <div className='col-lg-9 col-md-12 p-0'>
                    <div className="d-flex justify-content-between align-items-center">
                        <Breadcrumb
                            items={["Home", selectedTypes?.name, `Projects in ${cityName}`]} paths={["/", `${selectedTypes?.name == "Housing Societies" ? "/new-projects/housing-societies" : "/new-projects/high-rise"}`]} />
                        <div className="card-section pt-0">
                            <div className="filter d-lg-none d-flex align-items-center gap-2 ms-auto" onClick={() => setOpen(!open)}>
                                Filter <LuFilter />
                            </div>
                        </div>
                    </div>

                    <div className='row m-0'>
                        <div className="col-lg-10 col-md-6 col-12 p-0">
                            <div className="heading">
                                {selectedTypes?.name} in {data?.location_id?.length ? locationList?.filter((item) => data?.location_id.map(Number).includes(item?.id)).map((item) => item?.name).join(", ") : ""}{data?.location_id?.length && cityName ? ', ' : ''}{cityName} <span>({pagination?.total})</span>
                            </div>
                            <div className="d-sm-none d-flex align-items-center justify-content-between gap-2">
                                <div className='pagination_value'>
                                    <span>{pagination?.current_page}-{pagination?.per_page} of {pagination?.total} projects</span>
                                </div>
                                <div className="card-order d-sm-none d-flex m-0" ref={inputRef}>
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
                                    {
                                        order ?
                                            <>
                                                <div className="input-drop-menu">
                                                    <div className={filterData?.sorting === "popular" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "popular" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "popular" });
                                                        navigate(`/project-listing/${params?.slug}?${queryString}`)
                                                    }}>Popular</div>
                                                    <div className={filterData?.sorting === "low_price" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "low_price" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "low_price" });
                                                        navigate(`/project-listing/${params?.slug}?${queryString}`)
                                                    }}>Low Price</div>
                                                    <div className={filterData?.sorting === "high_price" ? "title active" : "title"} onClick={() => {
                                                        setFilterData({ ...filterData, sorting: "high_price" }); setOrder(false)
                                                        const queryString = objectToQueryString({ ...data, sorting: "high_price" });
                                                        navigate(`/project-listing/${params?.slug}?${queryString}`)
                                                    }}>High Price</div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-12 d-sm-flex d-none align-items-end justify-content-end ps-0">

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


                    </div>
                </div>


            </div>
            
            <div className='row m-0 px-0 ' style={{ paddingBottom: '30px' }}>
                <div className='listing_section col-lg-9 col-md-12'>
                    {/* Loading state */}
                    {(!projectList || projectList?.data === undefined) ? (
                        <>
                            {grid ? (
                                <div className="row">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="col-lg-6 col-md-12 px-lg-3 px-2 mt-3">
                                            <CardLoding />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {[...Array(4)].map((_, index) => (
                                        <ProjectListCardLoading key={index} />
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {/* No projects found message */}
                            {!getMixedContent.length && projectList?.data?.length === 0 && (
                                <div style={{ marginTop: "10px", marginBottom: "16px" }}>
                                    <NotFound message="No projects found" />
                                </div>
                            )}

                            {grid ? (
                                <>
                                    <div className="row">
                                        {getGridMixedContent.map((item) => {
                                            if (item.type === 'project') {
                                                return (
                                                    <div key={item.data?.id || item.index} className="col-lg-6 col-md-12 px-lg-3 px-2">
                                                        <GridCard data={item.data} currencyRates={currencyRates} loadingRates={loadingRates} />
                                                    </div>
                                                );
                                            } else if (item.type === 'ad') {
                                                return (
                                                    <div key={item.data.id} className="col-12 px-lg-3 px-2">
                                                        <a
                                                            href={item.data.url}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleAdClick(item.data.id, item.data.url);
                                                            }}
                                                            className="global-horizontal-ad-box w-100 mt-3 d-block"
                                                        >
                                                            <img src={item.data.image} alt={item.data.title || 'Advertisement'} className="w-100" />
                                                        </a>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {getMixedContent.map((item, idx) => {
                                        if (item.type === 'project') {
                                            return (
                                                <ListCard
                                                    key={item.data?.id || item.index}
                                                    data={item.data}
                                                    featuer={idx === 0}
                                                    currencyRates={currencyRates}
                                                    loadingRates={loadingRates}
                                                />
                                            );
                                        } else if (item.type === 'ad') {
                                            return (
                                                <a
                                                    key={item.data.id}
                                                    href={item.data.url}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAdClick(item.data.id, item.data.url);
                                                    }}
                                                    className="global-horizontal-ad-box w-100 mt-3 d-block"
                                                >
                                                    <img src={item.data.image} alt={item.data.title || 'Advertisement'} className="w-100" />
                                                </a>
                                            );
                                        }
                                        return null;
                                    })}
                                </>
                            )}
                        </>
                    )}
                    {pagination?.total_pages > 1 && <div className="col-12 mt-4">

                        <div className="row w-100 m-0 justify-content-end align-items-center" style={{ gap: '20px 80px' }}>
                            <div className="col-md-4 col-sm-6 col-12 order-sm-first order-last p-0 mb-sm-0 mb-3">
                                <div className="pagination w-lg-unset w-100 justify-content-md-center justify-content-sm-start justify-content-center">
                                    <div className="move-btn back" onClick={() => handlePageChange({ action: "back" })}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.2329 4.18414C10.4626 4.423 10.4551 4.80282 10.2163 5.0325L7.06605 8L10.2163 10.9675C10.4551 11.1972 10.4626 11.577 10.2329 11.8159C10.0032 12.0547 9.62339 12.0622 9.38452 11.8325L5.78452 8.4325C5.66688 8.31938 5.60039 8.16321 5.60039 8C5.60039 7.83679 5.66688 7.68062 5.78452 7.5675L9.38452 4.1675C9.62339 3.93782 10.0032 3.94527 10.2329 4.18414Z" fill="#737678" />
                                        </svg>
                                        BACK
                                    </div>

                                    {Array.from({ length: pagination?.total_pages }, (_, i) => i + 1)?.map((num, index) => (
                                        <div
                                            key={index}
                                            className={`page-number ${pagination?.current_page === num ? 'active' : ''}`}
                                            onClick={() => handlePageChange({ action: "pageChange", page_number: num })}
                                        >
                                            {num}
                                        </div>
                                    ))}

                                    <div className="move-btn next" onClick={() => handlePageChange({ action: "next" })}>
                                        NEXT
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.76711 11.8159C5.53743 11.577 5.54488 11.1972 5.78374 10.9675L8.93395 8L5.78374 5.0325C5.54488 4.80282 5.53743 4.423 5.76711 4.18413C5.99679 3.94527 6.37661 3.93782 6.61548 4.1675L10.2155 7.5675C10.3331 7.68062 10.3996 7.83679 10.3996 8C10.3996 8.16321 10.3331 8.31938 10.2155 8.4325L6.61548 11.8325C6.37661 12.0622 5.99679 12.0547 5.76711 11.8159Z" fill="#737678" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-4 p-0 d-sm-block d-none">
                                <div className="card-showing-box">
                                    <div className="text" onClick={() => setShowCard(!showCard)}>Result per page</div>
                                    <div className="box" onClick={() => setShowCard(!showCard)}>{cardNumber}
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
                                                        <div className="title" onClick={() => { setCardNumber("05"); setShowCard(false) }}>05</div>
                                                        <div className="title" onClick={() => { setCardNumber("10"); setShowCard(false) }}>10</div>
                                                        <div className="title" onClick={() => { setCardNumber("15"); setShowCard(false) }}>15</div>
                                                        <div className="title" onClick={() => { setCardNumber("20"); setShowCard(false) }}>20</div>
                                                        <div className="title" onClick={() => { setCardNumber("25"); setShowCard(false) }}>25</div>
                                                        <div className="title" onClick={() => { setCardNumber("30"); setShowCard(false) }}>30</div>
                                                    </div>
                                                </>
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>}
                </div>
                <div className='col-3 d-lg-inline-block d-none pe-0'>
                    <div className=' mt-lg-3 mt-sm-4 mt-3'>
                        {getFilteredAds.vertical.map((item, idx) => {
                            return (
                                <a 
                                    key={item.id || idx}
                                    href={item?.url} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAdClick(item?.id, item?.url);
                                    }}
                                >
                                    <div style={{ marginBottom: `${"22.55px"}` }} className='img_adds'>
                                        <img className='w-100' src={item?.image} alt={item?.title || 'Advertisement'} />
                                    </div>
                                </a>
                            )
                        })}

                    </div>
                </div>

            </div>


            {/* <hr className='d-sm-block d-none' style={{ marginTop: "30px" }} /> */}
        </div>
    )
}

export default LisitngSection