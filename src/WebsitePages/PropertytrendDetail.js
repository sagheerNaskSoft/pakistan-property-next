import React, { useEffect, useState, useRef } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/PropertytrendDetail/Banner'
import SearchedTrend from '../Component/PropertytrendDetail/SearchedTrend'
import SearchChart from '../Component/PropertytrendDetail/SearchChart'
import SearchedGraph from '../Component/PropertytrendDetail/SearchedGraph'
import FAQ from '../Component/PropertyIndex/FAQS'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'
import { LuFilter } from 'react-icons/lu';
import BreadCrumb from '../Component/Metiral/BreadCrumb'
function PropertytrendDetail() {
    const { parseQueryParams, filterPropertyTrends, objectToQueryString, getLOcation, setLocationList, citiesList, locationList, propertyType, loading } = useAuth()
    const [filterData, setFilterData] = useState({
        purpose: '',
        city: "",
        location: ""
    });
    const [parsedData, setParsedData] = useState()
    const [locationName, setLocationName] = useState("")
    const [data, setData] = useState()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const parsed = await parseQueryParams(location.search);
            setParsedData(parsed)
            let result = await filterPropertyTrends({ ...parsed, blocks_data: parsed?.location_id ? true : false })
            if (result?.success) {
                setData(result?.data?.data)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.search])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100dvh';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = '';
        }


        return;
    }, [open]);


    const hasFetchedLocation = useRef(false); // New reference
    const previousLocationId = useRef(null); // Track previous location_id
    useEffect(() => {
        const fetchData = async () => {
            const parsed = await parseQueryParams(location.search);

            const city = citiesList?.find(item => item?.app_code === parsed?.city_code);
            const propertyTypeId = propertyType?.find(item => item?.id === parseInt(parsed?.property_type_id));

            // Reset flag if location_id changed or was removed
            if (previousLocationId.current !== parsed?.location_id) {
                hasFetchedLocation.current = false;
                previousLocationId.current = parsed?.location_id;
            }

            // Clear locationName if location_id is not present
            if (!parsed?.location_id) {
                setLocationName("");
                setFilterData({
                    purpose: propertyTypeId,
                    city: city,
                    location: null,
                });
                return;
            }

            let locationData = locationList?.find(item => {
                if (item?.id === parseInt(parsed?.location_id)) {
                    setLocationName(item?.name);
                    return true;
                }
                return false;
            });

            // Only fetch if not already fetched and locationData is missing
            if (!locationData && !hasFetchedLocation.current && parsed?.location_id) {
                hasFetchedLocation.current = true; // prevent future calls
                try {
                    const locationResult = await getLOcation({
                        city_code: parsed?.city_code,
                    });
                    setLocationList(locationResult?.data || []);
                    locationData = locationResult?.data?.find(item => {
                        if (item?.id === parseInt(parsed?.location_id)) {
                            setLocationName(item?.name);
                            return true;
                        }
                        return false;
                    });
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }
            }

            setFilterData({
                purpose: propertyTypeId,
                city: city,
                location: locationData,
            });
        };

        fetchData();
        // Remove locationList from dep array to prevent re-run on setLocationList
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [citiesList, propertyType, location.search]);



    const faqData = [
        {
            question: "What is Pakistan Property Trends?",
            answer:
                "Pakistan Property Trends is a real estate Trends that measures the performance of the real estate sector in Pakistan. It provides comprehensive data and historical trends of property prices in different societies and cities in Pakistan"
        },
        {
            question: "Is Pakistan Property Trends reliable?",
            answer:
                "Pakistan Property Trends is a highly reliable and trusted source for accurate market insights and real estate trends across Pakistan."
        },
        {
            question: "Can I use Pakistan Property Trends to make investment decisions?",
            answer:
                "Yes, you can confidently use Pakistan Property Trends to make informed investment decisions, as it provides accurate data, market insights, and trend analyses to guide you effectively."
        },
        {
            question: "Can I use Pakistan Property Trends to make investment decisions?",
            answer:
                "Yes, Pakistan Property Trends provides reliable market insights and data to help you make well-informed real estate investment decisions."
        },
        {
            question: "How frequently is Pakistan Property Trends updated?",
            answer:
                "Pakistan Property Trends is updated regularly, ensuring you always have access to the latest property listings, market insights, and trend analyses."
        }
    ];

    const para = "Find quick answers to common questions about listings, pricing, and property searches on our platform. Your go-to guide for understanding how to explore and manage properties with ease."
    const navigate = useNavigate()
    const handleNaviagte = async (dataSearch) => {
        const queryString = objectToQueryString(dataSearch);
        navigate(`/property-trend-detail?${queryString}`)
    }

    return (
        <div>
            <NavBar prevButton={true} />
            <Banner filterData={filterData} setFilterData={setFilterData} open={open} setOpen={setOpen} />
            <div className="secondary-color secondary-trend-box" style={{ paddingTop: "60px" }}>
                <div className="main-container" style={{ marginBottom: '32px' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <BreadCrumb
                            items={[
                                'Home',
                                "Property Trends",
                                filterData?.city?.city || null,
                                locationName || null
                            ]}
                            paths={[
                                '/',
                                '/property-trend',
                                parsedData?.city_code ? `/property-trend-detail?property_type_id=1&city_code=${parsedData.city_code}` : '/property-trend-detail',
                                null
                            ]}
                        />
                        <div className="filter d-sm-none d-flex align-items-center gap-2 ms-auto" onClick={() => setOpen(!open)}>
                            Filter <LuFilter />
                        </div>
                    </div>
                </div>
                {loading ? (
                    <>
                        {/* SearchedTrend skeleton (most searched properties) */}
                        <div className="main-container mb-5">
                            <div className="placeholder-glow">
                                {/* Heading */}
                                <div className='placeholder mb-4' style={{ width: '300px', height: '32px' }} />

                                {/* Cards grid skeleton */}
                                <div className="row m-0" style={{ gap: '20px 0' }}>
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                                            <div className="placeholder placeholder-glow" style={{ width: '100%', height: '106px', borderRadius: '8px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SearchChart skeleton (table/chart section) */}
                        <div className="main-container mb-5">
                            <div className="placeholder-glow">
                                {/* Heading */}
                                <div className='placeholder mb-4' style={{ width: '250px', height: '32px' }} />

                                {/* Chart/Graph skeleton */}
                                <div className='placeholder mb-4' style={{ width: '100%', height: '400px', borderRadius: '8px' }} />

                                {/* Table skeleton */}
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                {[...Array(5)].map((_, index) => (
                                                    <th key={index} className="placeholder-glow">
                                                        <div className='placeholder' style={{ width: '100px', height: '20px' }} />
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(8)].map((_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {[...Array(5)].map((_, colIndex) => (
                                                        <td key={colIndex} className="placeholder-glow">
                                                            <div className='placeholder' style={{ width: '80px', height: '20px' }} />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* FAQ skeleton */}
                        <div className="main-container mb-5">
                            <div className="placeholder-glow">
                                {/* Heading */}
                                <div className='placeholder mb-3' style={{ width: '200px', height: '32px' }} />
                                {/* Description */}
                                <div className='placeholder mb-4' style={{ width: '100%', height: '20px' }} />
                                <div className='placeholder mb-4' style={{ width: '90%', height: '20px' }} />

                                {/* FAQ items skeleton */}
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="border rounded p-3 mb-3" style={{ borderRadius: '8px' }}>
                                        <div className="placeholder-glow">
                                            <div className='placeholder mb-2' style={{ width: '80%', height: '24px' }} />
                                            <div className='placeholder mb-1' style={{ width: '100%', height: '18px' }} />
                                            <div className='placeholder' style={{ width: '95%', height: '18px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PreLocation and PreProperty skeleton */}
                        <div className="main-container">
                            <div className="placeholder-glow mb-4">
                                <div className='placeholder mb-3' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                            </div>
                            <div className="placeholder-glow">
                                <div className='placeholder' style={{ width: '100%', height: '300px', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {!parsedData?.location_id ? (
                            loading || data === undefined ? (
                                // SearchedTrend placeholder
                                <div className="main-container mb-5">
                                    <div className="placeholder-glow">
                                        {/* Heading */}
                                        <div className='placeholder mb-4' style={{ width: '300px', height: '32px' }} />
                                        
                                        {/* Cards grid skeleton */}
                                        <div className="row m-0" style={{ gap: '20px 0' }}>
                                            {[...Array(4)].map((_, index) => (
                                                <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                                                    <div className="placeholder placeholder-glow" style={{ width: '100%', height: '106px', borderRadius: '8px' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <SearchedTrend data={data?.most_searched_properties_categorywise?.original?.data || []} cityName={filterData?.city?.city} />
                            )
                        ) : (
                            loading || data === undefined ? (
                                // SearchedGraph placeholder
                                <div className="main-container mb-5">
                                    <div className="row">
                                        {/* Heading and dropdown */}
                                        <div className="d-flex justify-content-between align-items-sm-center align-items-baseline mb-4" style={{ width: "100%", gap: '12px' }}>
                                            <div className='placeholder placeholder-glow' style={{ width: '250px', height: '32px' }} />
                                            <div className='placeholder placeholder-glow' style={{ width: '128px', height: '36px', borderRadius: '8px' }} />
                                        </div>
                                        
                                        {/* Graph skeleton */}
                                        <div className="col-lg-8">
                                            <div className="placeholder-glow" style={{ borderRadius: '8px', padding: '20px', backgroundColor: 'white' }}>
                                                <div className='placeholder placeholder-glow' style={{ width: '100%', height: '366px', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="placeholder-glow" style={{ borderRadius: '8px', padding: '20px', backgroundColor: 'white', height: '100%' }}>
                                                <div className='placeholder mb-3' style={{ width: '100%', height: '24px' }} />
                                                <div className='placeholder mb-4' style={{ width: '100%', height: '20px' }} />
                                                <div className='placeholder placeholder-glow' style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <SearchedGraph graphData={data?.location_monthly_trend} locationName={locationName} />
                            )
                        )}
                        <SearchChart handleNaviagte={handleNaviagte} tableData={data?.category_wise_city_area_trend?.data} cityName={filterData?.city?.city} setLocationName={setLocationName} locationName={locationName} />
                        <FAQ faqData={faqData} para={para} />
                        <div className="main-container">
                            <PreLocation />
                            <PreProperty />
                        </div>
                    </>
                )}
            </div>
            <div className="main-container">
                <Footer />
            </div>
        </div>
    )
}

export default PropertytrendDetail
