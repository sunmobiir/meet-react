import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useTranslation } from 'react-i18next';

export const PWAInstallButton = () => {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Smartphone className="h-4 w-4" />
      <Download className="h-4 w-4" />
      {t('installApp', 'Install App')}
    </Button>
  );
};