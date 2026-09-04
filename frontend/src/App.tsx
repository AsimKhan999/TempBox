import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MailboxProvider } from './context/MailboxContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <MailboxProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </MailboxProvider>
    </BrowserRouter>
  );
}
