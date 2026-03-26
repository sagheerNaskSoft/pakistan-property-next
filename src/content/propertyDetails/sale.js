import React from 'react';

function replacePlaceholders(text, city, location) {
  return text.replace(/\[City]/g, city).replace(/\[Location]/g, location);
}

// Robust normalization
function normalizeTypeSubtype({ propertyType, subTypeName }) {
  const typeOptions = ["Home", "Plots", "Commercial"];
  const homeSubTypes = [
    "House", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "Penthouse"
  ];
  const plotsSubTypes = [
    "ResidentialPlot", "CommercialPlot", "AgriculturalLand", "IndustrialLand", "PlotFile", "PlotForm"
  ];
  const commercialSubTypes = [
    "Office", "Shop", "WarehousePortion", "Factory", "Building", "Other"
  ];

  let normType = typeOptions.find(t => (propertyType || "").toLowerCase().includes(t.toLowerCase())) || propertyType;

  let normSub = "";
  if (normType === "Home") normSub = homeSubTypes.find(s => (subTypeName || "").toLowerCase().includes(s.replace(/ /g, "").toLowerCase())) || homeSubTypes.find(s=> (propertyType||"").toLowerCase().includes(s.replace(/ /g, "").toLowerCase()));
  else if (normType === "Plots") normSub = plotsSubTypes.find(s => (subTypeName || "").toLowerCase().includes(s.replace(/ /g, "").toLowerCase())) || plotsSubTypes.find(s=> (propertyType||"").toLowerCase().includes(s.replace(/ /g, "").toLowerCase()));
  else if (normType === "Commercial") normSub = commercialSubTypes.find(s => (subTypeName || "").toLowerCase().includes(s.replace(/ /g, "").toLowerCase())) || commercialSubTypes.find(s=> (propertyType||"").toLowerCase().includes(s.replace(/ /g, "").toLowerCase()));
  else normSub = subTypeName;

  // Allow fallback
  return [normType, normSub];
}

const data = {
  Home: {
    House: {
      title: "Find Your Ideal Home for Sale in [Location], [City]",
      blocks: [
        "Looking for a reliable place to buy in [Location], [City]? This listing offers a suitable choice for long-term ownership, whether you are interested in a moderate home or a luxury unit. Homes in [Location] are known for their practical layouts, comfortable surroundings, and convenient access to nearby services. Buyers often appreciate how the area supports daily needs, making it easier to plan for long-term living.",
        "With a range of home types available, you can choose an option that fits your budget, lifestyle, and future plans. For many buyers, [Location] provides the right balance between comfort, accessibility, and overall value.",
        "Living Experience in [Location], [City] - What You Can Expect",
        "The home in [Location] offers a different living experience depending on design, structure, and the overall neighborhood setting:",
        "Comfortable living space: The house offers a well-sized living area that supports daily routines and allows easy furniture placement.",
        "Private and secure setting: The home provides a good level of privacy along with basic security features that support safe everyday living.",
        "Essential utilities: Electricity, water supply, gas connection, and proper ventilation are available to ensure a smooth living experience.",
        "Practical room layout: The house includes a thoughtfully planned arrangement of bedrooms, bathrooms, a kitchen, and common areas designed for daily use.",
        "Open or outdoor area: The home may include a small yard, terrace, or open space that can be used for personal needs or family activities.",
        "The listed home offers easy access to essential needs such as markets, schools, healthcare facilities, parks, and public transport. This makes daily routines smoother and ensures you have everything you need within a reasonable distance.",
        "Why This Home Is a Practical Choice",
        "This home brings together convenience, functionality, and a comfortable environment. With essential services nearby, you can manage daily tasks without difficulty. Secure surroundings ensure peace of mind, and the community-focused atmosphere helps create a positive living experience.",
        "If you're looking for a long-term family home, planning for future stability, or upgrading to a better space, [Location] offers a range of benefits suited to different buyers. Its road connectivity, nearby facilities, and calm setting make it a suitable choice for many households.",
        "Pakistan Property – Your Reliable Classified Platform",
        "Buying a home through Pakistan Property gives you access to updated listings, clear details, and simple navigation tools. As a trusted nationwide platform, it connects buyers with verified home options and provides a smooth browsing experience. With user-friendly features that help you compare prices, locations, and home types, Pakistan Property supports buyers in making well-informed decisions."
      ]
    },
    Flat: {
      title: "Flat for Sale in [Location], [City] – A Suitable Choice for You",
      blocks: [
        "If you’re planning to buy a flat in [Location], [City], this listing brings a practical option for long-term living and everyday comfort. Flats in this area usually suit different needs, whether you want a compact studio, a standard apartment, or a larger multi-bed unit for family use. Buyers often prefer [Location] because the surroundings offer consistent access to essential services, a calm environment, and well-connected routes within the city. The availability of multiple flat types ensures that every buyer can find a setup that matches their lifestyle and future plans.",
        "Life in [Location], [City] – What This Flat Offers",
        "The flat in [Location] delivers a suitable living experience based on its building structure, layout, and nearby facilities:",
        "Compact living option: A studio or 1-bed flat offers a manageable space suitable for students, individuals, or professionals who prefer low-maintenance living with a simple, organized layout.",
        "Family-friendly setup: A standard apartment provides well-planned rooms, practical storage, and shared building services that support the daily needs of a small family.",
        "Portion-style arrangement: This type of flat gives a mix of private living space along with shared building features, making it a practical and cost-efficient choice for many buyers.",
        "Modern construction: A newly built flat offers improved materials, updated fittings, better flooring, and a layout designed for comfortable day-to-day use.",
        "Most flats in [Location] come with easy access to everyday essentials such as grocery stores, schools, hospitals, parks, and transportation routes, allowing residents to move through their day comfortably.",
        "Why This Flat Is a Good Choice",
        "This flat stands out as a suitable option for buyers who value convenience and functionality together. With essential services close by, a secure environment, and a friendly neighborhood setting, it creates a living space that supports both comfort and routine stability. Whether you are purchasing your first flat, moving into a better environment, or planning for future long-term use, [Location] offers surroundings that match a wide range of preferences and family needs. Its reliable access to main roads and public facilities also makes daily travel and errands easier.",
        "Pakistan Property – A Trusted Way to Buy Flats Online",
        "Buying through Pakistan Property gives you access to regularly updated listings, simple search tools, and a nationwide platform trusted by buyers. The website connects you with verified flat options and provides the convenience of browsing multiple choices in one place. With a user-friendly interface and clear listing details, Pakistan Property helps you compare flats easily and make confident decisions without complications."
      ]
    }
    // ...Add more Home subtypes
  },
  Plots: {
    ResidentialPlot: {
      title: "Residential Plot for Sale in [Location], [City]",
      blocks: ["Sample content for Residential Plot goes here."]
    }
    // ...Add more Plots subtypes
  },
  Commercial: {
    Office: {
      title: "Office for Sale in [Location], [City]",
      blocks: ["Sample content for Office goes here."]
    }
    // ...Add more Commercial subtypes
  }
};

function SaleContent({ purposeName, city, location, propertyType, subTypeName }) {
  const [normType, normSubType] = normalizeTypeSubtype({ propertyType, subTypeName });
  const section = data[normType] && data[normType][normSubType];
  console.log(normType, normSubType, "section" ,propertyType);
  
  if (!section) return null;
  const blocks = section.blocks;
  return (
    <>
      <h3>{replacePlaceholders(section.title, city, location)}</h3>
      {blocks && blocks.map((block, idx) => <h4 key={idx}>{replacePlaceholders(block, city, location)}</h4>)}
    </>
  );
}

export default SaleContent;
