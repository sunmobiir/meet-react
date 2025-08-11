import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useParticipantStore } from '@/store/useParticipantStore';
import { Participant } from '@/model/model_pb';
import { useTranslation } from 'react-i18next';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Grid3X3,
  User as UserIcon,
  Presentation,
  Volume2,
  VolumeX
} from 'lucide-react';

export const VideoConference = () => {
  const { t } = useTranslation();
  const users = useParticipantStore(s => s.participants);
  const videoConference = useAppStore(s => s.videoConference);
  const toggleVideo = useAppStore(s => s.toggleVideo);
  const toggleAudio = useAppStore(s => s.toggleAudio);
  const toggleScreenShare = useAppStore(s => s.toggleScreenShare);
  const setVideoLayout = useAppStore(s => s.setVideoLayout);
  const currentUserId = useAppStore(s => s.ui.currentUserId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const currentUser = users.find(u => u.id === currentUserId);
  const otherUsers = users.filter(u => u.id !== currentUserId );
  const speakerUser = users.find(u => u.id === videoConference.currentSpeaker);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    });

    resizeObserver.observe(container);

    // Set initial dimensions
    const rect = container.getBoundingClientRect();
    setDimensions({ width: Math.round(rect.width), height: Math.round(rect.height) });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const renderVideoFeed = (user: Participant, isMain = false) => {
    const isMuted = user.id === currentUserId ? !videoConference.isAudioEnabled : false;
    const hasVideo = user.id === currentUserId ? videoConference.isVideoEnabled : true;
    
    return (
      <Card key={user.id} className={`relative overflow-hidden ${isMain ? 'h-full' : 'aspect-video'}`}>
        <CardContent className="p-0 h-full bg-gray-900 flex items-center justify-center">
          {hasVideo ? (
            <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{user.name}'s Video</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <UserIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">{user.name}</p>
              </div>
            </div>
          )}
          
          {/* User info overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <span>{user.name}</span>
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </div>
          
          {/* Hand raised indicator */}
          {user.raiseHand && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              ✋ {t('raiseHand')}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderScreenShare = () => {
    if (!videoConference.isScreenSharing) return null;
    
    return (
      <Card className="h-full">
        <CardContent className="p-0 h-full bg-gray-900 flex items-center justify-center">
          <div className="w-full h-full bg-linear-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center">
              <Monitor className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">{currentUser?.name}'s Screen</p>
              <p className="text-sm opacity-75">Screen sharing active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      {/* Resize Dimensions Display */}
      <div className="absolute top-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
        {dimensions.width} x {dimensions.height}
      </div>

      {/* Video Conference Header */}
      <div className="flex items-center justify-between p-3 border-b">
        {/* <h2 className="text-lg font-semibold">{t('videoConference')}</h2> */}
        
        {/* Layout Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={videoConference.layout === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVideoLayout('grid')}
            aria-label={t('gridView')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={videoConference.layout === 'speaker' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVideoLayout('speaker')}
            aria-label={t('speakerView')}
          >
            <UserIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={videoConference.layout === 'presentation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVideoLayout('presentation')}
            aria-label={t('presentationView')}
          >
            <Presentation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-3">
        {videoConference.layout === 'grid' && (
          <div></div>
/*           <div className="h-full grid grid-cols-2 lg:grid-cols-3 gap-3">
            {currentUser && renderVideoFeed(currentUser)}
            {otherUsers.map(user => renderVideoFeed(user))}
          </div> */
        )}

        {videoConference.layout === 'speaker' && (
          <div className="h-full flex gap-3">
            <div className="flex-1">
              {speakerUser ? renderVideoFeed(speakerUser, true) : (
                <Card className="h-full">
                  <CardContent className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <UserIcon className="h-16 w-16 mx-auto mb-4" />
                      <p>No active speaker</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="w-48 space-y-2 overflow-y-auto">
              {[currentUser, ...otherUsers].filter(Boolean).map(user => 
                user?.id !== videoConference.currentSpeaker ? renderVideoFeed(user) : null
              )}
            </div>
          </div>
        )}

        {videoConference.layout === 'presentation' && (
          <div className="h-full flex gap-3">
            <div className="flex-1">
              {videoConference.isScreenSharing ? renderScreenShare() : (
                <Card className="h-full">
                  <CardContent className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <Presentation className="h-16 w-16 mx-auto mb-4" />
                      <p>No presentation active</p>
                      <p className="text-sm">Start screen sharing to begin presentation</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="w-48 space-y-2 overflow-y-auto">
              {[currentUser, ...otherUsers].filter(Boolean).map(user => renderVideoFeed(user))}
            </div>
          </div>
        )}
      </div>

      {/* Video Controls Toolbar */}
      <div className="border-t p-3">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={videoConference.isVideoEnabled ? 'default' : 'destructive'}
            size="sm"
            onClick={toggleVideo}
            aria-label={videoConference.isVideoEnabled ? t('stopVideo') : t('startVideo')}
          >
            {videoConference.isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={videoConference.isAudioEnabled ? 'default' : 'destructive'}
            size="sm"
            onClick={toggleAudio}
            aria-label={videoConference.isAudioEnabled ? t('mute') : t('unmute')}
          >
            {videoConference.isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={videoConference.isScreenSharing ? 'default' : 'outline'}
            size="sm"
            onClick={toggleScreenShare}
            aria-label={videoConference.isScreenSharing ? t('stopScreenShare') : t('startScreenShare')}
          >
            {videoConference.isScreenSharing ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};