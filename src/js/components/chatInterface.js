// ===========================================
// CHAT INTERFACE COMPONENT
// ===========================================

import { MessageFormatter } from './messageFormatter.js';

class ChatInterface {
    constructor() {
        this.chatHistory = [];
        this.isProcessing = false;
        this.timeoutWarningId = null;
    }

    // Add message to chat with loading state support
    addMessageToChat(message, sender, isLoading = false) {
        const chatConversation = document.getElementById('chatConversation');
        const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.id = messageId;
        
        if (isLoading) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        }
        
        chatConversation.appendChild(messageDiv);
        chatConversation.scrollTop = chatConversation.scrollHeight;
        
        return messageId;
    }

    // Remove message from chat
    removeMessageFromChat(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
    }

    // Add message to conversation
    addMessageToConversation(message, sender) {
        const chatConversation = document.getElementById('chatConversation');
        if (!chatConversation) {
            console.error('❌ chatConversation element not found');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Parse structured content for assistant messages
        let content;
        if (sender === 'assistant' && message.includes('**')) {
            // For API responses with structured content, render directly without message-bubble
            content = MessageFormatter.parseStructuredMessage(message);
            messageDiv.innerHTML = content;
        } else {
            // For regular messages, use message-bubble wrapper
            content = message;
            messageDiv.innerHTML = `
                <div class="message-bubble">${content}</div>
            `;
        }
        
        chatConversation.appendChild(messageDiv);
        
        // Scroll to bottom with smooth animation
        setTimeout(() => {
            chatConversation.scrollTo({
                top: chatConversation.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    // Show loading state with timeout indicator
    showLoadingState(message = 'Analyzing your request... (This may take up to 30 seconds)') {
        const loadingId = this.addMessageToChat(message, 'assistant', true);
        
        // Show timeout warning after 15 seconds
        this.timeoutWarningId = setTimeout(() => {
            const warningId = this.addMessageToChat('⚠️ The API is taking longer than usual to respond. Please wait...', 'assistant', true);
            // Remove warning after 10 seconds
            setTimeout(() => {
                const warningElement = document.getElementById(`message-${warningId}`);
                if (warningElement) {
                    warningElement.remove();
                }
            }, 10000);
        }, 15000);

        return loadingId;
    }

    // Clear loading state
    clearLoadingState(loadingId) {
        this.removeMessageFromChat(loadingId);
        if (this.timeoutWarningId) {
            clearTimeout(this.timeoutWarningId);
            this.timeoutWarningId = null;
        }
    }

    // Show animated processing message
    showAnimatedProcessingMessage() {
        const processingId = this.addMessageToChat(`
            <div class="analyzing-text">
                <span>Processing PDF analysis</span>
                <div class="processing-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `, 'assistant', true);
        
        return processingId;
    }

    // Hide processing message
    hideProcessingMessage(processingId) {
        this.removeMessageFromChat(processingId);
    }

    // Hide welcome section
    hideWelcomeSection() {
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.style.display = 'none';
        }
    }

    // Show welcome section
    showWelcomeSection() {
        const welcomeSection = document.getElementById('welcomeSection');
        if (welcomeSection) {
            welcomeSection.style.display = 'flex';
        }
    }

    // Show chat conversation
    showChatConversation() {
        const chatConversation = document.getElementById('chatConversation');
        if (chatConversation) {
            chatConversation.classList.add('active');
        }
    }

    // Hide chat conversation
    hideChatConversation() {
        const chatConversation = document.getElementById('chatConversation');
        if (chatConversation) {
            chatConversation.classList.remove('active');
        }
    }

    // Clear conversation
    clearConversation() {
        const chatConversation = document.getElementById('chatConversation');
        if (chatConversation) {
            chatConversation.innerHTML = '';
        }
    }

    // Load conversation from history
    loadConversationFromHistory(messages) {
        this.clearConversation();
        
        if (!messages || messages.length === 0) {
            this.addMessageToConversation('No conversation history found.', 'assistant');
            return;
        }

        // Show loading message
        this.addMessageToConversation('Loading session...', 'assistant');
        
        // Load messages
        messages.forEach(message => {
            if (message.role === 'user' || message.sender === 'user') {
                this.addMessageToConversation(message.content || message.message, 'user');
            } else if (message.role === 'assistant' || message.sender === 'assistant') {
                const formattedContent = MessageFormatter.formatMessageContent(message.content || message.message);
                this.addMessageToConversation(formattedContent, 'assistant');
            }
        });

        // Remove loading message
        setTimeout(() => {
            const loadingMessages = document.querySelectorAll('.message.assistant');
            if (loadingMessages.length > 0) {
                const lastMessage = loadingMessages[loadingMessages.length - 1];
                if (lastMessage.textContent.includes('Loading session...')) {
                    lastMessage.remove();
                }
            }
        }, 500);

        // Scroll to bottom
        setTimeout(() => {
            const chatConversation = document.getElementById('chatConversation');
            if (chatConversation) {
                chatConversation.scrollTo({
                    top: chatConversation.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // Store message in chat history
    storeMessage(userMessage, assistantMessage) {
        this.chatHistory.push({
            user: userMessage,
            assistant: assistantMessage,
            timestamp: new Date().toISOString()
        });
    }

    // Get chat history
    getChatHistory() {
        return this.chatHistory;
    }

    // Clear chat history
    clearChatHistory() {
        this.chatHistory = [];
    }

    // Set processing state
    setProcessing(isProcessing) {
        this.isProcessing = isProcessing;
    }

    // Get processing state
    getProcessing() {
        return this.isProcessing;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatInterface;
}
