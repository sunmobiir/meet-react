import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileManager } from '@/components/FileManager';
import { useTranslation } from 'react-i18next';
import { FolderOpen } from 'lucide-react';

export const FileManagerModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderOpen className="h-4 w-4 mr-2" />
          {t('files')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('fileManager')}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(80vh-120px)]">
          <FileManager />
        </div>
      </DialogContent>
    </Dialog>
  );
};