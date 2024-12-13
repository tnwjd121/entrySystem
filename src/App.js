import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import Main from './pages/Main';
import PhoneVerification from './pages/PhoneVerification';

function App() {
  return (
    <Routes>
      <Route path='/ibk/entry/main' element={<Main/>}/>
      <Route path='/ibk/entry/phoneVerification' element={<PhoneVerification/>}/>
    </Routes>
  );
}

export default App;
