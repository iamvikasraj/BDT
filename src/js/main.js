// ===========================================
// MAIN APPLICATION
// ===========================================

import { BloodDiagnosticAPI } from './api/bloodDiagnosticAPI.js';
import SessionManager from './api/sessionManager.js';
import { MessageFormatter } from './components/messageFormatter.js';
import ChatInterface from './components/chatInterface.js';
import SessionList from './components/sessionList.js';

class BloodDiagnosticApp {
    constructor() {
        this.sessionManager = new SessionManager();
        this.chatInterface = new ChatInterface();
        this.sessionList = new SessionList();
        
        // Make sessionManager globally available for sessionList
        window.sessionManager = this.sessionManager;
        
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.setupEventListeners();
        this.loadUserSessions();
        this.checkAPIHealth();
    }

    // Setup event listeners
    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const pdfBtn = document.getElementById('pdfBtn');
        const fileInput = document.getElementById('fileInput');

        // Send message functionality
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // PDF upload functionality
        pdfBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.processPDFUpload(file);
            } else {
                alert('Please select a valid PDF file.');
            }
        });

        // Session selection events
        document.addEventListener('sessionSelected', (e) => {
            this.loadSession(e.detail.sessionId);
        });

        document.addEventListener('showCurrentConversation', () => {
            this.showCurrentConversation();
        });
    }

    // Check API health
    async checkAPIHealth() {
        try {
            const health = await BloodDiagnosticAPI.checkHealth('basic');
            console.log('✅ API Health Check:', health);
        } catch (error) {
            console.error('❌ API Health Check Failed:', error);
        }
    }

    // Load user sessions
    async loadUserSessions() {
        try {
            const sessions = await this.sessionManager.loadUserSessions();
            this.sessionList.updateSessionHistory(sessions);
        } catch (error) {
            console.error('❌ Error loading user sessions:', error);
        }
    }

    // Send message
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || this.chatInterface.getProcessing()) return;

        this.chatInterface.setProcessing(true);
        
        // Hide welcome section and show chat conversation
        this.chatInterface.hideWelcomeSection();
        this.chatInterface.showChatConversation();

        // Add user message to chat
        this.chatInterface.addMessageToConversation(message, 'user');

        // Only add to chat history if this is the first message in a conversation
        if (!document.querySelector('.chat-item.conversation-item')) {
            this.sessionList.addConversationToHistory();
        } else {
            // Update the existing conversation item
            this.sessionList.updateConversationInHistory(message);
        }

        // Show loading state
        const loadingId = this.chatInterface.showLoadingState();

        try {
            // Create session if we don't have one
            if (!this.sessionManager.getCurrentSessionId()) {
                await this.sessionManager.createSession('user_123', 'Blood Diagnostic Session');
            }
            
            if (!this.sessionManager.getCurrentSessionId()) {
                throw new Error('Failed to create session');
            }

            // Send to API
            const response = await BloodDiagnosticAPI.sendMessage(
                this.sessionManager.getCurrentSessionId(), 
                message, 
                { type: 'clinical_assessment', priority: 'normal' }
            );
            
            console.log('API Response received:', response);
            
            if (response) {
                // Clear loading state
                this.chatInterface.clearLoadingState(loadingId);
                
                // Process and display API response
                const responseData = response.data?.content || response.data || response;
                console.log('Response data:', responseData);
                
                let responseText = 'No response received';
                
                if (typeof responseData === 'string') {
                    responseText = responseData;
                    console.log('Using string response:', responseText);
                } else if (responseData && typeof responseData === 'object') {
                    // Format structured medical response
                    responseText = MessageFormatter.formatMedicalResponse(responseData);
                    console.log('Using formatted response:', responseText);
                }
                
                this.chatInterface.addMessageToConversation(responseText, 'assistant');
                
                // Store in chat history
                this.chatInterface.storeMessage(message, responseText);
            } else {
                // Handle API error - show fallback
                console.log('No response received from API');
                this.chatInterface.clearLoadingState(loadingId);
                const fallbackResponse = MessageFormatter.generateFallbackResponse(message);
                this.chatInterface.addMessageToConversation(fallbackResponse, 'assistant');
            }
        } catch (error) {
            // Handle error
            this.chatInterface.clearLoadingState(loadingId);
            console.error('API Error:', error);
            
            // Check if it's a network error or API unavailable
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                const fallbackResponse = MessageFormatter.generateFallbackResponse(message);
                this.chatInterface.addMessageToConversation(fallbackResponse, 'assistant');
            } else {
                // For other errors, show a more specific message with error details
                this.chatInterface.addMessageToConversation(`I encountered an error processing your request: ${error.message}. Please try again.`, 'assistant');
            }
        } finally {
            this.chatInterface.setProcessing(false);
            // Clear input
            messageInput.value = '';
        }
    }

    // Process PDF upload
    async processPDFUpload(file) {
        if (this.chatInterface.getProcessing()) return;
        
        console.log('📄 PDF upload started:', file.name);
        this.chatInterface.setProcessing(true);
        
        // Hide welcome section and show chat conversation
        this.chatInterface.hideWelcomeSection();
        this.chatInterface.showChatConversation();
        
        // If no conversation exists, create one
        if (!document.querySelector('.chat-item.conversation-item')) {
            this.sessionList.addConversationToHistory();
        }
        
        // Add PDF document card to current conversation
        this.chatInterface.addMessageToConversation(`
            <div class="pdf-document-card">
                <div class="pdf-file-name">${file.name}</div>
                <div class="pdf-icon-container">
                    <div class="pdf-icon">PDF</div>
                </div>
            </div>
        `, 'user');
        
        // Show processing message
        const processingId = this.chatInterface.showAnimatedProcessingMessage();
        
        try {
            // Upload file to API
            const response = await BloodDiagnosticAPI.uploadReport('user_123', file, 'Blood test report analysis');
            
            if (response && response.success) {
                // Hide processing message
                this.chatInterface.hideProcessingMessage(processingId);
                
                // Get session ID from upload response
                const sessionId = response.data?.session_id || response.data?.id;
                if (sessionId) {
                    this.sessionManager.setCurrentSessionId(sessionId);
                    console.log('✅ PDF uploaded, session created:', sessionId);
                }
                
                // Show analysis results
                const analysisData = response.data?.content || response.data;
                let analysisText = 'PDF analysis completed successfully.';
                
                if (typeof analysisData === 'string') {
                    analysisText = analysisData;
                } else if (analysisData && typeof analysisData === 'object') {
                    analysisText = MessageFormatter.formatMedicalResponse(analysisData);
                }
                
                this.chatInterface.addMessageToConversation(analysisText, 'assistant');
                
                // Store in chat history
                this.chatInterface.storeMessage(`Uploaded PDF: ${file.name}`, analysisText);
                
                // Refresh session list
                this.loadUserSessions();
            } else {
                throw new Error('Upload failed: ' + (response?.error || 'Unknown error'));
            }
        } catch (error) {
            // Handle error
            this.chatInterface.hideProcessingMessage(processingId);
            console.error('❌ PDF upload error:', error);
            
            const errorMessage = `Failed to process PDF: ${error.message}. Please try again.`;
            this.chatInterface.addMessageToConversation(errorMessage, 'assistant');
        } finally {
            this.chatInterface.setProcessing(false);
        }
    }

    // Load session
    async loadSession(sessionId) {
        try {
            console.log('🔄 Loading session:', sessionId);
            
            // Check if this is the current active session
            if (this.sessionManager.isCurrentSession(sessionId)) {
                console.log('📱 Loading current session - preserving existing conversation');
                // Just show the current conversation without loading from API
                this.chatInterface.hideWelcomeSection();
                this.chatInterface.showChatConversation();
                this.sessionList.updateSessionListActiveState(sessionId);
                return;
            }

            // Set as current session
            this.sessionManager.setCurrentSessionId(sessionId);
            
            // Hide welcome section and show chat conversation
            this.chatInterface.hideWelcomeSection();
            this.chatInterface.showChatConversation();
            
            // Load session history
            const history = await this.sessionManager.loadSessionHistory(sessionId);
            
            if (history && history.length > 0) {
                this.chatInterface.loadConversationFromHistory(history);
            } else {
                this.chatInterface.addMessageToConversation('No conversation history found for this session.', 'assistant');
            }
            
            // Update active state
            this.sessionList.updateSessionListActiveState(sessionId);
            
        } catch (error) {
            console.error('❌ Error loading session:', error);
            this.chatInterface.addMessageToConversation('Failed to load session history. Please try again.', 'assistant');
        }
    }

    // Show current conversation
    showCurrentConversation() {
        this.chatInterface.hideWelcomeSection();
        this.chatInterface.showChatConversation();
    }

    // Handle API errors
    handleAPIError(error) {
        console.error('API Error:', error);
        
        if (error.name === 'AbortError') {
            return 'Request timed out. Please check your connection and try again.';
        }
        
        if (error.message.includes('Failed to fetch')) {
            return 'Network error. Please check your connection and try again.';
        }
        
        if (error.message.includes('HTTP error')) {
            return `Server error: ${error.message}`;
        }
        
        return `An error occurred: ${error.message}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BloodDiagnosticApp();
});
