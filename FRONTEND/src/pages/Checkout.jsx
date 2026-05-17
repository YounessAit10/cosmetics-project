import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart, useLanguage } from '../hooks';
import { Button } from '../components';

export const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate order placement
    setTimeout(() => {
      clearCart();
      navigate('/');
      alert('Order placed successfully! Thank you for your purchase.');
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('checkout.emptyCart')}
          </h1>
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
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-accent hover:text-opacity-80 transition-all mb-8"
        >
          <ArrowLeft size={20} />
          {t('checkout.backToCart')}
        </button>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-12">
          {t('checkout.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t('checkout.shippingAddress')}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder={t('checkout.firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder={t('checkout.lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder={t('checkout.email')}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              />

              <input
                type="text"
                name="address"
                placeholder={t('checkout.address')}
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="city"
                  placeholder={t('checkout.city')}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder={t('checkout.zipCode')}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder={t('checkout.phone')}
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Payment Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t('checkout.payment')}
              </h2>

              <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('checkout.paymentNote')}
                </p>
                <input
                  type="text"
                  placeholder={t('checkout.cardNumber')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none mb-4"
                  disabled
                  defaultValue="4242 4242 4242 4242"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('checkout.expiry')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none"
                    disabled
                    defaultValue="12/25"
                  />
                  <input
                    type="text"
                    placeholder={t('checkout.cvc')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none"
                    disabled
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg"
            >
              {isLoading ? t('checkout.processing') : t('checkout.placeOrder')}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg h-fit">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t('cart.checkout')}
            </h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                >
                  <span>{item.quantity}x {getProductName(item)}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-6 space-y-3">
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
              <div className="border-t border-gray-300 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-800 dark:text-white text-lg">
                <span>{t('cart.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
