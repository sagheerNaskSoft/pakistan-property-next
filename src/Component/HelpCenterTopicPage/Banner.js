import React, { useEffect, useState } from 'react'
import BreadCrumb from '../Metiral/BreadCrumb'
import { Link } from 'react-router-dom'
import { TiSocialFacebook } from 'react-icons/ti'
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import './helpcenter.css'
import { useAuth } from '../../Context/ContextProvider'
function Banner({ topic }) {
    const { helpCenterFeedback } = useAuth()
    const [helpfulCount, setHelpfulCount] = useState(0)
    useEffect(() => {
        setHelpfulCount(topic?.article?.helpful_count)
    }, [topic?.article?.helpful_count])
    const handleFeedback =async (type) => {
        if(type === 'helpful'){
            const result = await helpCenterFeedback(topic?.article?.id, { feedback_type: type ,action:"add"})
            if(result?.success){
                setHelpfulCount(result?.data?.data?.helpful_count)
            }
        }
        else{
            helpCenterFeedback(topic?.article?.id, { feedback_type: type ,action:"remove"})
        }
        
    }

  return (
    <div className='help-center-topic-banner'>
        <div className='main-container mt-3'>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}> 
            <BreadCrumb items={['Help Center', topic?.article?.title]} paths={['/help-center', '/help-center-topic']} />
            <div style={{width:'300px'}}>
            {/* <SingleTypeFeild label='Help Center Topic' value='Help Center Topic' /> */}
            </div>
        </div>
        <div className='row m-0 mt-2'>
        <div className='col-lg-9 col-12 p-0'>
           <div className='row m-0'>
            <div className='col-lg-3 col-12 p-0 pe-2'>
                <div className='help-center-topic-banner-left'>
                    <h6>Articles in this section</h6>
                    <div className='d-flex flex-column gap-2'>
                        {topic?.related_articles?.map((article) => (
                            <Link className='link' to={`/help-center-topic/${article?.slug}`}>{article?.title}</Link>
                        ))}
                    </div>
                  
                </div>
            </div>
            <div className='col-lg-9 col-12 p-0'>
                <div className='help-center-topic-banner-right'>
                    <div className='d-flex justify-content-between align-items-center'>
                    <h3>{topic?.article?.title}</h3>
                    {/* <button>Follow</button> */}
                    </div>
                    <div className='help-center-topic-banner-right-content' dangerouslySetInnerHTML={{ __html: topic?.article?.content }} />
                    <div className='d-flex gap-2'>
                        <a href="https://www.facebook.com/profile.php?id=100083395718437" target='_blank'>
                            <TiSocialFacebook style={{fontSize:'20px'}} />
                        </a>
                        <a href="https://x.com/Pak_Pro_" target='_blank'>
                            <FaXTwitter style={{fontSize:'20px'}} />
                        </a>
                        <a href="https://www.linkedin.com/company/pakistanproperty/" target='_blank'>
                            <FaLinkedin style={{fontSize:'20px'}} />
                        </a>
              
                
                    </div>
                    <hr/>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                            <h6>Was this article helpful?</h6>
                            <div className='d-flex gap-2'>
                            <button className='py-1' onClick={() => handleFeedback('helpful')}>Yes</button>
                            <button onClick={() => handleFeedback('not_helpful')}>No</button>

                            </div>
                            <p>{topic?.article?.views_count} out of {helpfulCount} found this helpful</p>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <h6>Related Articles</h6>
                        <div className='d-flex flex-column gap-2'>
                            {topic?.article?.related_articles?.map((article) => (
                                <Link className='link' key={article?.id} to={`/help-center-topic/${article?.slug}`}>{article?.title}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </div>
       
        </div>
        </div>
       
    </div>
  )
}

export default Banner