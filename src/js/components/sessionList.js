// ===========================================
// SESSION LIST COMPONENT
// ===========================================

class SessionList {
    constructor() {
        this.chatHistoryElement = document.getElementById('chatHistory');
        this.sessionFilter = 'all'; // 'all' or 'urgent'
    }

    // Update session history display
    updateSessionHistory(sessions) {
        if (!this.chatHistoryElement) {
            console.error('❌ chatHistory element not found');
            return;
        }

        // Clear existing content
        this.chatHistoryElement.innerHTML = '';

        // Add section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
            <div class="session-header">
                <span class="section-title">Previous Diagnosis</span>
                <div class="session-filters">
                    <button class="filter-btn ${this.sessionFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-btn ${this.sessionFilter === 'urgent' ? 'active' : ''}" data-filter="urgent">Urgent</button>
                </div>
            </div>
        `;

        this.chatHistoryElement.appendChild(sectionHeader);

        // Add filter event listeners
        sectionHeader.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setSessionFilter(filter);
            });
        });

        // Filter sessions
        const filteredSessions = this.getFilteredSessions(sessions);

        if (filteredSessions.length === 0) {
            this.showEmptyState();
            return;
        }

        // Add session items
        filteredSessions.forEach(session => {
            const sessionDiv = this.createSessionItem(session);
            this.chatHistoryElement.appendChild(sessionDiv);
        });
    }

    // Create session item element
    createSessionItem(session) {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'chat-item';
        sessionDiv.setAttribute('data-session-id', session.session_id);

        // Add urgent class if needed
        if (session.urgent) {
            sessionDiv.classList.add('urgent');
        }

        // Format dates
        const createdDate = new Date(session.created_at).toLocaleDateString('en-GB');
        const lastMessageDate = new Date(session.last_message_at).toLocaleDateString('en-GB');

        sessionDiv.innerHTML = `
            <div class="session-header-info">
                <div class="session-status">
                    <span class="status-indicator status-${session.status}"></span>
                    <span class="status-text">${session.status}</span>
                    ${session.urgent ? '<span class="urgent-badge">URGENT</span>' : ''}
                </div>
                <div class="session-time">${createdDate}</div>
            </div>
            <div class="session-title">${session.title}</div>
            <div class="session-diagnosis">
                <span class="diagnosis-label">Diagnosis:</span>
                <span class="diagnosis-text">${session.primary_diagnosis}</span>
                <span class="confidence-badge">${session.confidence}%</span>
            </div>
            <div class="session-meta">
                <span class="message-count">${session.message_count} messages</span>
                <span class="session-date">${lastMessageDate}</span>
            </div>
        `;

        // Add click event listener
        sessionDiv.addEventListener('click', () => {
            this.loadSession(session.session_id);
        });

        return sessionDiv;
    }

    // Show empty state
    showEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-sessions';
        emptyDiv.innerHTML = `
            <div class="empty-icon">📋</div>
            <div class="empty-text">No sessions found</div>
            <div class="empty-subtext">Start a new conversation to see your diagnosis history</div>
        `;
        this.chatHistoryElement.appendChild(emptyDiv);
    }

    // Set session filter
    setSessionFilter(filter) {
        this.sessionFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });

        // Re-render sessions (this will be called from the main app)
        if (window.sessionManager) {
            window.sessionManager.loadUserSessions().then(sessions => {
                this.updateSessionHistory(sessions);
            });
        }
    }

    // Get filtered sessions
    getFilteredSessions(sessions) {
        if (this.sessionFilter === 'urgent') {
            return sessions.filter(session => session.urgent === true);
        }
        return sessions;
    }

    // Load session (this will be handled by the main app)
    loadSession(sessionId) {
        // Dispatch custom event for the main app to handle
        const event = new CustomEvent('sessionSelected', { 
            detail: { sessionId } 
        });
        document.dispatchEvent(event);
    }

    // Update active session state
    updateSessionListActiveState(sessionId) {
        // Remove active class from all items
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected item
        const selectedItem = document.querySelector(`[data-session-id="${sessionId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }

    // Add conversation to history
    addConversationToHistory() {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item conversation-item';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        chatItem.innerHTML = `
            <div class="chat-header">
                <div class="chat-date">Chat Conversation</div>
                <div class="chat-time">${timeString}</div>
            </div>
            <div class="chat-message">Click to view conversation</div>
        `;
        
        // Remove active class from all existing chat items
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to new chat item
        chatItem.classList.add('active');
        
        // Add to top of chat history
        this.chatHistoryElement.insertBefore(chatItem, this.chatHistoryElement.firstChild);
        
        // Add click functionality
        chatItem.addEventListener('click', () => {
            // Remove active class from all chat items
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            chatItem.classList.add('active');
            
            // Show the conversation for this chat item
            this.showConversationForChatItem(chatItem);
        });
        
        // Scroll to top
        this.chatHistoryElement.scrollTop = 0;
    }

    // Update conversation in history
    updateConversationInHistory(message) {
        const conversationItem = document.querySelector('.chat-item.conversation-item');
        if (conversationItem) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            conversationItem.querySelector('.chat-time').textContent = timeString;
            conversationItem.querySelector('.chat-message').textContent = `Last message: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`;
        }
    }

    // Show conversation for chat item
    showConversationForChatItem(chatItem) {
        // This will be handled by the main app
        const event = new CustomEvent('showCurrentConversation');
        document.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionList;
}
