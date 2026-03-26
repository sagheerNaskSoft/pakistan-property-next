import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Probanner from '../Component/ProjectDetail/Probanner'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Projectbanner from '../Component/ProjectDetail/Projectbanner'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import SideIcon from '../Component/ProjectDetail/SideIcon'
import { useAuth } from '../Context/ContextProvider'
import { useParams } from 'react-router-dom'
import PageLoading from '../Component/Metiral/PageLoading'

function ProjectDetail() {
  const { projectDetail,loading } = useAuth()
  const params = useParams()
  const [data, setData] = useState({})
  const [aminitiesWithCategory, setAminitiesWithCategory] = useState([])
  useEffect(() => {
    const featchProjectDetail = async (id) => {
      try {
        // Fetch property data
        const projectResult = await projectDetail(id);
        setData(projectResult?.data?.data?.project);
        setAminitiesWithCategory(projectResult?.data?.data?.categories_with_amenities);
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    }
    featchProjectDetail(params?.slug)
  }, [params?.slug])
  return (
    <>
      {data?.project_title && (
        <Head>
          <title>{data.project_title} - Pakistan Property</title>
          <meta name="description" content={data?.project_description?.replace?.(/<[^>]+>/g, '')?.slice(0, 160) || ''} />
          <meta property="og:image" content={(() => {
            const img = data?.project_cover_image || data?.images?.[0]?.url;
            if (img) return img;
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            return `${origin}/previewImgae.jpg`;
          })()} />
          <meta property="og:title" content={data.project_title} />
          <meta property="og:description" content={data?.project_description?.replace?.(/<[^>]+>/g, '')?.slice(0, 160) || ''} />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Pakistan Property" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>
      )}
      <div>
        <NavBar prevButton={true} />

        {loading?        <div className="secondary-color p-1">
          <div className={window?.innerWidth <= 576 ? 'mx-0 mb-0' : 'main-container'}>
            <PageLoading />
          </div>
        </div>:
          <>
              <div style={{ position: 'relative' }} className="secondary-color">
          <div className="main-container project-detail-main-container">
            <Probanner data={data} />

            <Projectbanner aminitiesWithCategory={aminitiesWithCategory} projectData={data} />

            <div className="project-main-container">
              <PreLocation />
              <PreProperty />
            </div>
          </div>

          <div style={{ position: 'absolute', top: '115px' }}>
            <SideIcon projectData={data}  />
          </div>
        </div>
        <div className="main-container">
          <Footer />
        </div>
          </>
        }
    
      </div>
    </>
  );
}

export default ProjectDetail;
