import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/Faqs/Banner'
import Footer from '../Component/NavBarFooter/Footer'
import { Helmet } from 'react-helmet'

function Faqs() {
  return (
    <div>
      <Helmet>
        <title>Frequently Asked Questions - Pakistan Property</title>
        <meta name="description" content="Find simple answers to common questions about buying, renting, selling, and listing property on PakistanProperty.com. Get quick help & clear guidance here."/>
      </Helmet>
      <NavBar />
      <div className="secondary-color">
        <div className='main-container'>
          <Banner />
          <Footer />

        </div>
      </div>

    </div>
  )
}

export default Faqs
