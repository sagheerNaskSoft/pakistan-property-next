import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider';
import PageLoader from '../Component/Metiral/PageLoader';
import { Helmet } from 'react-helmet';
import SpinerLoading from '../Component/Metiral/SpinerLoading';

// Lazy load heavy/non-critical components
const InputSection = lazy(() => import('../Component/PropertyListing/InputSection'));
const CardSection = lazy(() => import('../Component/PropertyListing/CardSection'));
const PropertyText = lazy(() => import('../Component/PropertyListing/PropertyText'));
const PropertyValuation = lazy(() => import('../Component/HomePage/PropertyValuation'));
const PreLocation = lazy(() => import('../Component/HomePage/PreLocation'));
const PreProperty = lazy(() => import('../Component/HomePage/PreProperty'));

function PropertyListing() {
  const { propertyData, parseQueryParams, serchProperty, getLocationSummery, nearestCities, nearestTowns} = useAuth()
  const [open, setOpen] = useState(false)
  const [saveBlink, setSaveBlink] = useState(false)
  const [locationSummery, setLocationSummery] = useState([])
  const [nearestCitiesData, setNearestCitiesData] = useState([])
  const [nearestTownsData, setNearestTownsData] = useState([])
  useEffect(() => {
    if (saveBlink) {
      setTimeout(() => {
        setSaveBlink(false)
      }, 1500)
    }
  }, [saveBlink])
  const location = useLocation()
  const params = useParams()
  const [filter, setFilter] = useState()
  // Remove redundant filterData state initialization from function scope, if not externally required
  const [filterData, setFilterData] = useState({
    purpose: "",
    city: "",
    bedroom: [],
    bathroom: [],
    locations: [],
    agencies: [],
    more: [],
    priceRange: {
      min: "",
      max: "",
      priceValue: {
        id: 6,
        name: "PKR",
        code: 'pkr'
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
    propertyType: {
      type: "",
      subType: [],
    },
  });

  // Memoize propertyData values for CardSection to prevent re-renders
  // const memoizedPropertyData = useMemo(() => propertyData?.properties, [propertyData?.properties]);
  const memoizedPagination = useMemo(() => propertyData?.pagination, [propertyData?.pagination]);
  const memoizedNearestCities = useMemo(() => propertyData?.nearest_cities, [propertyData?.nearest_cities]);

  // Memoized callbacks
  const handleSetFilterData = useCallback((data) => setFilterData(data), []);
  const handleSetOpen = useCallback((openVal) => setOpen(openVal), []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const parsed = await parseQueryParams(location.search);
        setFilter(parsed);
        serchProperty(parsed)
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    const fetchPropertyNew = async () => {
      try {
        if (params?.slug === "property-trend") {
          serchProperty({
            trend: true
          })
        } else {
          const parsed = await parseQueryParams(location.search);
          setFilter(parsed);
          serchProperty({...parsed,new_properties: true})

        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    if (params?.slug) {
      fetchPropertyNew();
    } else {
      // setLoading(true);

      fetchProjects();
    }
    // eslint-disable-next-line
  }, [location.search, params?.slug]); // Add dependencies that are actually used
  useEffect(() => {
    const fetchLocationSummery = async () => {
      try {
        const parsed = await parseQueryParams(location.search);

        const response = await getLocationSummery(parsed)
        if(response?.success) {
          setLocationSummery(response?.data?.areas)
          const nearestCitiesResponse = await nearestCities(parsed)
          const nearestTownsResponse = await nearestTowns(parsed)
          if(nearestCitiesResponse?.success) {
            setNearestCitiesData(nearestCitiesResponse?.data?.data?.nearest_cities)
          }
          if(nearestTownsResponse?.success) {
            setNearestTownsData(nearestTownsResponse?.data?.data?.nearest_towns)
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching location summary:", error);
      }
    }
    fetchLocationSummery()
  }, [location.search]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.search]);
  return (
    <>
        {params?.slug ?
      <Helmet>
          <title>New Properties for Sale in Pakistan - Verified Listings</title>
          <meta name="description" content="Find new properties for sale in Pakistan with verified listings and trusted sellers. Explore fresh homes and good investment options updated regularly."/>
          </Helmet>
       :
        <Helmet>

        <title>Property Listings in Pakistan - Verified Properties for Sale & Rent</title>
        <meta name="description" content="Browse verified property listings in Pakistan. Find homes for sale and rent with trusted sellers and agents. Explore detailed property information and make informed decisions."/>
        </Helmet>
      }
       
      
      <NavBar />
      <Suspense fallback={<PageLoader/>}>
        <InputSection saveBlink={saveBlink} open={open} setOpen={handleSetOpen} filterData={filterData} setFilterData={handleSetFilterData} data={filter} />
      </Suspense>
      <Suspense fallback={<SpinerLoading />}>
        <CardSection backtoSearchContent={location} nearestTowns={nearestTownsData} locationSummery={locationSummery} open={open} setOpen={handleSetOpen} nearCities={nearestCitiesData} setFilterData={handleSetFilterData} filterData={filterData} data={filter} propertyData={propertyData?.properties} pagination={memoizedPagination} setSaveBlink={setSaveBlink} noPropertyFound={propertyData?.nearest_message} />
      </Suspense>
      <Suspense >
        <PropertyText Purpose={filterData?.purpose?.name==="Sell" ? "Buy" : filterData?.purpose?.name} City={filterData?.city?.city} />
      </Suspense>
      <div className="secondary-color">
        <div className="main-container">
          <Suspense >
            <PropertyValuation />
          </Suspense>
          <Suspense >
            <PreLocation />
          </Suspense>
          <Suspense >
            <PreProperty />
          </Suspense>
        </div>
      </div>
      <div className='main-container'>
        <Footer />
      </div>
    </>
  )
}

export default PropertyListing
