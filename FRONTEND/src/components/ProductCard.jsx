import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks';
import { Button } from './Button';

export const ProductCard = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <Heart
              size={20}
              className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
            />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 hover:text-accent transition-colors">
            {name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</span>
        </div>

        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart size={18} />
          {t('products.addToCart')}
        </Button>
      </div>
    </div>
  );
};
