import React from 'react'
import PrimaryButton from '../../Component/Metiral/Button/PrimaryButton'
import { useNavigate } from 'react-router-dom'
import { FallbackImage } from '../Metiral/FallbackImage'
function Developer({ projectData }) {

  const navigate = useNavigate()

  return (
    <>
      <div id='developers-sections' className='developer-projects mt-2 mb-5 ps-0'>
        <h3 className='mb-3'>About Developer</h3>
        <div className="developer-card">
          <div className="top">
            <div className='Developers-imgs'>
              <FallbackImage src={projectData?.developer?.logo_url || projectData?.developer?.logo} alt='.../' componentName="Developer" />

            </div>
            <div className="text-box">
              <h3>{projectData?.developer?.name}</h3>
              <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg> <div className='location-text'>{projectData?.developer?.address + "," + projectData?.developer?.city?.city}</div></h4>
            </div>
          </div>
          <div className="description">
            {projectData?.developer?.description}
          </div>
          <PrimaryButton text={"View Developer Profile"} onFunction={() => {
            navigate(`/developer-profile/${projectData?.developer?.slug}`)
          }} />
        </div>
      </div>
    </>
  )
}

export default Developer
