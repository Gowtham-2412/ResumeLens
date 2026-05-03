import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const decodeJwtPayload = (token) => {
    try {
        const [, payload = ""] = token.split(".");
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
        const json = atob(padded);

        return JSON.parse(json);
    } catch {
        return null;
    }
};

const buildUserFromToken = (token, existingUser = null) => {
    const payload = decodeJwtPayload(token);

    if (!payload?.id) {
        return existingUser;
    }

    return {
        id: payload.id,
        name: existingUser?.name || "Member",
        email: existingUser?.email || "",
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (!token) {
            return;
        }

        setUser((currentUser) => currentUser || buildUserFromToken(token, currentUser));
    }, [token]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const { data } = await api.post("/api/auth/login", credentials);
            setToken(data.token);
            setUser(data.user);
            navigate(`/${data.user.id}`)
            return data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials) => {
        setLoading(true);
        try {
            const { data } = await api.post("/api/auth/register", credentials);
            setToken(data.token);
            setUser(data.user);
            navigate(`/${data.user.id}`)
            return data;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = () => {
        setLoading(true);

        return api
            .get("/api/auth/google/status")
            .then(({ data }) => {
                if (!data.configured) {
                    throw new Error(data.message || "Google OAuth is not configured on the server.");
                }

                window.location.assign(`${api.defaults.baseURL}/api/auth/google`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const setAuthSession = (oauthToken, existingUser = null) => {
        const nextUser = buildUserFromToken(oauthToken, existingUser);

        if (!nextUser?.id) {
            throw new Error("Invalid OAuth token");
        }

        setToken(oauthToken);
        setUser(nextUser);

        return nextUser;
    };

    const completeOAuth = (oauthToken) => {
        const nextUser = setAuthSession(oauthToken, null);
        navigate(`/${nextUser.id}`, { replace: true });

        return nextUser;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            register,
            loginWithGoogle,
            setAuthSession,
            completeOAuth,
            logout,
            isAuthenticated: Boolean(token)
        }),
        [user, token, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
