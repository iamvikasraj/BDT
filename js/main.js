// Main Application Entry Point
import { BloodDiagnosticAPI } from './api/blood-diagnostic-api.js';
import { MessageFormatter } from './utils/message-formatter.js';

// Global state management
let currentSessionId = null;
let chatHistory = [];
let userSessions = [];
let isProcessing = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Blood Diagnostic Tool initialized');
    
    // Initialize components
    initializeEventListeners();
    initializeShimmerTest();
    loadUserSessions();
    
    // Check API health
    checkAPIHealth();
});

// ===========================================
// EVENT LISTENERS
// ===========================================

function initializeEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (messageInput && sendBtn) {
        // Send message on button click
        sendBtn.addEventListener('click', handleSendMessage);
        
        // Send message on Enter key (but allow Shift+Enter for new lines)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }
}

function initializeShimmerTest() {
    const shimmerTestBtn = document.getElementById('shimmerTestBtn');
    if (shimmerTestBtn) {
        shimmerTestBtn.addEventListener('click', toggleShimmerTest);
    }
}

// ===========================================
// MESSAGE HANDLING
// ===========================================

async function handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Clear input
    messageInput.value = '';
    autoResizeTextarea(messageInput);
    
    // Add user message to conversation
    addMessageToConversation(message, 'user');
    
    // Show loading state
    const loadingId = showLoadingState();
    
    try {
        isProcessing = true;
        
        // Create session if we don't have one
        if (!currentSessionId) {
            await createNewSession(message);
        }
        
        if (!currentSessionId) {
            throw new Error('Failed to create session');
        }

        // Send to API
        const response = await BloodDiagnosticAPI.sendMessage(
            currentSessionId, 
            message, 
            { type: 'clinical_assessment', priority: 'normal' }
        );
        
        console.log('API Response received:', response);
        
        if (response) {
            // Clear loading state
            clearLoadingState(loadingId);
            
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
            
            addMessageToConversation(responseText, 'assistant');
            
            // Store in chat history
            storeMessage(message, responseText);
            
            // Generate follow-up suggestions
            generateFollowUpSuggestions(message, responseText);
        } else {
            // Handle API error - show fallback
            console.log('No response received from API');
            clearLoadingState(loadingId);
            const fallbackResponse = MessageFormatter.generateFallbackResponse(message);
            addMessageToConversation(fallbackResponse, 'assistant');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        clearLoadingState(loadingId);
        
        // Show error message
        const errorMessage = 'I apologize, but I encountered an error processing your request. Please try again.';
        addMessageToConversation(errorMessage, 'assistant');
    } finally {
        isProcessing = false;
    }
}

// ===========================================
// SESSION MANAGEMENT
// ===========================================

async function createNewSession(message) {
    try {
        const response = await BloodDiagnosticAPI.createSession('user_123', 'Blood Diagnostic Session', message);
        
        if (response && response.data && response.data.session_id) {
            currentSessionId = response.data.session_id;
            console.log('✅ Session created:', currentSessionId);
            
            // Add session to the list
            addSessionToList({
                id: currentSessionId,
                title: 'Blood Diagnostic Session',
                status: 'active',
                time: new Date().toLocaleTimeString(),
                urgent: false
            });
            
            return true;
        }
    } catch (error) {
        console.error('Error creating session:', error);
    }
    return false;
}

