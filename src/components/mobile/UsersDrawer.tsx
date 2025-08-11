import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useUIStore } from '@/store/useUIStore';
import { ParticipantList } from '@/components/ParticipantList';
import { useTranslation } from 'react-i18next';

export const UsersDrawer = () => {
  const { t } = useTranslation();
  const open = useUIStore(s => s.isUsersDrawerOpen);
  const toggle = useUIStore(s => s.toggleUsersDrawer);

  return (
    <Drawer open={open} onOpenChange={toggle}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>{t('participants')}</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 h-full">
          <ParticipantList />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
