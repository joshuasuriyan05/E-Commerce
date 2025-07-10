const BrandFilter = ({ brands, selectedBrands, setSelectedBrands }) => {
  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-1">Filter by Brands</label>
      <div className="space-y-2">
        {brands.map((brand, index) => (
          <label key={index} className="block text-sm">
            <input type="checkbox" className="mr-2" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}/>{brand}
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;
