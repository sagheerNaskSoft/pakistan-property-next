import React, { useEffect, useState } from 'react'
import UpdatedNavbar from '../Component/NavBarFooter/UpdatedNavbar'
import Footer from '../Component/NavBarFooter/Footer'
import Banner from '../Component/HelpCenterTopicPage/Banner'
import { useParams } from 'react-router-dom'
import { useAuth } from '../Context/ContextProvider'
function HelpCenterTopicPage() {
  const { helpCenterTopic } = useAuth()
  const [topic, setTopic] = useState(null)
  const { slug } = useParams()
  useEffect(() => {
    helpCenterTopic(slug).then((res) => {
      if (res.success) {
        setTopic(res.data?.data)
      }
    })
  }, [slug])
  return (
    <div>
        <UpdatedNavbar />
        <Banner topic={topic} />
        <div className='main-container'>
            <Footer />
        </div>
    </div>
  )
}

export default HelpCenterTopicPage