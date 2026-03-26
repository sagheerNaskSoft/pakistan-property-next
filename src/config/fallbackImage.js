// Fallback image configuration system
// This file allows you to manage and change fallback images for different pages and components
// Simply import the image and add it to the FALLBACK_IMAGES object below

// Import all fallback images
import defaultFallbackImage from '../Asset/no-property-medium.svg';
import defaultAgentFallbackImage from '../Asset/DefaultImages/agentImg.svg';
import defaultAgencyFallbackImage from '../Asset/DefaultImages/defaultAgency.svg'
import noPropertyLarge from '../Asset/no-property-large.svg';
import noPropertySmall from '../Asset/no-propert-small.svg';
import notFoundImage from '../Asset/not-found.png';
import propertyNotFound from '../Asset/property_not_found.svg';
import defaultProjectImg from '../Asset/DefaultImages/defaultProject.svg';
import defaultAgentFallbackImageNew from '../Asset/DefaultImages/NewAgentDefaultImg.svg'
import defaultSmallSizeAgent from '../Asset/DefaultImages/SmallSizeAgent.png'

// Main fallback image configuration
// Add or modify fallback images for different pages/components here
export const FALLBACK_IMAGES = {
    // Default fallback (used when no specific page is matched)
    default: defaultFallbackImage,
    
    // Page-specific fallbacks
    pages: {
        // Property related pages
        'PropertyDetail': noPropertyLarge,
        'PropertyListing': defaultFallbackImage,
        'PropertyIndex': defaultFallbackImage,
        
        // Agent related pages
        'AgentProfile': defaultAgentFallbackImageNew,
        "AgentSmallProfile" : defaultSmallSizeAgent,
        "AgentDefault": defaultAgentFallbackImageNew,
        "NewAgentProfile": defaultAgentFallbackImageNew,
        // "AgencyImg" : defaultAgencyFallbackImage,
        // Agency related pages
        'AgencyDetail': defaultFallbackImage,
        'AgenciesListing': defaultFallbackImage,
        "AgencyDefault": defaultAgencyFallbackImage,
        
        // Project related pages
        "DefaultProject": defaultProjectImg,
        'ProjectDetail': noPropertyLarge,
        'ProjectListing': defaultFallbackImage,
        'Projects': defaultFallbackImage,
        
        // Blog and News pages
        'BlogPage': defaultFallbackImage,
        'BlogDetail': defaultFallbackImage,
        'NewsPage': defaultFallbackImage,
        'NewsDetail': defaultFallbackImage,
        
        // Other pages
        'HomePage': defaultFallbackImage,
        'WishList': defaultFallbackImage,
        'SavedSearches': defaultFallbackImage,
        'InstantValuation': defaultFallbackImage,
        'ConstructionDetailpage': defaultFallbackImage,
        'DeveloperDetailpage': defaultFallbackImage,
    },
    
    // Component-specific fallbacks
    components: {
        // Card components
        'HorizontalCard': defaultFallbackImage,
        'GridCard': defaultFallbackImage,
        'ListCard': defaultFallbackImage,
        'Card': defaultFallbackImage,
        
        // Property components
        'PropertyDetail': noPropertyLarge,
        'SimilerProperty': propertyNotFound,
        
        // Agent components
        'AgentProfile': defaultFallbackImage,
        'ListedProperties': notFoundImage,
        'SoldProperties': notFoundImage,
        
        // Agency components
        'AgencyDetail': defaultFallbackImage,
        'AgencySlider': defaultFallbackImage,
        'TrustedAgencies': defaultFallbackImage,
        'ProfileCard': defaultFallbackImage,
        'AgencyContactCard': defaultFallbackImage,
        
        // Project components
        'Projectbanner': noPropertyLarge,
        'Probanner': defaultFallbackImage,
        'Developer': defaultFallbackImage,
        'FeaturedProjects': defaultFallbackImage,
        'BrowseProjects': defaultFallbackImage,
        'FeaturedDevelopers': defaultFallbackImage,
        'TrustedProjects': defaultFallbackImage,
        
        // Property Trends components
        'TopCities': defaultFallbackImage,
        'SearchedCities': defaultFallbackImage,
        
        // Other components
        'NotFound': defaultFallbackImage,
        'NoResultFound': propertyNotFound,
        'CeoMessage': defaultFallbackImage,
        'OurTeam': defaultFallbackImage,
    },
    
    // Category-specific fallbacks (for property types)
    categories: {
        property: defaultFallbackImage,
        agent: defaultFallbackImage,
        agency: defaultFallbackImage,
        project: noPropertyLarge,
        blog: defaultFallbackImage,
        news: defaultFallbackImage,
    },
    
    // Size-specific fallbacks
    sizes: {
        small: noPropertySmall,
        medium: defaultFallbackImage,
        large: noPropertyLarge,
    }
};

// Function to get fallback image based on page/component name
// Usage: getFallbackImage('PropertyDetail') or getFallbackImage('HorizontalCard', 'component')
export const getFallbackImage = (name, type = 'auto') => {
    if (!name) return FALLBACK_IMAGES.default;
    
    // Auto-detect type if not specified
    if (type === 'auto') {
        // Check in pages first
        if (FALLBACK_IMAGES.pages[name]) {
            return FALLBACK_IMAGES.pages[name];
        }
        // Then check in components
        if (FALLBACK_IMAGES.components[name]) {
            return FALLBACK_IMAGES.components[name];
        }
        // Then check in categories
        if (FALLBACK_IMAGES.categories[name]) {
            return FALLBACK_IMAGES.categories[name];
        }
    } else {
        // Explicit type specified
        if (type === 'page' && FALLBACK_IMAGES.pages[name]) {
            return FALLBACK_IMAGES.pages[name];
        }
        if (type === 'component' && FALLBACK_IMAGES.components[name]) {
            return FALLBACK_IMAGES.components[name];
        }
        if (type === 'category' && FALLBACK_IMAGES.categories[name]) {
            return FALLBACK_IMAGES.categories[name];
        }
        if (type === 'size' && FALLBACK_IMAGES.sizes[name]) {
            return FALLBACK_IMAGES.sizes[name];
        }
    }
    
    // Return default if nothing found
    return FALLBACK_IMAGES.default;
};

// Export default fallback image (for backward compatibility)
export const FALLBACK_IMAGE = FALLBACK_IMAGES.default;

// Export default
export default FALLBACK_IMAGE;
