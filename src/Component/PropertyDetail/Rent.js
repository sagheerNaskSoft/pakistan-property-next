import React, { lazy, Suspense } from 'react';

// Lazy load all property detail components - only load the one that's needed
// HOME (Sale)
const House = lazy(() => import('../../content/Sale/Home/House'))
const Flat = lazy(() => import('../../content/Sale/Home/Flat'))
const UpperPortion = lazy(() => import('../../content/Sale/Home/UpperPortion'))
const LowerPortion = lazy(() => import('../../content/Sale/Home/LowerPortion'))
const PentHouse = lazy(() => import('../../content/Sale/Home/PentHouse'))
const Room = lazy(() => import('../../content/Sale/Home/Room'))
const FarmHouse = lazy(() => import('../../content/Sale/Home/FarmHouse'))
// COMMERCIAL (Sale)
const Building = lazy(() => import('../../content/Sale/Commercial/Building'))
const Factory = lazy(() => import('../../content/Sale/Commercial/Factory'))
const Office = lazy(() => import('../../content/Sale/Commercial/Office'))
const Other = lazy(() => import('../../content/Sale/Commercial/Other'))
const Shop = lazy(() => import('../../content/Sale/Commercial/Shop'))
const WareHouse = lazy(() => import('../../content/Sale/Commercial/WareHouse'))

// HOME (Rent)
const RentalHouse = lazy(() => import('../../content/Rent/Home/House'))
const FlatForRent = lazy(() => import('../../content/Rent/Home/Flat'))
const UpperPortionRental = lazy(() => import('../../content/Rent/Home/UpperPortion'))
const LowerPortionRental = lazy(() => import('../../content/Rent/Home/LowerPortion'))
const PenthouseRental = lazy(() => import('../../content/Rent/Home/PentHouse'))
const RoomForRent = lazy(() => import('../../content/Rent/Home/Room'))
const FarmHouseRental = lazy(() => import('../../content/Rent/Home/FarmHouse'))
// COMMERCIAL (Rent)
const CommercialBuildingForRent = lazy(() => import('../../content/Rent/Commercial/Building'))
const FactoryRental = lazy(() => import('../../content/Rent/Commercial/Factory'))
const OfficeRental = lazy(() => import('../../content/Rent/Commercial/Office'))
const CommercialRental = lazy(() => import('../../content/Rent/Commercial/Other'))
const ShopForRent = lazy(() => import('../../content/Rent/Commercial/Shop'))
const WarehouseRental = lazy(() => import('../../content/Rent/Commercial/WareHouse'))

// HOME (Lease)
const HouseForLease = lazy(() => import('../../content/Lease/Home/House'))
const FlatLease = lazy(() => import('../../content/Lease/Home/Flat'))
const UpperPortionForLease = lazy(() => import('../../content/Lease/Home/UpperPortion'))
const LowerPortionLease = lazy(() => import('../../content/Lease/Home/LowerPortion'))
const PenthouseForLease = lazy(() => import('../../content/Lease/Home/PentHouse'))
const RoomLease = lazy(() => import('../../content/Lease/Home/Room'))
const FarmHouseForLease = lazy(() => import('../../content/Lease/Home/FarmHouse'))
// COMMERCIAL (Lease)
const CommercialBuildingLease = lazy(() => import('../../content/Lease/Commercial/Building'))
const FactoryLease = lazy(() => import('../../content/Lease/Commercial/Factory'))
const OfficeForLease = lazy(() => import('../../content/Lease/Commercial/Office'))
const CommercialUnitForLease = lazy(() => import('../../content/Lease/Commercial/Other'))
const ShopLease = lazy(() => import('../../content/Lease/Commercial/Shop'))
const WarehouseForLease = lazy(() => import('../../content/Lease/Commercial/WareHouse'))

