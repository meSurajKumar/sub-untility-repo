import {readFile , writeFile} from 'fs/promises';
import path from 'path';


async function alterPackageJson(params) {
    const filePath = '../package.json'
    try {
        // STEP 1 : READ (Raw Data) Abhi ye ek raw string hai to hum 'version' change nahi kr sakte hain.   
        console.log('Reading File...');
        const rawData = await readFile(filePath,'utf-8');
        
        // STEP 2 : Parse File.
        // String ko javascript ka object bana hai. Taki Object ki keys ko use kr sake
        const fileData = JSON.parse(rawData);
        // console.log(`File version :: `, fileData.version)
        const oldVersion = fileData.version;
        console.log('Updating version...');
        fileData.version = "1.0.1"
        
        // STEP 3 : Vaps STRINGFY (Object -> string)
        // Vaps File me likhne ki leye esko string banana padega
        // null, 2 ka mtlb hai formating and indetation maintain rakhna hai.
        const newContent = JSON.stringify(fileData,null,2);
        await writeFile(filePath,newContent);
        console.log('Sucess ! File wrire completed.')
        
    } catch (error) {
        console.log('Error in file updation', error.message)
    }
}

alterPackageJson()