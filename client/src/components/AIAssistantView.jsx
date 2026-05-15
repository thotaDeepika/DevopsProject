import React, { useState } from 'react';
import { Sparkles, MessageSquare, FileText, Bot, Loader2, ListTodo, Copy, Check } from 'lucide-react';
import API from '../services/api';

const AIAssistantView = ({ workspaceId }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState('digest'); // digest, chat, task
  const [copied, setCopied] = useState(false);

  const handleAction = async (endpoint, payload = {}) => {
    if (!workspaceId) return;
    
    try {
      setLoading(true);
      setResult(null);
      const res = await API.post(`/ai/${endpoint}`, { workspaceId, ...payload });
      
      if (endpoint === 'summarize-chat') setResult(res.data.summary);
      if (endpoint === 'daily-digest') setResult(res.data.digest);
      if (endpoint === 'generate-task-description') setResult(res.data.description);
    } catch (error) {
      console.error("AI Error:", error);
      setResult("Sorry, I encountered an error generating that response. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setLoading(false);
      setCopied(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-10 bg-[#F8F9FB] rounded-[40px] m-6 border border-gray-100 overflow-hidden">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">AI Workspace Assistant</h2>
          <p className="text-sm text-gray-500 font-medium">Powered by Google Gemini 1.5</p>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Action Sidebar */}
        <div className="w-72 flex flex-col gap-4 shrink-0">
          <button 
            onClick={() => { setActiveTab('digest'); handleAction('daily-digest'); }}
            className={`p-4 rounded-3xl border text-left transition-all flex items-start gap-3 ${activeTab === 'digest' ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'digest' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
              <FileText size={20} />
            </div>
            <div>
              <p className={`text-sm font-bold ${activeTab === 'digest' ? 'text-indigo-900' : 'text-gray-700'}`}>Daily Digest</p>
              <p className="text-[11px] text-gray-500 mt-1">Get a summary of what happened today.</p>
            </div>
          </button>

          <button 
            onClick={() => { setActiveTab('chat'); handleAction('summarize-chat'); }}
            className={`p-4 rounded-3xl border text-left transition-all flex items-start gap-3 ${activeTab === 'chat' ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-white border-gray-100 hover:border-purple-100'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'chat' ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-400'}`}>
              <MessageSquare size={20} />
            </div>
            <div>
              <p className={`text-sm font-bold ${activeTab === 'chat' ? 'text-purple-900' : 'text-gray-700'}`}>Summarize Chat</p>
              <p className="text-[11px] text-gray-500 mt-1">Catch up on the latest conversations.</p>
            </div>
          </button>

          <div className={`p-4 rounded-3xl border transition-all ${activeTab === 'task' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-100'}`}>
            <div className="flex items-start gap-3 mb-4 cursor-pointer" onClick={() => setActiveTab('task')}>
              <div className={`p-2 rounded-xl ${activeTab === 'task' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                <ListTodo size={20} />
              </div>
              <div>
                <p className={`text-sm font-bold ${activeTab === 'task' ? 'text-blue-900' : 'text-gray-700'}`}>Task Generator</p>
                <p className="text-[11px] text-gray-500 mt-1">Write descriptions instantly.</p>
              </div>
            </div>
            {activeTab === 'task' && (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Fix login page styling"
                  className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-300"
                />
                <button 
                  disabled={!taskTitle.trim() || loading}
                  onClick={() => handleAction('generate-task-description', { title: taskTitle })}
                  className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Generate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-indigo-500">
              <Loader2 className="animate-spin w-10 h-10 mb-4" />
              <p className="text-sm font-bold animate-pulse">Gemini is thinking...</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Bot size={20} />
                  <span className="font-bold text-sm">AI Response</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg flex items-center gap-2"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-4">
                <Bot size={40} />
              </div>
              <p className="text-gray-500 font-medium max-w-xs">Select an action on the left to ask the AI assistant for help.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
