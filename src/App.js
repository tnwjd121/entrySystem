import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import Main from './pages/Main';
import PhoneVerification from './pages/PhoneVerification';
import Ceritification from './pages/Ceritification';
import Entry from './pages/Entry';

function App() {
  return (
    <Routes>
      <Route path='/ibk/entry/main' element={<Main/>}/>
      <Route path='/ibk/entry/phoneVerification' element={<PhoneVerification/>}/>
      <Route path='/ibk/entry/certification' element={<Ceritification/>}/>
      <Route path='/ibk/entry/entry' element={<Entry/>}/>
    </Routes>
  );
}

export default App;
