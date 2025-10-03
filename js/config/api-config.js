// API Configuration
export const API_CONFIG = {
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/proxy/blood-diagnostic-bot-7b4wpufaoq-el.a.run.app'
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
