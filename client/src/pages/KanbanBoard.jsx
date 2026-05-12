import React from 'react';
import { Link } from 'react-router-dom';

const KanbanBoard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="h-16 bg-white border-b flex items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <Link to="/workspace" className="text-gray-500 hover:text-gray-700">← Back</Link>
          <h1 className="text-xl font-semibold text-gray-800">Sprint Board</h1>
        </div>
        <Link to="/chat" className="text-blue-600 hover:text-blue-800 font-medium">Open Chat</Link>
      </header>
      <main className="flex-1 overflow-x-auto p-8">
        <div className="flex space-x-6 min-w-max h-full">
          {/* To Do Column */}
          <div className="w-80 bg-gray-100 rounded-lg flex flex-col max-h-full">
            <div className="p-3 font-semibold text-gray-700 border-b">To Do</div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-900">Implement Auth API</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-red-500 font-medium">High</span>
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">JD</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* In Progress Column */}
          <div className="w-80 bg-gray-100 rounded-lg flex flex-col max-h-full">
            <div className="p-3 font-semibold text-gray-700 border-b">In Progress</div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-900">Design Kanban UI</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-yellow-500 font-medium">Medium</span>
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">AS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Done Column */}
          <div className="w-80 bg-gray-100 rounded-lg flex flex-col max-h-full">
            <div className="p-3 font-semibold text-gray-700 border-b">Done</div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              <div className="bg-white p-4 rounded shadow-sm border border-gray-200 opacity-75">
                <p className="text-sm font-medium text-gray-900 line-through">Setup Docker</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KanbanBoard;
