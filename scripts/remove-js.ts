import fs from 'fs';
function removeJsFiles(baseDir:string){
    const files = fs.readdirSync(baseDir);
    files.forEach(file => {
        const filePath = `${baseDir}/${file}`;
        if(!fs.existsSync(filePath)) {
            console.warn(`File or directory does not exist: ${filePath}`);
            return;
        }
        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
            fs.unlinkSync(filePath);
            console.log(`Removed file: ${filePath}`);
        } else if (fs.statSync(filePath).isDirectory()) {
            removeJsFiles(filePath);
        }
    });

}
function removeJsFileStdInput() {
    let baseDir = process.argv[2];
    console.log('Base directory:', baseDir);
    if (baseDir) {
        // Remove any trailing newline characters
        baseDir = baseDir.toString().trim();
    }
    if(!baseDir || baseDir === '' || fs.existsSync(baseDir) === false) {
       throw new Error('Invalid directory specified');
    }
    if (baseDir) {
        removeJsFiles(baseDir);
    } else {
        console.error('No directory specified');
    }
}
removeJsFileStdInput();
