import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import CategoryDown from "../components/CategoryDown";
import BrandFilter from "../components/BrandFilter";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    axios
      .get("https://e-commerce-1-h1h0.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

  const categories = [...new Set(products.map((p) => p?.category))].filter(Boolean);
  const brands = [...new Set(products.map((p) => p?.brand))].filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="flex">
      <aside className="w-64 h-screen fixed top-16 left-0 bg-gray-100 border-r p-4 overflow-y-auto hidden lg:block">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <CategoryDown selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories}/>
        <BrandFilter brands={brands} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}/>
      </aside>
      <main className="flex-1 ml-0 lg:ml-15rem pt-20 px-4">
        <div className="flex justify-center mb-6">
          <input type="text" value={searchText} placeholder="🔍 Search for Products..." onChange={(e) => setSearchText(e.target.value)} className="p-3 w-full max-w-xl border rounded border-gray-700 bg-gray-900 bg-opacity-60 backdrop-blur-md text-white shadow"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
