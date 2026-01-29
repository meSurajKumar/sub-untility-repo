import { readdir, readFile, stat, open } from 'fs/promises';
import path from 'path';

const detectFileTypes = async () => {
    try {
        console.log('Detecting files...');
        const filesPath = './raw-files';

        const dirPath = path.resolve(filesPath);
        const files = await readdir(dirPath);
        // console.log('files : ', files);

        const detectionPromises = files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            let fileHandle = null;
            try {
                const fileStats = await stat(filePath);
                if (!fileStats.isFile()) {
                    return { status: 'skipped', fileName: file, reason: 'Not a File' }
                }
                // STEP 1:  Open file (File descriptor milta hai, data load nahi hota.)
                fileHandle = await open(filePath, 'r');
                // STEP 2: only read the small portion of file. eg. (4100 bytes - like vs code also did)
                const buffer = Buffer.alloc(512);
                const { bytesRead } = await fileHandle.read(buffer, 0, 512, 0);

                // 1.  Checking the Numbers (Images/Media);
                if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return { status: 'detected', fileName: file, type: "image/jpeg" };
                if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return { status: 'detected', fileName: file, type: "image/png" };
                if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return { status: 'detected', fileName: file, type: "media/gif" };
                if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44) return { status: 'detected', fileName: file, type: "application/pdf" };

                // 2. Binary vs Text Check (The null byte Test)
                // Agar buffer mai kahi pr bhi 0x00 (Null) hai, to wo Binary file hai (exe, bin, mp4 etc )
                // Agar null hai to vo probably Text file hai.
                const scannedBuffer = buffer.subarray(0, bytesRead);
                if (scannedBuffer.includes(0x00)) {
                    return { status: 'detected', fileName: file, type: 'application/octet-stream (Binary)' };
                } else {
                    return { status: 'detected', fileName: file, type: 'text/plain (Source Code/Text)' };
                }
            } catch (error) {
                // Ensure file is closed even if error occurs
                return { status: 'error', fileName: file, reason: error.message };
            } finally {
                if (fileHandle) {
                    // Last STEP 3 : Close (Saving from resource leak)
                    await fileHandle.close();
                }
            }
        })

        const resultData = await Promise.allSettled(detectionPromises);
        resultData.forEach(result => {
            if (result.status === 'rejected') {
                console.log(`Promise Failed ${result.reason}`)
                return;
            }
            const data = result.value;
            if (data.status === 'detected') {
                console.log(`${data.fileName.padEnd(25)} -> ${data.type}`)
            } else {
                console.log(`${data.fileName.padEnd(25)} -> ${data.reason}`)
            }
        });
        return resultData;
    } catch (error) {
        console.log('Critical Error : ', error)
    }
}

detectFileTypes()