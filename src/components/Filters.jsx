import { Check, RotateCcw, SlidersHorizontal } from 'lucide-react';
export default function Filters({ categories, category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, brands, selectedBrands, toggleBrand, reset, mobileOpen, setMobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Product filters">
      <div className="sidebar-title"><h2><SlidersHorizontal size={19}/> Filters</h2><button className="text-btn" onClick={reset}><RotateCcw size={13}/> Clear all</button></div>
      <div className="filter-group"><h3>Category</h3><div className="category-list">
        <button className={!category ? 'category-option active' : 'category-option'} onClick={() => setCategory('')}>All categories <span>›</span></button>
        {categories.map(c => <button key={c.slug} className={category === c.slug ? 'category-option active' : 'category-option'} onClick={() => setCategory(c.slug)}>{c.name}<span>›</span></button>)}
      </div></div>
      <div className="filter-group"><h3>Price range <span className="muted">($)</span></h3><div className="price-inputs"><label>Min<input aria-label="Minimum price" type="number" min="0" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)}/></label><span className="price-separator">—</span><label>Max<input aria-label="Maximum price" type="number" min="0" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/></label></div></div>
      <div className="filter-group"><h3>Brand <span className="muted">({brands.length})</span></h3><div className="brand-list">
        {brands.length ? brands.map(brand => <label className="brand-option" key={brand}><input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}/><span className="fake-check"><Check size={12}/></span><span>{brand}</span></label>) : <p className="small-muted">No brands available in this category.</p>}
      </div></div>
      <button className="mobile-done" onClick={() => setMobileOpen(false)}>View products</button>
    </aside>
  );
}
