import { readFile, writeFile } from 'fs/promises';
import fs from 'fs'

const getUserByEmail = async (email:string) => {
    try {
        const path = process.cwd()+"\\src\\dummy_database\\"+email+'.json';
        const content = await readFile(path, 'utf-8');
        return JSON.parse(content)
    } catch (error) {
        return false;
    }
}

const saveUser = async (nome:string, email:string, senha:string) => {

    if(emailExists(email)) return false;

    try {
        const path = process.cwd()+"\\src\\dummy_database\\"+email+'.json';
        console.log(path);
        
        const content = JSON.stringify({nome:nome, senha:senha})
        await writeFile(path, content)
        return true;
    } catch (error) {
        return false;
    }
}

const emailExists = (email:string) => {
    const path = process.cwd()+"\\src\\dummy_database\\"+email+'.json';
    return fs.existsSync(path)
}

export {
    getUserByEmail,
    saveUser,
    emailExists
}