const {execSync}= require("child_process");
const fs= require("fs");
const path= require("path");

function isGitRepository(){
    const gitPath= path.join(process.cwd(), ".git");
    return fs.existsSync(gitPath);
}

function initializeRepo(){
    runCommand("git init");
}

function stageAll(){
    runCommand("git add .");
}

function commit(msg){
    try{
        const output= execSync(`git commit -m "${msg}" `, {encoding:'utf-8'});
        console.log(output); //Manually Print
        return {committed: true};
    }catch(err){
        const errorOutput= err.stderr?.toString() || 
                            err.stdout?.toString() ||
                            "";
                
        console.log(errorOutput); //show git message
        
        if(errorOutput.includes("nothing to commit")){
            return {committed: false};
        }
        throw new Error(`Git Commit Failed: ${errorOutput}`);
    }
}


function remoteExists(){
    try{
        const output= execSync("git remote").toString().trim();
        return output.includes("origin");
    }catch(err){
        return false;
    }
}

function addRemote(url){
    runCommand(`git remote add origin ${url}`);
}

function push(){
    runCommand("git push -u origin main");
}

function runCommand(command){
    try{
        execSync(command, {stdio:"inherit"});
    }catch(err){
        throw new Error(`Git Command Failed: ${command}`);
    }
}

function ensureMainBranch(){
    try{
        execSync("git branch -M main", {stdio:"inherit"});
    }catch(err){
        throw new Error("Failed to set main branch");
    }
}

module.exports= {
    isGitRepository,
    initializeRepo,
    stageAll,
    commit,
    remoteExists,
    addRemote,
    push,
    ensureMainBranch
}