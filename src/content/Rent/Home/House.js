import React from 'react'

function RentalHouse({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>Find a Comfortable House for Rent in {locationName}, {cityName}</h3>
      <h4>
        If you’re planning to rent a house in {locationName}, {cityName}, this option gives you a practical and homely place to settle into without the long-term commitment of buying or leasing. 
        Houses in this locality are appreciated for their user-friendly layouts, calm street views, and close proximity to everyday facilities. 
        Whether you need a smaller unit to manage monthly costs or a larger house to accommodate family routines, the rental choices here can match different lifestyles and budgets.
      </h4>
      <h4>
        Renters often prefer {locationName} because it combines comfort, convenience, and a neighbourhood setting that supports daily life with fewer hassles.
      </h4>

      <h3>Living Experience in {locationName}, {cityName} – What This Rental House Offers</h3>
      <ul className='rent-property-lis px-3'>
        <h4>This rented house is designed to make day-to-day living easy:</h4>

        <li><b>Relaxing indoor area:</b> A living space that can comfortably hold regular furniture and family activities.</li>
        <li><b>Sense of privacy:</b> A defined residential setting that helps you feel secure in your own space.</li>
        <li><b>Move-in-ready utilities:</b> Water, electricity, gas, and ventilation are arranged so you can start living with minimal setup.</li>
        <li><b>Everyday-friendly layout:</b> Bedrooms, bathrooms, kitchen, and lounge positioned in a way that keeps movement simple.</li>

        <h4 style={{ marginTop: '28px' }}>
          Nearby grocery points, schools, pharmacies, parks, and transport stops make it easier to handle shopping, commuting, and basic errands in less time.
        </h4>
      </ul>

      <h3>Why This Rental House Is a Good Fit</h3>
      <h4>
        This house works well for tenants who want a peaceful place to live with the flexibility of a rental agreement. 
        Whether you’re relocating for work, trying a new area before buying, or simply looking for a place that supports family routines, this home offers a balanced mix of comfort and practicality.
      </h4>
      <h4>
        With its functional room planning, ready services, and location inside {locationName}, everyday living becomes simpler to manage, from school runs to office commutes.
      </h4>

      <h3>Pakistan Property – Helping You Discover Houses for Rent</h3>
      <h4>
        On Pakistan Property, you can quickly explore multiple house rental options, compare areas, see rent ranges, and read clear property details so you can choose a suitable house with confidence.
      </h4>
    </div>
  )
}

export default RentalHouse
