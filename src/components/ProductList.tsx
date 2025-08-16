import React, { useEffect, useState } from 'react';
import { IPresent } from '../types/presents';
import { productService } from '../services/productService';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IPresent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.listProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (productId: string) => {
    try {
      await productService.initiateCheckout(productId);
    } catch (err) {
      console.error('Failed to initiate checkout:', err);
      alert('Failed to start checkout process');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {product.image && (
            <img src={product.image} alt={product.name} />
          )}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: € {(product.price / 100).toFixed(2)}</p>
          <button onClick={() => handleBuyClick(product.id)}>
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}; 