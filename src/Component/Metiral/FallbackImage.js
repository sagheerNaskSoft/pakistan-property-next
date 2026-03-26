import { getFallbackImage } from '../../config/fallbackImage';
import Image from 'next/image';
/**
 * FallbackImage Component
 * 
 * @param {string} src - The image source URL
 * @param {string} alt - Alt text for the image
 * @param {object} style - Inline styles for the image
 * @param {string} className - CSS class names
 * @param {string} fallbackSrc - Custom fallback image (optional, will use page/component default if not provided)
 * @param {string} pageName - Page name for automatic fallback selection (e.g., 'PropertyDetail', 'AgentProfile')
 * @param {string} componentName - Component name for automatic fallback selection (e.g., 'HorizontalCard', 'GridCard')
 * @param {string} size - Size preference ('small', 'medium', 'large') for automatic fallback selection
 */
export const FallbackImage = ({ 
    src, 
    alt, 
    style, 
    className, 
    fallbackSrc,
    pageName,
    componentName,
    size,
    ...rest
}) => {
    // Determine which fallback image to use
    let finalFallbackSrc = fallbackSrc;
    
    if (!finalFallbackSrc) {
        // Try to get fallback based on component name first
        if (componentName) {
            finalFallbackSrc = getFallbackImage(componentName, 'component');
        }
        // Then try page name
        else if (pageName) {
            finalFallbackSrc = getFallbackImage(pageName, 'page');
        }
        // Then try size
        else if (size) {
            finalFallbackSrc = getFallbackImage(size, 'size');
        }
        // Finally use default
        else {
            finalFallbackSrc = getFallbackImage();
        }
    }
    
    // Check if src is valid (not empty, null, or undefined)
    const isValidSrc = src && (typeof src === 'string' ? src.trim() !== '' : true);
    
    // Use fallback image directly if src is invalid, otherwise use src and fallback on error
    const imageSrc = isValidSrc ? src : finalFallbackSrc;
    
    return (
        <img
            src={imageSrc}
            alt={alt || ''}
            style={style}
            className={className}
            onError={(e) => {
                // Only set fallback if we haven't already set it (prevent infinite loop)
                if (finalFallbackSrc && e.currentTarget.src !== finalFallbackSrc) {
                    e.currentTarget.src = finalFallbackSrc;
                }
            }}
            {...rest}
        />
    );
};