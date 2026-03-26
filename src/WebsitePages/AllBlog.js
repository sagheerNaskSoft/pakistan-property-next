import React, { useEffect, useState } from 'react'
import Banner from '../Component/AllBlog/Banner'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import { useAuth } from '../Context/ContextProvider'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AllBlogLoading from './AllBlogLoading'

function AllBlog() {
    const { getBlogList, parseQueryParams, loading } = useAuth()
    const [blogSlider, setBlogSlider] = useState(false)
    const [blogData, setBlogData] = useState()
    const [filter, setFilter] = useState()
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 12,
        current_page: 1,
        total_pages: 0,
    })
    const location = useLocation()
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
    useEffect(() => {
        const parsed = parseQueryParams(location?.search)
        setFilter(parsed)
        const fetchBlogs = async () => {
            try {
                let result = await getBlogList({ ...parsed, category_slug: parsed?.category,per_page:parsed?.per_page || 12,current_page:parsed?.current_page || 1 })
                if (result?.success) {
                    setBlogData(result?.data?.data)
                    setPagination({
                        total: result?.data?.data?.blogs?.total,
                        per_page: parseInt(parsed?.per_page) || result?.data?.data?.blogs?.per_page,
                        current_page: parseInt(parsed?.current_page) || result?.data?.data?.blogs?.current_page,
                        total_pages: result?.data?.data?.blogs?.total_pages || result?.data?.data?.blogs?.last_page,
                    })
                }

            } catch {
                console.error("something went wrong")
            }
        }
        fetchBlogs()
    }, [location?.search])
    if (loading) {
        return <AllBlogLoading />
    }

    return (
        <>
            <Helmet>
                <title>Latest Property Blogs in Pakistan - Expert Insights</title>
                <meta name="description" content="Read Pakistan property blogs for expert guidance, buying tips, investment insights & practical information to help you make informed real estate decisions." />
            </Helmet>
            <NavBar  blogSliderButton={true} setBlogSlider={setBlogSlider} />
            <Banner filter={filter} pagination={pagination} categoryList={blogData?.categories_counts} blogList={blogData?.blogs?.data} blogSlider={blogSlider} setBlogSlider={setBlogSlider} />
            <div className='main-container'>
                <PreLocation />
                <PreProperty />
                <Footer />
            </div>

        </>
    )
}

export default AllBlog
