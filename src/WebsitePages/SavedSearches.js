import React from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/SavedSearches/Banner'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'

function SavedSearches() {
  return (
     <div>          
      <NavBar />

            <div className='secondary-color'>

                <div className='main-container'>
                    <Banner />
                    <PreLocation />
                    <PreProperty />
                </div>
            </div>
            <div className='main-container'>
                <Footer />
            </div>
        </div>
  )
}

export default SavedSearches