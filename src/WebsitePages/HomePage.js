import React, { lazy, Suspense, useEffect, useState, memo } from 'react';
import NavBarOrig from '../Component/NavBarFooter/UpdatedNavbar';
import BannerOrig from '../Component/HomePage/Banner';
import FooterOrig from '../Component/NavBarFooter/Footer';
import { useAuth } from '../Context/ContextProvider';
import { Helmet } from 'react-helmet';
import { messaging, getToken } from '../firebase';
import SpinerLoading from '../Component/Metiral/SpinerLoading';
import CitiesProperties from '../Component/Buy_Rent_Lease_Material/CitiesProperties/CitiesProperties';
const RecentSearch = lazy(() => import('../Component/HomePage/RecentSearch'));
const OurService = lazy(() => import('../Component/HomePage/OurService'));
const ViewedProperty = lazy(() => import('../Component/HomePage/ViewedProperty'));
const TrustedAgencies = lazy(() => import('../Component/HomePage/UpdatedTrustedAgencies'));
const OurCommunity = lazy(() => import('../Component/HomePage/OurCommunity'));
const PropertyValuation = lazy(() => import('../Component/HomePage/PropertyValuation'));
const SliderProjects = lazy(() => import('../Component/HomePage/SliderProjects'));
const PreLocation = lazy(() => import('../Component/HomePage/PreLocation'));
const PreProperty = lazy(() => import('../Component/HomePage/PreProperty'));
const HomeDetail = lazy(() => import('../Component/HomePage/HomeDetail'));
const AppSection = lazy(() => import('../Component/HomePage/AppSection'));
const VAPID_KEY = 'BEPWJczXoK6PlOT7Qnwf7TzHKdmcNshFnwhxWJI8nobQp48EvoVwFFPCv8uwuh_zDiqBPK6zFCU4mt8MgTayKZE'; // Replace with your real VAPID key

function HomePage() {
  const { loginData, base_url, setDeviceToken } = useAuth();
  const recentSearch = localStorage.getItem('recent-property-searches') || [];


  useEffect(() => {
    // Only try FCM push registration if supported by browser AND messaging is not null
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      messaging // messaging is not null
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: VAPID_KEY })
            .then((token) => {
              if (token) {
                // Send token to your API here:
                setDeviceToken(token)
                fetch(`${base_url}push-notifications/device-token`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ device_token: token }),
                })
                  .then((res) => res.json())
                  .then((data) => console.log('Device token sent, API response:', data))
                  .catch(err => console.error('Error sending device token:', err));
              }
            })
            .catch((err) => {
              console.error('Error retrieving device token from Firebase:', err);
            });
        }
      });
    } else {
      console.log('Push messaging not supported in this browser or device.');
    }
  }, []);

  // const NavBar = memo(NavBarOrig);
  // const Banner = memo(BannerOrig);
  const Footer = memo(FooterOrig);

  const recentViewed = JSON.parse(localStorage.getItem("recentViewed"))


  return (
    <div>
      <Helmet>
        <title>Find & List Best Properties in Pakistan - Search Now</title>
        <meta name="description" content="Find top properties across Pakistan. Browse verified homes, plots, and commercial listings and connect with trusted agents to make confident choices today." />

      </Helmet>
      <Suspense fallback={<SpinerLoading />}>
        <NavBarOrig />
        <BannerOrig />
      </Suspense>
      <Suspense fallback={<SpinerLoading />}>

        <div className='secondary-color'>
          <div className='main-container'>
            {recentSearch && <RecentSearch />}
            <OurService />
          </div>
        </div>
      </Suspense>
      <Suspense fallback={<></>}>
        <div className="secondary-color">
          { recentViewed &&
          <section className='section-container' style={{ background: 'linear-gradient(0deg, #EAF9F1 0%, rgba(237, 244, 239, 0.00) 100%)', padding: '40px 0 56px' }}>
            <div className='main-container'>
               <CitiesProperties modify={true} propertyData={recentViewed} title={"Recently Viewed Properties"} unDisablePropertyCardTag={true} />
            </div>
          </section> }
        </div>
      </Suspense >
      <Suspense fallback={<></>}>
        <div className='secondary-color'>
          <div className='main-container'>
            <TrustedAgencies />
            <OurCommunity heading={'Our Community'} />
            <PropertyValuation />
          </div>

          <div className="main-container">
            <div className="global-line-seperator"></div>
          </div>
          <div className="main-container" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <HomeDetail />
          </div>
          <div className='main-container'>
            <PreLocation />
            <PreProperty />
          </div>
          <AppSection />

        </div>
      </Suspense>
      <Suspense fallback={<></>}>
        <div className='main-container'>
          <Footer />
        </div>
      </Suspense>
    </div >

  );
}

export default HomePage;