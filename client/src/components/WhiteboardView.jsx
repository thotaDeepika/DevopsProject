import React, { useState, Component } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Excalidraw Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 p-4">Something went wrong: {this.state.error.message}</div>;
    }
    return this.props.children; 
  }
}

const WhiteboardView = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
      <ErrorBoundary>
        <Excalidraw
          theme="dark"
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
        >
          <MainMenu>
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
      </ErrorBoundary>
    </div>
  );
};

export default WhiteboardView;
