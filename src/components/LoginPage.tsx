import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUIStore, UserRole } from '@/store/useUIStore';
import { useTranslation } from 'react-i18next';
import { Video, Users, Globe, Moon, Sun } from 'lucide-react';

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [isLoading, setIsLoading] = useState(false);

  const login = useUIStore(s => s.login);
  const lang = useUIStore(s => s.lang);
  const theme = useUIStore(s => s.theme);
  const setLang = useUIStore(s => s.setLang);
  const setTheme = useUIStore(s => s.setTheme);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    login(username.trim(), password, role);
    setIsLoading(false);
  };

  const changeLang = (newLang: 'en' | 'ar' | 'fa') => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getLanguageLabel = (langCode: string) => {
    switch (langCode) {
      case 'en': return 'English';
      case 'ar': return 'العربية';
      case 'fa': return 'فارسی';
      default: return langCode.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Language and Theme Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Select value={lang} onValueChange={changeLang}>
          <SelectTrigger className="w-32">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="fa">فارسی</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Video className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Live Stage</CardTitle>
          <CardDescription>
            {t('loginDescription') || 'Enter your credentials to join the video conference'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
            
              <RadioGroup
                value={role}
                onValueChange={(value: UserRole) => setRole(value)}
                disabled={isLoading}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="host" id="host" />
                  <Label htmlFor="host" className="flex items-center cursor-pointer">
                    <Video className="h-4 w-4 mr-2" />
                    {t('host') || 'Host'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="participant" id="participant" />
                  <Label htmlFor="participant" className="flex items-center cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    {t('participant') || 'Participant'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">{t('username') || 'Username'}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('enterUsername') || 'Enter your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password') || 'Password'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('enterPassword') || 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('loggingIn') || 'Logging in...'}
                </div>
              ) : (
                t('login') || 'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{t('loginNote') || 'Any password will be accepted for demo purposes'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};