import { useEffect, useParams, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import AgencyDetail from '../Component/AgenciesListing/AgencyDetail'
import Banner from '../Component/AgenciesListing/Banner'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useAuth } from '../Context/ContextProvider'
import { useLocation } from 'react-router-dom'
function AgenciesListing() {
  const location = useLocation()
  const [agencyCardData, setAgencyCardData] = useState([])
  const [listingSlider, setListingSlider] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [cityName, setCityName] = useState(null)
  const { parseQueryParams, citiesList, locationList, setLocationList, agencyList, getLOcation } = useAuth()
  const [filterData, setFilterData] = useState({
    city: "",
    search: [],
    agency_name: "",
    most_properties_type: "",
    propertyType: {
      type: "",
      subType: []
    }
  })

  useEffect(() => {
    const updateFilterData = async () => {

      const parsed = await parseQueryParams(location.search);


      let cityName = citiesList?.find(item => item?.app_code === parsed?.city_code);
      setCityName(cityName?.city)
      let locationName = locationList?.filter(item => parsed?.location?.includes(item?.slug));
      if (parsed?.location?.length > 0 && locationName?.length === 0) {
        let locationResult = await getLOcation({
          city_code: parsed?.city_code,
        });
        setLocationList(locationResult?.data || []);
        locationName = locationResult?.data?.filter(item => parsed?.location.includes(item?.slug));
      }
      setFilterData(prevFilterData => ({
        ...prevFilterData, city: cityName, locations: locationName, propertyType: {
          type: parsed?.category_id,
          subType: parsed?.sub_category_id,

        },
        current_page: parsed?.current_page,
        per_page: parsed?.per_page,
        agency_name: parsed?.agency_name,
        most_properties_type: parsed?.most_properties_type,
      }))

    }
    updateFilterData()
  }, [location.search, citiesList])

  useEffect(() => {
    const fetchAgencies = async () => {
      let parsed = await parseQueryParams(location.search);
      let result = await agencyList(parsed)
      if (result?.success) {
        setAgencyCardData(result?.data?.data?.agencies)
        setPagination(result?.data?.data?.pagination)
      }
    }
    fetchAgencies()
  }, [location.search])

  useEffect(() => {
    const updateBodyHeight = () => {
      const isMobile = window.innerWidth <= 576;
      if (listingSlider && isMobile) {
        document.body.style.height = '100dvh';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.height = '';
      }
    };

    updateBodyHeight();
    
    window.addEventListener('resize', updateBodyHeight);
    
    return () => {
      window.removeEventListener('resize', updateBodyHeight);
      // Reset body height on cleanup
      document.body.style.height = '';
    };
  }, [listingSlider])


  const heading = 'Looking for popular Agencies?'
  const para = "Here's a list of agencies which are operating in different cities."
  const heading1 = 'Markaz Properties'
  const heading2 = 'Saiban Properties'
  const heading3 = 'Clan group of companies'
  const heading4 = 'Union Properties & developers'
  const heading5 = 'MS Real Estate'
  return (
    <>
      <div>
        <NavBar />
        <Banner filterData={filterData} setFilterData={setFilterData} setOpen={setListingSlider} open={listingSlider}  />
        <div className='agency-background' style={{ backgroundColor: '#F9F9F9', paddingTop: '109px' }}>
          <div className='main-container'>
            <AgencyDetail open={listingSlider} setOpen={setListingSlider} filterData={filterData} setFilterData={setFilterData} cityName={cityName} agencyData={agencyCardData} pagination={pagination} />
            <div className='mt-4 pt-3'>
              <PreProperty heading={heading} heading1={heading1} heading2={heading2} heading3={heading3} heading4={heading4} heading5={heading5} para={para} />
            </div>
          </div>
        </div>
        <div className='main-container'>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default AgenciesListing
