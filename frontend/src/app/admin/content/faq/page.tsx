'use client';

import { Plus, Search, Edit, Trash2, Eye, EyeOff, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useContent } from '@/lib/context/ContentContext';
import { useAuth } from '@/lib/hooks/useAuth';

interface FAQFormData {
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function AdminFAQPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { faqItems, faqCategories, addFAQItem, updateFAQItem, deleteFAQItem, toggleFAQItemStatus } =
    useContent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState<FAQFormData>({
    category: '',
    question: '',
    answer: '',
    isActive: true,
  });

  useEffect(() => {
    if (!loading && (!user || !['admin', 'super_admin'].includes(user.role))) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredItems = faqItems.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updateFAQItem(editingItem, {
        ...formData,
        updatedBy: user?.displayName || 'Admin',
      });
      setEditingItem(null);
    } else {
      addFAQItem({
        ...formData,
        updatedBy: user?.displayName || 'Admin',
      });
    }

    setFormData({
      category: '',
      question: '',
      answer: '',
      isActive: true,
    });
    setIsFormOpen(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      isActive: item.isActive,
    });
    setEditingItem(item.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      category: '',
      question: '',
      answer: '',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>Chargement...</div>
    );
  }

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center space-x-4 mb-4'>
            <Link
              href='/admin'
              className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Retour au dashboard
            </Link>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>Gestion FAQ</h1>
          <p className='mt-2 text-gray-600'>Gérez les questions fréquemment posées</p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Search className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Questions</p>
                <p className='text-2xl font-bold text-gray-900'>{faqItems.length}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Eye className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Actives</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {faqItems.filter(item => item.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <EyeOff className='h-6 w-6 text-orange-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Désactivées</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {faqItems.filter(item => !item.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 flex-1'>
              {/* Search */}
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  type='text'
                  placeholder='Rechercher une question...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
              >
                <option value='all'>Toutes les catégories</option>
                {faqCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={() => {
                setIsFormOpen(true);
                setEditingItem(null);
              }}
              className='min-h-[44px]'
            >
              <Plus className='h-4 w-4 mr-2' />
              Ajouter une question
            </Button>
          </div>
        </div>

        {/* Form Modal - Mobile Optimized */}
        {isFormOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4'>
            <div className='bg-white rounded-t-xl sm:rounded-lg w-full max-w-2xl sm:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto'>
              <div className='p-4 sm:p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold'>
                    {editingItem ? 'Modifier la question' : 'Ajouter une question'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className='p-3 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  {/* Category */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className='w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black min-h-[44px] text-base'
                      required
                    >
                      <option value=''>Sélectionnez une catégorie</option>
                      {faqCategories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Question */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Question</label>
                    <Input
                      type='text'
                      value={formData.question}
                      onChange={e => setFormData({ ...formData, question: e.target.value })}
                      placeholder='Entrez la question...'
                      required
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Réponse</label>
                    <textarea
                      value={formData.answer}
                      onChange={e => setFormData({ ...formData, answer: e.target.value })}
                      placeholder='Entrez la réponse...'
                      rows={5}
                      className='w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none text-base'
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className='flex items-center space-x-3 py-2'>
                    <input
                      type='checkbox'
                      id='isActive'
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className='w-4 h-4 rounded border-gray-300 text-black focus:ring-black'
                    />
                    <label
                      htmlFor='isActive'
                      className='text-sm text-gray-700 cursor-pointer flex-1'
                    >
                      Question active (visible sur le site)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4'>
                    <Button type='submit' className='flex-1 min-h-[48px]'>
                      <Save className='h-4 w-4 mr-2' />
                      {editingItem ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                    <Button
                      type='button'
                      onClick={handleCancel}
                      variant='outline'
                      className='flex-1 min-h-[48px]'
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List - Mobile Cards + Desktop Table */}
        {/* Mobile Cards View */}
        <div className='block md:hidden space-y-4'>
          {filteredItems.map(item => (
            <div key={item.id} className='bg-white rounded-lg shadow border border-gray-200 p-4'>
              {/* Header */}
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center space-x-2'>
                  <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {item.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Désactivée'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className='mb-3'>
                <h4 className='text-sm font-medium text-gray-900 mb-2 line-clamp-2'>
                  {item.question}
                </h4>
                <p className='text-sm text-gray-500 line-clamp-3'>{item.answer}</p>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                <span className='text-xs text-gray-500'>
                  Modifié le {item.updatedAt.toLocaleDateString('fr-FR')}
                </span>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handleEdit(item)}
                    className='p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center'
                    title='Modifier'
                  >
                    <Edit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => toggleFAQItemStatus(item.id)}
                    className='p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center'
                    title={item.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {item.isActive ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
                        deleteFAQItem(item.id);
                      }
                    }}
                    className='p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center'
                    title='Supprimer'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className='hidden md:block bg-white rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Question
                  </th>
                  <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Catégorie
                  </th>
                  <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Statut
                  </th>
                  <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Modifié le
                  </th>
                  <th className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredItems.map(item => (
                  <tr key={item.id} className='hover:bg-gray-50'>
                    <td className='px-4 lg:px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                        {item.question}
                      </div>
                      <div className='text-sm text-gray-500 max-w-md truncate'>{item.answer}</div>
                    </td>
                    <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        {item.category}
                      </span>
                    </td>
                    <td className='px-4 lg:px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Désactivée'}
                      </span>
                    </td>
                    <td className='px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {item.updatedAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td className='px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleEdit(item)}
                          className='text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors'
                          title='Modifier'
                        >
                          <Edit className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => toggleFAQItemStatus(item.id)}
                          className='text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors'
                          title={item.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {item.isActive ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
                              deleteFAQItem(item.id);
                            }
                          }}
                          className='text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors'
                          title='Supprimer'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Search className='h-12 w-12 mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Aucune question trouvée</h3>
            <p className='text-gray-500'>
              {searchTerm || selectedCategory !== 'all'
                ? 'Aucune question ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre première question FAQ.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
