import "./globals";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider, useAuth } from "./providers/auth";
import { theme } from "./theme";
import initializeKeys from "./initializeKeys";
import "./index.css";
import SignUp from "./pages/SignUp";
import Feed from "./pages/Feed";
import Community from "./pages/Community";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

initializeKeys().then(() => {
  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/signup" element={<SignUp />}></Route>
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<Feed />} index></Route>
                  <Route path="/r/:communityId" element={<Community />}></Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  );
});

function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.session) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
