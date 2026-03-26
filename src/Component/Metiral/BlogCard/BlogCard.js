import React from 'react'
import './BlogCard.css'
import img from '../../../Asset/BLog/building-img.png'
import { useNavigate } from 'react-router-dom';
function BlogCard({data,route}) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  function getWordCount(text) {
    if (!text) return 0;
    // HTML tags hata kar plain text nikalen
    const plainText = text.replace(/<[^>]+>/g, ' ');
    return plainText.trim().split(/\s+/).filter(w => w).length; // handle extra spaces
  }
  
  // Reading time calculate karein
  function getReadingTime(text) {
    const wordsPerMinute = 200; // average reading speed
    const wordCount = getWordCount(text);
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute)); // kam se kam 1 min
  }

  const navigate=useNavigate()
  return (
    <>
      <div onClick={()=>{
        navigate(`/${route?"news":"blog"}-detail/${data?.slug}`)
      }} className='blog-card'>
        <div className='blog-img'>
          <img style={{objectFit:"cover"}} src={data?.featured_image_url || img} alt={data?.featured_image_alt|| data?.title}/>
          <div>{data?.category}</div>
        </div>
        <div className='blog-heading'>
          <h4>{data?.headline || data?.title}</h4>
          <div className='content' dangerouslySetInnerHTML={{ __html:data?.content?.replace(/<[^>]+>/g, ' ')}} />
          <div className='bog-lowe-heading'>
            <div className='blog-lowe-section'>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.3335 1.33337V4.00004" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6665 1.33337V4.00004" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.6667 2.66663H3.33333C2.59695 2.66663 2 3.26358 2 3.99996V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V3.99996C14 3.26358 13.403 2.66663 12.6667 2.66663Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 6.66663H14" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{formatDate(data?.published_at)}</span>
            </div>
            <div className='blog-lowe-section'>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4V8L10.6667 9.33333" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00004C14.6668 4.31814 11.6821 1.33337 8.00016 1.33337C4.31826 1.33337 1.3335 4.31814 1.3335 8.00004C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{getReadingTime(data?.content)} min read</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogCard
