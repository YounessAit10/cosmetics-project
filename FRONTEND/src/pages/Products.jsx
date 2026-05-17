import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks';
import { ProductGrid } from '../components';
import { products } from '../data/products';

export const Products = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('products.all') },
    { id: 'skincare', label: t('products.skincare') },
    { id: 'acne', label: t('products.acne') },
    { id: 'hydration', label: t('products.hydration') },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">
          {t('products.title')}
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-accent text-white'
                  : 'bg-primary dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-secondary dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
