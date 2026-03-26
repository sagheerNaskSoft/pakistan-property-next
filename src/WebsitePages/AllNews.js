import React, { useEffect, useState } from 'react'
import Banner from '../Component/AllNews/Banner'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useAuth } from '../Context/ContextProvider'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AllNewsLoading from './AllNewsLoading'
function AllNews() {
    const {getNewsList, parseQueryParams, loading} = useAuth()
    const [blogSlider, setBlogSlider] = useState(false)
    const [blogData,setBlogData]=useState()
    const [filter,setFilter]=useState()
    const [pagination,setPagination]=useState({
        total: 0,
        per_page: 12,
        current_page: 1,
        total_pages: 0,
    })
    const location=useLocation()
    useEffect(() => {
        if (blogSlider) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100dvh';
          } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = '';
          }
          
      
        return;
      }, [blogSlider]);
    useEffect(()=>{
        const parsed=parseQueryParams(location?.search)
        setFilter(parsed)
        const fetchBlogs=async()=>{
            try{
                let result=await getNewsList({...parsed,category_slug:parsed?.category})
                if(result?.success){
                    setBlogData(result?.data?.data)
                    setPagination({
                        total: result?.data?.data?.news?.total,
                        per_page: parseInt(parsed?.per_page) || result?.data?.data?.news?.per_page,
                        current_page: parseInt(parsed?.current_page) || result?.data?.data?.news?.current_page,
                        total_pages: result?.data?.data?.news?.total_pages || result?.data?.data?.news?.last_page,
                    })
                }

            }catch{
                console.error("something went wrong")
            }
        }
        fetchBlogs()
    },[location?.search])
    if (loading) {
        return <AllNewsLoading />
    }

  return (
    <>
    <Helmet>
        <title>Pakistan Property News - Latest Real Estate Updates</title>
        <meta name="description" content="Stay updated with Pakistan Property news, covering market activity, housing initiatives, development projects & insights shaping the real estate industry." />
    </Helmet>
    <NavBar  blogSliderButton={true} setBlogSlider={setBlogSlider} />
    <Banner categoryList={blogData?.categories?.news_count_categories || []} filter={filter} pagination={pagination} blogList={blogData?.news?.data} blogSlider={blogSlider} setBlogSlider={setBlogSlider} />
    <div className='main-container'>
        <PreLocation />
        <PreProperty />
        <Footer />
    </div>
</>
  )
}

export default AllNews