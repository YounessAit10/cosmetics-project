import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useCart, useLanguage } from '../hooks';
import { Button } from '../components';

export const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { currentLanguage } = useLanguage();

  const getProductName = (product) => {
    return currentLanguage === 'en'
      ? product.nameEn
      : currentLanguage === 'fr'
      ? product.nameFr
      : product.nameAr;
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('cart.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('cart.empty')}
          </p>
          <Button onClick={() => navigate('/products')}>
            {t('cart.continue')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-accent hover:text-opacity-80 transition-all mb-8"
        >
          <ArrowLeft size={20} />
          {t('cart.continue')}
        </button>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-12">
          {t('cart.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={getProductName(item)}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {getProductName(item)}
                    </h3>
                    <p className="text-accent font-bold mb-3">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        {t('cart.quantity')}:
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-primary dark:bg-gray-700 rounded hover:bg-secondary dark:hover:bg-gray-600 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-primary dark:bg-gray-700 rounded hover:bg-secondary dark:hover:bg-gray-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg h-fit">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t('cart.checkout')}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart.shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart.tax')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 pt-4 flex justify-between font-bold text-gray-800 dark:text-white text-lg">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate('/checkout')}
              className="w-full py-3 text-lg"
            >
              {t('cart.checkout')}
            </Button>

            {shipping === 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-4 text-center">
                ✓ Free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
