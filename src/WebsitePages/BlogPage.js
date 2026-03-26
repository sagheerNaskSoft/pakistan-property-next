import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/BlogPage/Banner'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Bloglisting from '../Component/BlogPage/Bloglisting'
import { useAuth } from '../Context/ContextProvider'
import { Helmet } from 'react-helmet'
import BlogPageLoading from './BlogPageLoading'

function BlogPage() {
    const [blogSlider, setBlogSlider] = useState(false)
    const { getBlogList, loading } = useAuth()
    const [blogData, setBlogData] = useState()
    const [filterData, setFilterData] = useState({
        current_page: 1,
        per_page: 12,
    })
    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 12,
        current_page: 1,
        total_pages: 0,
    })
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                let result = await getBlogList({per_page:12,current_page:1})
                if (result?.success) {
                    setBlogData(result?.data?.data)
                    setPagination({
                        total: result?.data?.data?.blogs?.total,
                        per_page: result?.data?.data?.blogs?.per_page,
                        current_page: result?.data?.data?.blogs?.current_page,
                        total_pages: result?.data?.data?.blogs?.total_pages || result?.data?.data?.blogs?.last_page,
                    })
                }

            } catch {
                console.error("something went wrong")
            }
        }
        fetchBlogs()
    }, [])



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

    // Handle click outside drawer to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (blogSlider) {
                // Find the drawer element
                const drawer = document.querySelector('.blog-slider-categories')
                const drawerButton = document.querySelector('[data-blog-slider-button]')
                
                // Check if click is outside drawer and not on the button that opens it
                if (drawer && 
                    !drawer.contains(event.target) && 
                    !drawerButton?.contains(event.target)) {
                    setBlogSlider(false)
                }
            }
        }

        if (blogSlider) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [blogSlider])
    if (loading) {
        return <BlogPageLoading />
    }

    return (
        <div>
                 <Helmet>
            <title>Latest Property Blogs in Pakistan - Expert Insights</title>
            <meta name="description" content="Read Pakistan property blogs for expert guidance, buying tips, investment insights & practical information to help you make informed real estate decisions." />
        </Helmet>
            <NavBar blogSliderButton={true} setBlogSlider={setBlogSlider} />
            <>
                <Banner blogData={blogData?.featured_blogs} />
                <div className='secondary-color'>
                    <div className='main-container'>
                        <Bloglisting blogSlider={blogSlider} setBlogSlider={setBlogSlider} popular_blogs={blogData?.popular_blogs?.original?.data?.blogs} blogList={blogData?.blogs?.data} categoryList={blogData?.categories_counts || []} pagination={pagination} filterData={filterData} setFilterData={setFilterData} />
                        <PreLocation />
                        <PreProperty />
                    </div>
                </div>
                <div className='main-container'>
                    <Footer />
                </div>
            </>
        </div>
    )
}

export default BlogPage
