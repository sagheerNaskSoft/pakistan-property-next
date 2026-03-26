import React, { useState, useEffect } from 'react'
import BreadCrumb from '../Metiral/BreadCrumb'
import img from '../../Asset/Features_img/Wave.svg'
import ShareModal from '../Metiral/ShareModal'
import GridCard from '../Metiral/GridCard'
import NoResultFound from '../Metiral/NoResultFound'
import CardLoding from '../Metiral/CardLoding'
import { useAuth } from '../../Context/ContextProvider'

import Image from 'next/image';
function Banner({ developerData }) {
  const [open, setOpen] = useState(false)
  const { citiesList } = useAuth()
  const [cityName, setCityName] = useState("")

  const handleOpen = () => setOpen(true)

  // ✅ Match city code with city name safely
  useEffect(() => {
    if (developerData?.developer?.city_code && citiesList?.length) {
      const matchedCity = citiesList.find(
        (item) => item?.app_code === developerData?.developer?.city_code
      )
      setCityName(matchedCity?.city || "Unknown City")
    }
  }, [developerData, citiesList])

  // Loading state
  if (!developerData || !developerData?.developer) {
    return (
      <>
        <div className='developer-detail-page'>
          {/* Breadcrumb placeholder - Desktop only */}

          {/* Developer detail card placeholder */}
          <div className='developer-detail-card flex-sm-row flex-column'>
            <Image className='wave_img' src={img} alt="wave" />

            <div className='devlepor-box'>
              {/* Logo placeholder */}
              <div className="img-box placeholder-glow">
                  <div className='placeholder w-100 h-100' style={{ borderRadius: '8px' }} />
              </div>

              <div className='developer-headings'>
                <div>
                  {/* Name placeholder */}
                  <div className='placeholder-glow mb-2'>
                    <div className='placeholder' style={{ width: '250px', height: '32px' }} />
                  </div>
                  {/* Address placeholder */}
                  <div className='placeholder-glow mb-3'>
                    <div className='placeholder' style={{ width: '200px', height: '20px' }} />
                  </div>

                  {/* Stats placeholder - Desktop */}
                  <div className='develop-lower-heading d-sm-flex d-none'>
                    <div>
                      <div className='placeholder-glow mb-1'>
                        <div className='placeholder' style={{ width: '40px', height: '28px' }} />
                      </div>
                      <div className='placeholder-glow'>
                        <div className='placeholder' style={{ width: '60px', height: '18px' }} />
                      </div>
                    </div>
                    <div className='developer-line'></div>
                    <div>
                      <div className='placeholder-glow mb-1'>
                        <div className='placeholder' style={{ width: '40px', height: '28px' }} />
                      </div>
                      <div className='placeholder-glow'>
                        <div className='placeholder' style={{ width: '50px', height: '18px' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share button placeholder */}
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                </div>
              </div>
            </div>

            {/* Stats placeholder - Mobile */}
            <div className='develop-lower-heading d-flex d-sm-none w-100 justify-content-around' style={{ marginTop: '16px' }}>
              <div className='d-sm-block d-flex gap-1 align-items-center'>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '30px', height: '24px' }} />
                </div>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '60px', height: '16px' }} />
                </div>
              </div>
              <div className='developer-line'></div>
              <div className='d-sm-block d-flex gap-1 align-items-center'>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '30px', height: '24px' }} />
                </div>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '50px', height: '16px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* About Developer section placeholder */}
          <div className='new-detial-page-container'>
            <div className='developers-peragraphs'>
              <div className='placeholder-glow mb-3'>
                <div className='placeholder' style={{ width: '180px', height: '32px' }} />
              </div>
              <div className='placeholder-glow d-flex flex-column gap-2'>
                <div className='placeholder' style={{ width: '100%', height: '16px' }} />
                <div className='placeholder' style={{ width: '100%', height: '16px' }} />
                <div className='placeholder' style={{ width: '90%', height: '16px' }} />
                <div className='placeholder' style={{ width: '85%', height: '16px' }} />
                <div className='placeholder' style={{ width: '95%', height: '16px' }} />
              </div>
            </div>

            {/* Developer Projects section placeholder */}
            <div className='row mx-0 mb-5 mt-4'>
              <div className='developers-peragraphs p-0 mb-3'>
                <div className='placeholder-glow'>
                  <div className='placeholder' style={{ width: '200px', height: '32px' }} />
                </div>
              </div>
              {/* Grid cards placeholder */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className='col-lg-4 col-md-6 col-12 px-sm-3 px-0'>
                  <CardLoding />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='developer-detail-page'>
        <span className='d-none d-sm-inline-block'>
          <BreadCrumb
            items={[
              'Home',
              // 'New Projects',
              // cityName || 'City',
              developerData?.developer?.name || 'Developer'
            ]
            }
            paths={[
              '/',
              // `/developer-listing/${developerData?.developer?.id}`
            ]}
          />
        </span>

        <div className='developer-detail-card flex-sm-row flex-column'>
          <Image className='wave_img' src={img} alt="wave" />

          <div className='devlepor-box'>
            <div className="img-box">
              <img
                src={developerData?.developer?.logo_url || developerData?.developer?.logo}
                alt={developerData?.developer?.name}
              />
            </div>

            <div className='developer-headings'>
              <div>
                <h2>{developerData?.developer?.name}</h2>
                <span>
                  <svg
                    style={{ marginRight: '4px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z"
                      stroke="white"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z"
                      stroke="white"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {developerData?.developer?.address}{cityName && `, ${cityName}`}
                </span>

                <div className='develop-lower-heading d-sm-flex d-none'>
                  <div>
                    <h2>{developerData?.projects?.length || 0}</h2>
                    <h5>Projects</h5>
                  </div>
                  <div className='developer-line'></div>
                  <div>
                    <h2>{developerData?.developer?.experience || 'Less then 1'}</h2>
                    <h5>Years</h5>
                  </div>
                </div>
              </div>

              <button className='share_btn' onClick={handleOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="white" />
                </svg>
              </button>
            </div>
          </div>
          <div className='develop-lower-heading d-flex d-sm-none w-100 justify-content-around' style={{ marginTop: '16px' }}>
            <div className='d-sm-block d-flex gap-1 align-items-center'>
              <h2 >{developerData?.projects?.length || 0}</h2>
              <h5>Projects</h5>
            </div>
            <div className='developer-line'></div>
            <div className='d-sm-block d-flex gap-1 align-items-center'>
              <h2>{developerData?.developer?.experience || 'Less then 1'}</h2>
              <h5>Years</h5>
            </div>
          </div>
        </div>

        <div className='new-detial-page-container'>
          <div className='developers-peragraphs'>
            <h2>About Developer</h2>
            <h5>{developerData?.developer?.description}</h5>
          </div>

          <div className='row mx-0 mb-5'>
            <div className='developers-peragraphs p-0'>
              <h2>Developer Projects</h2>
            </div>
            {developerData?.projects && developerData.projects.length > 0 ? (
              developerData.projects.map((project, index) => (
                <div key={index} className='col-lg-4 col-md-6 col-12 px-0'>
                  <GridCard small={true} data={project} />
                </div>
                
              ))
            ) : (
              <div className='col-12 p-0'>
                <NoResultFound marginTop="20px" />
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal open={open} setOpen={setOpen} />
    </>
  )
}

export default Banner
