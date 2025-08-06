'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Types pour la gestion de contenu
export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string; // userId ou nom
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string; // nom de l'icône Lucide
  isActive: boolean;
}

export interface PageContent {
  slug: string;
  title: string;
  description?: string;
  content: any; // Structure flexible selon le type de page
  updatedBy: string;
  updatedAt: Date;
}

interface ContentContextType {
  // FAQ Management
  faqItems: FAQItem[];
  faqCategories: FAQCategory[];
  addFAQItem: (item: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFAQItem: (id: string, updates: Partial<FAQItem>) => void;
  deleteFAQItem: (id: string) => void;
  toggleFAQItemStatus: (id: string) => void;

  // Category Management
  addFAQCategory: (category: Omit<FAQCategory, 'id'>) => void;
  updateFAQCategory: (id: string, updates: Partial<FAQCategory>) => void;
  deleteFAQCategory: (id: string) => void;

  // Page Content Management
  pageContents: PageContent[];
  updatePageContent: (slug: string, content: any, updatedBy: string) => void;
  getPageContent: (slug: string) => PageContent | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Données initiales FAQ
const initialFAQCategories: FAQCategory[] = [
  { id: 'commande', name: 'Commande', icon: 'ShoppingBag', isActive: true },
  { id: 'livraison', name: 'Livraison', icon: 'Truck', isActive: true },
  { id: 'paiement', name: 'Paiement', icon: 'CreditCard', isActive: true },
  { id: 'compte', name: 'Mon Compte', icon: 'User', isActive: true },
  { id: 'produits', name: 'Produits', icon: 'Package', isActive: true },
];

const initialFAQItems: FAQItem[] = [
  {
    id: '1',
    category: 'Commande',
    question: 'Comment passer une commande ?',
    answer:
      'Pour passer commande, ajoutez vos articles au panier, puis cliquez sur "Passer la commande". Vous devrez ensuite remplir vos informations de livraison et choisir votre mode de paiement.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
  {
    id: '2',
    category: 'Commande',
    question: 'Puis-je modifier ma commande après validation ?',
    answer:
      "Les modifications ne sont possibles que dans les 30 minutes suivant la validation, et uniquement si la commande n'est pas encore en préparation. Contactez-nous rapidement.",
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
  {
    id: '3',
    category: 'Livraison',
    question: 'Quels sont vos délais de livraison ?',
    answer:
      'Nos délais de livraison varient selon votre zone :\n• Libreville : 24-48h\n• Port-Gentil : 2-3 jours\n• Autres villes : 3-5 jours\n• Zones rurales : 5-7 jours',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
  {
    id: '4',
    category: 'Livraison',
    question: 'Livrez-vous partout au Gabon ?',
    answer:
      'Oui, nous livrons dans tout le Gabon. Les frais de livraison sont gratuits à partir de 50,000 FCFA pour Libreville et Port-Gentil.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
  {
    id: '5',
    category: 'Paiement',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Nous acceptons :\n• Paiement à la livraison (espèces)\n• Virement bancaire\n• Mobile Money (Airtel Money, Moov Money)\n• Cartes bancaires (prochainement)',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
  {
    id: '6',
    category: 'Compte',
    question: 'Comment créer un compte client ?',
    answer:
      'Cliquez sur "S\'inscrire" en haut de la page, remplissez vos informations personnelles et confirmez votre email. Votre compte sera créé immédiatement.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    updatedBy: 'Admin',
  },
];

const STORAGE_KEY_FAQ_ITEMS = 'afrovibz_faq_items';
const STORAGE_KEY_FAQ_CATEGORIES = 'afrovibz_faq_categories';
const STORAGE_KEY_PAGE_CONTENTS = 'afrovibz_page_contents';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // FAQ Items
      const storedFAQItems = localStorage.getItem(STORAGE_KEY_FAQ_ITEMS);
      if (storedFAQItems) {
        try {
          const parsedItems = JSON.parse(storedFAQItems);
          const itemsWithDates = parsedItems.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }));
          setFaqItems(itemsWithDates);
        } catch (error) {
          console.error('Erreur lors du chargement des FAQ:', error);
          setFaqItems(initialFAQItems);
        }
      } else {
        setFaqItems(initialFAQItems);
      }

      // FAQ Categories
      const storedCategories = localStorage.getItem(STORAGE_KEY_FAQ_CATEGORIES);
      if (storedCategories) {
        try {
          setFaqCategories(JSON.parse(storedCategories));
        } catch (error) {
          console.error('Erreur lors du chargement des catégories:', error);
          setFaqCategories(initialFAQCategories);
        }
      } else {
        setFaqCategories(initialFAQCategories);
      }

      // Page Contents
      const storedContents = localStorage.getItem(STORAGE_KEY_PAGE_CONTENTS);
      if (storedContents) {
        try {
          const parsedContents = JSON.parse(storedContents);
          const contentsWithDates = parsedContents.map((content: any) => ({
            ...content,
            updatedAt: new Date(content.updatedAt),
          }));
          setPageContents(contentsWithDates);
        } catch (error) {
          console.error('Erreur lors du chargement des contenus:', error);
          setPageContents([]);
        }
      }
    }
  }, []);

