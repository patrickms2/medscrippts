import axios from "axios";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Common/Layout";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import EditScript from "./pages/EditScript";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Script from "./pages/Script";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ViewScript from "./pages/ViewScript";
import PrivateRoute from './PrivateRoute';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken')
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config
})

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="script" element={<PrivateRoute><Script /> </PrivateRoute>} />
        <Route path="/view-script/:slug" element={<PrivateRoute><ViewScript /> </PrivateRoute>} />
        <Route path="/edit-script/:slug" element={<PrivateRoute> <EditScript /> </PrivateRoute>} />
        <Route path="/compare-script/:slug/:keyword" element={<PrivateRoute><Compare /> </PrivateRoute>} />
      </Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route path="/magic-login" element={<MagicLogin />} /> */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
