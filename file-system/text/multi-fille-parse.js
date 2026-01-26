import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';


const multiFileReader = async () => {
    try {
        console.log('Reading Files..');
        const filesPath = './raw-files';

        const dirPath = path.resolve(filesPath);
        const files = await readdir(dirPath);
        console.log('files found : ', files);

        // Works but it's don't handles the files parallely
        // for (const file of files) {
        //     const filePath = path.join(dirPath, file);
        //     const fileContent = await readFile(filePath, 'utf-8');
        //     console.log(`\n \n \n ${file}  : ${fileContent}`);
        //     // console.log(fileContent);
        // };

        const fileReadPromises = files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            try {
                const fileStats = await stat(filePath);
                // console.log('fileStats : ', fileStats);
                if (!fileStats.isFile()) {
                    return { status: 'skipped', fileName: file, reason: 'Not a file' }
                }
                // this is is not that necessary but only for here only for the json files.
                if (!file.endsWith('.json')) {
                    return { status: 'skipped', fileName: file, reason: 'Not a Json File' };
                }
                const fileContent = await readFile(filePath, 'utf-8');
                return { status: 'success', fileName: file, content: JSON.parse(fileContent) }
            } catch (error) {
                return { status: 'failed', fileName: file, reason: error.message }
            }
        });

        const resultWrapper = await Promise.allSettled(fileReadPromises);
        const allResults = resultWrapper.map(r => r.status === 'fulfilled' ? r.value : { status: 'failed', fileName: 'unkonwn', reason: r.reason })
        // console.log('result >> ', allResults);
        const successFulFiles = allResults.filter(result => result.status == 'success');
        const skippedFiles = allResults.filter(result => result.status == 'skipped');
        const failedFiles = allResults.filter(result => result.status == 'failed');

        console.log(`successFulFiles ${successFulFiles.length} readed successfully!`);
        console.log(`skippedFiles ${skippedFiles.length} Skipped!`);
        console.log(`failedFiles ${failedFiles.length} failed!`);

        if (successFulFiles.length > 0) {
            successFulFiles.forEach(({ fileName, content }) => {
                console.log(`${fileName} : `, Object.keys(content).length, 'items')
            });
        };
        if (failedFiles.length > 0) {
            console.log(`Failed files : ${failedFiles.length}`);
            failedFiles.forEach(({ fileName, content }) => {
                console.log(`${fileName} : `, Object.keys(content).length, 'items')
            });
        }
        return successFulFiles;

    } catch (error) {
        console.log('Error in reading files!', error.message)
    }
}


multiFileReader();