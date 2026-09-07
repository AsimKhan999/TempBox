import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MailboxProvider } from './context/MailboxContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Saved } from './pages/Saved';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MailboxProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
          <Footer />
        </MailboxProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
