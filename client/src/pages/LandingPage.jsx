import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Zap, Shield, Rocket, ArrowRight, LayoutGrid, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">CS</div>
          <span className="font-bold text-xl tracking-tight">CollabSpace</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          Open App
        </button>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-300">CollabSpace v2.0 is live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          The Workspace That <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Works For You
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Experience a unified platform designed for modern DevOps teams. Seamlessly manage tasks, collaborate in real-time, and accelerate your workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative px-8 py-4 bg-blue-600 rounded-full text-white font-bold text-lg hover:bg-blue-500 transition-all flex items-center shadow-[0_0_40px_rgba(37,99,235,0.4)]"
          >
            <span>Start New Workspace</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl perspective-1000">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-2xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
            <img src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop" alt="Dashboard Preview" className="rounded-xl opacity-80" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-black/50 py-32 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need to Ship Faster</h2>
            <p className="text-gray-400 text-lg">A unified suite of tools designed to remove friction and keep your team in the flow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Zap className="text-yellow-400" size={32} />}
              title="Collaborate in Real-Time"
              desc="See updates as they happen. Whether you're moving tasks or brainstorming, everyone stays perfectly in sync without ever hitting refresh."
            />
            <FeatureCard 
              icon={<LayoutGrid className="text-blue-400" size={32} />}
              title="Visual Task Management"
              desc="Organize workflows intuitively with fluid drag-and-drop boards. From idea to launch, know exactly where every project stands."
            />
            <FeatureCard 
              icon={<MessageSquare className="text-green-400" size={32} />}
              title="Contextual Communication"
              desc="Keep conversations right next to your work. Eliminate app-switching fatigue and maintain your focus with built-in instant messaging."
            />
            <FeatureCard 
              icon={<Layers className="text-pink-400" size={32} />}
              title="Infinite Whiteboarding"
              desc="Sketch ideas, map system architectures, and brainstorm together on a limitless digital canvas built directly into your workspace."
            />
            <FeatureCard 
              icon={<Rocket className="text-orange-400" size={32} />}
              title="AI-Powered Assistant"
              desc="Overcome roadblocks instantly. Our integrated AI helps you draft plans, analyze data, and keep your momentum going at all times."
            />
            <FeatureCard 
              icon={<Shield className="text-purple-400" size={32} />}
              title="Enterprise-Grade Security"
              desc="Rest easy knowing your intellectual property is safe. We use industry-leading encryption and isolated environments to protect your data."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500 text-sm relative z-10">
        <p>© 2026 CollabSpace Project. Built for high-performance DevOps teams.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;
