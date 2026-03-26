import React from 'react'

function Room({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>A Suitable Room Available in {locationName}, {cityName}</h3>
      <h4>
        This room in {locationName}, {cityName} offers a simple and manageable space for buyers who prefer a compact setup with essential features. 
        The space is built to support personal use, keeping things organized without needing a large area. 
        Whether it's meant for living or maintaining a private corner away from shared environments, this room provides a straightforward option within the locality.
      </h4>

      <h3>What This Room Adds to Your Living Experience in {locationName}, {cityName}</h3>

      <ul className='rent-property-lis px-3'>
        <h4>The room brings a set of features designed to keep living simple and focused:</h4>

        <li>
          <b>Well-defined interior:</b> The room has enough space to arrange basic furniture without making the area feel crowded.
        </li>
        <li>
          <b>Utility-ready setup:</b> Access to essential utilities ensures that the room can be used comfortably from the first day.
        </li>
        <li>
          <b>Personal environment:</b> The enclosed setting maintains privacy, making it suitable for individuals who need a dedicated space.
        </li>
        <li>
          <b>Easy indoor use:</b> The layout keeps movement simple, helping the room stay functional and uncluttered.
        </li>

        <h4 style={{ marginTop: '28px' }}>
          Nearby in {locationName}, small shops, transport stops, and essential service points make basic tasks easy and time-saving.
        </h4>
      </ul>

      <h3>Reasons This Room May Fit Your Requirements</h3>
      <h4>
        This room works well for buyers wanting an uncomplicated space with minimal upkeep. 
        Its size, privacy, and straightforward layout make it a practical choice for students, working individuals, or anyone who needs a personal area 
        without the responsibilities of managing a full-sized property. {locationName} adds to the ease with nearby services accessible whenever needed.
      </h4>

      <h3>Pakistan Property – Making Room Searches Easier</h3>
      <h4>
        Pakistan Property helps you explore available rooms across different areas through clear details and an organized listing experience. 
        With verified entries and simple browsing tools, the platform supports confident and informed selection, allowing you to find a room that suits your needs without complications.
      </h4>
    </div>
  )
}

export default Room
