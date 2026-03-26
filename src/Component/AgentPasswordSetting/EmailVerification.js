import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import logo from '../../Asset/Logo.svg';
import modalImg from '../../Asset/Illus.svg'
import PrimaryButton from '../Metiral/Button/PrimaryButton';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import Image from 'next/image';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    borderRadius: "12px",
    // bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    // p: 4,
    outline: 'none',
};



function EmailVerification() {
    const [open, setOpen] = useState(true)
    const location = useLocation()
    const {parseQueryParams,emailVerification} = useAuth()
    const email_token = parseQueryParams(location.search)?.token || ""
    useEffect(() => {
        emailVerification(email_token).then(res => {
            // if (res.success) {
            //     setOpen(false)
            // } else {
            //     setOpen(false)
            // }
        })
    }, [email_token])
  return (
    <>
    <div className="agent-email-page">
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className='password-changed-modal-box'>
                <div className="password-changed-modal">
                    <div className="logo">
                        <Image src={logo} alt="" />
                    </div>
                    <div className="modal-img">
                    <Image src={modalImg} alt="" />
                    </div>
                    <div className="text-box">
                        <div className="title">Success</div>
                        <div className="para">Your email has been successfully verified. <br />
                            Click below to Login.</div>
                    </div>
                    <Link to={`/`} style={{ textDecoration: "none" }}>
                        <div className="button">
                            <PrimaryButton widthSize={"100%"} text={"Go to Home"} />
                        </div>
                    </Link>
                </div>
            </Box>
        </Modal>


    </div>
</>
  )
}

export default EmailVerification