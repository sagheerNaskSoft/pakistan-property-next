import React, { useRef, useEffect, useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// Styled Tooltip component
const StyledTooltip = styled(Tooltip, {
  shouldForwardProp: (prop) =>
    !['color', 'padding', 'textColor', 'borderRadius', 'width', 'zindex'].includes(prop),
})(({ color, padding, textColor, borderRadius, width, zindex }) => ({
  zIndex: zindex || 99999,
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: color || '#737678',
    color: textColor || 'white',
    fontSize: '12px',
    fontFamily: '"DM Sans", sans-serif',
    padding: padding || '4px 8px',
    borderRadius: borderRadius || '8px',
    maxWidth: width || 300,
    lineHeight: "18px"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: color || '#737678',
  },
}));

// Custom Tooltip wrapper component
const CustomTooltip = ({ className, color, padding, textColor, borderRadius, width, placement, zindex, children, showModal, enabled = true, ...props }) => {
  const shouldApplyOffset = Boolean(width);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
  const [modalOpen, setModalOpen] = useState(false);
  const childRef = useRef();

  // Extract title from props (MUI Tooltip uses title prop)
  const tooltipTitle = props.title || '';
  const isEnabled = enabled !== false;

  // Check if modal mode should be active (screen <= 768px AND showModal prop is true)
  const useModalMode = isMobile && showModal === true;

  // Click/touch handler to open the modal
  const handleModalOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalOpen(true);
  };

  // Handler to close the modal
  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Handle window resize to update screen size
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ref-props for badge (only apply when modal mode is active)
  const childProps = useModalMode
    ? {
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleModalOpen(e);
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleModalOpen(e);
      },
      ref: childRef,
      style: { cursor: 'pointer', ...children?.props?.style },
    }
    : {};

  // Only clone if children is a valid React element and we need to add props
  let childWithProps = children;
  if (useModalMode && React.isValidElement(children)) {
    childWithProps = React.cloneElement(children, childProps);
  }

  // If mobile and showModal is not true, disable tooltip completely - just return children
  if (isMobile && !showModal) {
    return <>{children}</>;
  }

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '250px',
    maxWidth: 400,
    bgcolor: color || '#2D2D2D',
    color: textColor || 'white',
    borderRadius: borderRadius || '8px',
    boxShadow: 24,
    p: padding || '20px',
    outline: 'none',
    position: 'relative',
  };

  return (
    <>
      {useModalMode ? (
        <>
          {childWithProps}
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-tooltip-title"
            aria-describedby="modal-tooltip-description"
            BackdropProps={{
              className: 'light-global-modal-background-color'
            }}
          >
            <Box
              sx={modalStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="close-btn" onClick={handleModalClose} style={{position: "absolute", top: "3px", right: "5px" , width:'20px' , height:'20px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{width:'20px' , height:'20px'}}>
                  <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="white" />
                  <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="white" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontFamily: '"DM Sans", sans-serif',
                  lineHeight: '20px',
                  wordWrap: 'break-word',
                }}
              >
                {tooltipTitle}
              </div>
            </Box>
          </Modal>
        </>
      ) : (
        <StyledTooltip
          title={isEnabled ? tooltipTitle : ''}
          disableHoverListener={!isEnabled}
          disableFocusListener={!isEnabled}
          disableTouchListener={!isEnabled}
          {...props}
          color={color}
          padding={padding}
          textColor={textColor}
          borderRadius={borderRadius}
          width={width}
          zindex={zindex}
          arrow
          placement={placement ? placement : 'right'}
          PopperProps={{
            ...(shouldApplyOffset
              ? {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-40, 0],
                    },
                  },
                ],
              }
              : {}),
          }}
          classes={{ popper: className }}
        >
          {children}
        </StyledTooltip>
      )}
    </>
  );
};

export default CustomTooltip;
