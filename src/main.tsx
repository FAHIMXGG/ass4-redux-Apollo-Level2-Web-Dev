import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="library-ui-theme">
      <Provider store={store}>
        {/* React Router */}
        <Router>
          <App />
          {/* Toast Notifications container */}
          <Toaster position="bottom-right" reverseOrder={false} />
        </Router>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
