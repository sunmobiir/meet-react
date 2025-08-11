import { VideoConference } from '@/components/VideoConference';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const MainPanelBottom = () => {
  const isVideoConferenceVisible = useUIStore(s => s.isVideoConferenceVisible);
  const videoConferencePosition = useUIStore(s => s.videoConferencePosition);
  const isMainPanelBottomVisible = useUIStore(s => s.isMainPanelBottomVisible);
  const toggleMainPanelBottom = useUIStore(s => s.toggleMainPanelBottom);
  
  const shouldShowVideoConference = isVideoConferenceVisible && videoConferencePosition === 'mainPanelBottom';

  if (!isMainPanelBottomVisible) {
    return null;
  }

  if (shouldShowVideoConference) {
    return (
      <div className="h-full p-4 relative">
        {/* Panel Header with Dropdown */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleMainPanelBottom}>
                Hide Panel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <VideoConference />
      </div>
    );
  }

  return (
    <div className="h-full p-4 bg-background relative">
      {/* Panel Header with Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleMainPanelBottom}>
              Hide Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Main Panel Bottom</h3>
          <p className="text-sm">This is an empty main panel bottom</p>
        </div>
      </div>
    </div>
  );
};