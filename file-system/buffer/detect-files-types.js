import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

const detectFileTypes = async () => {
    try {
        console.log('Detecting files...');
        const filesPath = './raw-files';

        const dirPath = path.resolve(filesPath);
        const files = await readdir(dirPath);
        // console.log('files : ', files);

        const fileReadPromises = files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            try {
                const fileStats = await stat(filePath);
                if (!fileStats.isFile()) {
                    return { status: 'skipped', fileName: file, reason: 'Not a File' }
                }
                //  Detecting Files..
                const buffer = await readFile(filePath);
                // console.log(`${file} buffer : ${buffer}`)
                const header = buffer.slice(0, 8);
                // console.log(file);
                // console.log(header);
                if (header[0] === 0x5b && header[1] === 0x0a) return { status: 'detected', fileName: file, type: "text/plain" };
                if (header[0] === 0xff && header[1] === 0xd8) return { status: 'detected', fileName: file, type: "image/jpeg" };
                if (header[0] === 0x89 && header[1] === 0x50) return { status: 'detected', fileName: file, type: "image/png" };
                if (header[0] === 0x00 && header[1] === 0x00) return { status: 'detected', fileName: file, type: "media/mp4" };
                if (header[0] === 0x47 && header[1] === 0x49) return { status: 'detected', fileName: file, type: "media/gif" };
            } catch (error) {
                return { status: 'error', fileName: file, reason: error.message };
            }
        })

        const resultData = await Promise.all(fileReadPromises);
        console.log('Detection Results : ');
        resultData.forEach(result => {
            if (result.status === 'detected') {
                console.log(`${result.fileName.padEnd(25)} -> ${result.type}`)
            }
            if (result.status === 'skipped') {
                console.log(`${result.fileName.padEnd(25)} -> ${result.reason}`)
            } else if (result.status === 'error') {
                console.log(`${result.fileName.padEnd(25)} -> ${result.reason}`)
            }
        });

        return resultData;
    } catch (error) {
        console.log('error : ', error)
    }
}

detectFileTypes()