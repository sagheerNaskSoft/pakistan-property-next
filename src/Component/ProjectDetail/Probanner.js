
import { useParams } from 'react-router-dom'
import ShareModal from '../PropertyDetail/ShareModal'
import { FallbackImage } from '../Metiral/FallbackImage'
import Breadcrumb from '../Metiral/BreadCrumb'
import { useAuth } from '../../Context/ContextProvider'

function Probanner({ data }) {
    const { id } = useParams()
    const { projectTypeData } = useAuth()
    const selectedTypes = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === id)
    return (
        <>
            <div className='pro-banner'>
                <div className='row m-0 w-100 pt-2 d-sm-block d-none'>
                    <div className='detail-lis ps-0'>
                        <ul className='detil-p p-0'>
                            <Breadcrumb items={["Home", "New Projects", `${selectedTypes?.name ? selectedTypes?.name + "in" : ''}  ${data?.city?.city}`, data?.project_title]}
                                paths={["/",
                                    `/new-projects/${id}`,
                                    `/project-listing/${id}?city_code=${data?.city?.app_code}&project_type_id=${selectedTypes?.id}`
                                ]}
                            />
                        </ul>
                    </div>
                </div>
                <div className='detail-heading d-flex d-sm-flex d-none align-items-center' style={{ marginBottom: '16px' }}>
                    <div className='project-logo'>
                        <FallbackImage src={data?.developer_logo} alt='.../' componentName="Probanner" />
                    </div>
                    <div style={{ width: '-webkit-fill-available' }}>
                        <h1 style={{ marginBottom: '0px', marginTop: '5px' }}>{data?.project_title}</h1>
                        <div className='detail-p'>
                            <p style={{ marginBottom: "0", marginTop: '7px', display: "flex", alignItems: "center", gap: "4px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3346 6.66634C13.3346 9.99501 9.64197 13.4617 8.40197 14.5323C8.28645 14.6192 8.14583 14.6662 8.0013 14.6662C7.85677 14.6662 7.71615 14.6192 7.60064 14.5323C6.36064 13.4617 2.66797 9.99501 2.66797 6.66634C2.66797 5.25185 3.22987 3.8953 4.23007 2.89511C5.23026 1.89491 6.58681 1.33301 8.0013 1.33301C9.41579 1.33301 10.7723 1.89491 11.7725 2.89511C12.7727 3.8953 13.3346 5.25185 13.3346 6.66634Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#737678" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>{data?.location?.name}, {data?.city?.city}</p>
                            <div className='detail-icon'>
                                <div className="icon-hover-box">
                                    <div className="tooltip">Share</div>
                                    <span style={{ marginRight: '0px' }}>
                                        <ShareModal />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Probanner
