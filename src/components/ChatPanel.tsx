import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Lock
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { Chat } from '@/store/useChatStore';

interface ChatMessageProps {
  message: Chat;
  isCurrentUser: boolean;
  onReply: (messageId: string, messageText: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  onReply,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`flex gap-3 p-3 hover:bg-muted/50 ${isCurrentUser ? 'bg-primary/5' : ''}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="text-xs">
          {getInitials(message.userName)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.userName}</span>
          {message.isPrivate && (
            <Lock className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {formatTime(message.insertTime)}
          </span>
        </div>
        
        {message.isReply && (
          <div className="mb-2 p-2 bg-muted/30 rounded border-l-2 border-primary">
            <div className="text-xs text-muted-foreground mb-1">
              {t('replyingTo')}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {message.replyText}
            </div>
          </div>
        )}
        
        <div className="text-sm break-words">
          {message.text}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onReply(message.ID, message.text)}>
            <Reply className="h-4 w-4 mr-2" />
            {t('reply')}
          </DropdownMenuItem>
          {isCurrentUser && (
            <>
              <DropdownMenuItem onClick={() => onEdit(message.ID)}>
                <Edit3 className="h-4 w-4 mr-2" />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(message.ID)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const ChatPanel: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  
  const {
    messages,
    currentUserId,
    addMessage,
    replyToMessage,
    editMessage,
    deleteMessage,
    getPublicMessages,
    initializeMockData,
  } = useChatStore();


  // Initialize mock data on mount
  useEffect(() => {
    if (messages.length === 0) {
      initializeMockData();
    }
  }, [messages.length, initializeMockData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const publicMessages = getPublicMessages();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (editingMessageId) {
      editMessage(editingMessageId, message);
      setEditingMessageId(null);
    } else if (replyingTo) {
      replyToMessage(replyingTo.id, replyingTo.text, message);
      setReplyingTo(null);
    } else {
      addMessage(message);
    }
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReply = (messageId: string, messageText: string) => {
    setReplyingTo({ id: messageId, text: messageText });
    setEditingMessageId(null);
  };

  const handleEdit = (messageId: string) => {
    const messageToEdit = messages.find(m => m.ID === messageId);
    if (messageToEdit) {
      setMessage(messageToEdit.text);
      setEditingMessageId(messageId);
      setReplyingTo(null);
    }
  };

  const handleDelete = (messageId: string) => {
    deleteMessage(messageId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b">
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium">{t('chat')}</span>
        <Badge variant="secondary" className="ml-auto">
          {publicMessages.length}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="divide-y">
          {publicMessages.map((msg) => (
            <div key={msg.ID} className="group">
              <ChatMessageComponent
                message={msg}
                isCurrentUser={msg.userId === currentUserId}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t">
        {replyingTo && (
          <div className="mb-2 p-2 bg-muted/30 rounded border-l-2 border-primary flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">
                {t('replyingTo')}
              </div>
              <div className="text-sm truncate">
                {replyingTo.text}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelReply}>
              ×
            </Button>
          </div>
        )}
        
        {editingMessageId && (
          <div className="mb-2 p-2 bg-muted/30 rounded border-l-2 border-orange-500 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {t('editing')}
            </div>
            <Button variant="ghost" size="sm" onClick={cancelEdit}>
              ×
            </Button>
          </div>
        )}

        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              editingMessageId
                ? t('editMessage')
                : replyingTo
                ? t('replyMessage')
                : t('typeMessage')
            }
            className="pr-12"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            variant="ghost"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};