// ===========================================
// SESSION MANAGEMENT
// ===========================================

import { BloodDiagnosticAPI } from './bloodDiagnosticAPI.js';

class SessionManager {
    constructor() {
        this.currentSessionId = null;
        this.userSessions = [];
        this.sessionFilter = 'all'; // 'all' or 'urgent'
    }

    // Create a new session
    async createSession(userId = 'user_123', title = 'New Session', textInput = null, file = null) {
        try {
            const data = await BloodDiagnosticAPI.createSession(userId, title, textInput, file);
            this.currentSessionId = data.data?.session_id || data.data?.id;
            console.log('✅ Session created:', this.currentSessionId);
            return this.currentSessionId;
        } catch (error) {
            console.error('❌ Error creating session:', error);
            throw error;
        }
    }

    // Load user sessions
    async loadUserSessions(userId = 'user_123') {
        try {
            const response = await BloodDiagnosticAPI.listSessions(userId, 1, 50, 'date_desc', false);
            
            if (response.success && response.data?.sessions) {
                this.userSessions = response.data.sessions;
                console.log('✅ Sessions loaded:', this.userSessions.length);
                return this.userSessions;
            } else {
                console.log('No sessions found');
                this.userSessions = [];
                return [];
            }
        } catch (error) {
            console.error('❌ Error loading sessions:', error);
            this.userSessions = [];
            return [];
        }
    }

    // Load session history
    async loadSessionHistory(sessionId) {
        try {
            const response = await BloodDiagnosticAPI.getSessionHistory(sessionId);
            
            if (response.success && response.data?.history) {
                console.log('✅ Session history loaded:', response.data.history.length, 'messages');
                return response.data.history;
            } else {
                console.log('No session history found');
                return [];
            }
        } catch (error) {
            console.error('❌ Error loading session history:', error);
            return [];
        }
    }

    // Get filtered sessions
    getFilteredSessions() {
        if (this.sessionFilter === 'urgent') {
            return this.userSessions.filter(session => session.urgent === true);
        }
        return this.userSessions;
    }

    // Set session filter
    setSessionFilter(filter) {
        this.sessionFilter = filter;
    }

    // Get current session ID
    getCurrentSessionId() {
        return this.currentSessionId;
    }

    // Set current session ID
    setCurrentSessionId(sessionId) {
        this.currentSessionId = sessionId;
    }

    // Check if session is current
    isCurrentSession(sessionId) {
        return this.currentSessionId === sessionId;
    }

    // Get session by ID
    getSessionById(sessionId) {
        return this.userSessions.find(session => session.session_id === sessionId);
    }

    // Update session in list
    updateSession(sessionId, updates) {
        const sessionIndex = this.userSessions.findIndex(session => session.session_id === sessionId);
        if (sessionIndex !== -1) {
            this.userSessions[sessionIndex] = { ...this.userSessions[sessionIndex], ...updates };
        }
    }

    // Add new session to list
    addSession(session) {
        this.userSessions.unshift(session);
    }

    // Remove session from list
    removeSession(sessionId) {
        this.userSessions = this.userSessions.filter(session => session.session_id !== sessionId);
    }

    // Clear all sessions
    clearSessions() {
        this.userSessions = [];
        this.currentSessionId = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}
