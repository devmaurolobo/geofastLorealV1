import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Preview, PreviewState } from '@creatomate/preview';
import { useWindowWidth } from '../utility/useWindowWidth';
import { SimpleSettingsPanel } from './SettingsPanel';

const App: React.FC = () => {
  // React Hook to update the component when the window width changes
  const windowWidth = useWindowWidth();

  // Video aspect ratio that can be calculated once the video is loaded
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>();

  // Reference to the preview
  const previewRef = useRef<Preview>();

  // Current state of the preview
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentState, setCurrentState] = useState<PreviewState>();

  // This sets up the video player in the provided HTML DIV element
  const setUpPreview = (htmlElement: HTMLDivElement) => {
    if (previewRef.current) {
      previewRef.current.dispose();
      previewRef.current = undefined;
    };

    // Once the SDK is ready, load a template from our project    const preview = new Preview(htmlElement, 'player', process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!);
    const preview = new Preview(htmlElement, 'player', process.env.NEXT_PUBLIC_CREATOMATE_PUBLIC_TOKEN!);


    preview.onReady = async () => {
      await preview.loadTemplate(process.env.NEXT_PUBLIC_TEMPLATE_ID!);
      setIsReady(true);
    };

    preview.onLoad = () => {
      setIsLoading(true);
    };

    preview.onLoadComplete = () => {
      setIsLoading(false);
    };

    // Listen for state changes of the preview
    preview.onStateChange = (state) => {
      setCurrentState(state);
      setVideoAspectRatio(state.width / state.height);
    };

    previewRef.current = preview;
  };

  return (
    <Component>
      <Wrapper>
        <Container
          ref={(htmlElement) => {
            if (htmlElement && htmlElement !== previewRef.current?.element) {
              setUpPreview(htmlElement);
            }
          }}
          style={{
            height:
              videoAspectRatio && windowWidth && windowWidth <1500? window.innerWidth / videoAspectRatio : undefined,
          }}
        />
      </Wrapper>

      <Panel>
        {isReady && (
          <PanelContent id="panel">
            <SimpleSettingsPanel preview={previewRef.current!} currentState={currentState} />
          </PanelContent>
        )}
      </Panel>

      {isLoading && <LoadIndicator>Loading...</LoadIndicator>}
    </Component>
  );
};

export default App;

const Component = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  

  @media (min-width: 768px) {
    flex-direction: row;
    
  }
`;

const Wrapper = styled.div`
  display: flex;

  @media (min-width: 768px) {
    flex: 1;
    padding: 20px;
    
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  max-height: 700px;
  margin: auto;
`;

const Panel = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  background: rgb(238, 238, 238);
  box-shadow: rgba(190, 48, 48, 0.1) 0 6px 15px 0;

  @media (min-width: 768px) {
    flex: initial;
    margin: 50px;
    width: 1000px;
    border-radius: 15px;
  }
`;

const PanelContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 20px;
`;

const LoadIndicator = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 15px;
  background: #ffff;
  box-shadow: rgba(0, 0, 0, 0.1) 0 6px 15px 0;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 600;

  @media (min-width: 620px) {
    top: 50px;
    left: calc((100% - 400px) / 2);
  }
`;
