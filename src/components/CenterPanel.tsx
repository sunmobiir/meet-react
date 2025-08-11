import { VideoConference } from '@/components/VideoConference';
import { useUIStore } from '@/store/useUIStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const CenterPanel = () => {
  const { t } = useTranslation();
  const isVideoConferenceVisible = useUIStore(s => s.isVideoConferenceVisible);
  const videoConferencePosition = useUIStore(s => s.videoConferencePosition);
  const isCenterPanelVisible = useUIStore(s => s.isCenterPanelVisible);
  const toggleCenterPanel = useUIStore(s => s.toggleCenterPanel);
  
  const shouldShowVideoConference = isVideoConferenceVisible && videoConferencePosition === 'centerPanel';

  if (!isCenterPanelVisible) {
    return null;
  }

  return (
    <main className="h-full overflow-auto relative">
      {/* Panel Header with Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleCenterPanel}>
              Hide Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {shouldShowVideoConference ? (
        <div className="h-full p-4">
          <VideoConference />
        </div>
      ) : (
        <div className="h-full p-4 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{t('welcomeToStage')}</h2>
            <p>{t('useQuizDrawerToStartQuiz')}</p>
          </div>
        </div>
      )}
    </main>
  );
};