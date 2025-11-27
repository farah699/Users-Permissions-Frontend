import React from 'react';
import { isDemoMode } from '../services/mockData';

export const DemoBanner: React.FC = () => {
  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-center shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="font-medium">
          🚀 Mode Démonstration - Données fictives pour la présentation
        </span>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
      <div className="text-xs opacity-90 mt-1">
        Identifiants: admin@demo.com / demo123
      </div>
    </div>
  );
};

export default DemoBanner;