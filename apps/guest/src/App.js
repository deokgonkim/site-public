import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { basePath } from "./config";
import HomePage from "./pages/home";
import "./App.css";
import BlankLayout from "./layout/blank";
import FinalPage from "./pages/final";
import FirstPage from "./pages/first";
import en from "./resources/messages.en.json";
import ko from "./resources/messages.ko.json";

function App() {
  const locale = navigator.language || navigator.userLanguage;
  const messages = locale.startsWith("ko") ? ko : en;
  console.log("locale", locale);
  return (
    <BrowserRouter basename={basePath}>
      <IntlProvider locale={locale} messages={messages}>
        <Routes>
          <Route element={<BlankLayout />}>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/:shopUid" element={<FirstPage />} />
            <Route path="/:shopUid/final" element={<FinalPage />} />
          </Route>
        </Routes>
      </IntlProvider>
    </BrowserRouter>
  );
}

export default App;
