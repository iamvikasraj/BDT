import streamlit as st
from pathlib import Path

# Version information
def get_version():
    """Get version from VERSION file"""
    version_file = Path("VERSION")
    if version_file.exists():
        return version_file.read_text().strip()
    return "0.0.0"

VERSION = get_version()

# Page configuration
st.set_page_config(
    page_title="Blood Diagnosis Tool",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Add viewport meta tag for mobile
st.markdown("""
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
""", unsafe_allow_html=True)

# Custom CSS for the layout
st.markdown("""
<style>
/* Updated: Right container background to #F8F8F8 */
/* Import Work Sans font */
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

/* CSS Variables for Color Palette */
:root {
    /* Primary Colors */
    --color-primary: #19B76A;
    --color-primary-dark: #16A085;
    
    /* Background Colors */
    --bg-main: linear-gradient(180deg, #BFC3C8 0%, #DAD9DA 100%);
    --bg-container: #F8F8F8;
    --bg-left-top: rgba(245, 245, 245, 0.9);
    --bg-left-bottom: rgba(255, 255, 255, 0.9);
    --bg-input: rgba(255, 255, 255, 0.95);
    
    /* Text Colors */
    --text-primary: #202020;
    --text-secondary: #343434;
    --text-muted: #6B7280;
    --text-placeholder: #9CA3AF;
    --text-disabled: #D1D5DB;
    
    /* Border Colors */
    --border-light: #EAEAEA;
    --border-medium: #E5E7EB;
    --border-glass: rgba(255, 255, 255, 0.3);
    
    /* Shadow Colors */
    --shadow-subtle: 0 4px 16px rgba(0, 0, 0, 0.05);
    --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.08);
    --shadow-strong: 0 8px 32px rgba(0, 0, 0, 0.1);
    --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    
    /* Avatar Colors */
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
}

/* Override Streamlit's default styles */
.stApp {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: var(--bg-main) !important;
}

.stApp > div {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: var(--bg-main) !important;
}

.stApp > div > div {
    margin: 0 !important;
    padding: 0 !important;
    background: var(--bg-main) !important;
}

/* Override all Streamlit containers */
.stApp > div > div > div {
    background: var(--bg-main) !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Hide Streamlit's default elements */
.stApp > header {
    display: none !important;
}

.stApp > div > div {
    margin: 0 !important;
    padding: 0 !important;
}

/* Hide specific Streamlit header classes */
.stAppHeader {
    display: none !important;
}

.st-emotion-cache-1ffuo7c {
    display: none !important;
}

.e3g0k5y1 {
    display: none !important;
}

/* Target any element with these classes */
[class*="stAppHeader"] {
    display: none !important;
}

[class*="st-emotion-cache-1ffuo7c"] {
    display: none !important;
}

[class*="e3g0k5y1"] {
    display: none !important;
}

/* Hide Streamlit's debug toolbar and other UI elements */
.stDeployButton {
    display: none !important;
}

.stToolbar {
    display: none !important;
}

.stStatusWidget {
    display: none !important;
}

.stDecoration {
    display: none !important;
}

/* Hide any other Streamlit UI elements */
[data-testid="stToolbar"] {
    display: none !important;
}

[data-testid="stDecoration"] {
    display: none !important;
}

[data-testid="stStatusWidget"] {
    display: none !important;
}

/* Main page container */
.main-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    padding: 24px;
    align-items: flex-start;
    gap: 24px;
    background: var(--bg-main);
    margin: 0;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
}

/* Left container */
.left-container {
    display: flex;
    width: 374px;
    height: 100%;
    min-height: calc(100vh - 48px);
    max-height: calc(100vh - 48px);
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex-shrink: 0;
    align-self: stretch;
    position: relative;
    overflow: hidden;
}

/* Top container inside left */
.top-container {
    display: flex;
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 16px 16px 0 0;
    background: rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: none;
    box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    min-height: 0;
    overflow: hidden;
    position: relative;
}

/* Section header */
.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    width: 100%;
    border-bottom: 1px solid #E5E7EB;
    background: #F5F5F5;
}

.section-title {
    font-family: "Work Sans", sans-serif !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: var(--text-primary) !important;
    margin: 0 !important;
    text-decoration: none !important;
    line-height: 1.2 !important;
}

/* Bottom container inside left */
.bottom-container {
    display: flex;
    height: auto;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    padding: 20px 24px;
    align-self: stretch;
    border-radius: 0 0 16px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-top: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    flex-shrink: 0;
    position: relative;
}

/* User profile */
.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    cursor: pointer;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.user-avatar {
    flex-shrink: 0;
}

.user-avatar-container {
    width: 32px;
    height: 32px;
    border-radius: 20%;
    overflow: hidden;
    display: flex;
    background: #dbdbdb;
    align-items: center;
    justify-content: center;
}

.user-avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.user-name {
    font-family: "Work Sans", sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-primary) !important;
    margin: 0 !important;
    line-height: 1.2 !important;
}

.user-role {
    font-family: "Work Sans", sans-serif !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: var(--text-muted) !important;
    margin: 0 !important;
    line-height: 1.2 !important;
}

.user-chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.user-profile:hover .user-chevron {
    transform: rotate(180deg);
}

/* Right container */
.right-container {
    flex: 1 0 0;
    height: 100%;
    min-height: calc(100vh - 48px);
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    background: var(--bg-container);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    padding: 0;
    min-height: 0;
    overflow: hidden;
    position: relative;
}

/* Right top container */
.right-top-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    align-self: stretch;
    justify-content: center;
    padding: 24px;
}



.right-bottom-container {
    margin-top: auto;
    width: 100%;
}

/* Input section */
.input-section {
    display: flex;
    height: auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    width: 100%;
    border-radius: 0 0 16px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    flex-shrink: 0;
    position: relative;
}

.input-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.action-btn:hover {
    background: #F3F4F6;
}

.input-field {
    flex: 1;
}

.message-input {
    width: 100%;
    border: none;
    outline: none;
    font-family: "Work Sans", sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--text-primary);
    background: transparent;
    line-height: 1.5;
}

.message-input::placeholder {
    color: var(--text-placeholder);
    font-weight: 400;
}

.message-input:focus {
    color: var(--text-primary);
    outline: none;
    caret-color: #19B76A;
}

.message-input:hover {
    color: var(--text-primary);
}

.message-input:disabled {
    color: #D1D5DB;
    cursor: not-allowed;
}

.send-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.send-btn svg {
    transition: all 0.3s ease;
}

.send-btn:hover svg {
    stroke: #19B76A;
    transform: rotate(45deg);
}

/* Active state when input has content */
.input-section:has(.message-input:not(:placeholder-shown)) .send-btn svg path {
    stroke: #19B76A !important;
}

.input-section:has(.message-input:not(:placeholder-shown)) .send-btn svg {
    transform: rotate(45deg);
}

/* Text styling for right top container */
.right-top-container p {
    color: var(--Secondary, #6D6D6D);
    text-align: center;
    font-family: "Work Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 135% */
    letter-spacing: -0.4px;
    margin: 0;
}

/* Chat history styling */
.chat-history {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
}

/* Custom scrollbar for chat history */
.chat-history::-webkit-scrollbar {
    width: 2px;
}

.chat-history::-webkit-scrollbar-track {
    background: transparent;
}

.chat-history::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 1px;
    transition: all 0.3s ease;
}

.chat-history::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
    width: 3px;
}

.chat-history {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
}

/* Custom scrollbar for left container */
.left-container::-webkit-scrollbar {
    width: 2px;
}

.left-container::-webkit-scrollbar-track {
    background: transparent;
}

.left-container::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 1px;
    transition: all 0.3s ease;
}

.left-container::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
    width: 3px;
}

.left-container {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
}

/* Custom scrollbar for main container */
.main-container::-webkit-scrollbar {
    width: 3px;
}

.main-container::-webkit-scrollbar-track {
    background: transparent;
}

.main-container::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 1.5px;
    transition: all 0.3s ease;
}

.main-container::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
    width: 4px;
}

.main-container {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
}

/* Global scrollbar customization */
*::-webkit-scrollbar {
    width: 3px;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 1.5px;
    transition: all 0.3s ease;
}

*::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
    width: 4px;
}

* {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
}

.chat-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    border-bottom: 1px solid #E5E7EB;
}

.chat-item:hover {
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.chat-date {
    font-family: "Work Sans";
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.chat-time {
    font-family: "Work Sans";
    font-size: 11px;
    font-weight: 400;
    color: var(--text-placeholder);
}

.chat-message {
    font-family: "Work Sans";
    font-size: 14px;
    font-weight: 400;
    color: #374151;
    line-height: 1.4;
}

.chat-divider {
    height: 1px;
    background: #E5E7EB;
    margin: 0 24px;
}

/* Mobile and tablet responsive design */
@media (max-width: 1024px) {
    .main-container {
        flex-direction: column;
        height: 100vh;
        min-height: 100vh;
        max-height: 100vh;
        padding: 12px;
        gap: 12px;
        overflow-y: auto;
    }
    
    .left-container {
        width: 100%;
        height: 40vh;
        min-height: 40vh;
        max-height: 40vh;
        flex-shrink: 0;
    }
    
    .right-container {
        width: 100%;
        height: 60vh;
        min-height: 60vh;
        max-height: 60vh;
        flex-shrink: 0;
    }
}

@media (max-width: 768px) {
    .main-container {
        padding: 8px;
        gap: 8px;
    }
    
    .left-container {
        height: 35vh;
        min-height: 35vh;
        max-height: 35vh;
    }
    
    .right-container {
        height: 65vh;
        min-height: 65vh;
        max-height: 65vh;
    }
    
    .chat-item {
        padding: 12px 16px;
    }
    
    .input-section {
        padding: 12px 16px;
    }
    
    .section-header {
        padding: 12px 16px;
    }
    
    .bottom-container {
        padding: 12px 16px;
    }
}

@media (max-width: 480px) {
    .main-container {
        padding: 4px;
        gap: 4px;
    }
    
    .left-container {
        height: 30vh;
        min-height: 30vh;
        max-height: 30vh;
    }
    
    .right-container {
        height: 70vh;
        min-height: 70vh;
        max-height: 70vh;
    }
    
    .chat-item {
        padding: 8px 12px;
    }
    
    .input-section {
        padding: 8px 12px;
    }
    
    .section-header {
        padding: 8px 12px;
    }
    
    .bottom-container {
        padding: 8px 12px;
    }
    
    .user-name {
        font-size: 12px !important;
    }
    
    .user-role {
        font-size: 10px !important;
    }
}

/* Landscape orientation for tablets */
@media (max-height: 600px) and (orientation: landscape) {
    .main-container {
        flex-direction: row;
        padding: 8px;
        gap: 8px;
    }
    
    .left-container {
        width: 300px;
        height: 100%;
        min-height: calc(100vh - 16px);
        max-height: calc(100vh - 16px);
    }
    
    .right-container {
        flex: 1;
        height: 100%;
        min-height: calc(100vh - 16px);
        max-height: calc(100vh - 16px);
    }
}

/* Touch-friendly interactions for mobile */
@media (max-width: 1024px) {
    .chat-item {
        min-height: 60px;
        padding: 16px 20px;
    }
    
    .send-btn, .action-btn {
        min-width: 44px;
        min-height: 44px;
        width: 44px;
        height: 44px;
    }
    
    .user-profile {
        min-height: 60px;
        padding: 8px 0;
    }
    
    .message-input {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 12px 0;
    }
}

/* Prevent text selection on mobile */
@media (max-width: 1024px) {
    .chat-item, .user-profile, .send-btn, .action-btn {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
}
</style>
""", unsafe_allow_html=True)

# Layout structure
st.markdown("""
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
                <!-- <div class="user-chevron">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div> -->
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
""", unsafe_allow_html=True)

# Add version information in sidebar
with st.sidebar:
    st.markdown("---")
    st.markdown(f"**Version:** {VERSION}")
    st.markdown("**BDT - Blood Diagnosis Tool**")

