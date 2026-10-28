import { Link } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
export default function ProductCard({ product, search }) {
  return (
    <Link to={{ pathname: `/product/${product.id}`, search }} className="product-card" aria-label={`View ${product.title}`}>
      <div className="product-art">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {product.discountPercentage > 10 && <span className="discount">−{Math.round(product.discountPercentage)}%</span>}
        <span className="hover-arrow"><ArrowUpRight size={19}/></span>
      </div>
      <div className="product-content">
        <span className="product-category">{product.brand || product.category.replaceAll('-', ' ')}</span>
        <h3 title={product.title}>{product.title}</h3>
        <div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><span className="rating"><Star size={14} fill="currentColor"/> {product.rating?.toFixed(1) ?? 'N/A'}</span></div>
      </div>
    </Link>
  );
}
