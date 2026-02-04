import { createReadStream, createWriteStream, statSync } from 'fs';
import path from 'path';


const copyWithProgress = (fileName) => {
    return new Promise((resolve, reject) => {
        const srcPath = path.join('./raw-files', fileName);
        const destPath = path.join('./dest-files', `copy-${fileName}`);
        try {
            // const fileData = await stat(filePath);
            // console.log('file stats : ', fileData.isFile());

            // 1. Getting the file size for the to (Calculate Percentage);
            const totalSize = statSync(srcPath).size;
            let copiedSize = 0;
            console.log(`Staring Copy : ${fileName} (${(totalSize / 1024 / 1024).toFixed(2)} MB)`)

            // 2. Streams Banano
            const readStream = createReadStream(srcPath);
            const writeStream = createWriteStream(destPath);

            // console.log('readStream ', readStream)

            // 3. EVENT : "data" (Jab bhi hum thoda sa data padha jaye)
            readStream.on('data', (chunk) => {
                // 'Chunk' wo chota sa thukda hai jisko humne transfer keya.
                copiedSize += chunk.length;
                const percentage = Math.round((copiedSize / totalSize) * 100);
                process.stdout.write(`\r Progress : ${percentage} [${copiedSize} / ${totalSize} bytes]`)
            });

            //  -- 2. ERROR HANDLING (Cleanup)...
            const cleanup = () => {
                readStream.destroy();
                writeStream.end(); // also can use destroy() here.
            };
            // 5. EVENT : 'Error' (agar kuch fat jaye) // improving the error handig
            const handleError = (err) => {
                console.log(`\n Error : ${err.message}`);
                cleanup();
                reject(err)
            };
            readStream.on('error', handleError);
            writeStream.on('error', handleError);

            writeStream.on('finish', () => {
                process.stdout.write('\n');
                console.log(`Copy Complte : ${fileName}`);
                resolve();
            });
            readStream.pipe(writeStream);

            // --- 5. CRITICAL: Handle Ctrl+C (Process Termination) ---
            process.on('SIGINT', () => {
                console.log('\n\n Process Cancelled by User. Cleaning up...');
                readStream.destroy();
                writeStream.destroy();
                process.exit();
            })

            // 6. Magic Line : Pipe connect 
        } catch (error) {
            reject(error);
        };
    });
};


const runTask = async () => {
    try {
        console.log('---- Job Started ----');
        // await copyWithProgress('sea.mp4');
        await copyWithProgress('test-data.mkv');
        console.log('---- Job Finished ----');
    } catch (error) {
        console.log('Task Failed : ', error.message)
    }
}


//  use some bigger file.
runTask();