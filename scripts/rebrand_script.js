const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /Aion Luxury/g, to: 'Aion Luxury' },
    { from: /AION LUXURY/g, to: 'AION LUXURY' },
    { from: /aionluxury/g, to: 'aionluxury' },
    { from: /Aion Luxury/g, to: 'Aion Luxury' }
];

const ignoredDirs = ['node_modules', '.next', '.git', 'dist', 'build'];
const allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss', '.html', '.env', '.example', '.config.js', '.config.ts', '.sql'];

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        replacements.forEach(rep => {
            content = content.replace(rep.from, rep.to);
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
    }
}

function run(targetPath) {
    const stat = fs.statSync(targetPath);

    if (stat.isDirectory()) {
        const files = fs.readdirSync(targetPath);
        for (const file of files) {
            const fullPath = path.join(targetPath, file);
            const subStat = fs.statSync(fullPath);

            if (subStat.isDirectory()) {
                if (!ignoredDirs.includes(file)) {
                    run(fullPath);
                }
            } else {
                const ext = path.extname(file);
                if (allowedExtensions.includes(ext) || file === '.env' || file === '.env.example' || file === 'package.json' || file === 'README.md') {
                    processFile(fullPath);
                }
            }
        }
    } else {
        processFile(targetPath);
    }
}

const targetDir = process.argv[2] || process.cwd();
console.log(`Starting rebranding from Aion Luxury to Aion Luxury in: ${targetDir}`);
run(targetDir);
console.log('Rebranding complete.');
