'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Types pour le système de tracking
export interface LogisticsTracking {
  id: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  deliveryOption: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: Date;
  currentLocation: string;
  lastUpdate: Date;
  notes: string;
}

interface TrackingContextType {
  logistics: LogisticsTracking[];
  updateLogisticsStatus: (
    id: string,
    newStatus: LogisticsTracking['status'],
    updatedBy?: 'vendeuse' | 'system'
  ) => void;
  findByTrackingNumber: (trackingNumber: string) => LogisticsTracking | null;
  findByOrderNumber: (orderNumber: string) => LogisticsTracking | null;
  getStatusCounts: () => Record<string, number>;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

// Données initiales mockées
const initialLogistics: LogisticsTracking[] = [
  {
    id: '1',
    orderNumber: 'CMD-2024-001',
    customerName: 'Marie Dupont',
    deliveryAddress: '123 Rue de la Paix, Libreville, Gabon',
    deliveryOption: 'Express',
    status: 'in_transit',
    trackingNumber: 'AF24001789',
    estimatedDelivery: new Date('2024-01-25'),
    currentLocation: 'Centre de tri Libreville',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Colis en cours de livraison',
  },
  {
    id: '2',
    orderNumber: 'CMD-2024-002',
    customerName: 'Jean Martin',
    deliveryAddress: '456 Avenue des Palmiers, Libreville, Gabon',
    deliveryOption: 'Standard',
    status: 'preparing',
    trackingNumber: 'AF24002156',
    estimatedDelivery: new Date('2024-01-27'),
    currentLocation: 'Entrepôt AFROVIBZ',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Préparation en cours',
  },
  {
    id: '3',
    orderNumber: 'CMD-2024-003',
    customerName: 'Sophie Bernard',
    deliveryAddress: '789 Boulevard de la Mer, Libreville, Gabon',
    deliveryOption: 'Express',
    status: 'out_for_delivery',
    trackingNumber: 'AF24003423',
    estimatedDelivery: new Date('2024-01-18'),
    currentLocation: 'En route vers le client',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Livreur en route',
  },
];

const STORAGE_KEY = 'afrovibz_tracking_data';

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [logistics, setLogistics] = useState<LogisticsTracking[]>([]);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          // Reconvertir les dates
          const logisticsWithDates = parsedData.map((item: any) => ({
            ...item,
            estimatedDelivery: new Date(item.estimatedDelivery),
            lastUpdate: new Date(item.lastUpdate),
          }));
          setLogistics(logisticsWithDates);
        } catch (error) {
          console.error('Erreur lors du chargement des données tracking:', error);
          setLogistics(initialLogistics);
        }
      } else {
        setLogistics(initialLogistics);
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined' && logistics.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logistics));
    }
  }, [logistics]);

  const updateLogisticsStatus = (
    id: string,
    newStatus: LogisticsTracking['status'],
    updatedBy: 'vendeuse' | 'system' = 'vendeuse'
  ) => {
    setLogistics(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              lastUpdate: new Date(),
              currentLocation: getLocationForStatus(newStatus),
            }
          : item
      );

      // Notification différente selon qui a mis à jour
      const item = updated.find(item => item.id === id);
      if (item) {
        if (updatedBy === 'vendeuse') {
          toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
        } else {
          toast(`📦 Mise à jour automatique : ${item.orderNumber} - ${getStatusLabel(newStatus)}`);
        }
      }

      return updated;
    });
  };

  const findByTrackingNumber = (trackingNumber: string) => {
    return (
      logistics.find(item => item.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()) ||
      null
    );
  };

  const findByOrderNumber = (orderNumber: string) => {
    return (
      logistics.find(item => item.orderNumber.toLowerCase() === orderNumber.toLowerCase()) || null
    );
  };

  const getStatusCounts = () => {
    return logistics.reduce(
      (counts, item) => {
        counts[item.status] = (counts[item.status] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );
  };

  return (
    <TrackingContext.Provider
      value={{
        logistics,
        updateLogisticsStatus,
        findByTrackingNumber,
        findByOrderNumber,
        getStatusCounts,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}

// Fonctions utilitaires
function getLocationForStatus(status: LogisticsTracking['status']): string {
  const locations = {
    preparing: 'Entrepôt AFROVIBZ',
    shipped: 'Centre de tri principal',
    in_transit: 'Centre de tri Libreville',
    out_for_delivery: 'En route vers le client',
    delivered: 'Livré chez le client',
  };
  return locations[status] || 'Localisation inconnue';
}

function getStatusLabel(status: LogisticsTracking['status']): string {
  const labels = {
    preparing: 'En préparation',
    shipped: 'Expédié',
    in_transit: 'En transit',
    out_for_delivery: 'En livraison',
    delivered: 'Livré',
  };
  return labels[status] || status;
}
