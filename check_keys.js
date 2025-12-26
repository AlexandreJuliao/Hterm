const fs = require('fs');

// Read i18n.js
const i18nContent = fs.readFileSync('js/i18n.js', 'utf8');

// Extract keys from the object (hacky regex but should work for this simple file)
// We are looking for "key: " inside "pt: {"
// actually, let's just eval it if possible? No, it's browser code.
// Let's just use regex to find keys inside pt: { ... }

// Find the pt block
const ptBlockMatch = i18nContent.match(/pt:\s*{([^}]+)}/s);
if (!ptBlockMatch) {
    console.error("Could not find pt block");
    process.exit(1);
}
const ptBlock = ptBlockMatch[1];
const ptKeys = ptBlock.match(/^\s*([\w_]+):/gm).map(k => k.trim().replace(':', ''));

const enBlockMatch = i18nContent.match(/en:\s*{([^}]+)}/s);
if (!enBlockMatch) {
    console.error("Could not find en block");
    process.exit(1);
}
const enBlock = enBlockMatch[1];
const enKeys = enBlock.match(/^\s*([\w_]+):/gm).map(k => k.trim().replace(':', ''));


// Read used keys
const usedKeys = fs.readFileSync('used_keys.txt', 'utf8').split('\n').filter(k => k.trim() !== '');

// Check
const missingPt = usedKeys.filter(k => !ptKeys.includes(k));
const missingEn = usedKeys.filter(k => !enKeys.includes(k));

console.log("Missing in PT:", missingPt);
console.log("Missing in EN:", missingEn);
