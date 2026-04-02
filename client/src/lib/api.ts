const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface FeedbackData {
    userId: string;
    userName: string;
    category: string;
    rating: number;
    comment: string;
    sentiment: string;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const fetchFeedback = async (userId?: string) => {
    const url = userId ? `${API_URL}/feedback?userId=${userId}` : `${API_URL}/feedback`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch feedback');
    }
    return response.json();
};

export const fetchPublicStats = async () => {
    const response = await fetch(`${API_URL}/feedback/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch public stats');
    }
    return response.json();
};

export const submitFeedback = async (data: FeedbackData) => {
    const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to submit feedback');
    }
    return response.json();
};

export const updateFeedback = async (id: string, data: Partial<FeedbackData>) => {
    const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update feedback');
    }
    return response.json();
};

export const deleteFeedback = async (id: string) => {
    const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete feedback');
    }
    // DELETE typically returns 204 No Content, so we might not have JSON to parse
    return response.status === 204 ? null : response.json().catch(() => null);
};

export const addMessage = async (feedbackId: string, text: string) => {
    const response = await fetch(`${API_URL}/feedback/${feedbackId}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        throw new Error('Failed to add message');
    }
    return response.json();
};
