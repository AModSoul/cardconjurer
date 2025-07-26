// filepath: c:\Users\Brandon\Documents\GitHub\cardconjurerjosh\js\frames\versionMinimalist.js
function setupMinimalistCard() {
    card.version = 'Minimalist';
    
    // Art bounds
    card.artBounds = { x: 0, y: 0, width: 1, height: 0.9224 };
    
    // Set symbol bounds
    card.setSymbolBounds = { x: 0.91, y: 0.635, width: 0.12, height: 0.0410, vertical: 'center', horizontal: 'right' };
    
    // Watermark bounds
    card.watermarkBounds = { x: 0.5, y: 0.7762, width: 0.75, height: 0.2305 };
    
    // Rules text box setup
    const minHeight = 0.15; // 15% of the canvas height
    const maxHeight = 0.40; // 40% of the canvas height
    const yPosition = 0.10; // 10% away from the bottom of the canvas
    
    loadTextOptions({
        rules: {
            name: 'Rules Text',
            text: '',
            x: 0.086,
            y: 1 - yPosition - minHeight, // Positioning based on the bottom
            width: 0.771,
            height: minHeight,
            size: 0.033,
            outlineWidth: 0.008,
            font: 'Plantin MT Pro',
            color: 'white',
            scale: function(text) {
                const textHeight = calculateTextHeight(text, this.size);
                this.height = Math.min(maxHeight, Math.max(minHeight, textHeight / card.height));
            }
        }
    });
}

function calculateTextHeight(text, fontSize) {
    // Placeholder function to calculate text height based on the content and font size
    // This should return the height of the text based on the number of lines and font size
    const lineHeight = fontSize * 1.2; // Example line height
    const lines = text.split('\n').length;
    return lineHeight * lines;
}

// Call the setup function to initialize the card
setupMinimalistCard();