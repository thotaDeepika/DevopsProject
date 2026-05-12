import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Keeping old routes as backups for now */}
        <Route path="/workspace" element={<Dashboard />} />
        <Route path="/board" element={<Dashboard />} />
        <Route path="/chat" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
