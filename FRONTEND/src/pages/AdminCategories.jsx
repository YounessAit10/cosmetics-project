import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Loader2, Package, Search } from 'lucide-react';
import { categoryService } from '../services/api';
import { useLanguage } from '../hooks';
import { Button } from '../components';

export const AdminCategories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nameFr: '',
    nameEn: '',
    nameAr: '',
    descriptionFr: '',
    descriptionEn: '',
    descriptionAr: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    if (currentLanguage === 'ar' && category.nameAr) return category.nameAr;
    if (currentLanguage === 'en' && category.nameEn) return category.nameEn;
    return category.nameFr;
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        nameFr: category.nameFr || '',
        nameEn: category.nameEn || '',
        nameAr: category.nameAr || '',
        descriptionFr: category.descriptionFr || '',
        descriptionEn: category.descriptionEn || '',
        descriptionAr: category.descriptionAr || '',
        imageUrl: category.imageUrl || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        nameFr: '',
        nameEn: '',
        nameAr: '',
        descriptionFr: '',
        descriptionEn: '',
        descriptionAr: '',
        imageUrl: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      
      await loadCategories();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    
    try {
      await categoryService.delete(categoryId);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCategories = categories.filter(category =>
    getCategoryName(category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('admin.categories')}
          </h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/admin/products')}>
              {t('admin.products')}
            </Button>
            <Button onClick={() => navigate('/admin/orders')}>
              {t('admin.orders')}
            </Button>
            <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <Plus size={18} />
              {t('admin.addCategory')}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('admin.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={getCategoryName(category)}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Package className="text-gray-400" size={48} />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {getCategoryName(category)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {category.descriptionFr}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                  >
                    <Edit size={18} />
                    {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 size={18} />
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {editingCategory ? t('admin.editCategory') : t('admin.addCategory')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.nameFr')}
                      </label>
                      <input
                        type="text"
                        name="nameFr"
                        value={formData.nameFr}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.nameEn')}
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.nameAr')}
                      </label>
                      <input
                        type="text"
                        name="nameAr"
                        value={formData.nameAr}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.descFr')}
                      </label>
                      <textarea
                        name="descriptionFr"
                        value={formData.descriptionFr}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.descEn')}
                      </label>
                      <textarea
                        name="descriptionEn"
                        value={formData.descriptionEn}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('admin.descAr')}
                      </label>
                      <textarea
                        name="descriptionAr"
                        value={formData.descriptionAr}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('admin.imageUrl')}
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-500 hover:bg-gray-600">
                      {t('admin.cancel')}
                    </Button>
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? <Loader2 className="animate-spin" size={18} /> : t('admin.save')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;