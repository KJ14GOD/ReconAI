// src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import App from "./App"
import Login from "./pages/Login"
import SignupPage from "./pages/SignUp"
import "./index.css"
import { ThemeProvider } from "next-themes"
import LinkAccountPage from "./pages/LinkAccount"
import TransactionList from "./pages/transactions"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="class" storageKey="reconai-theme">
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<App />} />
          <Route path="*" element={<Login />} /> {/* default route */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/link-account" element={<LinkAccountPage />} />
          <Route path="/transactions" element={<TransactionList />} />
        </Routes> 
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)
