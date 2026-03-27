import React, { useEffect, useState, lazy, Suspense } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'
import PageLoading from '../Component/Metiral/PageLoading'
import propertyNotFound from '../Asset/not-found.png'
import { TbHomeSearch } from "react-icons/tb";
import EndUserChat from '../Component/Metiral/EndUserChat'

import Image from 'next/image';
// Lazy load below-the-fold components for better performance
const Banner = lazy(() => import('../Component/PropertyDetail/Banner'))
const Rent = lazy(() => import('../Component/PropertyDetail/Rent'))
const PropertyValuation = lazy(() => import('../Component/HomePage/PropertyValuation'))
const PreLocation = lazy(() => import('../Component/HomePage/PreLocation'))
const PreProperty = lazy(() => import('../Component/HomePage/PreProperty'))
const Footer = lazy(() => import('../Component/NavBarFooter/Footer'))

function PropertyDetailClient({ ssrPropertyDetail }) {
  const params = useParams()
  const slug = params?.slug
  const { getPropertyDetail, getSearchLocation, getPropertyAmenities, getSimilarProperties, getUserOfProperty } = useAuth()
  const [propertyData, setPropertyData] = useState()
  const [propertyFound, setPropertyFound] = useState(true)
  const [mostSearchs, setMostSearchs] = useState([])
  const [propertyAmenities, setPropertyAmenities] = useState([])
  const [similarProperties, setSimilarProperties] = useState([])
  const [userOfProperty, setUserOfProperty] = useState({})
  const fromSSR = ssrPropertyDetail?.slug === slug ? ssrPropertyDetail.initialPropertyData : undefined
  const [loading, setLoading] = useState(() => {
    if (fromSSR === undefined) return true
    if (fromSSR === null) return false
    return !fromSSR?.property
  })
  const [endUserChatOpen, setEndUserChatOpen] = useState(false)
  const [isNarrowViewport, setIsNarrowViewport] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsNarrowViewport(typeof window !== 'undefined' && window.innerWidth <= 576)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const body = document.body
    if (endUserChatOpen) {
      body.style.height = '100dvh'
      body.style.overflow = 'hidden'
    } else {
      const clearBodyStyles = () => {
        body.style.height = ''
        body.style.overflow = ''
      }
      clearBodyStyles()
      requestAnimationFrame(clearBodyStyles)
    }
    return () => {
      body.style.height = ''
      body.style.overflow = ''
    }
  }, [endUserChatOpen])

  const pushRecentlyViewed = (property, id) => {
    const existingData = JSON.parse(localStorage.getItem("recentViewed")) || [];
    const alreadyExists = existingData.some(
      (item) => item?.id === property?.property_id
    );
    if (!alreadyExists) {
      const entry = {
        images: property?.property_images,
        is_liked: property?.is_liked,
        title: property?.title,
        price: property?.price,
        bedrooms: property?.bedrooms,
        bathrooms: property?.bathrooms,
        installments_available: property?.installments_available,
        property_type_id: property?.property_type_slug === 'sell' ? 1 : property?.property_type_slug === 'rent' ? 2 : property?.property_type_slug === 'lease' ? 3 : 0,
        city: { name: property?.city },
        location: { name: property?.location?.name },
        slug: id,
        area_size: property?.area_size,
        unit_area: property?.area_unit_name,
        id: property?.property_id,
        active_offer: { label: property?.offer_name },
        ready_for_possession: property?.ready_for_possession,
      }
      const updatedData = [entry, ...existingData];
      if (updatedData.length > 8) {
        updatedData.pop();
      }
      localStorage.setItem("recentViewed", JSON.stringify(updatedData));
    }
  }

  const loadSupplementary = async (id, property) => {
    try {
      pushRecentlyViewed(property, id)
      const propertyAmenitiesRes = await getPropertyAmenities(id);
      const similarPropertiesRes = await getSimilarProperties({ location_id: property?.location?.id, user_id: property?.user_id, property_type_slug: property?.property_type_slug });
      const userOfPropertyRes = await getUserOfProperty(property?.user_id);
      if (userOfPropertyRes?.success) {
        setUserOfProperty(userOfPropertyRes?.data?.data)
      }
      if (propertyAmenitiesRes?.success) {
        setPropertyAmenities(propertyAmenitiesRes?.data?.data?.categories_with_amenities)
      }
      if (similarPropertiesRes?.success) {
        setSimilarProperties(similarPropertiesRes?.data?.data)
      }
      let locationSearch = await getSearchLocation({
        city_code: property?.city_app_code,
        location_id: property?.location?.id
      })
      if (locationSearch?.success) {
        setMostSearchs(locationSearch?.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const fetchPropertyDetail = async (id) => {
      try {
        setLoading(true)
        const typeResult = await getPropertyDetail(id);
        if (typeResult?.success) {
          const property = typeResult?.data?.data?.property;
          const data = typeResult?.data?.data;
          if (property) {
            setPropertyData(data);
            setLoading(false)
            pushRecentlyViewed(property, id);
            const propertyAmenitiesRes = await getPropertyAmenities(id);
            const similarPropertiesRes = await getSimilarProperties({ location_id: property?.location?.id, user_id: property?.user_id, property_type_slug: property?.property_type_slug });
            const userOfPropertyRes = await getUserOfProperty(property?.user_id);
            if (userOfPropertyRes?.success) {
              setUserOfProperty(userOfPropertyRes?.data?.data)
            }
            if (propertyAmenitiesRes?.success) {
              setPropertyAmenities(propertyAmenitiesRes?.data?.data?.categories_with_amenities)
            }
            if (similarPropertiesRes?.success) {
              setSimilarProperties(similarPropertiesRes?.data?.data)
            }
            let locationSearch = await getSearchLocation({
              city_code: property?.city_app_code,
              location_id: property?.location?.id
            })
            if (locationSearch?.success) {
              setMostSearchs(locationSearch?.data)
            }
          }
        }
        else if (typeResult?.status === 404) {
          setPropertyFound(false)
        }

      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      } finally {
        setLoading(false)
      }
    };

    if (!slug) return;

    const ssr = ssrPropertyDetail?.slug === slug ? ssrPropertyDetail.initialPropertyData : undefined;

    if (ssr === undefined) {
      fetchPropertyDetail(slug);
      return;
    }

    if (ssr === null) {
      setPropertyFound(false);
      setPropertyData(undefined);
      setLoading(false);
      return;
    }

    const property = ssr?.property;
    if (!property) {
      setPropertyFound(false);
      setLoading(false);
      return;
    }

    setPropertyData(ssr);
    setPropertyFound(true);
    setLoading(false);
    loadSupplementary(slug, property);
  }, [slug, ssrPropertyDetail]);

  // Track property view for user-logs (time spent + visit count)
  useEffect(() => {
    const propertyId = propertyData?.property?.property_id;
    if (!propertyId) return;

    const idStr = String(propertyId);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('propertyViewStartTime', String(Date.now()));
      sessionStorage.setItem('propertyViewId', idStr);
    }

    try {
      const raw = localStorage.getItem('propertyVisitCounts');
      const counts = raw ? JSON.parse(raw) : {};
      counts[idStr] = (counts[idStr] || 0) + 1;
      localStorage.setItem('propertyVisitCounts', JSON.stringify(counts));
    } catch (e) { }

    return () => {
      try {
        const start = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('propertyViewStartTime') : null;
        const sid = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('propertyViewId') : null;
        if (start && sid) {
          const seconds = Math.round((Date.now() - Number(start)) / 1000);
          const raw = localStorage.getItem('propertyTimeSpent');
          const timeSpent = raw ? JSON.parse(raw) : {};
          timeSpent[sid] = (timeSpent[sid] || 0) + seconds;
          localStorage.setItem('propertyTimeSpent', JSON.stringify(timeSpent));
        }
      } catch (e) { }
    };
  }, [propertyData?.property?.property_id]);

  const loadingContainerClass = isNarrowViewport ? 'mx-0 mb-0' : 'main-container'

  return (
    <div style={{ overflowX: 'hidden' }}>
      <div>

        <NavBar prevButton={true} />
        {loading ? <div className="secondary-color p-1">
          <div style={{ minHeight: '100vh' }} className={loadingContainerClass}>
            <PageLoading />
          </div>
        </div> :
          <>
            {propertyFound ? <>
              <div className='secondary-color'>
                <div className='main-container propertry-detail-container'>
                  {/* <Suspense fallback={<SpinerLoading/>}> */}
                  <Banner setEndUserChatOpen={setEndUserChatOpen} userOfProperty={userOfProperty} aminitiesWithCategory={propertyAmenities} propertyData={propertyData?.property} mostSearchs={mostSearchs} simlerProperties={similarProperties} />
                  {/* </Suspense> */}
                  <div className="px-sm-0 mx-sm-0 mx-2 px-2">
                    <Suspense fallback={<></>}>
                      <Rent cityName={propertyData?.property?.city} locationName={propertyData?.property?.location?.name} typeName={propertyData?.property?.category_name} purposeName={propertyData?.property?.property_type_slug === 'sell' ? 'Sell' : propertyData?.property?.property_type_slug === 'rent' ? 'Rent' : propertyData?.property?.property_type_slug === 'lease' ? 'Lease' : ''} subTypeName={propertyData?.property?.sub_category_name} />
                    </Suspense>
                    <Suspense fallback={<></>}>
                      <PropertyValuation />
                    </Suspense>
                    <Suspense fallback={<></>}>
                      <PreLocation />
                    </Suspense>
                    <Suspense fallback={<></>}>
                      <PreProperty />
                    </Suspense>
                  </div>
                </div>
              </div>
              <div className='main-container'>
                <Suspense fallback={<></>}>
                  <Footer />
                </Suspense>
              </div>
            </> : <>

              <div className="secondary-color p-1">
                <div className="main-container">
                  <div className='property-not-found d-flex align-items-center justify-content-between'>
                    <div >
                      <h1>Property Not<br />Found <span>404 !</span></h1>
                      <p>Sorry, the property you’re looking for couldn’t be found.<br />
                        Please check your search or explore more listings on <span>Pakistan Property.</span></p>
                      <button onClick={() => navigate('/')}>Back To Home <TbHomeSearch /></button>
                    </div>
                    <Image src={propertyNotFound} alt='...' />
                  </div>
                  <hr />
                  <Suspense fallback={<></>}>
                    <PreLocation />
                  </Suspense>
                  <Suspense fallback={<></>}>
                    <PreProperty />
                  </Suspense>
                </div>
              </div>
              <div className='main-container'>
                <Suspense fallback={<></>}>
                  <Footer />
                </Suspense>
              </div>
            </>
            }

          </>}

      </div>
      <EndUserChat
        open={endUserChatOpen}
        setOpen={setEndUserChatOpen}
        propertySlug={slug}
        agentId={propertyData?.property?.user_id}
        propertyData={propertyData?.property}
        userOfProperty={userOfProperty}
      />
    </div>
  )
}

export default PropertyDetailClient
