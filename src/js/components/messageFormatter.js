// ===========================================
// MESSAGE FORMATTING UTILITIES
// ===========================================

class MessageFormatter {
    // Parse structured text into HTML
    static parseStructuredMessage(text) {
        if (!text || typeof text !== 'string') return text;
        
        // Split by sections using ** markers
        const sections = text.split(/\*\*(.*?)\*\*/g);
        let html = '';
        
        for (let i = 0; i < sections.length; i++) {
            if (i % 2 === 1) { // Odd indices are section headers
                const header = sections[i].trim().replace(/:$/, ''); // Remove trailing colon
                const nextContent = sections[i + 1] ? sections[i + 1].trim() : '';
                
                if (nextContent) {
                    html += `<div class="message-card" data-section="${header}">
                        <div class="message-card-header">${header}</div>
                        <div class="message-card-content">${this.formatContent(nextContent)}</div>
                    </div>`;
                }
            }
        }
        
        // If no ** markers found, return original text
        return html || text;
    }
    
    // Format content within sections
    static formatContent(content) {
        if (!content) return content;
        
        // Handle bullet points - format as bold labels with descriptions
        if (content.includes('•')) {
            const items = content.split('•').filter(item => item.trim());
            let html = '';
            items.forEach(item => {
                const trimmed = item.trim();
                // Check if item has bold text pattern (text followed by description)
                if (trimmed.includes(' - ')) {
                    const [label, description] = trimmed.split(' - ', 2);
                    html += `<div class="finding-item">
                        <span class="finding-label">${label.trim()}</span>
                        <span class="finding-description">${description.trim()}</span>
                    </div>`;
                } else {
                    html += `<div class="finding-item">
                        <span class="finding-label">${trimmed}</span>
                    </div>`;
                }
            });
            return html;
        }
        
        // Handle numbered lists - but format references differently
        if (content.match(/^\d+\./m)) {
            const items = content.split(/\n/).filter(item => item.trim() && item.match(/^\d+\./));
            
            // Check if this is a references section by looking for [View Source] pattern
            if (content.includes('[View Source]')) {
                let html = '';
                items.forEach(item => {
                    const cleanedItem = item.replace(/^\d+\.\s*/, '').trim();
                    // Extract the link from [View Source](url) pattern
                    const linkMatch = cleanedItem.match(/\[View Source\]\(([^)]+)\)/);
                    if (linkMatch) {
                        const url = linkMatch[1];
                        const text = cleanedItem.replace(/\[View Source\]\([^)]+\)/, '').trim();
                        html += `<div class="reference-item">
                            <a href="${url}" target="_blank" class="reference-link">${text}</a>
                        </div>`;
                    } else {
                        html += `<div class="reference-item">${cleanedItem}</div>`;
                    }
                });
                return html;
            } else {
                // Regular numbered list
                return `<ol class="numbered-list">${items.map(item => `<li>${item.replace(/^\d+\.\s*/, '').trim()}</li>`).join('')}</ol>`;
            }
        }
        
        // Handle links [text](url)
        content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="reference-link">$1</a>');
        
        // Handle line breaks
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }
    
    // Format medical response data
    static formatMedicalResponse(data) {
        let formatted = '';
        
        if (data.summary) {
            formatted += `**Summary:** ${data.summary}\n\n`;
        }
        
        if (data.key_findings && Array.isArray(data.key_findings)) {
            formatted += `**Key Findings:**\n`;
            data.key_findings.forEach(finding => {
                formatted += `• ${finding}\n`;
            });
            formatted += '\n';
        }
        
        if (data.clinical_impression) {
            formatted += `**Clinical Impression:** ${data.clinical_impression}\n\n`;
        }
        
        if (data.immediate_actions && Array.isArray(data.immediate_actions)) {
            formatted += `**Immediate Actions:**\n`;
            data.immediate_actions.forEach(action => {
                formatted += `• ${action}\n`;
            });
            formatted += '\n';
        }
        
        if (data.citations && Array.isArray(data.citations)) {
            formatted += `**References:**\n`;
            data.citations.forEach((citation, index) => {
                formatted += `${index + 1}. ${citation.source}`;
                if (citation.year) formatted += ` (${citation.year})`;
                if (citation.link) formatted += ` - [View Source](${citation.link})`;
                formatted += '\n';
            });
        }
        
        return formatted || 'Analysis completed. Please ask for more specific details.';
    }

    // Format message content for display
    static formatMessageContent(content) {
        // Handle different content types
        if (typeof content === 'string') {
            // Check if it's complex HTML with message-card structure
            if (content.includes('message-card')) {
                return this.convertComplexToSimple(content);
            }
            
            // Basic formatting for medical responses
            return content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>')
                .replace(/•/g, '&bull;');
        } else if (typeof content === 'object') {
            // Handle structured medical responses
            let formatted = '';
            if (content.summary) formatted += `<div class="summary"><strong>Summary:</strong> ${content.summary}</div>`;
            if (content.key_findings && Array.isArray(content.key_findings)) {
                formatted += `<div class="findings"><strong>Key Findings:</strong><ul>${content.key_findings.map(f => `<li>${f}</li>`).join('')}</ul></div>`;
            }
            if (content.clinical_impression) formatted += `<div class="impression"><strong>Clinical Impression:</strong> ${content.clinical_impression}</div>`;
            if (content.immediate_actions && Array.isArray(content.immediate_actions)) {
                formatted += `<div class="actions"><strong>Immediate Actions:</strong><ul>${content.immediate_actions.map(a => `<li>${a}</li>`).join('')}</ul></div>`;
            }
            return formatted || JSON.stringify(content);
        }
        return content;
    }

    // Convert complex message-card HTML to simple format
    static convertComplexToSimple(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        let simpleContent = '';
        const messageCards = tempDiv.querySelectorAll('.message-card');
        
        messageCards.forEach(card => {
            const section = card.getAttribute('data-section');
            const header = card.querySelector('.message-card-header');
            const content = card.querySelector('.message-card-content');
            
            if (header && content) {
                const sectionName = header.textContent.trim();
                const sectionContent = content.innerHTML;
                
                if (sectionName === 'Summary') {
                    simpleContent += `<div class="summary"><strong>Summary:</strong> ${sectionContent}</div>`;
                } else if (sectionName === 'Key Findings') {
                    const findingItems = content.querySelectorAll('.finding-item');
                    let findingsList = '';
                    findingItems.forEach(item => {
                        const label = item.querySelector('.finding-label');
                        const description = item.querySelector('.finding-description');
                        if (label) {
                            const text = description ? `${label.textContent} - ${description.textContent}` : label.textContent;
                            findingsList += `<li>${text}</li>`;
                        }
                    });
                    simpleContent += `<div class="findings"><strong>Key Findings:</strong><ul>${findingsList}</ul></div>`;
                } else if (sectionName === 'Clinical Impression') {
                    simpleContent += `<div class="impression"><strong>Clinical Impression:</strong> ${sectionContent}</div>`;
                } else if (sectionName === 'Immediate Actions') {
                    const actionItems = content.querySelectorAll('.finding-item');
                    let actionsList = '';
                    actionItems.forEach(item => {
                        const label = item.querySelector('.finding-label');
                        if (label) {
                            actionsList += `<li>${label.textContent}</li>`;
                        }
                    });
                    simpleContent += `<div class="actions"><strong>Immediate Actions:</strong><ul>${actionsList}</ul></div>`;
                } else if (sectionName === 'References') {
                    const referenceItems = content.querySelectorAll('.reference-item');
                    let referencesList = '';
                    referenceItems.forEach(item => {
                        const link = item.querySelector('.reference-link');
                        if (link) {
                            referencesList += `<li><a href="${link.href}" target="_blank">${link.textContent}</a></li>`;
                        }
                    });
                    if (referencesList) {
                        simpleContent += `<div class="references"><strong>References:</strong><ul>${referencesList}</ul></div>`;
                    }
                }
            }
        });
        
        return simpleContent || htmlContent;
    }

    // Generate fallback response
    static generateFallbackResponse(message) {
        const responses = [
            "I understand your concern. Let me help you with that.",
            "That's a great question. I'd be happy to assist you with that.",
            "I can see you're looking for medical information. Let me help you with that.",
            "Thank you for reaching out. I'm here to help you with your medical analysis needs.",
            "I understand you need assistance. Let me guide you through the process.",
            "That's an interesting question. I can definitely help you with that.",
            "I'm here to help you with medical diagnosis and analysis. What would you like to know?",
            "I can assist you with patient management and medical analysis. How can I help?"
        ];
        
        // Simple keyword-based responses
        if (message.toLowerCase().includes('blood')) {
            return "I can help you analyze blood test results! For the most accurate analysis, please upload your blood test PDF using the paperclip icon. I can then provide detailed insights and diagnosis recommendations.";
        } else if (message.toLowerCase().includes('patient')) {
            return "I can help you with patient management and analysis. Please provide more details about the specific case or upload relevant medical documents for a comprehensive assessment.";
        } else if (message.toLowerCase().includes('diagnosis')) {
            return "I can assist with medical diagnosis based on symptoms, lab results, and clinical data. Please share the relevant information and I'll provide a detailed analysis.";
        } else {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageFormatter;
}
