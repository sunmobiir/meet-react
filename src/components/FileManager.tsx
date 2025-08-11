import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { FileText, Image as ImageIcon, FileBarChart2, File } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconFor = (type: string) => {
  switch(type){
    case 'pdf': return FileText;
    case 'ppt': return FileBarChart2;
    case 'image': return ImageIcon;
    default: return File;
  }
};

export const FileManager = () => {
  const { t } = useTranslation();
  const files = useAppStore(s => s.files);
  const addFile = useAppStore(s => s.addFile);
  const deleteFile = useAppStore(s => s.deleteFile);
  const currentUserId = useAppStore(s => s.ui.currentUserId);
  const users = useAppStore(s => s.users);
  const currentUser = users.find(u => u.id === currentUserId);
  const canFile = !!currentUser?.permissions?.file;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{t('files')}</h3>
        <Button onClick={() => canFile && addFile(`Mock-${Math.floor(Math.random()*1000)}.pdf`, 'pdf')} disabled={!canFile}>{t('addFile')}</Button>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('noFiles')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map(f => {
            const Icon = iconFor(f.type);
            return (
              <Card key={f.id} className="hover-scale">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="h-4 w-4"/> {f.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{f.sizeKb} KB</span>
                  <Button size="sm" variant="outline" disabled={!canFile} onClick={() => canFile && deleteFile(f.id)}>{t('delete')}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