// PLOTS (Sale)
const ResidentialPlot = lazy(() => import('../../content/Sale/Plot/ResidentialPlot'))
const CommercialPlot = lazy(() => import('../../content/Sale/Plot/CommercialPLot'))
const AgriculturalLand = lazy(() => import('../../content/Sale/Plot/AgricultureLand'))
const IndustrialLand = lazy(() => import('../../content/Sale/Plot/IndustrialLand'))
const PlotFile = lazy(() => import('../../content/Sale/Plot/PlotFile'))
const PlotForm = lazy(() => import('../../content/Sale/Plot/PlotForm'))

function Rent({ cityName, locationName, typeName, subTypeName, purposeName }) {
  // Helper function to render lazy components with Suspense
  console.log(cityName, locationName, typeName, subTypeName, purposeName);
  const renderComponent = (Component) => (
    <Suspense fallback={<></>}>
      <Component cityName={cityName} locationName={locationName} />
    </Suspense>
  )

  // HOME (Sale)
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'House') return renderComponent(House);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Flat') return renderComponent(Flat);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Upper Portion') return renderComponent(UpperPortion);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Lower Portion') return renderComponent(LowerPortion);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Farm House') return renderComponent(FarmHouse);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Room') return renderComponent(Room);
  if (purposeName === 'Sell' && typeName === 'Home' && subTypeName === 'Penthouse') return renderComponent(PentHouse);

  // HOME (Rent)
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'House') return renderComponent(RentalHouse);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Flat') return renderComponent(FlatForRent);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Upper Portion') return renderComponent(UpperPortionRental);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Lower Portion') return renderComponent(LowerPortionRental);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Farm House') return renderComponent(FarmHouseRental);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Room') return renderComponent(RoomForRent);
  if (purposeName === 'Rent' && typeName === 'Home' && subTypeName === 'Penthouse') return renderComponent(PenthouseRental);

  // HOME (Lease)
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'House') return renderComponent(HouseForLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Flat') return renderComponent(FlatLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Upper Portion') return renderComponent(UpperPortionForLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Lower Portion') return renderComponent(LowerPortionLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Farm House') return renderComponent(FarmHouseForLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Room') return renderComponent(RoomLease);
  if (purposeName === 'Lease' && typeName === 'Home' && subTypeName === 'Penthouse') return renderComponent(PenthouseForLease);

  // COMMERCIAL (Sale)
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Building') return renderComponent(Building);
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Factory') return renderComponent(Factory);
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Office') return renderComponent(Office);
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Other') return renderComponent(Other);
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Shop') return renderComponent(Shop);
  if (purposeName === 'Sell' && typeName === 'Commercial' && subTypeName === 'Warehouse Portion') return renderComponent(WareHouse);

  // COMMERCIAL (Rent)
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Building') return renderComponent(CommercialBuildingForRent);
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Factory') return renderComponent(FactoryRental);
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Office') return renderComponent(OfficeRental);
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Other') return renderComponent(CommercialRental);
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Shop') return renderComponent(ShopForRent);
  if (purposeName === 'Rent' && typeName === 'Commercial' && subTypeName === 'Warehouse Portion') return renderComponent(WarehouseRental);

  // COMMERCIAL (Lease)
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Building') return renderComponent(CommercialBuildingLease);
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Factory') return renderComponent(FactoryLease);
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Office') return renderComponent(OfficeForLease);
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Other') return renderComponent(CommercialUnitForLease);
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Shop') return renderComponent(ShopLease);
  if (purposeName === 'Lease' && typeName === 'Commercial' && subTypeName === 'Warehouse Portion') return renderComponent(WarehouseForLease);

  // PLOTS (Sale)
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Residential Plot') return renderComponent(ResidentialPlot);
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Commercial Plot') return renderComponent(CommercialPlot);
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Agricultural Land') return renderComponent(AgriculturalLand);
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Industrial Land') return renderComponent(IndustrialLand);
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Plot File') return renderComponent(PlotFile);
  if (purposeName === 'Sell' && typeName === 'Plots' && subTypeName === 'Plot Form') return renderComponent(PlotForm);
  
  // If Plots are added for Rent/Lease, copy the pattern above!
  return null;
}

export default Rent;