  // Sauvegarder FAQ Items dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && faqItems.length > 0) {
      localStorage.setItem(STORAGE_KEY_FAQ_ITEMS, JSON.stringify(faqItems));
    }
  }, [faqItems]);

  // Sauvegarder FAQ Categories dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && faqCategories.length > 0) {
      localStorage.setItem(STORAGE_KEY_FAQ_CATEGORIES, JSON.stringify(faqCategories));
    }
  }, [faqCategories]);

  // Sauvegarder Page Contents dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && pageContents.length > 0) {
      localStorage.setItem(STORAGE_KEY_PAGE_CONTENTS, JSON.stringify(pageContents));
    }
  }, [pageContents]);

  // FAQ Item Management
  const addFAQItem = (item: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: FAQItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFaqItems(prev => [...prev, newItem]);
    toast.success('✅ Question ajoutée avec succès');
  };

  const updateFAQItem = (id: string, updates: Partial<FAQItem>) => {
    setFaqItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item))
    );
    toast.success('✅ Question mise à jour');
  };

  const deleteFAQItem = (id: string) => {
    setFaqItems(prev => prev.filter(item => item.id !== id));
    toast.success('🗑️ Question supprimée');
  };

  const toggleFAQItemStatus = (id: string) => {
    setFaqItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive, updatedAt: new Date() } : item
      )
    );
    const item = faqItems.find(item => item.id === id);
    toast.success(`${item?.isActive ? '❌ Question désactivée' : '✅ Question activée'}`);
  };

  // Category Management
  const addFAQCategory = (category: Omit<FAQCategory, 'id'>) => {
    const newCategory: FAQCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setFaqCategories(prev => [...prev, newCategory]);
    toast.success('✅ Catégorie ajoutée');
  };

  const updateFAQCategory = (id: string, updates: Partial<FAQCategory>) => {
    setFaqCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)));
    toast.success('✅ Catégorie mise à jour');
  };

  const deleteFAQCategory = (id: string) => {
    // Vérifier s'il y a des questions dans cette catégorie
    const hasItems = faqItems.some(
      item => item.category === faqCategories.find(cat => cat.id === id)?.name
    );
    if (hasItems) {
      toast.error('❌ Impossible de supprimer une catégorie contenant des questions');
      return;
    }

    setFaqCategories(prev => prev.filter(cat => cat.id !== id));
    toast.success('🗑️ Catégorie supprimée');
  };

  // Page Content Management
  const updatePageContent = (slug: string, content: any, updatedBy: string) => {
    const existingIndex = pageContents.findIndex(page => page.slug === slug);
    const pageData: PageContent = {
      slug,
      title: content.title || slug,
      description: content.description,
      content,
      updatedBy,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      setPageContents(prev =>
        prev.map((page, index) => (index === existingIndex ? pageData : page))
      );
    } else {
      setPageContents(prev => [...prev, pageData]);
    }

    toast.success(`✅ Page ${slug} mise à jour`);
  };

  const getPageContent = (slug: string): PageContent | null => {
    return pageContents.find(page => page.slug === slug) || null;
  };

  return (
    <ContentContext.Provider
      value={{
        faqItems,
        faqCategories,
        addFAQItem,
        updateFAQItem,
        deleteFAQItem,
        toggleFAQItemStatus,
        addFAQCategory,
        updateFAQCategory,
        deleteFAQCategory,
        pageContents,
        updatePageContent,
        getPageContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
