const CategoryDropdown = ({ selectedCategory, setSelectedCategory, categories }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-1">Filter by Category</label>
    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
      <option value="">All Categories</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>{category}</option>
      ))}
    </select>
  </div>
);

export default CategoryDropdown;
