import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { getProduct } from '../lib/api';
export default function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getProduct(id, controller.signal).then(p => {setProduct(p); setLoading(false); setError('');}).catch(e => {if (e.name !== 'AbortError') {setError(e.message); setLoading(false);}});
    return () => controller.abort();
  }, [id, retry]);
  const backTo = `/${location.search}`;
  return <main className="page-container detail-container"><Link className="back-link" to={backTo}><ArrowLeft size={17}/> Back to all products</Link>
    {loading && <div className="detail-loading"><div className="skeleton-art"/><div className="skeleton-art"/></div>}
    {!loading && error && <div className="state-box" role="alert"><h2>Unable to load product</h2><p>{error}</p><button className="primary-btn" onClick={() => {setLoading(true);setRetry(n=>n+1);}}>Try again</button></div>}
    {!loading && product && <div className="detail-layout"><div className="detail-gallery"><div className="detail-main-image"><img src={(product.images?.[imageIndex] || product.thumbnail)} alt={`${product.title}, view ${imageIndex+1}`}/></div><div className="thumbnails">{(product.images?.length ? product.images : [product.thumbnail]).map((src,i) => <button key={`${src}-${i}`} onClick={() => setImageIndex(i)} className={imageIndex===i?'thumb active':'thumb'} aria-label={`Show product image ${i+1}`}><img src={src} alt=""/></button>)}</div></div>
      <div className="detail-info"><div className="eyebrow">{product.category.replaceAll('-', ' ').toUpperCase()}</div><h1>{product.title}</h1><div className="detail-rating"><Star size={17} fill="currentColor"/> <strong>{product.rating?.toFixed(1) ?? 'N/A'}</strong><span>Customer rating</span></div><div className="detail-divider"/><div className="detail-price">${product.price.toFixed(2)}</div><p className="detail-description">{product.description}</p><div className="detail-divider"/><dl className="attributes"><div><dt>Brand</dt><dd>{product.brand || 'Not specified'}</dd></div><div><dt>Category</dt><dd>{product.category.replaceAll('-', ' ')}</dd></div><div><dt>Availability</dt><dd>{product.availabilityStatus || (product.stock ? 'In stock' : 'Out of stock')}</dd></div></dl><div className="benefits"><span><Truck size={19}/> Shipping information</span><span><ShieldCheck size={19}/> Authentic products</span><span><RefreshCw size={19}/> {product.returnPolicy || 'See return policy'}</span></div></div>
    </div>}
  </main>;
}
