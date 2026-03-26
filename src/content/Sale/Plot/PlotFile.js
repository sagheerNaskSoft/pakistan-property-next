import React from 'react'

function PlotFile({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>Plot File for Sale in {locationName}, {cityName} – Document Overview</h3>
      <h4>
        The plot file available for this property in {locationName}, {cityName} represents a documented claim linked to its future allocation. 
        It is a formal file issued by the relevant society and project. The file confirms the entry in this project and outlines the connection to the plot. 
        The ownership will be assigned once the development and allocation stages progress.
      </h4>

      <h4>
        This plot file allows the buyer to secure a place within the project without immediate possession or land availability. 
        It is suitable for those who prefer to follow the project’s development timeline before planning construction or further steps.
      </h4>

      <h3>What This Plot File Includes in {locationName}, {cityName}</h3>

      <ul className='rent-property-lis px-3'>
        <h4>This plot file comes with details that support clear documentation and future allocation:</h4>

        <li><b>Official booking record:</b> The file for this particular plot includes the booking reference issued by the housing society or project.</li>
        <li><b>Project-linked documentation:</b> It outlines your registration within the project’s plan and related phases.</li>
        <li><b>Future plot allocation stage:</b> The plot number and exact location will be assigned once balloting or allocation is announced.</li>
        <li><b>Transferability:</b> The file can be transferred according to the society’s standard transfer process.</li>

        <h4 style={{ marginTop: '28px' }}>
          The file is tied to development progress in {locationName}, and updates are usually provided as the project moves toward allocation.
        </h4>
      </ul>

      <h3>Why This Plot File Is Useful</h3>
      <h4>
        This plot file is a practical option for buyers who want to become part of a planned project early. 
        It allows you to follow the development process and decide later on possession, construction, or transfer once the allocation is completed. 
        The file keeps your position secure within the project without requiring immediate building decisions.
      </h4>

      <h4>
        The procedural structure of the file ensures clarity and helps buyers track each step, from booking and verification to balloting and final allotment.
      </h4>

      <h3>Pakistan Property – Helping You Review Plot Files Easily</h3>
      <h4>
        Pakistan Property lists verified plot files with clear details and simple navigation. 
        Buyers can check file status, compare project stages, and choose a plot file that fits their future plans. 
        As a trusted nationwide platform, we support clear and confident decision-making for those interested in plot file documentation.
      </h4>
    </div>
  )
}

export default PlotFile
