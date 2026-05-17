import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks';
import { ProductGrid, Button } from '../components';
import { products } from '../data/products';

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary dark:from-gray-800 dark:to-gray-900 py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {t('home.subtitle')}
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="text-lg px-8 py-3"
          >
            {t('home.cta')}
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">
          {t('home.featured')}
        </h2>
        <ProductGrid
          products={featuredProducts}
          onAddToCart={addToCart}
        />
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Natural Ingredients
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All our products use natural and organic ingredients for your safety.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Free worldwide shipping on orders over $50.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Satisfaction Guarantee
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                30-day money-back guarantee on all purchases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
