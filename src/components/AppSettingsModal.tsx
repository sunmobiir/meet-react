import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore, AppSettings } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { Settings, Camera, Mic, Speaker, Bell, Video, AlertCircle } from 'lucide-react';

interface MediaDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export const AppSettingsModal = () => {
  const { t } = useTranslation();
  const settings = useAppStore(s => s.settings);
  const updateSettings = useAppStore(s => s.updateSettings);
  const lang = useAppStore(s => s.ui.lang);
  const theme = useAppStore(s => s.ui.theme);
  const setLang = useAppStore(s => s.setLang);
  const setTheme = useAppStore(s => s.setTheme);
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [cameras, setCameras] = useState<MediaDevice[]>([]);
  const [microphones, setMicrophones] = useState<MediaDevice[]>([]);
  const [speakers, setSpeakers] = useState<MediaDevice[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get real media devices
  const enumerateDevices = async () => {
    setIsLoading(true);
    setPermissionError(null);
    
    try {
      // Request permissions first
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Get all devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoInputs: MediaDevice[] = [
        { deviceId: 'default', label: t('defaultDevice'), kind: 'videoinput' }
      ];
      const audioInputs: MediaDevice[] = [
        { deviceId: 'default', label: t('defaultDevice'), kind: 'audioinput' }
      ];
      const audioOutputs: MediaDevice[] = [
        { deviceId: 'default', label: t('defaultDevice'), kind: 'audiooutput' }
      ];

      devices.forEach(device => {
        const deviceInfo: MediaDevice = {
          deviceId: device.deviceId,
          label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
          kind: device.kind
        };

        switch (device.kind) {
          case 'videoinput':
            videoInputs.push(deviceInfo);
            break;
          case 'audioinput':
            audioInputs.push(deviceInfo);
            break;
          case 'audiooutput':
            audioOutputs.push(deviceInfo);
            break;
        }
      });

      setCameras(videoInputs);
      setMicrophones(audioInputs);
      setSpeakers(audioOutputs);
    } catch (error) {
      console.error('Error enumerating devices:', error);
      setPermissionError('Unable to access media devices. Please grant camera and microphone permissions.');
      
      // Fallback to basic options
      setCameras([{ deviceId: 'default', label: t('defaultDevice'), kind: 'videoinput' }]);
      setMicrophones([{ deviceId: 'default', label: t('defaultDevice'), kind: 'audioinput' }]);
      setSpeakers([{ deviceId: 'default', label: t('defaultDevice'), kind: 'audiooutput' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load devices when modal opens
  useEffect(() => {
    if (open && cameras.length === 0) {
      enumerateDevices();
    }
  }, [open]);

  const handleSave = () => {
    updateSettings(localSettings);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setOpen(false);
  };

  const updateLocalSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const isRTL = lang === 'ar' || lang === 'fa';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t('settings')}>
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-3xl max-h-[80vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Settings className="h-5 w-5" />
            {t('appSettings')}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="audio-video" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="audio-video" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Video className="h-4 w-4" />
              {t('audioVideoSettings')}
            </TabsTrigger>
            <TabsTrigger value="general" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="h-4 w-4" />
              {t('generalSettings')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="h-4 w-4" />
              {t('notificationSettings')}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[50vh] overflow-y-auto">
            {/* Audio & Video Tab */}
            <TabsContent value="audio-video" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Camera className="h-4 w-4" />
                  {t('camera')}
                </Label>
                {permissionError && (
                  <div className={`flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <AlertCircle className="h-4 w-4" />
                    {permissionError}
                  </div>
                )}
                <Select
                  value={localSettings.selectedCamera}
                  onValueChange={(value) => updateLocalSetting('selectedCamera', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? 'Loading devices...' : t('selectDevice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((camera) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId}>
                        {camera.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mic className="h-4 w-4" />
                  {t('microphone')}
                </Label>
                <Select
                  value={localSettings.selectedMicrophone}
                  onValueChange={(value) => updateLocalSetting('selectedMicrophone', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? 'Loading devices...' : t('selectDevice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {microphones.map((mic) => (
                      <SelectItem key={mic.deviceId} value={mic.deviceId}>
                        {mic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Speaker className="h-4 w-4" />
                  {t('speakers')}
                </Label>
                <Select
                  value={localSettings.selectedSpeaker}
                  onValueChange={(value) => updateLocalSetting('selectedSpeaker', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? 'Loading devices...' : t('selectDevice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {speakers.map((speaker) => (
                      <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                        {speaker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label>{t('videoQuality')}</Label>
                  <Select
                    value={localSettings.videoQuality}
                    onValueChange={(value) => updateLocalSetting('videoQuality', value as 'low' | 'medium' | 'high')}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('low')}</SelectItem>
                      <SelectItem value="medium">{t('medium')}</SelectItem>
                      <SelectItem value="high">{t('high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label>{t('enableSoundEffects')}</Label>
                  <Switch
                    checked={localSettings.enableSoundEffects}
                    onCheckedChange={(checked) => updateLocalSetting('enableSoundEffects', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select
                  value={lang}
                  onValueChange={(value) => setLang(value as 'en' | 'ar' | 'fa')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="fa">فارسی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('theme')}</Label>
                <Select
                  value={theme}
                  onValueChange={(value) => setTheme(value as 'light' | 'dark')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('light')}</SelectItem>
                    <SelectItem value="dark">{t('dark')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label>{t('autoJoinAudio')}</Label>
                  <Switch
                    checked={localSettings.autoJoinAudio}
                    onCheckedChange={(checked) => updateLocalSetting('autoJoinAudio', checked)}
                  />
                </div>

                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Label>{t('autoStartVideo')}</Label>
                  <Switch
                    checked={localSettings.autoStartVideo}
                    onCheckedChange={(checked) => updateLocalSetting('autoStartVideo', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4 mt-0">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label>{t('enableNotifications')}</Label>
                <Switch
                  checked={localSettings.enableNotifications}
                  onCheckedChange={(checked) => updateLocalSetting('enableNotifications', checked)}
                />
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label>{t('enableSoundEffects')}</Label>
                <Switch
                  checked={localSettings.enableSoundEffects}
                  onCheckedChange={(checked) => updateLocalSetting('enableSoundEffects', checked)}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Buttons */}
        <div className={`flex gap-2 pt-4 border-t ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
          <Button variant="outline" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};