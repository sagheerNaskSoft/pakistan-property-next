import React from 'react'

function PlotForm({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>Comprehensive Plot Form Overview for {locationName}, {cityName}</h3>
      <h4>
        The plot form for this property in {locationName}, {cityName} serves as an official registration document issued by the relevant housing project. 
        It does not represent ownership or allocation of this particular property. Instead, it shows that the buyer holds a valid form that can be used 
        to apply for a plot when the project opens bookings or moves to the next development stage.
      </h4>
      <h4>
        The issued plot form is often the first step in a project’s process, allowing buyers to enter the system before plot files or allocations are issued. 
        It is suitable for individuals who want to register early and follow the project’s progress before making further decisions.
      </h4>

      <h3>What This Plot Form Process Includes in {locationName}, {cityName}</h3>
      <ul className='rent-property-lis px-3'>
        <h4>This plot form contains important details that support the registration process:</h4>

        <li><b>Official registration details:</b> The form includes the basic identification and registration sections issued by the society or project.</li>
        <li><b>Initial entry record:</b> It shows your entry in the early phase of the project’s booking process.</li>
        <li><b>Eligibility for future submission:</b> The form can be used when the project invites applications for plot assignment.</li>
        <li><b>Transferable document:</b> The form can be transferred according to the society’s transfer rules if needed.</li>

        <h4 style={{ marginTop: '28px' }}>
          The plot form is linked to the project’s development in {locationName}, and updates are provided as the project moves toward booking or allocation.
        </h4>
      </ul>

      <h3>How This Plot Form May Be Useful to Buy Property</h3>
      <h4>
        This plot form is a simple way to secure an early place within a developing project. 
        It allows you to stay connected to the process without immediate financial or construction commitments. 
        Once the project moves to the booking or allocation phase, you can use the form to continue with the next step.
      </h4>
      <h4>
        For buyers who prefer entering a project at the earliest stage, this document provides a manageable way to stay part of the system and follow updates at their own pace.
      </h4>

      <h3>Making Plot Form Information Easier in Pakistan Property</h3>
      <h4>
        Pakistan Property displays verified plot form listings with clear information and easy browsing. 
        Buyers can compare project phases, form details, and available options in one place. 
        As a trusted nationwide classified platform, Pakistan Property helps you make informed decisions when selecting a plot for future use.
      </h4>
    </div>
  )
}

export default PlotForm
