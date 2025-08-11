import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileManagerModal } from '@/components/FileManagerModal';
import { AppSettingsModal } from '@/components/AppSettingsModal';
import { QuizDrawer } from '@/components/QuizDrawer';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { useAppStore } from '@/store/useAppStore';
import { useUIStore, VideoConferencePosition } from '@/store/useUIStore';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Users, Moon, Sun, Languages, Video, Globe, ArrowLeftRight, Monitor, Layout, Eye, EyeOff, Check, LogOut, User } from 'lucide-react';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const lang = useUIStore(s => s.lang);
  const theme = useUIStore(s => s.theme);
  const currentUser = useUIStore(s => s.currentUser);
  const isVideoConferenceVisible = useUIStore(s => s.isVideoConferenceVisible);
  const videoConferencePosition = useUIStore(s => s.videoConferencePosition);
  
  // Panel visibility states
  const isCenterPanelVisible = useUIStore(s => s.isCenterPanelVisible);
  const isMainPanelVisible = useUIStore(s => s.isMainPanelVisible);
  const isMainPanelTopVisible = useUIStore(s => s.isMainPanelTopVisible);
  const isMainPanelCenterVisible = useUIStore(s => s.isMainPanelCenterVisible);
  const isMainPanelBottomVisible = useUIStore(s => s.isMainPanelBottomVisible);
  const isLeftPanelTopVisible = useUIStore(s => s.isLeftPanelTopVisible);
  const isLeftPanelCenterVisible = useUIStore(s => s.isLeftPanelCenterVisible);
  const isLeftPanelBottomVisible = useUIStore(s => s.isLeftPanelBottomVisible);
  
  const setLang = useUIStore(s => s.setLang);
  const setTheme = useUIStore(s => s.setTheme);
  const toggleChatDrawer = useUIStore(s => s.toggleChatDrawer);
  const toggleUsersDrawer = useUIStore(s => s.toggleUsersDrawer);
  const toggleVideoConference = useUIStore(s => s.toggleVideoConference);
  const setVideoConferencePosition = useUIStore(s => s.setVideoConferencePosition);
  const logout = useUIStore(s => s.logout);
  
  // Panel toggle functions
  const toggleCenterPanel = useUIStore(s => s.toggleCenterPanel);
  const toggleMainPanel = useUIStore(s => s.toggleMainPanel);
  const toggleMainPanelTop = useUIStore(s => s.toggleMainPanelTop);
  const toggleMainPanelCenter = useUIStore(s => s.toggleMainPanelCenter);
  const toggleMainPanelBottom = useUIStore(s => s.toggleMainPanelBottom);
  const toggleLeftPanelTop = useUIStore(s => s.toggleLeftPanelTop);
  const toggleLeftPanelCenter = useUIStore(s => s.toggleLeftPanelCenter);
  const toggleLeftPanelBottom = useUIStore(s => s.toggleLeftPanelBottom);

  const changeLang = (newLang: 'en' | 'ar' | 'fa') => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const getLanguageLabel = (langCode: string) => {
    switch (langCode) {
      case 'en': return t('english');
      case 'ar': return t('arabic');
      case 'fa': return t('persian');
      default: return langCode.toUpperCase();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex items-center justify-end py-3 gap-2">
        <div className="flex items-center gap-2">
          <FileManagerModal />
          <QuizDrawer />
          
          {/* Desktop panel toggles */}
          <div className="hidden sm:flex gap-2">
            <Button
              variant={isVideoConferenceVisible ? "default" : "outline"}
              size="sm"
              onClick={toggleVideoConference}
              aria-label={t('videoConference')}
            >
              <Video className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Video Conference Position">
                  <Monitor className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setVideoConferencePosition('centerPanel')} className="flex items-center justify-between">
                  <span>Center Panel</span>
                  {videoConferencePosition === 'centerPanel' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVideoConferencePosition('leftPanelTop')} className="flex items-center justify-between">
                  <span>Left Panel Top</span>
                  {videoConferencePosition === 'leftPanelTop' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVideoConferencePosition('mainPanelTop')} className="flex items-center justify-between">
                  <span>Main Panel Top</span>
                  {videoConferencePosition === 'mainPanelTop' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVideoConferencePosition('mainPanelCenter')} className="flex items-center justify-between">
                  <span>Main Panel Center</span>
                  {videoConferencePosition === 'mainPanelCenter' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVideoConferencePosition('mainPanelBottom')} className="flex items-center justify-between">
                  <span>Main Panel Bottom</span>
                  {videoConferencePosition === 'mainPanelBottom' && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Panel Visibility Control */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Panel Visibility">
                  <Layout className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={toggleCenterPanel} className="flex items-center justify-between">
                  <span>Center Panel</span>
                  {isCenterPanelVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleMainPanel} className="flex items-center justify-between">
                  <span>Main Panel</span>
                  {isMainPanelVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleMainPanelTop} className="flex items-center justify-between">
                  <span>Main Panel Top</span>
                  {isMainPanelTopVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleMainPanelCenter} className="flex items-center justify-between">
                  <span>Main Panel Center</span>
                  {isMainPanelCenterVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleMainPanelBottom} className="flex items-center justify-between">
                  <span>Main Panel Bottom</span>
                  {isMainPanelBottomVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleLeftPanelTop} className="flex items-center justify-between">
                  <span>Left Panel Top</span>
                  {isLeftPanelTopVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleLeftPanelCenter} className="flex items-center justify-between">
                  <span>Chat Panel</span>
                  {isLeftPanelCenterVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleLeftPanelBottom} className="flex items-center justify-between">
                  <span>Users Panel</span>
                  {isLeftPanelBottomVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <PWAInstallButton />
          <AppSettingsModal />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label={t('language')}>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLang('en')}>
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLang('ar')}>
                {t('arabic')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLang('fa')}>
                {t('persian')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={toggleTheme} aria-label={t('theme')}>
            {theme === 'light' ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
          </Button>

          {/* User Info and Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="User Menu">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{currentUser?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                <div className="font-medium">{currentUser?.username}</div>
                <div className="text-xs capitalize">{currentUser?.role}</div>
              </div>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout') || 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile drawer toggles */}
          <div className="flex gap-2 sm:hidden">
            <Button variant="secondary" onClick={() => toggleChatDrawer(true)} aria-label={t('chat')}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => toggleUsersDrawer(true)} aria-label={t('users')}>
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
