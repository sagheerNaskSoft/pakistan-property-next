import bank from '../../../Asset/Property Index/bank-img.svg'
import Breadcrumb from '../../Metiral/BreadCrumb'
import PrimaryButton from '../../Metiral/Button/PrimaryButton'
import LoanModel from '../../Metiral/LoanModel'
import { useState, useEffect, useMemo, useRef } from 'react'
import { LuFilter } from 'react-icons/lu'
import { useAuth } from '../../../Context/ContextProvider'
import Image from 'next/image';
const monthly = <svg width="28" height="28" viewBox="0 0 36 36" size="28"><circle cx="18" cy="18" r="18" fill="#f5f5f5"></circle><path d="M17.376,13.1V5.82A1.825,1.825,0,0,0,15.557,4H2.82A1.825,1.825,0,0,0,1,5.82V13.1a1.825,1.825,0,0,0,1.82,1.82H15.557A1.825,1.825,0,0,0,17.376,13.1Zm-1.82,0H2.82V5.82H15.557ZM9.188,6.729a2.729,2.729,0,1,0,2.729,2.729A2.726,2.726,0,0,0,9.188,6.729Zm11.827,0V16.737a1.825,1.825,0,0,1-1.82,1.82H3.729v-1.82H19.2V6.729Z" transform="translate(7.012 6.741)" fill="#737678"></path></svg>
const initial = <svg width="28" height="28" viewBox="0 0 28 28" size="28"><circle cx="14" cy="14" r="14" fill="#f5f5f5"></circle><path d="M4.292,7.315v4.523H6.23V7.315Zm3.877,0v4.523h1.938V7.315ZM3,15.068H15.276V13.13H3Zm9.045-7.753v4.523h1.938V7.315ZM9.138,1.5,3,4.73V6.023H15.276V4.73Z" transform="translate(4.973 5.827)" fill="#737678"></path></svg>
const interest = <svg width="28" height="28" viewBox="0 0 28 28" size="28"><circle cx="14" cy="14" r="14" fill="#f5f5f5"></circle><path d="M2.871,7.371a1.682,1.682,0,1,0-2.379,0A1.682,1.682,0,0,0,2.871,7.371ZM9.6,11.721a1.682,1.682,0,1,0,0,2.379A1.682,1.682,0,0,0,9.6,11.721ZM9.548,5.638l-.595-.595a.841.841,0,0,0-1.189,0L.544,12.265a.841.841,0,0,0,0,1.189l.595.595a.841.841,0,0,0,1.189,0L9.548,6.827A.841.841,0,0,0,9.548,5.638Z" transform="translate(8.954 4.454)" fill="#737678"></path></svg>
const type = <svg width="28" height="28" viewBox="0 0 28 28" size="28"><circle cx="14" cy="14" r="14" fill="#f5f5f5"></circle><path d="M3.615,8.961A1.115,1.115,0,1,0,4.73,10.076,1.114,1.114,0,0,0,3.615,8.961Zm0-4.461A1.115,1.115,0,1,0,4.73,5.615,1.114,1.114,0,0,0,3.615,4.5Zm0,8.922A1.115,1.115,0,1,0,4.73,14.537,1.119,1.119,0,0,0,3.615,13.422Zm2.974,1.859h8.922a.743.743,0,0,0,0-1.487H6.589a.743.743,0,1,0,0,1.487Zm0-4.461h8.922a.743.743,0,0,0,0-1.487H6.589a.743.743,0,1,0,0,1.487Zm-.743-5.2a.746.746,0,0,0,.743.743h8.922a.743.743,0,0,0,0-1.487H6.589A.746.746,0,0,0,5.846,5.615Z" transform="translate(4.623 3.924)" fill="#737678"></path></svg>

