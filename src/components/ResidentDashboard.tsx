import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, MapPin, Scale, Trash2, Wallet as WalletIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { compressImage } from '../lib/imageUtils';
import { Pickup, WasteType } from '../types';

export const ResidentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('w2c_points');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [type, setType] = useState<WasteType>('plastic');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('w2c_points', points.toString());
  }, [points]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setPhoto(compressed);
      } catch (error) {
        console.error('Photo compression failed', error);
        toast.error(t('photoError'));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !address) {
      toast.error(t('fillRequired'));
      return;
    }

    setIsSubmitting(true);

    const newPickup: Pickup = {
      id: crypto.randomUUID(),
      type,
      weight: parseFloat(weight),
      address,
      photo,
      status: 'available',
      createdAt: new Date().toISOString(),
      residentId: 'current-user', // Simulated user
    };

    // Simulate offline/online check
    const isOnline = navigator.onLine;

    const pickups = JSON.parse(localStorage.getItem('w2c_pickups') || '[]');
    
    if (isOnline) {
      pickups.push(newPickup);
      localStorage.setItem('w2c_pickups', JSON.stringify(pickups));
      setPoints((prev) => prev + 10);
      toast.success(t('successPost'));
    } else {
      const queue = JSON.parse(localStorage.getItem('w2c_offline_queue') || '[]');
      queue.push(newPickup);
      localStorage.setItem('w2c_offline_queue', JSON.stringify(queue));
      toast.info(t('offlineMode'));
    }

    // Reset form
    setType('plastic');
    setWeight('');
    setAddress('');
    setPhoto(null);
    setIsSubmitting(false);
  };

  const handleRedeem = () => {
    if (points < 100) {
      toast.error(t('insufficientPoints'));
      return;
    }

    if (confirm(t('confirmRedeem'))) {
      setPoints((prev) => prev - 100);
      toast.success(t('redeemSuccess'));
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 pb-20">
      {/* Wallet Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <WalletIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">{t('wallet')}</p>
              <p className="text-3xl font-bold">{points} {t('points')}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleRedeem}
            className="font-semibold"
          >
            {t('redeem')}
          </Button>
        </CardContent>
        <CardHeader className="pt-0">
          <CardDescription className="text-primary-foreground/80 text-center italic">
            {t('redeemDesc')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Post Waste Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-primary" />
            {t('postWaste')}
          </CardTitle>
          <CardDescription>{t('residentDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('wasteType')}</Label>
              <Select value={type} onValueChange={(val: WasteType) => setType(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">{t('plastic')}</SelectItem>
                  <SelectItem value="paper">{t('paper')}</SelectItem>
                  <SelectItem value="metal">{t('metal')}</SelectItem>
                  <SelectItem value="glass">{t('glass')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">{t('weight')}</Label>
              <div className="relative">
                <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  className="pl-10"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('address')}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Lagos Island, Lagos"
                  className="pl-10"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('photo')}</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${photo ? 'border-primary bg-primary/5' : 'border-muted'}`}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {photo ? (
                  <div className="relative inline-block">
                    <img src={photo} alt="Waste" className="h-32 w-32 object-cover rounded-md mx-auto" />
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Camera className="h-8 w-8" />
                    <span className="text-sm">{t('photo')}</span>
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  capture="environment"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
