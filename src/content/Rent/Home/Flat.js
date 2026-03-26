import React from 'react'

function FlatForRent({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>A Practical Flat for Rent in {locationName}, {cityName}</h3>
      <h4>
        This flat in {locationName}, {cityName} offers a handy rental option for anyone who wants a compact, manageable, and city-friendly living space. 
        Flats in this area are liked for their straightforward layouts, peaceful building environment, and easy access to essential services. 
        Whether you’re searching for a studio, a standard apartment, or a bigger multi-room flat, you’ll find rental choices that suit different living styles and budgets.
      </h4>

      <h4>
        People often pick {locationName} because it gives a good mix of residential calm and accessibility to main city routes.
      </h4>

      <h3>Inside the Flat – Rental Living in {locationName}, {cityName}</h3>

      <ul className='rent-property-lis px-3'>
        <h4>This flat supports a smooth daily routine with features like:</h4>

        <li><b>Easy-to-maintain layout:</b> An organised floor plan that doesn’t require heavy upkeep.</li>
        <li><b>Comfortable building setting:</b> Shared areas and entrance ways built for regular use.</li>
        <li><b>Ready connections:</b> Electricity, gas, water, and ventilation are arranged for everyday comfort.</li>
        <li><b>Practical room planning:</b> Bedrooms, bathrooms, kitchen, and lounge placed to support normal family or individual use.</li>

        <h4 style={{ marginTop: '28px' }}>
          With clinics, shops, schools, parks, and transport options reachable within a short distance, tenants can manage daily responsibilities without travelling far.
        </h4>
      </ul>

      <h3>Why This Flat Appeals to Renters</h3>
      <h4>
        This flat is suitable for students, working professionals, couples, and small families who want a convenient living space without managing a full house. 
        If you’re moving closer to your workplace, shifting from a hostel, or upgrading from a shared room, this flat offers enough comfort, reasonable space, and easy access to city facilities.
      </h4>

      <h4>
        The smart use of space, core amenities, and its position within {locationName} help reduce stress in day-to-day living.
      </h4>

      <h3>Find the Right Flat with Pakistan Property</h3>
      <h4>
        Pakistan Property allows you to shortlist flats by rent, size, and location, and compare details side-by-side so that choosing a flat becomes faster and more straightforward.
      </h4>
    </div>
  )
}

export default FlatForRent
