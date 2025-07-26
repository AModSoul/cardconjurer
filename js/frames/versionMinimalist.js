//checks to see if it needs to run
if (!loadedVersions.includes('/js/frames/versionMinimalist.js')) {
    loadedVersions.push('/js/frames/versionMinimalist.js');
    
    function calculateTextHeight(text, fontSize) {
        if (!text) return fontSize * 1.2;
        const lineSpacing = 1.2;
        const lines = text.split('\n');
        return fontSize * lineSpacing * lines.length;
    }
}