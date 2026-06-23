import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { MapPin, Scale, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Pickup } from '../types';

export const RecyclerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [pickups, setPickups] = useState<Pickup[]>([]);

  useEffect(() => {
    const loadPickups = () => {
      const saved = JSON.parse(localStorage.getItem('w2c_pickups') || '[]');
      setPickups(saved.filter((p: Pickup) => p.status === 'available'));
    };

    loadPickups();
    // Refresh periodically to simulate real-time updates
    const interval = setInterval(loadPickups, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (pickupId: string) => {
    const allPickups = JSON.parse(localStorage.getItem('w2c_pickups') || '[]');
    const updated = allPickups.map((p: Pickup) => {
      if (p.id === pickupId) {
        return { ...p, status: 'claimed' };
      }
      return p;
    });

    localStorage.setItem('w2c_pickups', JSON.stringify(updated));
    setPickups(updated.filter((p: Pickup) => p.status === 'available'));
    
    // Simulate awarding points to the resident
    const currentPoints = parseInt(localStorage.getItem('w2c_points') || '0', 10);
    localStorage.setItem('w2c_points', (currentPoints + 10).toString());

    toast.success(t('successClaim'));
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-primary" />
          {t('availablePickups')}
        </h2>
        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
          {pickups.length}
        </span>
      </div>

      {pickups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Trash2 className="h-12 w-12 mx-auto opacity-20 mb-4" />
            <p>{t('noPickups')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id} className="overflow-hidden">
              {pickup.photo && (
                <img 
                  src={pickup.photo} 
                  alt={pickup.type} 
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="capitalize">{t(pickup.type)}</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(pickup.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {pickup.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 font-medium">
                  <Scale className="h-4 w-4 text-primary" />
                  {pickup.weight} kg
                </div>
                <Button 
                  onClick={() => handleClaim(pickup.id)} 
                  className="w-full flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t('claim')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
