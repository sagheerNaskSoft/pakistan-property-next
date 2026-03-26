import React from 'react';
import saleContent from '../../content/propertyDetails/sale';

function replacePlaceholders(text, city, location) {
  return text.replace(/\[City]/g, city).replace(/\[Location]/g, location);
}

const contentMap = {
  sale: saleContent,
  // add: rent: rentContent, lease: leaseContent, etc.
};

function DynamicPropertyDetail({ type, propertyType, city, location }) {
  // fallback to house if propertyType not found
  const contentSet = contentMap[type] || {};
  const content = contentSet[propertyType] || contentSet['house'] || {};

  if (!content) return <div>No content found.</div>;

  return (
    <div className='DynamicPropertyDetail'>
      <h3>{replacePlaceholders(content.title, city, location)}</h3>
      {content.blocks && content.blocks.map((b, idx) => (
        <h4 key={idx}>{replacePlaceholders(b, city, location)}</h4>
      ))}
    </div>
  );
}

export default DynamicPropertyDetail;
