const {execSync, spawnSync}= require("child_process");
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
    runCommand("git add .", {stdio:"inherit"});
}

function commit(msg){
    try{
        // const output= execSync(`git commit -m "${msg}"`, {encoding:'utf-8'});
        const output= spawnSync("git", ["commit", "-m", msg], {encoding:'utf-8'});
        // console.log(output); //Manually Print

        if(output.stdout) process.stdout.write(output.stdout);
        if(output.stderr) process.stderr.write(output.stderr);

        if(output.status !== 0){
            const errorOutput= output.stderr || output.stdout || "";
            if(errorOutput.includes("nothing to commit")){
                return {committed: false};
            }
            throw new Error(`Git Commit Failed: ${errorOutput}`);

        }
        return {committed: true};
    }catch(err){
        //todo: OLD Codes with execSync, can be removed after testing
        // const errorOutput= err.stderr?.toString() || 
        //                     err.stdout?.toString() ||
        //                     "";
                
        // console.log(errorOutput); //show git message
        
        // if(errorOutput.includes("nothing to commit")){
        //     return {committed: false};
        // }
        // throw new Error(`Git Commit Failed: ${errorOutput}`);

        throw new Error(`Unexpected Git Error: ${err.message}`);
    }
}


function remoteExists(remoteName="origin"){
    try{
        const output= execSync("git remote").toString().trim();
        return output.split("\n").includes(remoteName);
    }catch(err){
        return false;
    }
}

function addRemote(url, token){
    const authenticatedUrl= url.replace(
        "https://",
        `https://${token}@`
    )
    runCommand(`git remote add origin ${authenticatedUrl}`);
}

function push(remote='origin', branch='main'){
    try{
        execSync(`git push -u ${remote} ${branch}`, {
            stdio:"inherit"
        });

    }catch(err){
        const errorOutput= err.stdout?.toString() || err.stderr?.toString() || "";
        throw new Error(`Git Push Failed: ${errorOutput}`);
    }

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