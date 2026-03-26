import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import logo from '../../Asset/Logo.svg';
import modalImg from '../../Asset/Illus.svg'
import PrimaryButton from '../Metiral/Button/PrimaryButton';
import { Link } from 'react-router-dom';
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


function VerifyEmailInvitation() {
    const { loginData } = useAuth()
    const [open, setOpen] = useState(true)
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
                                    <path d="M149.991 28.0486C149.991 29.6989 149.414 31.3697 148.182 32.7379C127.575 55.6499 108.5 81.3917 95.5669 111.072C93.3186 116.231 88.2153 119.53 82.5877 119.49C79.4337 119.468 77.4803 119.629 74.3444 119.972C68.8186 120.575 63.4684 117.871 60.6789 113.062C54.2862 102.043 45.4289 91.7541 36.7042 82.4714C31.8914 77.3511 33.1651 69.0744 39.2769 65.607C39.3483 65.567 39.4185 65.5271 39.4899 65.4871C42.7976 63.6297 46.8222 63.6408 50.1287 65.5017C59.0325 70.5117 68.1179 79.0027 76.6803 88.3908C92.8448 63.3636 114.816 37.7673 139.18 22.1112C141.089 20.8836 143.478 20.6668 145.584 21.5132C148.409 22.6477 149.991 25.3185 149.991 28.0486Z" fill="#447158" />
                                    <path d="M153.71 48.8581C152.166 45.2059 150.364 41.696 148.314 38.3446C145.824 41.1629 143.413 43.9704 141.078 46.7642C142.169 48.7652 143.164 50.8265 144.058 52.9423C147.682 61.5095 149.519 70.6125 149.519 79.9998C149.519 89.3871 147.682 98.4902 144.058 107.057C140.556 115.335 135.545 122.77 129.157 129.156C122.771 135.542 115.335 140.555 107.058 144.057C98.4906 147.682 89.3875 149.519 80.0002 149.519C70.6129 149.519 61.5099 147.682 52.9427 144.057C44.6652 140.555 37.2296 135.542 30.8439 129.156C24.4581 122.77 19.4446 115.335 15.9428 107.057C12.318 98.4902 10.481 89.3871 10.481 79.9998C10.481 70.6125 12.318 61.5095 15.9428 52.9423C19.4446 44.6648 24.4581 37.2292 30.8439 30.8435C37.2296 24.455 44.6652 19.4442 52.9427 15.9424C61.5099 12.3176 70.6129 10.4806 80.0002 10.4806C89.3875 10.4806 98.4906 12.3176 107.058 15.9424C113.742 18.769 119.879 22.5824 125.354 27.309C128.156 25.0948 131.035 22.9708 133.987 20.9643C127.243 14.7862 119.575 9.8575 111.142 6.29007C101.276 2.11576 90.7979 0 80 0C69.2021 0 58.7268 2.11576 48.8583 6.29007C39.3316 10.3194 30.778 16.0874 23.4327 23.4327C16.0874 30.778 10.3194 39.3316 6.29007 48.8583C2.11576 58.7241 0 69.2021 0 80C0 90.7979 2.11576 101.276 6.29007 111.142C10.3194 120.668 16.0874 129.222 23.4327 136.567C30.778 143.913 39.3316 149.681 48.8583 153.71C58.7268 157.884 69.2021 160 80 160C90.7979 160 101.276 157.884 111.142 153.71C120.668 149.681 129.222 143.913 136.567 136.567C143.913 129.222 149.681 120.668 153.71 111.142C157.884 101.276 160 90.7979 160 80C160 69.2021 157.884 58.7239 153.71 48.8581Z" fill="#447158" />
                                </svg>
                            </div>
                            <div className="text-box">
                                <div className="title">Success</div>
                                <div className="para">Your password has been successfully reset. <br />
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

export default VerifyEmailInvitation
