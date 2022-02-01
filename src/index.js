import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import "swiper/css";
import "swiper/css/navigation";
import 'react-image-lightbox/style.css';
import "slick-carousel/slick/slick.css";
import "react-modal-video/css/modal-video.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'es'],
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'sessionStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: { useSuspense: false }
  });
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <CategoryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CategoryProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
