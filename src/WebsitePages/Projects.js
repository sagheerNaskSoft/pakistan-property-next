import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Banner from '../Component/Projects/Banner'
import Categories from '../Component/Projects/Categories'
import FeaturedProjects from '../Component/Projects/FeaturedProjects'
import FeaturedDevelopers from '../Component/Projects/FeaturedDevelopers'
import TrustedProjects from '../Component/Projects/TrustedProjects'
import BrowseProjects from '../Component/Projects/BrowseProjects'
import TopProjects from '../Component/Projects/TopProjects'
import OurCommunity from '../Component/HomePage/OurCommunity'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useAuth } from '../Context/ContextProvider'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function Projects() {
  const { getProjects, projectTypeData, loading } = useAuth()
  const [projectData, setProjectData] = useState()
  const param = useParams()
  const slug = param.slug
  

  let textData = {};
  if (slug === 'high-rise') {
    textData = {
      heading1: 'Search New High-Rise Projects in Pakistan',
      para: "Browse premium high-rise projects in Pakistan, from residential towers to commercial plazas. Pakistan Property helps you locate high-rise projects, all verified and easy-to-list options.",
      title1: 'Browse High-Rise Projects in Pakistan by Type',
      title2: 'Top High-Rise Buildings Projects',
      title3: 'Leading High-Rise Builders & Developers',
      title4: 'Building Trust Through Verified High-Rise Projects',
      title5: 'Browse High-Rise Projects by City',
      title6: "Popular High-Rise Developers & Builders",
      title7: "Get Details on High-Rise Projects and Trusted Developers",
      projectInsights: [
        {
          title: "Project Evaluation Criteria",
          description:
            <>The trusted <b>commercial plaza projects in Pakistan listing</b> is based on how well each project is planned and how consistently it moves forward. Pakistan Property reviews each tower’s design approach, structural planning, and development progress to ensure users see only reliable and active high-rise projects.</>,
          list: [
            "Review the project plans and confirm visible progress.",
            "Confirm the NOC and approvals from the concerned authorities.",
            "Check the developer’s past work and overall reputation in earlier projects.",
          ]
        },
        {
          title: "Pricing Structure & Plans",
          description:
           <>
           High-rise projects with clear pricing create confidence for buyers. Pakistan Property reviews payment plan for <b>
           tall tower apartment projects in Pakistan</b>, to ensure transparency in installments, total cost, and possession timelines.
           </>,
          list: [
            "Convey a clear installment structure.",
            "Pricing compared to similar buildings in the area.",
            "Payment terms aligned with the project’s progress.",
          ]
        },
        {
          title: "Location and Accessibility Review",
          description:
            <>
            The value of a <b>high-rise commercial real estate in Pakistan</b> depends on its surroundings. The experts at Pakistan Property check how easily the tower connects to main roads, business districts, public transport, and other important factors for both residential towers and commercial plazas.
            </>,
          list: [
            "Road access and nearby city landmarks.",
            "Nearby workplaces, public services, and essential facilities.",
            "Local environment and overall accessibility.",
          ]
        },
        {
          title: "Amenities and Development Features",
          description:
            "A dependable high-rise offers more than height; it delivers comfort, safety, and practical features. Pakistan Property highlights buildings that provide essential facilities to support modern living and business needs. We ensure;",
          list: [
            "Core building facilities such as elevators, backup power, parking, and security arrangements.",
            "Spaces designed for business activity, visitor use, and general public convenience.",
            "Overall build quality, utility setup, and compliance with safety requirements.",
          ]
        },
        {
          title: "Booking and Communication Standards",
          description:
           <>
           A smooth process adds trust. Pakistan Property ensures that each listed or <b>upcoming high-rise development in Pakistan</b> offers simple communication and easy-to-follow steps for booking, inquiries, or project details.
           </>,
          list: [
            "Clear contact options.",
            "Easy access to project plans and relevant data.",
            "Verified sales representatives for guidance.",
          ]
        }
      ]
    }
  } else if (slug === 'housing-societies') {
    textData = {
      heading1: 'Find the New Housing Societies in Pakistan',
      para: <>
        Browse the latest <b>housing societies in Pakistan</b> with top residential projects and new housing developments. Pakistan Property connects you with verified listings and trusted developers, making it easy to find and list the housing society projects.
      </>,
      title1: 'Search Housing Societies in Pakistan by Category',
      title2: 'Featured Property Projects',
      title3: 'Trusted Developers Behind Pakistan’s Best Housing Societies',
      title4: 'Verified Housing Society Listings in Pakistan',
      title5: 'Explore Top Housing Societies by City',
      // title6:"Top Developers of Residential Housing Projects",
      title7: "Learn More About New Housing Societies Projects & Developers",


      projectInsights: [
        {
          title: "Project Evaluation Criteria",
          description:
            "A trusted housing project begins with a clear vision and a stable plan. At Pakistan Property, we review every society’s legal progress, the status of new housing development projects, and approval stages to understand how reliable the project truly is. Our goal is to give users the confidence that a project is genuine, progressing properly, and supported by credible developers.",
          list: [
            "Verify the project’s development plans and confirm real progress.",
            "Review its NOC and approval status with the right authorities.",
            "The developer’s track record and past performance are evaluated.",
          ]
        },
        {
          title: "Pricing Structure & Plans",
          description:
            "We believe that a reliable project shares clear and honest pricing. Pakistan Property lists the latest housing societies in Pakistan where payment schedules are simple, flexible, and well-structured. We look closely at how clearly the developer explains installments, possession timelines, and total cost to ensure buyers face no hassle.",
          list: [
            "Clear installment breakdowns.",
            "Fair pricing compared to the local market.",
            "Payment terms matched with the construction pace.",
          ]
        },
        {
          title: "Location and Accessibility Review",
          description:
            "Location plays a major role in a project’s long-term value. We assess how easily society connects to key areas such as schools, hospitals, business zones, and main roads. This helps users find the best housing societies in Pakistan that offer real convenience.",
          list: [
            "Road links, nearby landmarks, and approach routes.",
            "Security and community surroundings.",
            "Practical distance from commercial and residential zones.",
          ]
        },
        {
          title: "Amenities and Development Features",
          description:
            "Reliable housing societies are those that provide practical facilities that improve everyday living. Pakistan Property checks the new real estate projects in Pakistan, whether they offer essential amenities, and whether they are already under construction or in active use.",
          list: [
            "Parks, mosques, security systems, and community spaces.",
            "Commercial areas and basic utilities.",
            "Infrastructure quality, including roads and wiring.",
          ]
        },
        {
          title: "Booking and Communication Standards",
          description:
            "The real estate housing projects in Pakistan become trustworthy when communication is simple and transparent. Pakistan Property encourages societies to offer easy booking steps so buyers can contact the right person without delays.",
          list: [
            "Clear inquiry and booking process.",
            "Verified contact details of relevant sales teams.",
            "Simple options like forms or call-back requests.",
          ]
        }
      ]

    }
  }

  useEffect(() => {
    let typeId = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === param.slug)?.id
    const fetchProjects = async () => {
      try {
        const projectResult = await getProjects({ project_type_id: typeId });
        setProjectData(projectResult?.data?.data)
        window.scrollTo(0,0)
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };
    fetchProjects()
  }, [param.slug])

  return (
    <>
      <style>{`
        @media (max-width: 576px) {
          .project-placeholder .placeholder {
            width: calc(50% - 12px) !important;
          }
        }
      `}</style>
      <Helmet>
        <title>
          {slug === 'high-rise'
            ? 'New High-Rise Buildings & Projects in Pakistan'
            : slug === 'housing-societies'
              ? 'Pakistan Housing Societies - New & Upcoming Projects'
              : 'New Projects in Pakistan - Verified Projects'
              
              }
        </title>
        <meta
          name="description"
          content={
            slug === 'high-rise'
              ? 'Browse new high-rise projects across Pakistan with verified listings, reliable developers and key details to help you choose the ideal home or investments.'
              : slug === 'housing-societies'
                ? 'Find Pakistan’s newest housing societies with verified listings, trusted developers and project details to help you choose ideal home or investment option.'
                : 'Discover the latest projects in Pakistan. Browse verified residential and commercial towers with clear pricing, developer information, and easy contact options.'
          }
        />
      </Helmet>
      <NavBar />
      <Banner data={textData} />


      {loading ?
        <div className="secondary-color" style={{ overflowX: 'hidden' }}>
          <div className="main-container" style={{marginTop:window?.innerWidth <= 576 ? '20px' : '125px'}}>
            <div className='placeholder-glow project-placeholder d-flex flex-wrap' style={{ gap: "24px" , marginTop:0 , paddingTop:"0"}}>
              {[...Array(12)].map((_, idx) => {
                return (
                  <div 
                    key={idx}
                    className='placeholder border rounded' 
                    style={{ 
                      height: "150px", 
                      width: "183px"
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
        : <>
          <div className="secondary-color" style={{ overflowX: 'hidden' }}>
            <div className="main-container">
              <div className="d-flex" style={{ gap: "40px", flexDirection: 'column' }}>
                <Categories data={textData?.title1} categoryData={projectData?.projects_by_categories} />
                {projectData?.featured_projects?.length > 0 &&
                  <FeaturedProjects data={textData?.title2} featuredProjectsData={projectData?.featured_projects} />
                }
                {projectData?.trusted_developers?.length > 0 &&
                  <FeaturedDevelopers featuredDevelopersData={projectData?.trusted_developers} data={textData?.title3} />
                }
              </div>
            </div>
              {param?.slug && window.innerWidth > 576?<TrustedProjects arrayData={textData?.projectInsights} data={textData?.title4} />:""}
              {param?.slug && window.innerWidth <= 576?<TrustedProjects arrayData={textData?.projectInsights} data={textData?.title4} />:""}
              <div className="main-container">
            <div className="d-flex" style={{ gap: "40px", flexDirection: 'column' , marginTop:"40px"}}>
                {projectData?.projects_by_cities?.length > 0 &&
                  <BrowseProjects data={textData?.title5} citiesProject={projectData?.projects_by_cities} slug={slug} />
                }
                {projectData?.top_developers?.length > 0 &&
                  <TopProjects topDevelopersData={projectData?.top_developers} data={textData?.title6} />
                }
                <OurCommunity data={textData?.title7} />
                <PreProperty />

              </div>
            </div>
          </div>
          <div className="main-container">
            <Footer />
          </div>
        </>

      }


    </>
  )
}

export default Projects
