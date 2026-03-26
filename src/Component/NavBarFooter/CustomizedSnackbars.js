import * as React from 'react';
import { useAuth } from '../../Context/ContextProvider';
import './CustomizedSnackbars.css';

export default function CustomizedSnackbars() {
    const { open, setOpen, error, setError } = useAuth();

    const handleClose = () => {
        setOpen(false);
        setError({ message: "", color: "" });
    };

    React.useEffect(() => {
        if (error?.message && open) {
            // Add overlay to body
            const overlay = document.createElement('div');
            overlay.id = 'snackbar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.15);
                z-index: 99999998;
                pointer-events: none;
                borderRadius: 12px 12px 0 0;
                overflow: hidden;
            `;
            document.body.appendChild(overlay);

            const timer = setTimeout(() => {
                handleClose();
            }, 6000);
            
            return () => {
                clearTimeout(timer);
                const overlayElement = document.getElementById('snackbar-overlay');
                if (overlayElement) {
                    document.body.removeChild(overlayElement);
                }
            };
        } else {
            // Remove overlay when snackbar closes
            const overlayElement = document.getElementById('snackbar-overlay');
            if (overlayElement) {
                document.body.removeChild(overlayElement);
            }
        }
    }, [error, open]);

    if (!open || !error?.message) return null;

    const isSuccess = error?.color === 'success';

    return (
        <div className={`custom-snackbar ${open ? 'show' : ''}`}>
            <div className="custom-snackbar-content">
                <div className={`custom-snackbar-indicator ${isSuccess ? 'success' : 'error'}`}></div>
                <div className="custom-snackbar-icon">
                    {isSuccess ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27AE60" />
                            <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#C94444" />
                            <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <div className="custom-snackbar-message">{error?.message}</div>
            </div>
        </div>
    );
}
