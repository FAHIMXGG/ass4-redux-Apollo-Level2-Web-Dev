import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CreateBook from "./pages/CreateBook";
import BorrowSummary from "./pages/BorrowBook";
import EditBook from "./pages/EditBook";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/create-book" element={<CreateBook />} />
          <Route path="/borrow-summary" element={<BorrowSummary />} />
          <Route path="/edit-book/:id" element={<EditBook/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