async function loadUserSessions() {
    try {
        showShimmerLoading();
        
        const response = await BloodDiagnosticAPI.listSessions('user_123');
        
        if (response && response.data && Array.isArray(response.data)) {
            userSessions = response.data;
            renderSessionList();
        } else {
            showEmptySessionsState();
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
        showEmptySessionsState();
    } finally {
        hideShimmerLoading();
    }
}

// ===========================================
// UI RENDERING
// ===========================================

function addMessageToConversation(content, sender) {
    const chatConversation = document.getElementById('chatConversation');
    const welcomeSection = document.getElementById('welcomeSection');
    
    if (!chatConversation) return;
    
    // Hide welcome section when first message is added
    if (welcomeSection && welcomeSection.style.display !== 'none') {
        welcomeSection.style.display = 'none';
        chatConversation.classList.add('active');
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'assistant' && content.includes('message-card')) {
        // Handle structured medical responses
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${content}
            </div>
            <div class="message-time">${time}</div>
        `;
    } else {
        // Handle regular text messages
        const formattedContent = MessageFormatter.formatMessageContent(content);
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${formattedContent}
            </div>
            <div class="message-time">${time}</div>
        `;
    }
    
    chatConversation.appendChild(messageDiv);
    chatConversation.scrollTop = chatConversation.scrollHeight;
    
    // Add click handlers for diagnosis cards if present
    setTimeout(() => {
        addDiagnosisClickHandlers();
    }, 100);
}

function renderSessionList() {
    const chatHistory = document.querySelector('.chat-history');
    if (!chatHistory) return;
    
    chatHistory.innerHTML = '';
    
    if (userSessions.length === 0) {
        showEmptySessionsState();
        return;
    }
    
    userSessions.forEach(session => {
        const sessionElement = createSessionElement(session);
        chatHistory.appendChild(sessionElement);
    });
}

function createSessionElement(session) {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'chat-item';
    if (session.urgent) sessionDiv.classList.add('urgent');
    if (session.id === currentSessionId) sessionDiv.classList.add('active');
    
    sessionDiv.innerHTML = `
        <div class="session-header-info">
            <div class="session-status">
                ${session.urgent ? '<div class="urgent-badge"></div>' : ''}
                <span class="status-text">${session.status}</span>
            </div>
            <span class="session-time">${session.time}</span>
        </div>
        <div class="session-title">${session.title}</div>
    `;
    
    // Add click handler
    sessionDiv.addEventListener('click', () => {
        selectSession(session.id);
    });
    
    return sessionDiv;
}

function selectSession(sessionId) {
    // Update active session
    currentSessionId = sessionId;
    
    // Update UI
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const selectedItem = document.querySelector(`[data-session-id="${sessionId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Load session history
    loadSessionHistory(sessionId);
}

async function loadSessionHistory(sessionId) {
    try {
        const response = await BloodDiagnosticAPI.getSessionHistory(sessionId);
        
        if (response && response.data && response.data.messages) {
            // Clear current conversation
            const chatConversation = document.getElementById('chatConversation');
            const welcomeSection = document.getElementById('welcomeSection');
            
            if (chatConversation) {
                chatConversation.innerHTML = '';
                chatConversation.classList.add('active');
            }
            
            if (welcomeSection) {
                welcomeSection.style.display = 'none';
            }
            
            // Load messages from session history
            response.data.messages.forEach(message => {
                addMessageToConversation(message.content, message.role);
            });
            
            // Scroll to bottom
            if (chatConversation) {
                chatConversation.scrollTop = chatConversation.scrollHeight;
            }
        }
    } catch (error) {
        console.error('Error loading session history:', error);
        showError('Failed to load session history', error.message);
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function showLoadingState() {
    const loadingId = 'loading-' + Date.now();
    const loadingMessage = document.createElement('div');
    loadingMessage.id = loadingId;
    loadingMessage.className = 'message assistant';
    loadingMessage.innerHTML = `
        <div class="loading-message">
            <span>Analyzing your request</span>
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;
    
    const chatConversation = document.getElementById('chatConversation');
    chatConversation.appendChild(loadingMessage);
    chatConversation.scrollTop = chatConversation.scrollHeight;
    
    return loadingId;
}

function clearLoadingState(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

function storeMessage(userMessage, assistantResponse) {
    chatHistory.push({
        user: userMessage,
        assistant: assistantResponse,
        timestamp: new Date().toISOString()
    });
}

async function checkAPIHealth() {
    try {
        const health = await BloodDiagnosticAPI.checkHealth('basic');
        console.log('✅ API Health Check:', health);
        updateConnectionStatus('connected');
    } catch (error) {
        console.error('❌ API Health Check Failed:', error);
        updateConnectionStatus('disconnected');
    }
}

function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.className = `connection-status ${status}`;
        statusElement.textContent = status === 'connected' ? 'Connected' : 'Disconnected';
    }
}

// ===========================================
// SHIMMER LOADING
// ===========================================

function showShimmerLoading() {
    const chatHistoryElement = document.querySelector('.chat-history');
    if (!chatHistoryElement) return;
    
    const shimmerHTML = `
        <div class="shimmer-container">
            <div class="shimmer-header">
                <div class="shimmer shimmer-title"></div>
                <div class="shimmer-filters">
                    <div class="shimmer shimmer-filter"></div>
                    <div class="shimmer shimmer-filter"></div>
                </div>
            </div>
            
            <!-- Shimmer session items -->
            <div class="shimmer-session-item">
                <div class="shimmer shimmer-session-header">
                    <div class="shimmer shimmer-status"></div>
                    <div class="shimmer shimmer-time"></div>
                </div>
                <div class="shimmer shimmer-title-text"></div>
            </div>
            
            <div class="shimmer-session-item">
                <div class="shimmer shimmer-session-header">
                    <div class="shimmer shimmer-status"></div>
                    <div class="shimmer shimmer-time"></div>
                </div>
                <div class="shimmer shimmer-title-text"></div>
            </div>
            
            <div class="shimmer-session-item">
                <div class="shimmer shimmer-session-header">
                    <div class="shimmer shimmer-status"></div>
                    <div class="shimmer shimmer-time"></div>
                </div>
                <div class="shimmer shimmer-title-text"></div>
            </div>
        </div>
    `;
    
    chatHistoryElement.innerHTML = shimmerHTML;
}

function hideShimmerLoading() {
    const chatHistoryElement = document.querySelector('.chat-history');
    if (chatHistoryElement) {
        const shimmerContainer = chatHistoryElement.querySelector('.shimmer-container');
        if (shimmerContainer) {
            shimmerContainer.remove();
        }
    }
}

function showEmptySessionsState() {
    const chatHistoryElement = document.querySelector('.chat-history');
    if (!chatHistoryElement) return;
    
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-sessions';
    emptyState.innerHTML = `
        <div class="empty-icon">💬</div>
        <div class="empty-text">No conversations yet</div>
        <div class="empty-subtext">Start a new conversation to get started</div>
    `;
    
    chatHistoryElement.appendChild(emptyState);
}

function toggleShimmerTest() {
    const chatHistoryElement = document.querySelector('.chat-history');
    const shimmerTestBtn = document.getElementById('shimmerTestBtn');
    
    if (!chatHistoryElement || !shimmerTestBtn) return;
    
    const hasShimmer = chatHistoryElement.querySelector('.shimmer-container');
    
    if (hasShimmer) {
        hideShimmerLoading();
        updateShimmerButtonText(false);
    } else {
        showShimmerLoading();
        updateShimmerButtonText(true);
    }
}

function updateShimmerButtonText(isEnabled) {
    const shimmerTestBtn = document.getElementById('shimmerTestBtn');
    if (shimmerTestBtn) {
        shimmerTestBtn.textContent = isEnabled ? 'Hide Shimmer' : 'Test Shimmer';
    }
}

// ===========================================
// FOLLOW-UP SUGGESTIONS
// ===========================================

function generateFollowUpSuggestions(userMessage, assistantResponse) {
    // Check if this is a new thread (no existing messages)
    const isNewThread = chatHistory.length <= 1;
    
    if (!isNewThread) return; // Only show follow-ups for new threads
    
    const suggestions = generateFollowUpSuggestionsList(userMessage, assistantResponse);
    
    if (suggestions.length > 0) {
        const suggestionsHtml = `
            <div class="message-card" data-section="Suggested Next Steps">
                <div class="message-card-header">Suggested Next Steps</div>
                <div class="message-card-content">
                    ${suggestions.map(suggestion => `
                        <button class="suggestion-btn" onclick="sendSuggestionMessage('${suggestion.replace(/'/g, "\\'")}')">
                            ${suggestion}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        addMessageToConversation(suggestionsHtml, 'assistant');
    }
}

