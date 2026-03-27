const readline = require('readline');
const keytar= require('keytar');
const dotenv = require('dotenv');
dotenv.config();

const SERVICE_NAME= "mygit-cli";
const ACCOUNT_NAME= "github-token";

function askTokenFromUser(){
    //readline logic
    return new Promise((resolve)=>{
        const rl= readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter Your Github Token: ", (token)=>{
            rl.close();
            resolve(token.trim());
        });

    });
}

async function getToken(){
    //!1- CHECK ENVIRONMENT VARIABLE
    const envToken= process.env.GITHUB_TOKEN;
    if(envToken && envToken.trim() !== ""){
        return envToken;
    }

    //!2 keychain
    const savedToken= await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    if(savedToken){
        return savedToken;
    }

    //!3 FALLBACK-ASK USER IF NOT FOUND
    const token= await askTokenFromUser();

    if(!token){
        throw new Error("Github token is required");

    }

    //!4 saved to keychain
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);

    
    return token;
}

module.exports= {
    getToken
};