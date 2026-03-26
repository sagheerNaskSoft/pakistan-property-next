import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import NavBar from '../Component/NavBarFooter/UpdatedNavbar'
import PreLocation from '../Component/HomePage/PreLocation'
import PreProperty from '../Component/HomePage/PreProperty'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/BlogDetail/Banner'
import { useAuth } from '../Context/ContextProvider'
import { useParams } from 'react-router-dom'
import BlogDetailLoading from './BlogDetailLoading'

function BlogDetail() {
    const { getBlogDetail, loading } = useAuth()
    const params = useParams()
    const [blogData, setBlogData] = useState()
    const [blogSlider, setBlogSlider] = useState(false)
    useEffect(() => {
        if (blogSlider) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100dvh';
          } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = '';
          }
          
      
        return ;
      }, [blogSlider]);
    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                let result = await getBlogDetail(params?.slug)
                if (result?.success) {
                    setBlogData(result?.data?.data)
                }
            }
            catch {

            }
        }
        fetchBlogDetail()
    }, [params?.slug])
    if (loading) {
        return <BlogDetailLoading />
    }

    const blog = blogData?.blog

    return (
        <div>
            {blog?.title && (
                <Head>
                    <title>{blog.title} - Pakistan Property</title>
                    <meta name="description" content={(blog?.content?.replace?.(/<[^>]+>/g, '') || '').slice(0, 160)} />
                    <meta property="og:image" content={blog?.featured_image_url || (typeof window !== 'undefined' ? `${window.location.origin}/previewImgae.jpg` : '/previewImgae.jpg')} />
                    <meta property="og:title" content={blog.title} />
                    <meta property="og:description" content={(blog?.content?.replace?.(/<[^>]+>/g, '') || '').slice(0, 160)} />
                    <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Pakistan Property" />
                    <meta property="og:locale" content="en_US" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                </Head>
            )}
            <NavBar blogSliderButton={true} setBlogSlider={setBlogSlider} />
            <Banner categoryList={blogData?.categories} blogData={blogData?.blog} blogSlider={blogSlider} setBlogSlider={setBlogSlider} />
            <div className='main-container'>
                <PreLocation />
                <PreProperty />
                <Footer />
            </div>
        </div>
    )
}

export default BlogDetail
