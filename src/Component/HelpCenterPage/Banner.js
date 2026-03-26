import React from 'react'
import './helpcenter.css'
import SingleTypeFeild from '../Metiral/InputField/SingleMenuFeild/SingleTypeFeild'
import { IoIosSearch } from 'react-icons/io'
function Banner() {
  return (
    <div className='help-center-banner'>
        <h1>How can we help you?</h1>
        <p>We're here to help you with any questions or concerns you may have. Please use the form below to contact us.</p>
       {/* <div className='help-center-banner-form'>
        <SingleTypeFeild label='Search' type='text' />
        <button>Search<IoIosSearch style={{fontSize:"20px"}} />
        </button>
       </div> */}
    </div>
  )
}

export default Banner