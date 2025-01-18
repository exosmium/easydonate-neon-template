// Parse the markdown content into structured sections
function parseRules(content) {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentSubsection = null;

    lines.forEach(line => {
        // Main section (##)
        if (line.startsWith('## ')) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: line.replace('## ', ''),
                type: 'main',
                content: [],
                subsections: []
            };
        }
        // Subsection (###)
        else if (line.startsWith('### ')) {
            if (currentSubsection) {
                currentSection.subsections.push(currentSubsection);
            }
            currentSubsection = {
                title: line.replace('### ', ''),
                content: []
            };
        }
        // Bullet points
        else if (line.startsWith('* ')) {
            if (currentSubsection) {
                currentSubsection.content.push({
                    type: 'bullet',
                    text: line.replace('* ', '')
                });
            } else if (currentSection) {
                currentSection.content.push({
                    type: 'bullet',
                    text: line.replace('* ', '')
                });
            }
        }
        // Note/Exception blocks (> **)
        else if (line.startsWith('> **')) {
            const noteType = line.includes('Примечание:') ? 'note' : 'exception';
            const text = line.replace('> **Примечание:** ', '')
                            .replace('> **Исключение:** ', '')
                            .trim();
            
            if (currentSubsection) {
                currentSubsection.content.push({
                    type: noteType,
                    text: text
                });
            } else if (currentSection) {
                currentSection.content.push({
                    type: noteType,
                    text: text
                });
            }
        }
        // Regular text
        else if (line.trim() && !line.startsWith('>')) {
            if (currentSubsection) {
                currentSubsection.content.push({
                    type: 'text',
                    text: line
                });
            } else if (currentSection) {
                currentSection.content.push({
                    type: 'text',
                    text: line
                });
            }
        }
    });

    // Add the last section and subsection
    if (currentSubsection) {
        currentSection.subsections.push(currentSubsection);
    }
    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

// Create HTML elements for the rules content
function createRulesHTML(sections) {
    const container = document.createElement('div');
    container.className = 'rules-content';

    sections.forEach(section => {
        // Create section container
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'rules-section';

        // Add section title
        const title = document.createElement('h2');
        title.className = 'rules__section-title shadowed-text';
        title.textContent = section.title;
        sectionDiv.appendChild(title);

        // Add main section content (usually bullet points)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'rules__content';
        
        section.content.forEach(item => {
            if (item.type === 'bullet') {
                const bulletDiv = document.createElement('div');
                bulletDiv.className = 'rules__bullet';
                bulletDiv.innerHTML = `
                    <span class="bullet-marker">•</span>
                    <span class="bullet-text">${item.text}</span>
                `;
                contentDiv.appendChild(bulletDiv);
            }
        });
        sectionDiv.appendChild(contentDiv);

        // Add subsections
        section.subsections.forEach(subsection => {
            const subsectionDiv = document.createElement('div');
            subsectionDiv.className = 'rules__subsection';

            // Add subsection title
            const subsectionTitle = document.createElement('h3');
            subsectionTitle.className = 'rules__subsection-title';
            subsectionTitle.textContent = subsection.title;
            subsectionDiv.appendChild(subsectionTitle);

            // Add subsection content
            const subsectionContent = document.createElement('div');
            subsectionContent.className = 'rules__subsection-content';

            subsection.content.forEach(item => {
                const itemDiv = document.createElement('div');
                
                switch (item.type) {
                    case 'bullet':
                        itemDiv.className = 'rules__bullet';
                        itemDiv.innerHTML = `
                            <span class="bullet-marker">•</span>
                            <span class="bullet-text">${item.text}</span>
                        `;
                        break;
                    case 'text':
                        itemDiv.className = 'rules__text';
                        itemDiv.textContent = item.text;
                        break;
                    case 'note':
                    case 'exception':
                        itemDiv.className = 'rules__note';
                        itemDiv.innerHTML = `
                            <span class="note-title">
                                ${item.type === 'note' ? 'Примечание:' : 'Исключение:'}
                            </span>
                            <p class="note-text">${item.text}</p>
                        `;
                        break;
                }
                subsectionContent.appendChild(itemDiv);
            });

            subsectionDiv.appendChild(subsectionContent);
            sectionDiv.appendChild(subsectionDiv);
        });

        container.appendChild(sectionDiv);
    });

    return container;
}

// Main function to initialize the rules formatter
async function initRulesFormatter() {
    try {
        const rulesContent = document.getElementById('rulesContent');
        if (!rulesContent) return;

        const response = await fetch('./rules.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        const sections = parseRules(content);
        const rulesHTML = createRulesHTML(sections);
        
        // Clear any existing content
        rulesContent.innerHTML = '';
        rulesContent.appendChild(rulesHTML);
    } catch (error) {
        console.error('Error loading rules:', error);
        // Add error message to the page
        const rulesContent = document.getElementById('rulesContent');
        if (rulesContent) {
            rulesContent.innerHTML = `
                <div class="rules__error">
                    Error loading rules. Please try refreshing the page.
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initRulesFormatter);