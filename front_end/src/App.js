import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppUser from './AppUser';
import AppAdmin from './AppAdmin';

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AppAdmin />} />
      <Route path="/*" element={<AppUser />} />
    </Routes>
  );
}

export default App;
