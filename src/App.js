'use client';

import './App.css';
import './Page.css';
import './newPage.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ScrollToTop from './Component/Metiral/ScrollToTop';
import CustomizedSnackbars from './Component/NavBarFooter/CustomizedSnackbars';
import { useAuth } from './Context/ContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageLoader from './Component/Metiral/PageLoader';
// ROUTE-BASED LAZY IMPORTS
const Projects = lazy(() => import('./WebsitePages/Projects'));
const ProjectListing = lazy(() => import('./WebsitePages/ProjectListing'));
const Buy = lazy(() => import('./WebsitePages/Buy'));
const Rent = lazy(() => import('./WebsitePages/Rent'));
const Lease = lazy(() => import('./WebsitePages/Lease'));
const AgencyPropertyListing = lazy(() => import('./WebsitePages/AgencyPropertyListing'));
const Agencies = lazy(() => import('./WebsitePages/Agencies'));
const AgenciesListing = lazy(() => import('./WebsitePages/AgenciesListing'));
const AgencyDetail = lazy(() => import('./WebsitePages/AgencyDetail'));
const MainPortal = lazy(() => import('./AgentPortal/Component/MainPortal/MainPortal'));
const TermsCondition = lazy(() => import('./WebsitePages/TermsCondition'));
const Faqs = lazy(() => import('./WebsitePages/Faqs'));
const PrivacyPolicy = lazy(() => import('./WebsitePages/PrivacyPolicy'));
const AreaUnitConverter = lazy(() => import('./WebsitePages/AreaUnitConverter'));
const ConstructionCostCalcualtor = lazy(() => import('./WebsitePages/ConstructionCostCalcualtor'));
const ConstructionDetailpage = lazy(() => import('./WebsitePages/ConstructionDetailpage'));
const PropertyIndex = lazy(() => import('./WebsitePages/PropertyIndex'));
const PropertyIndexDetail = lazy(() => import('./WebsitePages/PropertyIndexDetail'));
const PropertyTrend = lazy(() => import('./WebsitePages/PropertyTrend'));
const PropertytrendDetail = lazy(() => import('./WebsitePages/PropertytrendDetail'));
const PropertyListing = lazy(() => import('./WebsitePages/PropertyListing'));
const HomePage = lazy(() => import('./WebsitePages/HomePage'));
const PropertyDetail = lazy(() => import('./WebsitePages/PropertyDetail'));
const WishList = lazy(() => import('./WebsitePages/WishList'));
const ProjectDetail = lazy(() => import('./WebsitePages/ProjectDetail'));
const SavedSearches = lazy(() => import('./WebsitePages/SavedSearches'));
const BlogPage = lazy(() => import('./WebsitePages/BlogPage'));
const AllBlog = lazy(() => import('./WebsitePages/AllBlog'));
const BlogDetail = lazy(() => import('./WebsitePages/BlogDetail'));
const LoanCalculator = lazy(() => import('./WebsitePages/LoanCalculator'));
const LoanListing = lazy(() => import('./WebsitePages/LoanListing'));
const InstentValuation = lazy(() => import('./WebsitePages/InstantValuation'));
const OurStory = lazy(() => import('./WebsitePages/OurStory'));
const SetAgentPassword = lazy(() => import('./WebsitePages/SetAgentPassword'));
const AgentProfile = lazy(() => import('./WebsitePages/AgentProfile'));
const AllNews = lazy(() => import('./WebsitePages/AllNews'));
const NewsPage = lazy(() => import('./WebsitePages/NewsPage'));
const NewsDetail = lazy(() => import('./WebsitePages/NewsDetail'));
const DeveloperDetailpage = lazy(() => import('./WebsitePages/DeveloperDetailpage'));
const VerifyEmailInvitation = lazy(() => import('./Component/AgentPasswordSetting/VerifyEmailInvitation'));
const NewPasswordSetup = lazy(() => import('./Component/AgentPasswordSetting/NewPasswordSetup'));
const PasswordChanged = lazy(() => import('./Component/AgentPasswordSetting/PasswordChanged'));
const ForgetPassword = lazy(() => import('./Component/AgentPasswordSetting/ForgetPassword'));
const EmailVerification = lazy(() => import('./Component/AgentPasswordSetting/EmailVerification'));
const Forum = lazy(() => import('./WebsitePages/Forum'));
const HelpCenterPage = lazy(() => import('./WebsitePages/HelpCenterPage'));
const HelpCenterSubcategoryPage = lazy(() => import('./WebsitePages/HelpCenterSubcategoryPage'));
const HelpCenterTopicPage = lazy(() => import('./WebsitePages/HelpCenterTopicPage'));
const PageNotFound = lazy(() => import('./WebsitePages/PageNotFound'));

