import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

export const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeResume = async (formData) => {
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/api/resume/upload", formData);
            setAnalysis(data.analysis);
            setHistory((current) => [data.analysis, ...current]);
            return data.analysis;
        } catch (err) {
            const message = err?.response?.data?.message || "ATS analysis failed";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        setError("");

        try {
            const { data } = await api.get("/api/resume/history");
            setHistory(data);
            return data;
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to fetch analysis history";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysisById = async (id) => {
        setLoading(true);
        setError("");

        try {
            const { data } = await api.get(`/api/resume/${id}`);
            setAnalysis(data.analysis);
            return data.analysis;
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to fetch analysis";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAnalysis = async (id) => {
        setLoading(true);
        setError("");

        try {
            await api.delete(`/api/resume/${id}`);
            setHistory((current) => current.filter((item) => item._id !== id));
            setAnalysis((current) => current?._id === id ? null : current);
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to delete analysis";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearAnalysis = () => {
        setAnalysis(null);
        setError("");
    };

    const value = useMemo(
        () => ({
            analysis,
            history,
            loading,
            error,
            analyzeResume,
            fetchHistory,
            fetchAnalysisById,
            deleteAnalysis,
            clearAnalysis
        }),
        [analysis, history, loading, error]
    );

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => useContext(AnalysisContext);
