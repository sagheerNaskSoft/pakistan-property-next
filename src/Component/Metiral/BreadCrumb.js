import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './BreadCrumb.css'

function BreadCrumb({ items = [], modified, paths = [] }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Filter out null/undefined/empty items and their corresponding paths
    const { filteredItems, filteredPaths } = useMemo(() => {
        const filteredItems = [];
        const filteredPaths = [];
        
        items.forEach((item, index) => {
            if (item !== null && item !== undefined && item !== '') {
                filteredItems.push(item);
                filteredPaths.push(paths[index] || null);
            }
        });
        
        return { filteredItems, filteredPaths };
    }, [items, paths]);

    // Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 576);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Truncate string to max words (for last breadcrumb only)
    const truncateToWords = (str, maxWords = 6) => {
        if (str == null || typeof str !== 'string') return str;
        const trimmed = str.trim();
        if (!trimmed) return str;
        const words = trimmed.split(/\s+/);
        if (words.length <= maxWords) return trimmed;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    // Helper to get label and path from item
    const getItemData = (item, index) => {
        if (typeof item === 'object' && item !== null) {
            return {
                label: item.label || item.name || null,
                path: item.path || filteredPaths[index] || null
            };
        }
        return {
            label: item,
            path: filteredPaths[index] || (item === "Home" ? "/" : null)
        };
    };

    // Generate path based on breadcrumb hierarchy
    const generatePath = (index) => {
        // If paths array is provided, use it
        if (filteredPaths[index]) {
            return filteredPaths[index];
        }
        
        // If item is "Home", navigate to root
        const currentItem = filteredItems[index];
        if (typeof currentItem === 'string' && currentItem === "Home") {
            return "/";
        }
        
        // For other items, try to generate path from previous items
        // This is a fallback - ideally paths should be provided
        return null;
    };

    const handleItemClick = (index) => {
        const itemData = getItemData(filteredItems[index], index);
        const path = itemData.path || generatePath(index);
        
        if (path && index !== filteredItems.length - 1) {
            navigate(path);
        }
    };

    // Mobile view: show only last item with back arrow, navigate back on click
    if (isMobile && filteredItems.length > 0) {
        const lastIndex = filteredItems.length - 1;
        const lastItemData = getItemData(filteredItems[lastIndex], lastIndex);

        const lastLabel = typeof lastItemData.label === 'string' ? truncateToWords(lastItemData.label, 6) : lastItemData.label;
        return (
            <div className="global-bread-crumb mobile-breadcrumb">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{ 
                        cursor: 'pointer',
                        transform: 'rotate(180deg)',
                        marginRight: '4px'
                    }}
                    onClick={() => navigate(-1)}
                >
                    <path
                        d="M11.55 7.40962L8.10747 3.96712C7.96695 3.82743 7.77686 3.74902 7.57872 3.74902C7.38058 3.74902 7.1905 3.82743 7.04997 3.96712C6.97968 4.03684 6.92388 4.11979 6.88581 4.21119C6.84773 4.30258 6.82812 4.40061 6.82812 4.49962C6.82812 4.59863 6.84773 4.69666 6.88581 4.78805C6.92388 4.87945 6.97968 4.9624 7.04997 5.03212L10.5 8.46712C10.5703 8.53684 10.6261 8.61979 10.6641 8.71119C10.7022 8.80258 10.7218 8.90061 10.7218 8.99962C10.7218 9.09863 10.7022 9.19666 10.6641 9.28805C10.6261 9.37945 10.5703 9.4624 10.5 9.53212L7.04997 12.9671C6.90875 13.1074 6.82901 13.2979 6.82831 13.497C6.8276 13.696 6.90599 13.8871 7.04622 14.0284C7.18646 14.1696 7.37705 14.2493 7.57607 14.25C7.7751 14.2507 7.96625 14.1724 8.10747 14.0321L11.55 10.5896C11.9713 10.1677 12.208 9.59587 12.208 8.99962C12.208 8.40337 11.9713 7.83149 11.55 7.40962Z"
                        fill={modified ? "white" : "#555555"}
                    />
                </svg>
                <span
                    style={{
                        color: modified ? "white" : "",
                        cursor: "pointer"
                    }}
                    className="item last-item"
                    onClick={() => navigate(-1)}
                >
                    {lastLabel}
                </span>
            </div>
        );
    }

    // Desktop view: show full breadcrumb
    return (
        <div className="global-bread-crumb">
            {filteredItems.map((item, index) => {
                const itemData = getItemData(item, index);
                const isLast = index === filteredItems.length - 1;
                const path = itemData.path || generatePath(index);
                const isClickable = !isLast && path;
                const displayLabel = isLast && typeof itemData.label === 'string'
                    ? truncateToWords(itemData.label, 6)
                    : itemData.label;

                return (
                    <React.Fragment key={index}>
                        <span
                            style={{
                                color: modified ? "white" : "",
                                cursor: isClickable ? "pointer" : "default"
                            }}
                            className={isLast ? "item last-item last-item-clamp" : "item"}
                            onClick={() => isClickable && handleItemClick(index)}
                        >
                            {displayLabel}
                        </span>
                        {!isLast && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                            >
                                <path
                                    d="M11.55 7.40962L8.10747 3.96712C7.96695 3.82743 7.77686 3.74902 7.57872 3.74902C7.38058 3.74902 7.1905 3.82743 7.04997 3.96712C6.97968 4.03684 6.92388 4.11979 6.88581 4.21119C6.84773 4.30258 6.82812 4.40061 6.82812 4.49962C6.82812 4.59863 6.84773 4.69666 6.88581 4.78805C6.92388 4.87945 6.97968 4.9624 7.04997 5.03212L10.5 8.46712C10.5703 8.53684 10.6261 8.61979 10.6641 8.71119C10.7022 8.80258 10.7218 8.90061 10.7218 8.99962C10.7218 9.09863 10.7022 9.19666 10.6641 9.28805C10.6261 9.37945 10.5703 9.4624 10.5 9.53212L7.04997 12.9671C6.90875 13.1074 6.82901 13.2979 6.82831 13.497C6.8276 13.696 6.90599 13.8871 7.04622 14.0284C7.18646 14.1696 7.37705 14.2493 7.57607 14.25C7.7751 14.2507 7.96625 14.1724 8.10747 14.0321L11.55 10.5896C11.9713 10.1677 12.208 9.59587 12.208 8.99962C12.208 8.40337 11.9713 7.83149 11.55 7.40962Z"
                                    fill={modified ? "white" : "#555555"}
                                />
                            </svg>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    )
}

export default BreadCrumb
