import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/login/login';
import Create from './pages/create-new-scenario/create-new';
import Confirmation from './pages/confirmation/confirmation';
import Download from './pages/download/download';
import Dashboard from './pages/dashboard/dashboard'
import Scenario from './pages/scenario1/scenario1';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/about" element={<About />} />
          <Route path="/create" element={<Create />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/download" element={<Download />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scenario" element={<Scenario />} />




        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
