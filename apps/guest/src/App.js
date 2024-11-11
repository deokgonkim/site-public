import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { basePath } from "./config";
import HomePage from "./pages/home";
import "./App.css";
import BlankLayout from "./layout/blank";
import FinalPage from "./pages/final";

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<Navigate replace to="/home" />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/:shopUid" element={<HomePage />} />
          <Route path="/:shopUid/final" element={<FinalPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
