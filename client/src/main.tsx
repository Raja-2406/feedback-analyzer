import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId="623498140904-4ki9r6slc9dp4vgqu2njrd26avils624.apps.googleusercontent.com">
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
);
