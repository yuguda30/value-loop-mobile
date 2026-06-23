import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Role } from '../types';
import { Button } from './ui/button';
import { User, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] max-w-md mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="relative mx-auto w-24 h-24 mb-6">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/a1a48369-34ed-4a9d-ba26-45c7fadf1ac6/waste2cash-logo-8add1a6d-1782222259420.webp" 
            alt="Waste2Cash Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t('appTitle')}</h1>
        <p className="text-muted-foreground">{t('selectRole')}</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full space-y-4"
      >
        <motion.div variants={item}>
          <Button 
            variant="outline" 
            className="w-full h-32 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={() => onSelect('resident')}
          >
            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="h-8 w-8" />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold">{t('resident')}</span>
              <span className="text-xs text-muted-foreground">{t('residentDesc')}</span>
            </div>
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <Button 
            variant="outline" 
            className="w-full h-32 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={() => onSelect('recycler')}
          >
            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              <Truck className="h-8 w-8" />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold">{t('recycler')}</span>
              <span className="text-xs text-muted-foreground">{t('recyclerDesc')}</span>
            </div>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full rounded-2xl overflow-hidden shadow-lg"
      >
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/a1a48369-34ed-4a9d-ba26-45c7fadf1ac6/waste2cash-hero-image-5eca8594-1782222277811.webp" 
          alt="Recycling Community" 
          className="w-full h-40 object-cover"
        />
      </motion.div>
    </div>
  );
};
