import React from 'react'
import { MdArrowOutward } from 'react-icons/md'
const icon = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" color="#447158" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path></svg>
const rates = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M16 7H22V13" stroke="#7CACE4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="#7CACE4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const calculator = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 6H16" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 14V18" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 10H16.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 10H12.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 10H8.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 14H12.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 14H8.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 18H12.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M8 18H8.01" stroke="#696AA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

const buildings = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 6H14" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 10H14" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 14H14" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10 18H14" stroke="#68AD83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


function Cost() {
    return (
        <>
            <div className='main-container mt-sm-5 mb-sm-5'>
                <div className='construstion-cost row w-100'>
                    <div className="col-md-6 col-12 px-md-3 px-0">
                        <div className='construs w-100'>
                            <h2>Construction Cost Calculator</h2>
                            <p>Start estimating your construction cost today and take the first step toward building your dream property in Pakistan.</p>
                            <div className='cost-d'>
                             <div className="icon" style={{background: '#E4F0FE'}}>   {rates}</div>
                                <div className="text-b">
                                    <h5>Real-Time Market Rates</h5>
                                    <p>Updated weekly based on current material prices and labor costs across Pakistan</p>
                                </div>
                            </div>
                            <div className='cost-d'>
                                <div className="icon" style={{background: '#F0F0FE'}}>   {calculator}</div>
                                <div className="text-box">
                                    <h5>Detailed Breakdown</h5>
                                    <p>Get itemized costs for grey structure, finishing, electrical, plumbing, and fixtures</p>
                                </div>
                            </div>
                            <div className='cost-d'>
                                <div className="icon" style={{background: '#F0F0FE'}}>   {buildings}</div>
                                <div className="text-box">
                                    <h5>Multiple Options</h5>
                                    <p>Compare costs for different quality grades from standard to luxury finishes</p>
                                </div>
                            </div>
                            {/* <div className='cost-button mt-4'>
                                <button>Read More <MdArrowOutward style={{ fontSize: '20px' }} /></button>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-md-6 col-12 px-md-3 px-0">
                        <div className='cost-big-left'>
                            <div className="title">What's Included in the Estimate?</div>
                            <div className="points-box">
                                <div className="points">
                                    {icon}
                                    Customizable Area Sizes and Units
                                </div>
                                <div className="points">
                                    {icon}
                                    Individual Estimates for Grey and Finished Homes
                                </div>
                                <div className="points">
                                    {icon}
                                    Variety of Construction Choice
                                </div>
                                <div className="points">
                                    {icon}
                                    Modifiable Number of Rooms
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cost
