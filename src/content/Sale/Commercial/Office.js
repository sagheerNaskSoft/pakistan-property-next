import React from 'react'

function Office({ cityName, locationName }) {
  return (
    <div className='Rent-Property'>
      <h3>Suitable Office for Sale in {locationName}, {cityName}</h3>
      <h4>
        This office in {locationName}, {cityName} offers a practical workspace option in a manageable and well-positioned area. 
        The space is suitable for a range of office needs, whether you want a small setup for day-to-day tasks or a larger area 
        that can support a growing team. Its placement in {locationName} helps maintain convenient access to nearby routes, 
        services, and common commercial points within the area.
      </h4>

      <h3>Demanded Office Features in {locationName}, {cityName}</h3>
      <ul className='rent-property-lis px-3'>
        <h4>This office includes features that support regular work routines and activity:</h4>

        <li><b>Defined working area:</b> The office layout allows space for desks, seating, and basic work arrangements.</li>
        <li><b>Functional interior:</b> The room design supports general office tasks without unnecessary complexity.</li>
        <li><b>Comfortable environment:</b> The indoor setting is suited for focused work and routine operations.</li>
        <li><b>Flexible furnishing options:</b> The space can be used as-is or arranged with furniture according to your needs.</li>

        <h4 style={{ marginTop: '28px' }}>
          Offices in {locationName} usually benefit from nearby facilities such as small shops, transport points, and service providers. 
          This helps maintain daily workflow without disruptions.
        </h4>
      </ul>

      <h3>Why This Office Location Can Be a Suitable Choice</h3>
      <h4>
        This office provides a straightforward workspace for buyers seeking a manageable area for professional use. 
        It works well for individuals who want a private office, small teams who need a focused environment, 
        or businesses that are setting up a local working point. The simplicity of the space makes it easy to adapt 
        and adjust according to your working requirements.
      </h4>
      <h4>
        The office’s placement in {locationName} also makes it easier to stay connected with nearby communities, service spots, and road links. 
        This combination of accessibility and ease of use makes the office a practical option for buyers who want a place 
        that supports consistent work activity.
      </h4>

      <h3>Simplify Office Space Selection with Pakistan Property</h3>
      <h4>
        Pakistan Property provides access to verified office listings with clear details and simple navigation. 
        You can compare office sizes, locations, and available options in one place. 
        As a trusted nationwide platform, Pakistan Property supports informed and confident decision-making 
        for anyone looking to set up or expand their workspace.
      </h4>
    </div>
  )
}

export default Office
