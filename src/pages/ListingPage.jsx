import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, PackageSearch, SlidersHorizontal } from 'lucide-react';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../lib/api';
const PAGE_SIZE = 12;

export default function ListingPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';
  const brandKey = params.get('brands') || '';
  const brandsSelected = useMemo(() => brandKey.split(',').filter(Boolean), [brandKey]);
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getCategories(controller.signal).then(setCategories).catch(e => { if (e.name !== 'AbortError') setCategoryError('Categories could not be loaded.'); });
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    const controller = new AbortController();
    // Avoid updating state synchronously in an effect; results are applied asynchronously.
    getProducts(category, controller.signal).then(items => { setProducts(items); setError(''); setLoading(false); }).catch(e => { if (e.name !== 'AbortError') { setError(e.message); setLoading(false); } });
    return () => controller.abort();
  }, [category, retry]);

  const update = (patch) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(patch)) {
        if (value === '' || value === null || value === undefined) next.delete(key); else next.set(key, String(value));
      }
      if (!Object.hasOwn(patch, 'page')) next.delete('page');
      return next;
    }, { replace: true });
  };
  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))].sort((a,b) => a.localeCompare(b)), [products]);
  const filtered = useMemo(() => products.filter(product => {
    const min = minPrice === '' ? -Infinity : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    return product.price >= min && product.price <= max && (!brandsSelected.length || brandsSelected.includes(product.brand));
  }), [products, minPrice, maxPrice, brandsSelected]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const toggleBrand = brand => update({ brands: (brandsSelected.includes(brand) ? brandsSelected.filter(b => b !== brand) : [...brandsSelected, brand]).join(',') });
  const changeCategory = value => { setLoading(true); setError(''); update({ category: value, brands: '' }); };
  const search = params.toString() ? `?${params}` : '';
  return <main className="page-container">
    <div className="intro"><div className="eyebrow">CURATED FOR YOU <span className="eyebrow-line"/></div><h1>Discover something <em>great.</em></h1><p>Explore our collection of everyday essentials and extraordinary finds.</p></div>
    <div className="shop-layout">
      <Filters categories={categories} category={category} setCategory={changeCategory} minPrice={minPrice} setMinPrice={v => update({min:v})} maxPrice={maxPrice} setMaxPrice={v => update({max:v})} brands={brands} selectedBrands={brandsSelected} toggleBrand={toggleBrand} reset={() => setParams({}, {replace:true})} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <section className="catalog" aria-label="Product listing"><div className="catalog-header"><div><h2>{category ? (categories.find(c => c.slug === category)?.name || category.replaceAll('-', ' ')) : 'All Products'}</h2><p>{loading ? 'Loading products…' : `${filtered.length} products found`}</p></div><button className="filter-toggle" onClick={() => setMobileOpen(v => !v)}><SlidersHorizontal size={17}/> Filters</button></div>
      {categoryError && <div className="notice" role="alert">{categoryError} <button onClick={() => setRetry(n => n + 1)}>Retry</button></div>}
      {loading && <div className="products-grid" aria-label="Loading products">{Array.from({length:8}, (_,i) => <div className="skeleton-card" key={i}><div className="skeleton-art"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div>}
      {!loading && error && <div className="state-box" role="alert"><PackageSearch size={36}/><h3>We couldn't load the products</h3><p>{error}</p><button className="primary-btn" onClick={() => {setLoading(true);setRetry(n=>n+1);}}>Try again</button></div>}
      {!loading && !error && !filtered.length && <div className="state-box"><PackageSearch size={36}/><h3>No products found</h3><p>Try adjusting the category, brand or price range.</p><button className="primary-btn" onClick={() => setParams({}, {replace:true})}>Clear filters</button></div>}
      {!loading && !error && !!filtered.length && <><div className="products-grid">{visibleProducts.map(p => <ProductCard key={p.id} product={p} search={search}/>)}</div><div className="pagination"><span>Showing {(currentPage-1)*PAGE_SIZE + 1}–{Math.min(currentPage*PAGE_SIZE, filtered.length)} of {filtered.length}</span><div className="pagination-actions"><button aria-label="Previous page" disabled={currentPage===1} onClick={() => update({page:currentPage-1})}><ArrowLeft size={17}/></button><span>Page {currentPage} of {totalPages}</span><button aria-label="Next page" disabled={currentPage===totalPages} onClick={() => update({page:currentPage+1})}><ArrowRight size={17}/></button></div></div></>}
      </section>
    </div>
  </main>;
}
