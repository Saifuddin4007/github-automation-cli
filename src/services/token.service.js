const readline = require('readline');
const dotenv = require('dotenv');
dotenv.config();



function askTokenFromUser(){
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

    //!2 ASK USER IF NOT FOUND
    const token= await askTokenFromUser();

    if(!token){
        throw new Error("Github token is required");

    }
    return token;
}

module.exports= {
    getToken
};