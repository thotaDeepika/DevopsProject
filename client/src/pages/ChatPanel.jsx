import React from 'react';
import { Link } from 'react-router-dom';

const ChatPanel = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col bg-white">
        <header className="h-16 border-b flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <Link to="/workspace" className="text-gray-500 hover:text-gray-700">← Back</Link>
            <h1 className="text-xl font-semibold text-gray-800"># general-chat</h1>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 mr-4">JD</div>
              <div>
                <div className="flex items-baseline">
                  <span className="font-semibold text-gray-900 mr-2">John Doe</span>
                  <span className="text-xs text-gray-500">10:45 AM</span>
                </div>
                <p className="text-gray-800 mt-1">Hey team, I've just updated the task board. Could everyone review their assigned tasks?</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600 mr-4">AS</div>
              <div>
                <div className="flex items-baseline">
                  <span className="font-semibold text-gray-900 mr-2">Alice Smith</span>
                  <span className="text-xs text-gray-500">10:48 AM</span>
                </div>
                <p className="text-gray-800 mt-1">Looks good to me. I'll start on the frontend UI now.</p>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="p-4 bg-white border-t">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input 
              type="text" 
              placeholder="Message #general-chat..." 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800"
            />
            <button className="ml-2 text-blue-600 font-medium hover:text-blue-800">Send</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPanel;