function AppRoutes() {
  const location = useLocation();
  const pathname = location.pathname;
  const defaultOgImage =
    typeof window !== 'undefined'
      ? `${window.location.origin}/previewImgae.jpg`
      : 'https://pakistanproperty.com/previewImgae.jpg';

  return (
    <>
      {!pathname?.includes('property-detail') &&
      !pathname?.includes('project-detail') &&
      !pathname?.includes('news-detail') &&
      !pathname?.includes('blog-detail') ? (
        <Helmet defaultTitle="Pakistan Property" titleTemplate="%s - Pakistan Property">
          <meta property="og:site_name" content="Pakistan Property" />
          <meta
            property="og:title"
            content="Find & List Best Properties in Pakistan - Pakistan Property"
          />
          <meta
            property="og:description"
            content="Find top properties across Pakistan. Browse verified homes, plots, and commercial listings and connect with trusted agents to make confident choices today."
          />
          <meta property="og:image" content={defaultOgImage} />
          <meta
            property="og:url"
            content={typeof window !== 'undefined' ? window.location.href : 'https://pakistanproperty.com'}
          />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Helmet>
      ) : null}
      <CustomizedSnackbars />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/properties/:slug" element={<PropertyListing />} />
          <Route path="/agency-property-Listing" element={<AgencyPropertyListing />} />
          <Route path="/property-detail/:slug" element={<PropertyDetail />} />
          <Route path="/property-wishlist" element={<WishList />} />
          <Route path="/saved-search" element={<SavedSearches />} />
          <Route path="/project-detail/:id/:slug" element={<ProjectDetail />} />
          <Route path="/new-projects/:slug" element={<Projects />} />
          <Route path="/new-projects" element={<Projects />} />
          <Route path="/project-listing/:slug" element={<ProjectListing />} />
          <Route path="/property-for-sell" element={<Buy />} />
          <Route path="/property-for-rent" element={<Rent />} />
          <Route path="/property-for-lease" element={<Lease />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/agency-listing" element={<AgenciesListing />} />
          <Route path="/agency-detail/:slug" element={<AgencyDetail />} />
          <Route path="/agent-portal/*" element={<MainPortal />}></Route>
          <Route path="/agency-portal/*" element={<MainPortal />}></Route>
          <Route path="/term-and-condition" element={<TermsCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/area-unit-converter" element={<AreaUnitConverter />} />
          <Route path="/construction-cost-calculator" element={<ConstructionCostCalcualtor />} />
          <Route path="/construction-cost-calculator/:slug" element={<ConstructionDetailpage />} />
          <Route path="/property-index" element={<PropertyIndex />} />
          <Route path="/property-index-detail" element={<PropertyIndexDetail />} />
          <Route path="/property-trend" element={<PropertyTrend />} />
          <Route path="/property-trend-detail" element={<PropertytrendDetail />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/all-blog" element={<AllBlog />} />
          <Route path="/blog-detail/:slug" element={<BlogDetail />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/all-news" element={<AllNews />} />
          <Route path="/news-detail/:slug" element={<NewsDetail />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/loan-listing" element={<LoanListing />} />
          <Route path="/valuation" element={<InstentValuation />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/agent-profile/:userId/:userName" element={<AgentProfile />} />
          <Route path="/developer-profile/:slug" element={<DeveloperDetailpage />} />
          <Route path="/email-verfication-invitation" element={<VerifyEmailInvitation />} />
          <Route path="/create-staff-password" element={<NewPasswordSetup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/password-changed" element={<PasswordChanged />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/help-center-subcategory/:slug" element={<HelpCenterSubcategoryPage />} />
          <Route path="/help-center-topic/:slug" element={<HelpCenterTopicPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  const { 
    countriesCode, 
    getType, 
    getCity, 
    homePagePreLocation, 
    getAreaUnit, 
    setAreaUnits,
    setPropertyType, 
    homePagePreProperty,
    setpreLoactionData, 
    setprePropertyData, 
    setCitiesList, 
    projectType, 
    setProjectTypeData, 
    fetchFavourites, 
    getSavedSearches, 
    loginData 
  } = useAuth();

  useEffect(() => {
    let isMounted = true;
    countriesCode();

    const fetchInitial = async () => {
      try {
        const projectTypeResult = await projectType();
        setProjectTypeData(projectTypeResult?.data?.data?.project_types);

        const typeResult = await getType();
        setPropertyType(typeResult?.data?.data?.property_types);

        const cityResult = await getCity();
        setCitiesList(cityResult?.data);

        if (isMounted) {
          await fetchAreaUnit();
          await fetchPreloaction();
          await fetchPreProperty();
          
          if (loginData) {
            await fetchFavourites();
            await getSavedSearches();
          }
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    const fetchAreaUnit = async () => {
      try {
        const cityResult = await getAreaUnit();
        setAreaUnits(cityResult?.data);
      } catch (error) {
        console.error("An error occurred while fetching area units:", error);
      }
    };

    const fetchPreloaction = async () => {
      try {
        const cityResult = await homePagePreLocation();
        setpreLoactionData(cityResult?.data?.data);
      } catch (error) {
        console.error("An error occurred while fetching pre-location:", error);
      }
    };

    const fetchPreProperty = async () => {
      try {
        const cityResult = await homePagePreProperty();
        setprePropertyData(cityResult?.data?.data);
      } catch (error) {
        console.error("An error occurred while fetching pre-property:", error);
      }
    };

    fetchInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loginData) {
      fetchFavourites();
      getSavedSearches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
