const path= require("path");
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

        console.log("Setting main branch.......");
        gitService.ensureMainBranch();
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

    //!STEP-4: CHECK REMOTE
    const hasRemote= gitService.remoteExists("origin");

    if(hasRemote){
        console.log("Remote already exists. Skipping Github repo creation.");
        return;

    }




    //!STEP-5: github Auth Part
    console.log("Validating Github token.....");

    const token= await tokenService.getToken();

    const github= new GitHubService(token);

    const user= await github.getAuthenticatedUser();

    console.log(`Authenticated as ${user.login}`);


    //!STEP-6: CREATE REPO
    const repoName= path.basename(process.cwd());

    console.log(`Creating Github repo: ${repoName}`);

    const repo= await github.createRepository({
        name: repoName,
        private: isPrivate
    });

    if(repo.created){
        console.log("Repo created successfully");
    }else{
        console.log("Repo already exists on Github");
    }

    //!STEP-7: ADD REMOTE
    console.log("Adding remote origin......");
    gitService.addRemote(repo.cloneUrl);

    console.log("Remote added siuccessfully");

}

module.exports= runWorkFlow;