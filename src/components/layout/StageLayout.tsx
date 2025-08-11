import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LeftPanelTop } from '@/components/LeftPanelTop';
import { LeftPanelCenter } from '@/components/LeftPanelCenter';
import { LeftPanelBottom } from '@/components/LeftPanelBottom';
import { CenterPanel } from '@/components/CenterPanel';
import { MainPanel } from '@/components/MainPanel';
import { useUIStore } from '@/store/useUIStore';
import { useTranslation } from 'react-i18next';

export const StageLayout = () => {
  const { t } = useTranslation();
  const isMainPanelVisible = useUIStore(s => s.isMainPanelVisible);
  const isLeftPanelVisible = useUIStore(s => s.isLeftPanelVisible);
  const isLeftPanelTopVisible = useUIStore(s => s.isLeftPanelTopVisible);
  const isLeftPanelCenterVisible = useUIStore(s => s.isLeftPanelCenterVisible);
  const isLeftPanelBottomVisible = useUIStore(s => s.isLeftPanelBottomVisible);
  const isCenterPanelVisible = useUIStore(s => s.isCenterPanelVisible);

  // Check if any left panel sub-panels are visible
  const hasVisibleLeftPanels = isLeftPanelTopVisible || isLeftPanelCenterVisible || isLeftPanelBottomVisible;
  const showLeftPanel = isLeftPanelVisible && hasVisibleLeftPanels;

  // Calculate panel sizes based on visible panels
  const visibleLeftPanels = [
    isLeftPanelTopVisible,
    isLeftPanelCenterVisible,
    isLeftPanelBottomVisible
  ].filter(Boolean).length;

  const leftPanelSize = visibleLeftPanels > 0 ? Math.floor(100 / visibleLeftPanels) : 33;

  return (
    <div className="flex w-full h-[calc(100vh-56px)]">
      <div className="hidden sm:flex w-full">
        <PanelGroup direction="horizontal" className="w-full">
          {showLeftPanel && (
            <>
              <Panel defaultSize={17} minSize={7}>
                <PanelGroup direction="vertical">
                  {isLeftPanelTopVisible && (
                    <>
                      <Panel defaultSize={leftPanelSize} minSize={15}>
                        <LeftPanelTop />
                      </Panel>
                      {(isLeftPanelCenterVisible || isLeftPanelBottomVisible) && (
                        <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />
                      )}
                    </>
                  )}
                  {isLeftPanelCenterVisible && (
                    <>
                      <Panel defaultSize={leftPanelSize} minSize={15}>
                        <LeftPanelCenter />
                      </Panel>
                      {isLeftPanelBottomVisible && (
                        <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />
                      )}
                    </>
                  )}
                  {isLeftPanelBottomVisible && (
                    <Panel defaultSize={leftPanelSize} minSize={15}>
                      <LeftPanelBottom />
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
            </>
          )}
          {isCenterPanelVisible && (
            <>
              <Panel defaultSize={showLeftPanel ? 18 : 35} minSize={7}>
                <CenterPanel />
              </Panel>
              <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
            </>
          )}
          {isMainPanelVisible && (
            <>
              <Panel defaultSize={60} minSize={40}>
                <MainPanel />
              </Panel>
            </>
          )}
          
        </PanelGroup>
      </div>
      <div className="sm:hidden w-full">
        <div className="h-[calc(100vh-56px)] flex">
          {isCenterPanelVisible && (
            <div className="flex-1">
              <CenterPanel />
            </div>
          )}
          <div className="w-64">
            <MainPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
