import React from 'react';
import { Link } from 'react-router-dom';

const WorkspaceDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg">
          CollabSpace
        </div>
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Workspaces</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/board" className="block px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
                Engineering Team
              </Link>
            </li>
            <li>
              <Link to="/chat" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                Design Team Chat
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800">Workspace Overview</h1>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome back to CollabSpace!</h2>
            <p className="text-gray-600">Select a workspace from the sidebar to view your tasks, chat, and files.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkspaceDashboard;
