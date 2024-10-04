import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './register';
import Login from './login';
import PhotographerList from './Home';
import Header from './Header'; 
// import PhotographerForm from './PhotographerForm';
import PhotographerDetails from './PhotographerDetail';
import MyBookings from './MyBookings';
import PhotographerLogin from './PhotoLog';
import PhotographerRegister from './PhotoRegg';
import PhotographerDashboard from './PhotographerDashboard';
import EditProfile from './EditProfile';
import ManageBookings from './ManageBookings';
const App = () => {
  return (
    <Router>
      <div className="App">
        <Header /> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/photographer-login" element={<PhotographerLogin/>} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PhotographerList />} />
          <Route path="/photographer/:id" element={<PhotographerDetails />}  style={{ paddingTop: '600px' }}/>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/photographer-register" element={< PhotographerRegister/>} />
          <Route path="/photographer-dashboard" element={< PhotographerDashboard/>} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
          <Route path="/manage-bookings" element={<ManageBookings />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;