function generateFollowUpSuggestionsList(userMessage, assistantResponse) {
    const messageLower = userMessage.toLowerCase();
    
    // Handle greetings
    if (messageLower.includes('hello') || messageLower.includes('hi') || 
        messageLower.includes('good morning') || messageLower.includes('good afternoon') ||
        messageLower.includes('good evening') || messageLower.includes('greetings')) {
        
        return [
            "Upload a blood test PDF for analysis",
            "Ask about a specific medical condition",
            "Get help with patient diagnosis",
            "Learn about lab result interpretation"
        ];
    }
    
    // Handle blood test related queries
    if (messageLower.includes('blood') || messageLower.includes('test') || messageLower.includes('lab') || messageLower.includes('result')) {
        return [
            "Upload your blood test PDF",
            "Explain abnormal values",
            "What do these results mean?",
            "Are there any concerns?"
        ];
    }
    
    // Handle diagnosis queries
    if (messageLower.includes('diagnosis') || messageLower.includes('diagnose')) {
        return [
            "Upload patient test results",
            "Explain the diagnosis process",
            "What are the next steps?",
            "Are there alternative diagnoses?"
        ];
    }
    
    // Default suggestions
    return [
        "Upload a medical document",
        "Ask about symptoms",
        "Get treatment recommendations",
        "Learn about medical conditions"
    ];
}

