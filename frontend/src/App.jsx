import { Routes, Route,Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Register from "./pages/Register.jsx";
// Feature set 2
import HostedListings from './pages/HostedListings.jsx';
import CreateListing from './pages/CreateListing.jsx';
import EditListing from './pages/EditListing.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Feature set 2 routes */}
      <Route path="/host/listings" element={<HostedListings />} />
      <Route path="/host/listings/new" element={<CreateListing />} />
      <Route path="/host/listings/:id/edit" element={<EditListing />} />
    </Routes>
  );
}

export default App
