const gitService= require("../services/git.service");
const tokenService= require("../services/token.service");
const GitHubService= require("../services/github.service");

async function runWorkFlow(options){
    const {message, private: isPrivate} = options;

    console.log("Commit message received:", message);
    console.log("Private repo flag:", isPrivate);

    //!git Part
    console.log("Starting Git Workflow.........");

    //!step-1: CHECK REPO
    if(!gitService.isGitRepository()){
        console.log("Initialising git repo.......");
        gitService.initializeRepo();
    }

    //!STEP-2: STAGE FILES
    console.log("Staging files.......");
    gitService.stageAll();


    //!STEP-3: COMMIT
    console.log("Creating Commit.......");
    const res= gitService.commit(message);
    if(!res.committed){
        console.log("Nothing to commit....");
        return;
    }

    console.log("Commit created Successfully");


    //!github Auth Part
    console.log("Validating Github token.....");

    const token= await tokenService.getToken();

    const github= new GitHubService(token);

    const user= await github.getAuthenticatedUser();

    console.log(`Authenticated as ${user.login}`);



}

module.exports= runWorkFlow;