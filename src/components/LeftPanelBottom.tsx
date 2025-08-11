import { ParticipantList } from '@/components/ParticipantList';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const LeftPanelBottom = () => {
  const isLeftPanelBottomVisible = useUIStore(s => s.isLeftPanelBottomVisible);
  const toggleLeftPanelBottom = useUIStore(s => s.toggleLeftPanelBottom);

  if (!isLeftPanelBottomVisible) {
    return null;
  }

  return (
    <div className="h-full relative bg-background border-b">
      {/* Panel Header with Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleLeftPanelBottom}>
              Hide Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="h-full">
        <ParticipantList />
      </div>
    </div>
  );
};