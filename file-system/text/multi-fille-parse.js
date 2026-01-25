import { readdir, readFile, writeFile } from 'fs/promises';
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
            const fileContent = await readFile(filePath, 'utf-8');
            return { fileName: file, content: JSON.parse(fileContent) }
        });

        const allFileData = await Promise.all(fileReadPromises);
        console.log('All files read successfully!')
        allFileData.forEach(({ fileName, content }) => {
            console.log(`${fileName} : `, Object.keys(content).length, 'items')
        });

        return allFileData;

    } catch (error) {
        console.log('Error in reading files!', error.message)
    }
}


multiFileReader();