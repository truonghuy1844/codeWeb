import { Routes, Route } from 'react-router-dom';
import AppAdmin from './AppAdmin';
import AppUser from './AppUser';

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AppAdmin />} />
      <Route path="/*" element={<AppUser />} />
    </Routes>
  );
}
export default App; 