function Listing({ data, filterData, adData, setFilterData, setFilterOpen }) {
    const { adsClick, adsImpression } = useAuth()
    const imgArray = [bank];
    const [closedAds, setClosedAds] = useState([]);
    const [open, setOpen] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState(null)
    const [deviceType, setDeviceType] = useState('desktop'); // 'mobile', 'tablet', 'desktop'
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const trackedImpressionsRef = useRef(new Set()); // Track which ad IDs have already been tracked
    const [formData, setformData] = useState({
        name: "",
        email: "",
        phone: "",
        cnic: "",
        city: "",
        priceRange: { min: "75000", max: "100000", priceValue: "PKR" }
    })

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
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
    }, [])

    const handleClose = () => setOpen(false);

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) return `${(num / 1_00_00_00_000).toFixed(2)} Billion`
        else if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(2)} Crore`
        else if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(2)} Lakh`
        else if (num >= 1_000) return `${(num / 1_000).toFixed(2)} Thousand`
        else if (num >= 1_00) return `${(num / 1_00).toFixed(2)} Hundred`
        return num?.toLocaleString()
    }

    const filteredData = data?.data?.filter((item) =>
        !filterData?.loanType ||
        item?.type?.toLowerCase() === filterData?.loanType?.toLowerCase() ||
        filterData?.loanType?.toLowerCase() === "all"
    )

    // Filter ads based on device type and ad type, sorted by priority
    const getFilteredAds = useMemo(() => {
        if (!adData || !Array.isArray(adData) || adData.length === 0) return { vertical: [], horizontal: [] };

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
            // Track horizontal ad impressions
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

    // Mix loan cards with horizontal ads - show after every 2 cards (darmiyan darmiyan)
    const getMixedContent = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];

        const horizontalAds = getFilteredAds.horizontal;
        const items = [];
        let adIndex = 0;

        filteredData.forEach((loan, index) => {
            items.push({ type: 'loan', data: loan, index });

            // Insert horizontal ad after every 2 cards (after 2nd, 4th, 6th, etc.)
            // Only insert if there are ads available and not all ads have been used
            if (horizontalAds.length > 0 && adIndex < horizontalAds.length) {
                // After 2nd card (index 1), 4th card (index 3), 6th card (index 5), etc.
                const shouldInsertAd = (index + 1) % 2 === 0;
                if (shouldInsertAd) {
                    items.push({ type: 'ad', data: horizontalAds[adIndex], index: `ad-${adIndex}` });
                    adIndex++; // Move to next ad, don't cycle (no repeat until all ads shown)
                }
            }
        });

        return items;
    }, [filteredData, getFilteredAds.horizontal]);

    return (
        <>
            <div className="loan-listing-section">
                <div className="d-flex align-items-center justify-content-between">
                <Breadcrumb items={['Home', 'Loan Calculator', 'Loan Options']} paths={["/", "/loan-calculator"]} />
                    <div className="filter d-md-none d-flex mb-0" style={{width:"fit-content", alignItems:"center" , gap:"8px"}} onClick={() => setFilterOpen(true)}>Filter <LuFilter /></div>
                </div>
                <div className="title">Rate of Interests and Loan Options</div>
                <div className="row">
                    <div className="col-lg-9">
                        <div className="card-section">
                            {getMixedContent.length > 0 ? (
                                getMixedContent.map((contentItem) => {
                                    if (contentItem.type === 'loan') {
                                        const item = contentItem.data;
                                        let monthlyInstallment
                                        let downPayment
                                        let onePercentPrice = Number(filterData?.propertyPrice) / 100;

                                        if (item?.kibor) {
                                            let kiborValue = Number(onePercentPrice) * Number(item?.kibor);
                                            let interestValue = Number(onePercentPrice) * Number(item.margin);
                                            let kiborPlusInterest = Number(kiborValue) + Number(interestValue);
                                            let totalAmout = Number(filterData?.propertyPrice) + Number(kiborPlusInterest);
                                            downPayment = Number(filterData?.downPayment) * Number(onePercentPrice);
                                            let remaingAmout = Number(totalAmout) - Number(downPayment);
                                            let totalMonths = Number(filterData?.loanPeriod) * 12;
                                            monthlyInstallment = Number(remaingAmout) / Number(totalMonths);
                                        } else {
                                            let interestValue = Number(onePercentPrice) * Number(item.margin);
                                            let totalAmout = Number(filterData?.propertyPrice) + Number(interestValue);
                                            downPayment = Number(filterData?.downPayment) * Number(onePercentPrice);
                                            let remaingAmout = Number(totalAmout) - Number(downPayment);
                                            let totalMonths = Number(filterData?.loanPeriod) * 12;
                                            monthlyInstallment = Number(remaingAmout) / Number(totalMonths);
                                        }

                                        return (
                                            <div className="listing-card" key={item.id}>
                                                <div className="row m-0">
                                                    <div className="col-sm-9 p-0">
                                                        <div className="title">{item?.title}</div>
                                                        <div className="card-details-box row">
                                                            <div className="col-xl-4 col-lg-6 col-md-4 col-6">
                                                                <div className="box">
                                                                    <div className="icon">{monthly}</div>
                                                                    <div className="text-box">
                                                                        <div className="label">Monthly Installments</div>
                                                                        <div className="value">{formatNumber(monthlyInstallment)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-4 col-6">
                                                                <div className="box">
                                                                    <div className="icon">{initial}</div>
                                                                    <div className="text-box">
                                                                        <div className="label">Initial Deposit</div>
                                                                        <div className="value">{formatNumber(downPayment)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-4 col-6">
                                                                <div className="box">
                                                                    <div className="icon">{interest}</div>
                                                                    <div className="text-box">
                                                                        <div className="label">Interest</div>
                                                                        <div className="value">{item?.kibor ? "Kibor +" : ""} {parseInt(item?.margin)?.toFixed(1)}%</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-4 col-6">
                                                                <div className="box">
                                                                    <div className="icon">{type}</div>
                                                                    <div className="text-box">
                                                                        <div className="label">Loan Type</div>
                                                                        <div className="value" style={{ textTransform: "capitalize" }}>{item?.type}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 p-0 mt-lg-0">
                                                        <div className="img-box">
                                                            <div className="loan-img">
                                                                <Image src={item?.logo || bank} alt="Bank Logo" />
                                                            </div>
                                                            <div
                                                                className="button"
                                                                onClick={() => {
                                                                    setSelectedLoan({
                                                                        item,
                                                                        monthlyInstallment,
                                                                        downPayment
                                                                    })
                                                                    setOpen(true)
                                                                }}
                                                            >
                                                                <PrimaryButton widthSize={"100%"} text={"Apply For Loan"} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else if (contentItem.type === 'ad') {
                                        return (
                                            <div key={contentItem.data.id} className="w-100 mt-4">
                                                <a 
                                                    href={contentItem.data.url} 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAdClick(contentItem.data.id, contentItem.data.url);
                                                    }}
                                                    className="global-horizontal-ad-box w-100 d-block"
                                                >
                                                    <Image src={contentItem.data.image} alt={contentItem.data.title || 'Advertisement'} className="w-100" />
                                                </a>
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            ) : (
                                <div className="no-results text-center py-5">
                                    <Image
                                        src="https://cdn-icons-png.flaticon.com/512/7486/7486761.png"
                                        alt="No results"
                                        style={{ width: "120px", opacity: 0.7, marginBottom: "15px" }}
                                    />
                                    <h5>No Loan Options Found</h5>
                                    <p className="text-muted">Try adjusting your filters or changing the loan type to see available options.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-3 mt-lg-0 mt-md-5 mt-3" style={{ paddingTop: '8px' , display:'flex' , flexDirection:'column' , gap:"12px" }}>
                        {getFilteredAds.vertical.length > 0 ? (
                            getFilteredAds.vertical.map((item, index) => (
                                closedAds.includes(item.id) ? null : (
                                    <div key={item.id} className="d-flex" style={{ gap: "10px", flexWrap: 'wrap' }}>
                                        <div style={{height:"auto"}} className="ad-global-box">
                                            <a 
                                                href={item?.url} 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAdClick(item?.id, item?.url);
                                                }}
                                            >
                                                <Image src={item?.image} alt={item?.title || 'Advertisement'} />
                                            </a>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="no-ad-results text-center py-5">
                                <Image
                                    src="https://cdn-icons-png.flaticon.com/512/7486/7486761.png"
                                    alt="No results"
                                    style={{ width: "120px", opacity: 0.7, marginBottom: "15px" }}
                                />
                                <h5>No Ads Found</h5>
                            </div>
                        )}

                    </div>
                </div>
                <div className="banking-partners">
                    <div className="title">
                        Banking Partners
                    </div>
                    <div className="bank-img-container">
                        {imgArray?.map((item) => (
                            <div className="img"><Image src={item} alt="" /></div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedLoan && selectedLoan.item && (
                <LoanModel
                    installmentValues={{
                        monthlyInstalment: selectedLoan.monthlyInstallment || 0,
                        bankFinace: (filterData?.propertyPrice || 0) - (selectedLoan.downPayment || 0)
                    }}
                    planData={{
                        plan: selectedLoan.item,
                        property_price: filterData?.propertyPrice || 0,
                        loanPeriod: filterData?.loanPeriod || 20,
                        down_payment: filterData?.downPayment || 30
                    }}
                    open={open}
                    handleClose={handleClose}
                />
            )}
        </>
    )
}

export default Listing
