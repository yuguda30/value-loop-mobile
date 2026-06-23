import React, { useState, useEffect } from 'react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { RoleSelection } from './components/RoleSelection';
import { ResidentDashboard } from './components/ResidentDashboard';
import { RecyclerDashboard } from './components/RecyclerDashboard';
import { LanguageToggle } from './components/LanguageToggle';
import { Role } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { LogOut, Trash2 } from 'lucide-react';
import { Button } from './components/ui/button';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem('w2c_role');
    return saved as Role | null;
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem('w2c_role', role);
    } else {
      localStorage.removeItem('w2c_role');
    }
  }, [role]);

  // Offline Sync simulation
  useEffect(() => {
    const syncOffline = () => {
      const queue = JSON.parse(localStorage.getItem('w2c_offline_queue') || '[]');
      if (queue.length > 0 && navigator.onLine) {
        const pickups = JSON.parse(localStorage.getItem('w2c_pickups') || '[]');
        const newPoints = queue.length * 10;
        
        localStorage.setItem('w2c_pickups', JSON.stringify([...pickups, ...queue]));
        localStorage.removeItem('w2c_offline_queue');
        
        const currentPoints = parseInt(localStorage.getItem('w2c_points') || '0', 10);
        localStorage.setItem('w2c_points', (currentPoints + newPoints).toString());
        
        toast.success(t('syncSuccess'));
        // Trigger a re-render for points if in Resident dashboard
        window.location.reload(); 
      }
    };

    window.addEventListener('online', syncOffline);
    return () => window.removeEventListener('online', syncOffline);
  }, [t]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Trash2 className="h-5 w-5" />
            <span>{t('appTitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {role && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setRole(null)}
                title={t('logout')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container pb-10">
        {!role ? (
          <RoleSelection onSelect={setRole} />
        ) : role === 'resident' ? (
          <ResidentDashboard />
        ) : (
          <RecyclerDashboard />
        )}
      </main>
      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
