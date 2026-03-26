import React from 'react'
import img from '../../Asset/HomePage/Frame 1984078314.svg'
import { Link } from 'react-router-dom'
import back from '../../Asset/HomePage/Grid bg.svg'
import { FallbackImage } from '../Metiral/FallbackImage'
function PropertyValuation() {
    return (
        <div className='property_valuation_section' style={{overflow: 'hidden'}}>
            <div className='card_valuation'>

                <div className='d-flex m-0 align-items-center' style={{ gap: '10px 24px' }}>
                    <div>
                        <h4>Instant Property Valuation</h4>
                        <p className='me-md-5'>Get a <b>data-backed property value estimate</b> in minutes. Our valuation tool uses <b>real market data</b> from active listings across Pakistan to help you make smart buying or selling decisions.</p>
                        <Link to='/valuation' style={{ textDecoration: "none" }}><button>Explore more</button></Link>
                    </div>
                    <div className="img d-sm-inline d-none">
                        <FallbackImage src={img} alt="" componentName="PropertyValuation" />
                    </div>
                </div>
                <FallbackImage className='back-img' src={back} alt='...' componentName="PropertyValuation" />
            </div>
        </div>
    )
}

export default PropertyValuation