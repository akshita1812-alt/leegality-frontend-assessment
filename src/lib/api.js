const BASE_URL = 'https://dummyjson.com';

async function getJson(path, signal) {
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) throw new Error(`Request failed (${response.status}). Please try again.`);
  return response.json();
}

// limit=0 is supported by DummyJSON and returns the complete collection.
// This allows price and brand filtering across the entire dataset (not just the current page).
export async function getProducts(category, signal) {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}?limit=0`
    : '/products?limit=0';
  const data = await getJson(path, signal);
  return data.products ?? [];
}
export async function getCategories(signal) {
  return getJson('/products/categories', signal);
}
export async function getProduct(id, signal) {
  return getJson(`/products/${encodeURIComponent(id)}`, signal);
}
