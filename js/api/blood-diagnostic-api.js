import { API_CONFIG } from '../config/api-config.js';

export class BloodDiagnosticAPI {
    // Health check methods
    static async checkHealth(type = 'basic') {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health checks
            
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.health[type]}`, {
                method: 'GET',
                headers: { 'X-API-Key': API_CONFIG.apiKey },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return await response.json();
        } catch (error) {
            console.error(`Health check failed (${type}):`, error); 
            throw error;
        }
    }

    // Session management methods
    static async createSession(userId = 'user_123', title = 'New Session', textInput = null, file = null) {
        try {
            // Use different approaches for localhost vs Netlify
            if (window.location.hostname === 'localhost') {
                // Localhost: Use FormData
                const formData = new FormData();
                formData.append('user_id', userId);
                formData.append('title', title);
                
                if (textInput) {
                    formData.append('text_input', textInput);
                }
                
                if (file) {
                    formData.append('report_file', file);
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for session creation

                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessions.create}`, {
                    method: 'POST',
                    headers: { 'X-API-Key': API_CONFIG.apiKey },
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Session creation API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                return data;
            } else {
                // Netlify: Use URLSearchParams for application/x-www-form-urlencoded
                const formData = new URLSearchParams();
                formData.append('user_id', userId);
                formData.append('title', title);
                
                if (textInput) {
                    formData.append('text_input', textInput);
                }
                
                if (file) {
                    formData.append('report_file', file);
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for session creation

                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessions.create}`, {
                    method: 'POST',
                    headers: { 
                        'X-API-Key': API_CONFIG.apiKey,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Session creation API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    static async listSessions(userId = 'user_123', page = 1, limit = 50, sort = 'date_desc', filterUrgent = false) {
        try {
            const params = new URLSearchParams({
                user_id: userId,
                page: page,
                limit: limit,
                sort: sort,
                filter_urgent: filterUrgent
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for session listing

            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessions.list}?${params}`, {
                method: 'GET',
                headers: { 'X-API-Key': API_CONFIG.apiKey },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            return await response.json();
        } catch (error) {
            console.error('Error listing sessions:', error);
            throw error;
        }
    }

    static async getSessionHistory(sessionId) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for session history
            
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessions.history(sessionId)}`, {
                method: 'GET',
                headers: { 'X-API-Key': API_CONFIG.apiKey },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            // Check if response is ok
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`Session ${sessionId} not found (404)`);
                    return { success: false, error: 'Session not found', data: null };
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.log(`Session ${sessionId} returned non-JSON response`);
                return { success: false, error: 'Invalid response format', data: null };
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting session history:', error);
            throw error;
        }
    }

    // Messaging methods
    static async sendMessage(sessionId, content, metadata = {}) {
        try {
            // Use different approaches for localhost vs Netlify
            if (window.location.hostname === 'localhost') {
                // Localhost: Use FormData
                const formData = new FormData();
                formData.append('content', content);
                formData.append('metadata', JSON.stringify(metadata));

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.messages.send(sessionId)}`, {
                    method: 'POST',
                    headers: { 'X-API-Key': API_CONFIG.apiKey },
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Message API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                return await response.json();
            } else {
                // Netlify: Use URLSearchParams for application/x-www-form-urlencoded
                const formData = new URLSearchParams();
                formData.append('content', content);
                formData.append('metadata', JSON.stringify(metadata));

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.messages.send(sessionId)}`, {
                    method: 'POST',
                    headers: { 
                        'X-API-Key': API_CONFIG.apiKey,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Message API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                return await response.json();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // File upload methods
    static async uploadReport(file, userId = 'user_123') {
        try {
            const formData = new FormData();
            formData.append('report_file', file);
            formData.append('user_id', userId);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file upload

            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.files.uploadReport}`, {
                method: 'POST',
                headers: { 'X-API-Key': API_CONFIG.apiKey },
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('File upload API Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}
