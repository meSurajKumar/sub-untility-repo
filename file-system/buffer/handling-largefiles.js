import { createReadStream, createWriteStream, statSync } from 'fs';
import path from 'path';


const copyWithProgress = async (fileName) => {
    try {
        const srcPath = path.join('./raw-files', fileName);
        const destPath = path.join('./dest-files', `copy-${fileName}`);
        // const fileData = await stat(filePath);
        // console.log('file stats : ', fileData.isFile());

        // 1. Getting the file size for the to (Calculate Percentage);
        const totalSize = statSync(srcPath).size;
        let copiedSize = 0;
        console.log(`Staring Copy : ${fileName} (${(totalSize / 1024 / 1024).toFixed(2)} MB)`)

        // 2. Streams Banano
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(destPath);

        // 3. EVENT : "data" (Jab bhi hum thoda sa data padha jaye)
        readStream.on('data', (chunk) => {
            // 'Chunk' wo chota sa thukda hai jisko humne transfer keya.
            copiedSize += chunk.length;
            const percentage = Math.round((copiedSize / totalSize) * 100);
            process.stdout.write(`\r Progress : ${percentage} [${copiedSize} / ${totalSize} bytes]`)
        });

        // 4. EVENT : 'end' (Jab read kahtam ho jaye)
        readStream.on('end', () => {
            console.log(`\n Reading Fineshed!`)
        })

        // 5. EVENT : 'Error' (agar kuch fat jaye)
        readStream.on('error', (err) => {
            console.log(`\n Error : ${err.message}`)
        })

        // 6. Magic Line : Pipe connect 
        readStream.pipe(writeStream);
    } catch (error) {
        console.log('Error >> ', error.message)
    }
}
//  use some bigger file.
copyWithProgress('sea.mp4');