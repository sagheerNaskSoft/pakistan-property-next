import SingleMenuFeild from '../../Metiral/InputField/SingleMenuFeild/SingleMenuFeild';
import PrimaryButton from '../../Metiral/Button/PrimaryButton';
import './Banner.css';
import CustomSingleSelect from '../../Metiral/CustomSingleSelect ';
import RangeMenuFeild from '../../Metiral/InputField/RangeMenuField/RangeMenuFeild';
import MultiMenuField from '../../Metiral/InputField/MultiMenuField/MultiMenuField';
import { useEffect, useState } from 'react';
import BreadCrumb from '../../Metiral/BreadCrumb'
import { useAuth } from '../../../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';

import Image from 'next/image';
function Banner({propertySubType, setPropertySubType, breadcrumb, heading, para, filterData, setFilterData, image, pageType }) {
    const icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18.4379 17.8325L14.9589 14.3535C15.907 13.194 16.3731 11.7144 16.2609 10.2208C16.1487 8.72721 15.4667 7.33389 14.356 6.32905C13.2453 5.3242 11.7908 4.7847 10.2935 4.82214C8.79619 4.85958 7.37054 5.47109 6.31144 6.53019C5.25234 7.58929 4.64083 9.01494 4.60339 10.5123C4.56595 12.0096 5.10545 13.464 6.1103 14.5747C7.11514 15.6854 8.50846 16.3674 10.002 16.4796C11.4956 16.5919 12.9752 16.1257 14.1347 15.1776L17.6138 18.6567C17.7237 18.7629 17.8709 18.8216 18.0238 18.8203C18.1766 18.819 18.3228 18.7577 18.4308 18.6496C18.5389 18.5415 18.6002 18.3953 18.6015 18.2425C18.6029 18.0897 18.5441 17.9425 18.4379 17.8325ZM10.4488 15.3303C9.52654 15.3303 8.62503 15.0569 7.85823 14.5445C7.09143 14.0322 6.49378 13.3039 6.14086 12.4519C5.78795 11.5999 5.69561 10.6623 5.87552 9.75784C6.05544 8.85334 6.49953 8.0225 7.15164 7.37039C7.80375 6.71828 8.63459 6.27419 9.53909 6.09427C10.4436 5.91436 11.3811 6.0067 12.2332 6.35961C13.0852 6.71253 13.8134 7.31018 14.3258 8.07698C14.8381 8.84378 15.1116 9.74529 15.1116 10.6675C15.1102 11.9037 14.6185 13.089 13.7444 13.9631C12.8702 14.8373 11.685 15.329 10.4488 15.3303Z" fill="white" />
    </svg>

    const { citiesList, locationList, getLOcation,buildSearchPayloadProperty,objectToQueryString, setLocationList, propertyType, currentCity, areaUnit } = useAuth()
    useEffect(() => {
        const updateFiltersAndFetch = async () => {
            let updatedFilterData = { ...filterData };
            const slug = window.location.pathname.split('/property-for-')[1]

            if (propertyType?.length) {
                updatedFilterData.property_type_id = propertyType?.find((item) => item?.slug === slug)?.id;
                setPropertySubType(propertyType?.find((item) => item?.slug === slug)?.categories)
            }
            if (currentCity?.app_code) {
                updatedFilterData.city = currentCity;
                // Clear area/location when city changes
                updatedFilterData.area = [];
            }
            // update state
            setFilterData((prev) => ({ ...prev, ...updatedFilterData }));

            // fetch locations only if city changed
            if (updatedFilterData?.city?.app_code) {
                try {
                    const locationResult = await getLOcation({
                        city_code: updatedFilterData.city.app_code,
                    });
                    setLocationList(locationResult?.data || []);
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }
            }
        };

        updateFiltersAndFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyType, currentCity]); // 👈 only depend on propertyType & city
    const PriceValue = [
        { code: "USD", symbol: "$" },
        { code: "EUR", symbol: "€" },
        { code: "GBP", symbol: "£" },
        { code: "SAR", symbol: "ر.س" },
        { code: "AED", symbol: "د.إ" },
        { code: "PKR", symbol: "Rs" }
    ];
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [areaSlider, setAreaSlider] = useState([0, 100]);
    const navigate=useNavigate()
    
    const goToNext = async () => {
        const data = await buildSearchPayloadProperty(filterData)
        const queryString = objectToQueryString(data);
        navigate(`/properties?${queryString}`)
    }

    // Watch for manual city changes and clear areas
    useEffect(() => {
        const handleManualCityChange = async () => {
            if (filterData?.city?.app_code && filterData?.city?.app_code !== currentCity?.app_code) {
                // Clear areas when city is manually changed
                setFilterData(prev => ({
                    ...prev,
                    area: [] // Clear selected areas
                }));

                // Fetch new locations for the manually selected city
                try {
                    const locationResult = await getLOcation({
                        city_code: filterData.city.app_code,
                    });
                    setLocationList(locationResult?.data || []);
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }
            }
        };

        handleManualCityChange();
    }, [filterData?.city]);


    return (
        <>
            <div className={`buy_rent_lease ${pageType}`}>
                <div className="row m-0 justify-content-between" style={{ gap: '63px' }}>
                    <div className="col-xl-6 col-lg-7 col-md-8 col-12 p-0">
                        <BreadCrumb items={['Home', breadcrumb]} paths={["/"]} />
                        <div className="text-area">
                            <span style={{ display: 'grid', gap: '4px' }}>
                                <div className="heading">{heading}</div>
                                <div className="para">{para}</div>
                            </span>
                            <div className="input-area-box">
                                <div className="row w-100 m-0 justify-content-start" style={{ gap: '12px 8px' }} >
                                    <div className="col-md-3 col-sm-4 col-12 p-md-0 p-1">
                                        <SingleMenuFeild getVaiable={"city"} filterData={filterData} setFilterData={setFilterData} varName={'city'} label={"City"} menuData={citiesList} optionSelect={"single"} input={true} />
                                    </div>
                                    <div className="col-md-6 col-sm-4 col-12 p-md-0 p-1">
                                        <CustomSingleSelect showMoreNumber={2} getVaiable={"name"} zindex={true} left={'12px'} optionSelect={"multiple"} filterData={filterData} setFilterData={setFilterData} varName={"area"} label={"Search the Area"} menuData={locationList} type={'menu selected'} />
                                    </div>
                                    <div className="btn-col col-md-2 col-sm-4 col-12 d-md-inline d-flex justify-content-end align-items-center mt-sm-0 mt-2 " style={{ padding: '0 0 0 8px' }} >
                                        <PrimaryButton height={'50px'} onFunction={goToNext} icon={icon} text={"Search"} padding={true} />
                                    </div>
                                    <div className='col-md-3 col-sm-4 col-12 p-md-0 p-1'>
                                        <MultiMenuField filterData={filterData} setFilterData={setFilterData} varName={'propertyType'} type={'type'} subType={"subType"} label={"Property Type"} menuData={propertySubType} />
                                    </div>
                                    <div className='col-md-3 col-sm-4 col-12 p-md-0 p-1'>
                                        <RangeMenuFeild label={"Area Range"} filterData={filterData} setFilterData={setFilterData} varName={'areaRange'} min={'min'} max={"max"} value={'areaValue'} menuData={areaUnit} sliderValue={areaSlider} setSliderValue={setAreaSlider} maxValue={100} />
                                    </div>
                                    <div className='col-md-3 col-sm-4 col-12 ps-md-0 py-md-0 p-1 pe-md-2'>
                                        <RangeMenuFeild label={"Price Range"} filterData={filterData} setFilterData={setFilterData} varName={'priceRange'} min={'min'} max={"max"} value={'priceValue'} menuData={PriceValue} type={'double'} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={10000} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-5 col-4 p-0 d-lg-inline d-none'>
                        <div className='img-box'>
                            <Image src={image} alt="..." />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner


