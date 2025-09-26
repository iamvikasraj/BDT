// ===========================================
// API SERVICE LAYER
// ===========================================

// API Configuration
const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:4000/proxy/blood-diagnostic-bot-7b4wpufaoq-el.a.run.app'
        : '/.netlify/functions/proxy',
    apiKey: 'healthcare-llm-gateway-api-key',
    endpoints: {
        // Health endpoints
        health: {
            basic: '/api/v1/health/',
            detailed: '/api/v1/health/detailed',
            ready: '/api/v1/health/ready',
            live: '/api/v1/health/live'
        },
        // Session management
        sessions: {
            create: '/api/v1/chat/sessions',
            list: '/api/v1/chat/sessions',
            history: (sessionId) => `/api/v1/chat/sessions/${sessionId}/history`,
            export: (sessionId) => `/api/v1/chat/sessions/${sessionId}/export/bibliography`
        },
        // Messaging
        messages: {
            send: (sessionId) => `/api/v1/chat/sessions/${sessionId}/messages`
        },
        // File operations
        files: {
            uploadReport: '/api/v1/chat/upload/report',
            uploadDocument: '/api/v1/documents/upload',
            processDocument: '/api/v1/documents/process',
            getSources: '/api/v1/documents/sources'
        }
    }
};

class BloodDiagnosticAPI {
    // Health check methods
    static async checkHealth(type = 'basic') {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for health checks
            
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
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for session creation
                
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
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for session creation
                
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
    static async uploadReport(userId, file, textInput = null) {
        try {
            // Validate file
            if (!file) {
                throw new Error('No file provided');
            }
            
            if (file.type !== 'application/pdf') {
                throw new Error('Only PDF files are supported');
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                throw new Error('File too large. Maximum size is 10MB');
            }

            console.log('📤 Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

            // Use different approaches for localhost vs Netlify
            if (window.location.hostname === 'localhost') {
                // Localhost: Use FormData
                const formData = new FormData();
                formData.append('user_id', userId);
                formData.append('file', file);
                
                if (textInput) {
                    formData.append('text_input', textInput);
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file uploads
                
                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.files.uploadReport}`, {
                    method: 'POST',
                    headers: { 'X-API-Key': API_CONFIG.apiKey },
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                console.log('📡 Upload response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('✅ Upload successful:', data);
                return data;
            } else {
                // Netlify: Convert to base64 and send as JSON
                const base64File = await this.fileToBase64(file);
                
                const requestBody = {
                    user_id: userId,
                    file: base64File,
                    filename: file.name,
                    content_type: file.type
                };
                
                if (textInput) {
                    requestBody.text_input = textInput;
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file uploads
                
                const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.files.uploadReport}`, {
                    method: 'POST',
                    headers: { 
                        'X-API-Key': API_CONFIG.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                console.log('📡 Upload response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('✅ Upload successful:', data);
                return data;
            }
        } catch (error) {
            console.error('Error uploading report:', error);
            throw error;
        }
    }

    // Helper method to convert file to base64
    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:application/pdf;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    // Export methods
    static async exportBibliography(sessionId, format = 'json') {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for exports
            
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sessions.export(sessionId)}?format=${format}`, {
                method: 'GET',
                headers: { 'X-API-Key': API_CONFIG.apiKey },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            return await response.json();
        } catch (error) {
            console.error('Error exporting bibliography:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BloodDiagnosticAPI, API_CONFIG };
}
