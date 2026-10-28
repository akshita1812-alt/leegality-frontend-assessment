import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, Github } from 'lucide-react';
import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';
import './styles.css';
export function App() {
  return <BrowserRouter><header className="site-header"><div className="header-inner"><Link to="/" className="logo"><span className="logo-mark"><ShoppingBag size={20}/></span> catalogly<span className="logo-dot">.</span></Link><nav><Link to="/">Shop collection</Link><a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">API docs</a></nav><span className="header-right">THE EVERYDAY EDIT <span className="edition">/ 2026</span></span></div></header><Routes><Route path="/" element={<ListingPage/>}/><Route path="/product/:id" element={<DetailPage/>}/><Route path="*" element={<main className="page-container state-box"><h1>Page not found</h1><Link to="/">Back to shop</Link></main>}/></Routes><footer className="footer"><span>© 2026 Catalogly. Built for the Leegality frontend assessment.</span><a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer"><Github size={15}/> Powered by DummyJSON</a></footer></BrowserRouter>;
}
createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);
