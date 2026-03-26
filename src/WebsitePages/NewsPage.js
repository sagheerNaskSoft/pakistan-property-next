import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/NewsPage/Banner'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Bloglisting from '../Component/NewsPage/Bloglisting'
import { useAuth } from '../Context/ContextProvider'
import { Helmet } from 'react-helmet'
import NewsPageLoading from './NewsPageLoading'
function NewsPage() {
    const {getNewsList, loading} = useAuth()
    const [blogSlider,setBlogSlider]=useState(false)
    const [blogData,setBlogData]=useState()
    const [filterData,setFilterData]=useState({
        current_page: 1,
        per_page: 12,
    })
    const [pagination,setPagination]=useState({
        total: 0,
        per_page: 12,
        current_page: 1,
        total_pages: 0,
    })
    useEffect(()=>{
        const fetchBlogs=async()=>{
            try{
                let result=await getNewsList({per_page:12,current_page:1})
                if(result?.success){
                    setBlogData(result?.data?.data)
                    setPagination({
                        total: result?.data?.data?.news?.total,
                        per_page: result?.data?.data?.news?.per_page,
                        current_page: result?.data?.data?.news?.current_page,
                        total_pages: result?.data?.data?.news?.total_pages || result?.data?.data?.news?.last_page,
                    })
                }

            }catch{
                console.error("something went wrong")
            }
        }
        fetchBlogs()
    },[])

    useEffect(() => {
        if (blogSlider) {
            document.body.style.height = '100dvh'
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.height = ''
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.height = ''
            document.body.style.overflow = ''
        }
    }, [blogSlider])
    if (loading) {
        return <NewsPageLoading />
    }

  return (
    <div>
        <Helmet>
            <title>Pakistan Property News - Latest Real Estate Updates</title>
            <meta name="description" content="Stay updated with Pakistan Property news, covering market activity, housing initiatives, development projects & insights shaping the real estate industry." />
        </Helmet>
    <NavBar blogSliderButton={true} setBlogSlider={setBlogSlider} />
    <Banner blogData={blogData?.featured_news} />
    <div className='secondary-color'>
        <div className='main-container'>
            <Bloglisting blogSlider={blogSlider} setBlogSlider={setBlogSlider} popular_news={blogData?.popular_news?.original?.data?.news} filterData={filterData} setFilterData={setFilterData} pagination={pagination} blogList={blogData?.news?.data} categoryList={blogData?.categories?.news_count_categories || []}/>
            <PreLocation />
            <PreProperty />
        </div>
    </div>
    <div className='main-container'>
        <Footer />
    </div>
</div>
  )
}

export default NewsPage