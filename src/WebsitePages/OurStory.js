import React from 'react'
import Banner from '../Component/OurStory/Banner'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import CeoMessage from '../Component/OurStory/CeoMessage'
import CoreValues from '../Component/OurStory/CoreValues'
import OurTeam from '../Component/OurStory/OurTeam'
import Coustomers from '../Component/OurStory/Coustomers'
import PropertyValuation from '../Component/HomePage/PropertyValuation'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { Helmet } from 'react-helmet'
function OurStory() {
  return (
   <>
   <Helmet>
    <title>Our Story - Shaping a Better Real Estate Future</title>
    <meta name="description" content="Learn the story behind Pakistan Property, our mission to make real estate transparent in Pakistan, and how our team supports buyers, sellers, and agencies." />
   </Helmet>
   <NavBar/>
   <Banner/>
  <div className='secondary-color'>
     <CeoMessage/>
     <CoreValues/>
     {/* <OurTeam/> */}
     {/* <Coustomers/> */}
     <div className="main-container">
        <PreLocation />
        <PreProperty />
        <Footer />
      </div>
  </div>
   </>
  )
}

export default OurStory
