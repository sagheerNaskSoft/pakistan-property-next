import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import { Helmet } from 'react-helmet'

function Forum() {
  // Test URL - change this back to 'https://discourse.pakistanproperty.com/categories' after testing
  const forumUrl = 'https://discourse.pakistanproperty.com/categories'
  
  return (
    <div>
      <Helmet>
        <title>Forum - Pakistan Property</title>
        <meta name="description" content="Join the Pakistan Property community forum to discuss property trends, investment opportunities, and get expert advice."/>
      </Helmet>
      <NavBar />
      <div className="secondary-color">
        <div className='main-container' style={{ minHeight: 'calc(100vh - 200px)', padding: '20px 0' }}>
          <div style={{ width: '100%', height: 'calc(100vh - 300px)', paddingTop: '20px', marginBottom: '20px', position: 'relative' }}>
          <iframe
       src="https://discourse.pakistanproperty.com"
       style={{width: '100%', minHeight: '75px', border: 'none'}}
      //  scrolling="no"
       allowtransparency="true"
     ></iframe>
          </div>
        </div>
      </div>
      <div className='main-container'>
        <Footer />
      </div>
    </div>
  )
}

export default Forum

