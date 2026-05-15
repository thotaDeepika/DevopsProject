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
    <div className="flex-1 min-w-0 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
      <div className="p-8 border-b border-gray-50 shrink-0">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Team Whiteboard</h2>
        <p className="text-gray-500 font-medium">Collaborative brainstorming canvas</p>
      </div>
      
      <div className="flex-1 w-full relative">
        <ErrorBoundary>
          <Excalidraw
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
    </div>
  );
};

export default WhiteboardView;
