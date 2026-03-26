import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/InstantValuation/Banner'
import ValuationProcess from '../Component/InstantValuation/ValuationProcess'
import InstantNotes from '../Component/InstantValuation/InstantNotes'
import Faq from '../Component/Buy_Rent_Lease_Material/FAQ/Faq'
import Footer from '../Component/NavBarFooter/Footer'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import { Helmet } from 'react-helmet'

function InstantValuation() {
  const para = "If you’re new to it, this valuation approach might seem confusing. Check out these common questions about valuations, accuracy, and property data to understand how Pakistan Property makes the process simple, fast, and reliable."
  const faqData = [
    { question: "How accurate is the online valuation process?", answer: 'Very accurate for a quick estimate. We combine recent sales, market trends, and location data. You’ll get a reliable price range you can refine with an expert.' },
    { question: "Is the property valuation service free of charge?", answer: <>
    Yes. The <b>property valuation services</b> are free to use with no hidden fees. You can get multiple valuations anytime</> },
    {  question: "What information do I need to provide?", answer: 'The most probable information required to run a valuation test includes:',
      list:[ "Property address and type" , "Beds and approximate size" , "Your contact details for confirmation"]

     },
    { question: "How long does it take to get a valuation?", answer: 'Shortly after you apply for a valuation. Our agent will contact you immediately and guide you about the requested valuation.' },
    { question: "Can I get a physical property inspection?", answer: 'Yes, you can request an in-person inspection for a comprehensive property evaluation.' },
  ]

  const newPara1 = 'Have more questions about the property valuation approach? Our support team is here to help you with accurate valuation guidance and property insights. Just send us an email, and we’ll respond quickly.'
  return (
    <div> 
      <Helmet>
        <title>Online Property Valuation Pakistan - Instant Estimate</title>
        <meta name="description" content="Get instant online property valuation in Pakistan with accurate estimates based on real market data. Fast and reliable, check your property’s true value."/>
      </Helmet>
      <NavBar />
      <Banner />
      <div className="secondary-color">
        <div className="main-container">
          <ValuationProcess />
        </div>
      </div>
      <div className="secondary-color">
        <InstantNotes />
        <div className="main-container">
          <Faq  faqData={faqData} para={para} newPara1={newPara1} />
          <div style={{ marginTop: '46px' }}>
            <PreLocation />
            <PreProperty />
          </div>
        </div>
      </div>
      <div className="main-container">
        <Footer />
      </div>
    </div>
  )
}

export default InstantValuation