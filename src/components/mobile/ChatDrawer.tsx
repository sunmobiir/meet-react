import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useUIStore } from '@/store/useUIStore';
import { ChatPanel } from '@/components/ChatPanel';
import { useTranslation } from 'react-i18next';

export const ChatDrawer = () => {
  const { t } = useTranslation();
  const open = useUIStore(s => s.isChatDrawerOpen);
  const toggle = useUIStore(s => s.toggleChatDrawer);

  return (
    <Drawer open={open} onOpenChange={toggle}>
      <DrawerContent className="h-[100vh]">
        <DrawerHeader>
          <DrawerTitle>{t('chat')}</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 h-full">
          <ChatPanel />
        </div>
      </DrawerContent>
    </Drawer>
  );
};