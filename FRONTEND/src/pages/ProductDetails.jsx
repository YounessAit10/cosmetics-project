import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart, useLanguage } from '../hooks';
import { Button } from '../components';
import { products } from '../data/products';

export const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentLanguage } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Product not found
          </h1>
          <Button onClick={() => navigate('/products')}>
            {t('productDetails.backToProducts')}
          </Button>
        </div>
      </div>
    );
  }

  const name =
    currentLanguage === 'en'
      ? product.nameEn
      : currentLanguage === 'fr'
      ? product.nameFr
      : product.nameAr;

  const description =
    currentLanguage === 'en'
      ? product.descriptionEn
      : currentLanguage === 'fr'
      ? product.descriptionFr
      : product.descriptionAr;

  const ingredients =
    currentLanguage === 'en'
      ? product.ingredientsEn
      : currentLanguage === 'fr'
      ? product.ingredientsFr
      : product.ingredientsAr;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-accent hover:text-opacity-80 transition-all mb-8"
        >
          <ArrowLeft size={20} />
          {t('productDetails.backToProducts')}
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {name}
            </h1>

            <div className="text-3xl font-bold text-accent mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('productDetails.quantity')}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-primary dark:bg-gray-800 rounded-lg hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 text-center border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-primary dark:bg-gray-800 rounded-lg hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              onClick={handleAddToCart}
              className="w-full py-3 text-lg mb-8"
            >
              {t('productDetails.addToCart')}
            </Button>

            {/* Ingredients */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {t('productDetails.ingredients')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {ingredients}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
