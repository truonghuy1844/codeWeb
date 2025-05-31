import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppUser from './AppUser';
import AppAdmin from './AppAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AppAdmin />} />
        <Route path="/*" element={<AppUser />} />
      </Routes>
    </Router>
  );
}

export default App;
