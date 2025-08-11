import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { QuizPanel } from '@/components/QuizPanel';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';

export const QuizDrawer = () => {
  const { t } = useTranslation();
  const isQuizDrawerOpen = useAppStore(s => s.ui.isQuizDrawerOpen);
  const toggleQuizDrawer = useAppStore(s => s.toggleQuizDrawer);
  const lang = useAppStore(s => s.ui.lang);
  const isRTL = lang === 'ar' || lang === 'fa';

  return (
    <Sheet open={isQuizDrawerOpen} onOpenChange={toggleQuizDrawer}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t('quiz')}>
          <HelpCircle className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-[400px] sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <HelpCircle className="h-5 w-5" />
            {t('quiz')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-[calc(100vh-120px)] overflow-y-auto">
          <QuizPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
};