import React from 'react'

function RoomForRent({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>Find a Comfortable Room for Rent in {locationName}, {cityName}</h3>
      <h4>
        This room in {locationName}, {cityName} is a practical choice for individuals who want an independent space without taking on the cost and responsibility of a full house or flat. 
        Rooms in this area are favoured by students, employees, and travellers for their affordability and simplicity.
      </h4>

      <h4>
        Many tenants choose {locationName} because it connects easily to workplaces, institutes and city facilities.
      </h4>

      <h3>Living Highlights of This Rental Room</h3>

      <ul className='rent-property-lis px-3'>
        <h4>This rented room provides:</h4>

        <li><b>Tidy interior:</b> Space for a bed, cupboard, study table or other basic furniture without overcrowding.</li>
        <li><b>Private use:</b> A dedicated room that can be locked and maintained according to your routine.</li>
        <li><b>Basic utilities:</b> Arrangements for electricity, water, and ventilation for comfortable daily use.</li>
        <li><b>Straightforward layout:</b> Simple structure that keeps cleaning and organising easy.</li>
        <li><b>Quiet surroundings:</b> A calm environment suitable for resting, studying, or working.</li>

        <h4 style={{ marginTop: '28px' }}>
          Nearby eateries, grocery shops, bus stops, and service points help tenants manage their day without travelling long distances.
        </h4>
      </ul>

      <h3>Why This Room Works for Renters</h3>
      <h4>
        This room is ideal for people looking for a budget-friendly and low-maintenance option—such as students, office staff, or individuals new to the city. 
        It gives you privacy while still keeping your monthly expenses under control.
      </h4>

      <h3>Find the Right Room with Pakistan Property</h3>
      <h4>
        Pakistan Property helps you review room rentals in different price ranges and areas so you can quickly identify an option that fits your budget and daily route.
      </h4>
    </div>
  )
}

export default RoomForRent
