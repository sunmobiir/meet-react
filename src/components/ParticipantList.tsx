import { useParticipantStore } from '@/store/useParticipantStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users as UsersIcon, Hand, ShieldCheck, MoreHorizontal, Mic, Camera, File, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Permission } from '@/model/model_pb';

let addMock=false;

export const ParticipantList = () => {
  const { t } = useTranslation();
  const participants = useParticipantStore(s => s.participants);
  const currentParticipant = useParticipantStore(s => s.currentParticipant);
  const toggleRaiseHand = useParticipantStore(s => s.toggleRaiseHand);
  const updatePermission = useParticipantStore(s => s.updatePermission);
    const h= useParticipantStore();
  if(!addMock){
  addMock=true;
  h.initializeMockData()
  console.log(participants)
  }

  
  const isHost = currentParticipant?.role === 1;
  
  // Sort participants with raised hands first
  const sorted = [...participants].sort((a, b) => Number(b.raiseHand) - Number(a.raiseHand));
  
  const handlePermissionChange = (participantId: string, permissionType: keyof Permission, value: boolean) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant?.permission) {
      const updatedPermission = new Permission({
        ...participant.permission,
        [permissionType]: value
      });
      updatePermission(participantId, updatedPermission);
    }
  };
  
  return (
    <aside className="h-full flex flex-col">
      <div className="px-3 py-2 text-sm font-medium flex items-center gap-2">
        <UsersIcon className="h-4 w-4"/> {t('participants')}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sorted.map(participant => (
          <div key={participant.id} className="flex items-center justify-between rounded-md" style={{marginBottom:'15px'}}>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${!participant.isHidden ? 'bg-primary' : 'bg-muted'}`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    {participant.name}
                    {participant.id === currentParticipant?.id ? ` (${t('you')})` : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mic className={`h-3 w-3 ${participant.permission?.audio ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <Camera className={`h-3 w-3 ${participant.permission?.video ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <File className={`h-3 w-3 ${participant.permission?.file ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {participant.raiseHand && <Badge variant="secondary"><Hand className="h-3 w-3 mr-1"/>Up</Badge>}
              {participant.id === currentParticipant?.id && (
                <Button size="sm" variant="ghost" onClick={() => toggleRaiseHand(participant.id)} aria-label={participant.raiseHand ? t('lowerHand') : t('raiseHand')}>
                  <Hand className="h-4 w-4" />
                </Button>
              )}
              {isHost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label={t('permissions')}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="text-xs text-muted-foreground">
                      {participant.role === 1 ? t('host') : t('participant')}
                    </div>
                    <DropdownMenuLabel>{t('permissions')}</DropdownMenuLabel>
                    <div className="p-2 space-y-2">
                      {(['audio', 'video', 'file', 'chat'] as const).map((key) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{key}</span>
                          <Switch
                            checked={participant.permission?.[key] ?? false}
                            onCheckedChange={(value) => handlePermissionChange(participant.id, key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};