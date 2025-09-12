import streamlit as st

# Page configuration
st.set_page_config(
    page_title="Blood Diagnosis Tool",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide ALL Streamlit elements and forms
st.markdown("""
<style>
/* Hide absolutely everything Streamlit creates */
.stApp > * {
    display: none !important;
}

.stApp {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: linear-gradient(180deg, #BFC3C8 0%, #DAD9DA 100%) !important;
}

/* Specifically hide forms and inputs */
form, input, button, .stForm, .stTextInput, .stFormSubmitButton {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Show only our custom content */
.custom-content {
    display: block !important;
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Import Work Sans font */
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

/* CSS Variables for Color Palette */
:root {
    --color-primary: #19B76A;
    --color-primary-dark: #16A085;
    --bg-main: linear-gradient(180deg, #BFC3C8 0%, #DAD9DA 100%);
    --bg-container: #F8F8F8;
    --bg-left-top: rgba(245, 245, 245, 0.9);
    --bg-left-bottom: rgba(255, 255, 255, 0.9);
    --bg-input: rgba(255, 255, 255, 0.95);
    --text-primary: #202020;
    --text-secondary: #343434;
    --text-muted: #6B7280;
    --text-placeholder: #9CA3AF;
    --text-disabled: #D1D5DB;
    --border-light: #EAEAEA;
    --border-medium: #E5E7EB;
    --border-glass: rgba(255, 255, 255, 0.3);
    --shadow-subtle: 0 4px 16px rgba(0, 0, 0, 0.05);
    --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
    --shadow-strong: 0 8px 32px rgba(0, 0, 0, 0.1);
    --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    --avatar-bg: #dbdbdb;
}

/* Reset all default styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-main);
}

/* Main page container */
.main-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    gap: 16px;
}

/* Left container - Chat history */
.left-container {
    flex: 0 0 350px;
    display: flex;
    flex-direction: column;
    background: var(--bg-container);
    border-radius: 16px;
    box-shadow: var(--shadow-medium);
    overflow: hidden;
}

.top-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-left-top);
    padding: 20px;
    overflow-y: auto;
}

.section-header {
    margin-bottom: 20px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.chat-history {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chat-item {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 12px 16px;
    border: 1px solid var(--border-light);
    transition: all 0.2s ease;
    cursor: pointer;
}

.chat-item:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: var(--shadow-subtle);
    transform: translateY(-1px);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.chat-date {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
}

.chat-time {
    font-size: 12px;
    color: var(--text-muted);
}

.chat-message {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.bottom-container {
    background: var(--bg-left-bottom);
    padding: 20px;
    border-top: 1px solid var(--border-light);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--avatar-bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-info {
    flex: 1;
}

.user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.user-role {
    font-size: 12px;
    color: var(--text-muted);
}

/* Right container - Chat interface */
.right-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-container);
    border-radius: 16px;
    box-shadow: var(--shadow-medium);
    overflow: hidden;
}

.right-top-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
}

.right-top-container svg {
    margin-bottom: 20px;
}

.right-top-container p {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.5;
}

.right-bottom-container {
    padding: 20px;
    border-top: 1px solid var(--border-light);
}

.input-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.input-field {
    flex: 1;
}

.message-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-medium);
    border-radius: 12px;
    background: var(--bg-input);
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: all 0.2s ease;
}

.message-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(25, 183, 106, 0.1);
}

.message-input::placeholder {
    color: var(--text-placeholder);
}

.input-actions {
    display: flex;
    gap: 8px;
}

.send-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 12px;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.send-btn:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium);
}

.send-btn:active {
    transform: translateY(0);
}

/* Mobile responsive */
@media (max-width: 1024px) {
    .main-container {
        flex-direction: column;
        padding: 12px;
    }
    .left-container {
        flex: 0 0 200px;
    }
}

@media (max-width: 768px) {
    .main-container {
        padding: 8px;
        gap: 8px;
    }
    .left-container {
        flex: 0 0 180px;
    }
    .top-container {
        padding: 16px;
    }
    .right-top-container {
        padding: 20px;
    }
    .right-top-container p {
        font-size: 16px;
    }
}
</style>
""", unsafe_allow_html=True)

# Your custom HTML content
st.markdown("""
<div class="custom-content">
    <div class="main-container">
        <div class="left-container">
            <div class="top-container">
                <div class="section-header">
                    <span class="section-title">Previous Diagnosis</span>
                </div>
                <div class="chat-history">
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">Today</div>
                            <div class="chat-time">2:30 PM</div>
                        </div>
                        <div class="chat-message">Patient consultation about symptoms</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">Today</div>
                            <div class="chat-time">1:15 PM</div>
                        </div>
                        <div class="chat-message">Follow-up on medication effectiveness</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">Today</div>
                            <div class="chat-time">11:45 AM</div>
                        </div>
                        <div class="chat-message">Initial diagnosis discussion</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">Yesterday</div>
                            <div class="chat-time">4:20 PM</div>
                        </div>
                        <div class="chat-message">Lab results review</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">Yesterday</div>
                            <div class="chat-time">2:10 PM</div>
                        </div>
                        <div class="chat-message">Treatment plan consultation</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">2 days ago</div>
                            <div class="chat-time">3:30 PM</div>
                        </div>
                        <div class="chat-message">Emergency consultation for chest pain</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">2 days ago</div>
                            <div class="chat-time">10:15 AM</div>
                        </div>
                        <div class="chat-message">Routine checkup and blood pressure monitoring</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">3 days ago</div>
                            <div class="chat-time">5:45 PM</div>
                        </div>
                        <div class="chat-message">Diabetes management and diet consultation</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">3 days ago</div>
                            <div class="chat-time">1:30 PM</div>
                        </div>
                        <div class="chat-message">Mental health check-in and therapy session</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">4 days ago</div>
                            <div class="chat-time">9:20 AM</div>
                        </div>
                        <div class="chat-message">Vaccination appointment and health screening</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">4 days ago</div>
                            <div class="chat-time">4:00 PM</div>
                        </div>
                        <div class="chat-message">Chronic pain management consultation</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">1 week ago</div>
                            <div class="chat-time">2:45 PM</div>
                        </div>
                        <div class="chat-message">Annual physical examination and health assessment</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">1 week ago</div>
                            <div class="chat-time">11:00 AM</div>
                        </div>
                        <div class="chat-message">Pediatric consultation for child's fever</div>
                    </div>
                    <div class="chat-item">
                        <div class="chat-header">
                            <div class="chat-date">1 week ago</div>
                            <div class="chat-time">8:30 AM</div>
                        </div>
                        <div class="chat-message">Pre-surgery consultation and preparation</div>
                    </div>
                </div>
            </div>
            <div class="bottom-container">
                <div class="user-profile">
                    <div class="user-avatar-container">
                    </div>
                    <div class="user-info">
                        <div class="user-name">Dr. Sarah Johnson</div>
                        <div class="user-role">General Practitioner</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="right-top-container">
                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.0129 2.67236C12.9723 -0.890788 18.0277 -0.890787 18.9871 2.67236L20.3219 7.62994C20.6565 8.87273 21.6273 9.8435 22.8701 10.1781L27.8276 11.5129C31.3908 12.4723 31.3908 17.5277 27.8276 18.4871L22.8701 19.8219C21.6273 20.1565 20.6565 21.1273 20.3219 22.3701L18.9871 27.3276C18.0277 30.8908 12.9723 30.8908 12.0129 27.3276L10.6781 22.3701C10.3435 21.1273 9.37273 20.1565 8.12994 19.8219L3.17236 18.4871C-0.390788 17.5277 -0.390787 12.4723 3.17236 11.5129L8.12994 10.1781C9.37273 9.8435 10.3435 8.87273 10.6781 7.62994L12.0129 2.67236Z" fill="#19B76A"/>
                </svg>
                <p>Hello, Doctor!<br>
                How can I help you today?</p>
            </div>
            <div class="right-bottom-container">
                <div class="input-section">
                    <div class="input-field">
                        <input type="text" placeholder="Type your message..." class="message-input">
                    </div>
                    <div class="input-actions">
                        <button class="send-btn">
                            <svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.9006 8.95457L10.2934 14.4616M10.2934 14.4616L14.8101 22.1449C15.2412 22.8782 16.3329 22.7726 16.6154 21.9703L23.341 2.87133C23.6137 2.09687 22.8885 1.34195 22.1037 1.58338L2.16397 7.71785C1.33369 7.97328 1.20155 9.09305 1.94956 9.53473L10.2934 14.4616Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)
