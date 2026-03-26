import React from 'react'

function LowerPortion({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>A Ground-Floor Lower Portion for Rent in {locationName}, {cityName}</h3>
      <h4>
        This lower portion in {locationName}, {cityName} offers ground-level comfort for tenants who prefer direct access and wider interior space. 
        Lower portions here are often chosen by families, senior citizens, and those who prefer not to use stairs regularly.
      </h4>

      <h4>
        Many renters choose {locationName} for lower portions because the area remains relatively calm while still being near daily-use services.
      </h4>

      <h3>Key Features of This Lower Portion</h3>

      <ul className='rent-property-lis px-3'>
        <h4>This rental portion includes:</h4>

        <li><b>Direct entry:</b> Access from ground level, easier for children, elders, and visitors.</li>
        <li><b>Spacious rooms:</b> Bedrooms, lounge, kitchen, and bathrooms are typically sized for family living.</li>
        <li><b>Naturally cooler indoor feel:</b> Being closer to the ground often helps maintain a moderate temperature in warmer months.</li>
        <li><b>Functional outside area:</b> Some units offer a small courtyard, washing corner, or side passage for chores.</li>
        <li><b>Core services available:</b> Water, gas, electricity, and ventilation are arranged for regular use.</li>

        <h4 style={{ marginTop: '28px' }}>
          Local shops, medical facilities, schools, and bus or rickshaw stops nearby make regular tasks simpler.
        </h4>
      </ul>

      <h3>Why Renting This Lower Portion Makes Sense</h3>
      <h4>
        This lower portion is suitable for tenants who want easy movement, a family-friendly setting, and a layout that doesn’t feel cramped. 
        It’s a sensible choice for people planning to rent for several months or years without feeling locked into a lease structure.
      </h4>

      <h3>Explore Lower Portion Rentals with Pakistan Property</h3>
      <h4>
        On Pakistan Property, you can filter the lower portion listings by rent, size, and locality, and easily compare what different owners are offering.
      </h4>
    </div>
  )
}

export default LowerPortion
