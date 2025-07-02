import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CreateBook from "./pages/CreateBook";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/create-book" element={<CreateBook />} />
          <Route path="/borrow-summary" element={<div className="text-center py-8"><h1 className="text-2xl font-bold">Borrow Summary</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
