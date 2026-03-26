import { Link, useNavigate } from 'react-router-dom'
import img from '../../Asset/Projects/23424257eb0f1bc5fd79c0463b39426d97fcf4e9.jpg'
import { FallbackImage } from '../Metiral/FallbackImage'
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'

function TopProjects({ topDevelopersData, data }) {
    const navigate = useNavigate()

    // Slice the data to show only first 5 developers
    const developersToShow = topDevelopersData && topDevelopersData.length > 0 
        ? topDevelopersData.slice(0, 5) 
        : []

    return (
        <>
            <div className="top-projects">
                <div className="heading">Top 5 developers in Pakistan</div>
                <div className="para">Explore the most trusted and renowned property developers in Pakistan. These companies have established a strong reputation for delivering quality projects and exceptional customer service.</div>

                { developersToShow.length > 0 && (
                    <div className="developers-table">
                        <div className="developers-table-header">
                            <div className="table-col">#</div>
                            <div className="table-col">Developer</div>
                            <div className="table-col">Location</div>
                            <div className="table-col">Projects</div>
                            <div className="table-col">View</div>
                        </div>
                        <div className="developers-table-body">
                            {developersToShow.map((developer, index) => (
                            <div key={index} className="developers-table-row">
                                <div className="table-col">{index + 1}</div>
                                <div className="table-col developer-col">
                                    <div className="developer-info">
                                        <div className="developer-icon">
                                           {developer?.logo_url ? <FallbackImage style={{width: '100%', height: '100%',objectFit: 'contain'}} src={developer?.logo_url} alt='...' componentName="TopProjects" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22H6Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 12H4C3.46957 12 2.96086 12.2107 2.58579 12.5858C2.21071 12.9609 2 13.4696 2 14V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H6" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H18" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 6H14" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 10H14" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 14H14" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 18H14" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>}
                                        </div>
                                        <div className="developer-details">
                                            <div className="developer-name">{developer?.name || '-'}</div>
                                            {developer?.established_year && (
                                                <div className="developer-est">Est. {developer.established_year}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="table-col location-col">
                                    <div className="location-info">
                                        <div className="location-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M13.3334 6.66634C13.3334 9.99501 9.64075 13.4617 8.40075 14.5323C8.28523 14.6192 8.14461 14.6662 8.00008 14.6662C7.85555 14.6662 7.71493 14.6192 7.59941 14.5323C6.35941 13.4617 2.66675 9.99501 2.66675 6.66634C2.66675 5.25185 3.22865 3.8953 4.22885 2.89511C5.22904 1.89491 6.58559 1.33301 8.00008 1.33301C9.41457 1.33301 10.7711 1.89491 11.7713 2.89511C12.7715 3.8953 13.3334 5.25185 13.3334 6.66634Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8 8.66699C9.10457 8.66699 10 7.77156 10 6.66699C10 5.56242 9.10457 4.66699 8 4.66699C6.89543 4.66699 6 5.56242 6 6.66699C6 7.77156 6.89543 8.66699 8 8.66699Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="location-text">{developer?.city?.city || developer?.address || '-'}</div>
                                    </div>
                                </div>
                                <div className="table-col projects-col">
                                    <div className="projects-info">
                                        <div className="projects-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M10.6667 4.66699H14.6667V8.66699" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14.6666 4.66699L8.99992 10.3337L5.66659 7.00033L1.33325 11.3337" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="projects-text">{developer?.projects_count || developer?.projects?.length || 0} Projects</div>
                                    </div>
                                </div>
                                <div className="table-col view-col align-items-center justify-content-center">
                                    <Link
                                    to={`/developer-profile/${developer?.slug}`}
                                    >
                                    <div
                                        className="view-link"
                                        // onClick={() => navigate(`/developer-profile/${developer?.slug}`)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M12.5 2.5H17.5V7.5" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8.33325 11.6667L17.4999 2.5" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    </Link>
                                
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
{/* 
                <div className="d-flex justify-content-center align-items-center" style={{marginTop:"16px"}}>
                    <PrimaryBorderButton text={"View All Developers"} />
                </div> */}

            </div>
        </>
    )
}

export default TopProjects
