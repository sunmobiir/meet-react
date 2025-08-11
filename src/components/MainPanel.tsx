import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MainPanelTop } from '@/components/MainPanelTop';
import { MainPanelCenter } from '@/components/MainPanelCenter';
import { MainPanelBottom } from '@/components/MainPanelBottom';
import { useUIStore } from '@/store/useUIStore';

export const MainPanel = () => {
  const isMainPanelVisible = useUIStore(s => s.isMainPanelVisible);
  const isMainPanelTopVisible = useUIStore(s => s.isMainPanelTopVisible);
  const isMainPanelCenterVisible = useUIStore(s => s.isMainPanelCenterVisible);
  const isMainPanelBottomVisible = useUIStore(s => s.isMainPanelBottomVisible);

  // If main panel is not visible, return null
  if (!isMainPanelVisible) {
    return null;
  }

  // Calculate panel sizes based on visible panels
  const visiblePanels = [
    isMainPanelTopVisible,
    isMainPanelCenterVisible,
    isMainPanelBottomVisible
  ].filter(Boolean).length;

  const panelSize = visiblePanels > 0 ? Math.floor(100 / visiblePanels) : 33;

  // If no panels are visible, show a placeholder
  if (visiblePanels === 0) {
    return (
      <div className="h-full border-l flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Main Panel</h3>
          <p className="text-sm">All sub-panels are hidden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-l">
      <PanelGroup direction="vertical">
        {isMainPanelTopVisible && (
          <>
            <Panel defaultSize={panelSize} minSize={15}>
              <MainPanelTop />
            </Panel>
            {(isMainPanelCenterVisible || isMainPanelBottomVisible) && (
              <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />
            )}
          </>
        )}
        {isMainPanelCenterVisible && (
          <>
            <Panel defaultSize={panelSize} minSize={15}>
              <MainPanelCenter />
            </Panel>
            {isMainPanelBottomVisible && (
              <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />
            )}
          </>
        )}
        {isMainPanelBottomVisible && (
          <Panel defaultSize={panelSize} minSize={15}>
            <MainPanelBottom />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
};