// Global function for suggestion buttons
window.sendSuggestionMessage = function(suggestion) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = suggestion;
        handleSendMessage();
    }
};

// ===========================================
// DIAGNOSIS CARD HANDLERS
// ===========================================

function addDiagnosisClickHandlers() {
    setTimeout(() => {
        const diagnosisCards = document.querySelectorAll('.diagnosis-card');
        diagnosisCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const rank = this.querySelector('.diagnosis-rank').textContent;
                const name = this.querySelector('.diagnosis-name').textContent;
                const confidence = this.querySelector('.confidence-score').textContent.replace('%', '');
                
                // Get diagnosis data based on the card clicked
                const diagnosisData = getDiagnosisData(rank, name, confidence);
                showDetailedDiagnosis(diagnosisData);
            });
        });
    }, 2000);
}

function getDiagnosisData(rank, name, confidence) {
    // Mock data - in real implementation, this would come from the API
    return {
        rank: rank,
        name: name,
        confidence: confidence,
        reasoning: `Detailed analysis for ${name} with ${confidence}% confidence.`,
        evidence: [
            "Clinical presentation matches diagnostic criteria",
            "Laboratory values support the diagnosis",
            "Patient history is consistent with condition"
        ],
        recommendations: [
            "Immediate medical evaluation recommended",
            "Consider additional diagnostic tests",
            "Monitor patient closely for complications"
        ]
    };
}

function showDetailedDiagnosis(diagnosisData) {
    const detailedHtml = `
        <div class="detailed-diagnosis">
            <div class="diagnosis-header">
                <div class="diagnosis-rank-circle">
                    <div class="rank-number">${diagnosisData.rank}</div>
                    <div class="diagnosis-title">${diagnosisData.name}</div>
                </div>
                <div class="diagnosis-confidence-badge">
                    <span class="confidence-score ${diagnosisData.confidence >= 70 ? 'high-confidence' : ''}">${diagnosisData.confidence}%</span>
                    <span class="confidence-label">Confidence</span>
                </div>
            </div>
            <div class="diagnosis-reasoning">${diagnosisData.reasoning}</div>
            
            <div class="evidence-section">
                <h4>Supporting Evidence:</h4>
                <ul>
                    ${diagnosisData.evidence.map(evidence => `<li>${evidence}</li>`).join('')}
                </ul>
            </div>
            
            <div class="recommendations-section">
                <h4>Recommendations:</h4>
                <ul>
                    ${diagnosisData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    addMessageToConversation(detailedHtml, 'assistant');
}

// ===========================================
// ERROR HANDLING
// ===========================================

function showError(message, details = null) {
    console.error('❌ Error:', message, details);
    
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant error';
    errorDiv.innerHTML = `
        <div class="message-bubble">
            <div class="error-message">
                <strong>Error:</strong> ${message}
                ${details ? `<br><small>${details}</small>` : ''}
            </div>
        </div>
    `;
    
    const chatConversation = document.getElementById('chatConversation');
    if (chatConversation) {
        chatConversation.appendChild(errorDiv);
        chatConversation.scrollTop = chatConversation.scrollHeight;
    }
}

// Export for use in other modules
export { 
    addMessageToConversation, 
    showError, 
    BloodDiagnosticAPI, 
    MessageFormatter 
};
