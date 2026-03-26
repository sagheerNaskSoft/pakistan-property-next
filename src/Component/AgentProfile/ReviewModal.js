import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PrimaryBorderButton from '../Metiral/Button/PrimaryBorderButton'
import PrimaryButton from '../Metiral/Button/PrimaryButton'
import { useAuth } from '../../Context/ContextProvider';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    boxShadow: 24,
    outline: "none"
};


function ReviewModal({ open, setOpen, data ,agentId, refetchAgentData}) {
    const [rating, setRating] = useState(0);
    const {giveRivews, setOpen: setSnackbarOpen, setError: setSnackbarError}=useAuth()
    const [hoverRating, setHoverRating] = useState(0);
    const [textData,setTextData]=useState("")
    const [ratingError, setRatingError] = useState("")
    const handleClose = () => {
        setOpen(false);
        setRating(0);
        setHoverRating(0);
        setRatingError("");
        setTextData("");
    };
    const handleSubmit = async() => {
        // Validate rating
        if (rating === 0) {
            setRatingError("Please select at least one star");
            setSnackbarError({
                message: "Please select at least one star to submit your review",
                color: "error"
            });
            setSnackbarOpen(true);
            return;
        }

        // Clear any previous errors
        setRatingError("");

        const result= await giveRivews({
            rating:rating,
            review:textData,
            agentId:agentId
        })
        if(result?.success){
            setSnackbarError({
                message: "Review submitted successfully",
                color: "success"
            });
            setSnackbarOpen(true);
            handleClose()
            setRating(0)
            setTextData("")
            setOpen(false)
            // Refetch agent data to update ratings
            if (refetchAgentData) {
                refetchAgentData();
            }
        } else {
            setSnackbarError({
                message: result?.error?.message || "Failed to submit review. Please try again.",
                color: "error"
            });
            setSnackbarOpen(true);
        }

    }

    const handleStarClick = (starIndex) => {
        setRating(starIndex);
    };

    const handleStarHover = (starIndex) => {
        setHoverRating(starIndex);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const getStarColor = (starIndex) => {
        const activeRating = hoverRating || rating;
        if (starIndex <= activeRating) {
            return '#FFB900';
        }
        return 'none';
    };

    const getStarStrokeColor = (starIndex) => {
        const activeRating = hoverRating || rating;
        if (starIndex <= activeRating) {
            return '#FFB900';
        }
        return '#2D2D2D';
    };
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                    className: 'global-modal-background-color'
                }}
            >
                <Box sx={style}>
                    <div className="review-modal global-modal-base-color">
                        <div className="close-btn" onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_8410_120888)">
                                    <path d="M15.9999 8.00012C15.8124 7.81265 15.5581 7.70734 15.2929 7.70734C15.0278 7.70734 14.7735 7.81265 14.5859 8.00012L11.9999 10.5861L9.41395 8.00012C9.22534 7.81796 8.97274 7.71717 8.71055 7.71945C8.44835 7.72173 8.19754 7.8269 8.01213 8.0123C7.82672 8.19771 7.72155 8.44853 7.71928 8.71072C7.717 8.97292 7.81779 9.22552 7.99995 9.41412L10.5859 12.0001L7.99995 14.5861C7.81779 14.7747 7.717 15.0273 7.71928 15.2895C7.72155 15.5517 7.82672 15.8025 8.01213 15.9879C8.19754 16.1733 8.44835 16.2785 8.71055 16.2808C8.97274 16.2831 9.22534 16.1823 9.41395 16.0001L11.9999 13.4141L14.5859 16.0001C14.7745 16.1823 15.0271 16.2831 15.2893 16.2808C15.5515 16.2785 15.8023 16.1733 15.9878 15.9879C16.1732 15.8025 16.2783 15.5517 16.2806 15.2895C16.2829 15.0273 16.1821 14.7747 15.9999 14.5861L13.4139 12.0001L15.9999 9.41412C16.1874 9.22659 16.2927 8.97229 16.2927 8.70712C16.2927 8.44196 16.1874 8.18765 15.9999 8.00012Z" fill="#2D2D2D" />
                                    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_8410_120888">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                       <div className="text-box">
                       <div className="name">Rate {data?.name}</div>
                        <div className="review-para">Please rate your experience with this Agent and share your valuable feedback</div>
                        <div className="star-rating-box" onMouseLeave={handleStarLeave}>
                            {[1, 2, 3, 4, 5].map((starIndex) => (
                                <svg
                                    key={starIndex}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="30"
                                    viewBox="0 0 32 30"
                                    fill="none"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        handleStarClick(starIndex);
                                        setRatingError(""); // Clear error when star is selected
                                    }}
                                    onMouseEnter={() => handleStarHover(starIndex)}
                                >
                                    <path
                                        d="M16.723 1.46557L20.3573 8.80271C20.44 8.98895 20.57 9.15026 20.7344 9.27058C20.8989 9.39087 21.092 9.466 21.2945 9.48843L29.3172 10.677C29.5497 10.7068 29.7687 10.8022 29.9488 10.9519C30.1289 11.1015 30.2628 11.2994 30.3346 11.5223C30.4066 11.7452 30.4135 11.9839 30.3547 12.2107C30.2962 12.4374 30.1742 12.6427 30.003 12.8027L24.2201 18.5399C24.0727 18.6778 23.9618 18.8503 23.898 19.042C23.834 19.2336 23.8192 19.4381 23.8544 19.637L25.2487 27.7055C25.2891 27.9375 25.2635 28.1759 25.1751 28.3939C25.0866 28.612 24.9387 28.8008 24.7481 28.9391C24.5577 29.0771 24.3321 29.159 24.0974 29.1754C23.8626 29.1917 23.6279 29.1418 23.4201 29.0312L16.1973 25.214C16.0124 25.1233 15.8091 25.0762 15.603 25.0762C15.397 25.0762 15.1937 25.1233 15.0087 25.214L7.78588 29.0312C7.57809 29.1418 7.34346 29.1917 7.1087 29.1754C6.87393 29.159 6.64844 29.0771 6.45793 28.9391C6.26739 28.8008 6.11946 28.612 6.03096 28.3939C5.94248 28.1759 5.91695 27.9375 5.95731 27.7055L7.3516 19.5456C7.38693 19.3467 7.37199 19.1422 7.30812 18.9506C7.24426 18.7589 7.13347 18.5863 6.98588 18.4484L1.13446 12.8027C0.961349 12.6384 0.839605 12.4273 0.783979 12.1952C0.728354 11.9631 0.741237 11.7198 0.821061 11.4948C0.900887 11.2699 1.04423 11.0729 1.23373 10.9277C1.42323 10.7826 1.65076 10.6955 1.88874 10.677L9.9116 9.48843C10.1141 9.466 10.3072 9.39087 10.4716 9.27058C10.6361 9.15026 10.7661 8.98895 10.8487 8.80271L14.483 1.46557C14.582 1.25188 14.74 1.07096 14.9385 0.944165C15.1369 0.817371 15.3675 0.75 15.603 0.75C15.8385 0.75 16.0691 0.817371 16.2676 0.944165C16.466 1.07096 16.6241 1.25188 16.723 1.46557Z"
                                        fill={getStarColor(starIndex)}
                                        stroke={getStarStrokeColor(starIndex)}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ))}
                        </div>
                        {/* {ratingError && (
                            <div style={{ color: '#C94444', fontSize: '14px', marginTop: '8px', marginBottom: '8px' }}>
                                {ratingError}
                            </div>
                        )} */}
                        <div className="review-title">Can you tell us more?</div>
                        <textarea onChange={(e)=>setTextData(e.target.value)} value={textData} rows={4} placeholder='Add Feedback'></textarea>
                        <div className="button-box">
                            <PrimaryBorderButton widthSize={"100%"} text={"Cancel"} onFunction={handleClose} />
                            <PrimaryButton widthSize={"100%"} text={"Submit"} onFunction={handleSubmit} />
                        </div>
                       </div>
                    </div>
                </Box>
            </Modal>
        </>
    )

} export default ReviewModal;