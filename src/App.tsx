import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BookList />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
