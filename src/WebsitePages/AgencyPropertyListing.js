import React, { lazy, Suspense } from 'react';

const NavBar = lazy(() => import('../Component/NavBarFooter/UpdatedNavbar'));
const Footer = lazy(() => import('../Component/NavBarFooter/Footer'));
const InputSection = lazy(() => import('../Component/PropertyListing/InputSection'));
const CardSection = lazy(() => import('../Component/PropertyListing/CardSection'));
const PropertyText = lazy(() => import('../Component/PropertyListing/PropertyText'));
const PropertyValuation = lazy(() => import('../Component/HomePage/PropertyValuation'));
const PreLocation = lazy(() => import('../Component/HomePage/PreLocation'));
const PreProperty = lazy(() => import('../Component/HomePage/PreProperty'));

const Loading = () => <div>Loading...</div>;

const AgencyPropertyListing = () => (
  <Suspense fallback={<Loading />}>
    <NavBar />
    <InputSection />
    <CardSection agency={true} />
    <PropertyText />
    <div className="secondary-color">
      <div className="main-container">
        <PropertyValuation />
        <PreLocation />
        <PreProperty />
      </div>
    </div>
    <div className="main-container">
      <Footer />
    </div>
  </Suspense>
);

export default AgencyPropertyListing;
