const path= require("path");
const gitService= require("../services/git.service");
const tokenService= require("../services/token.service");
const GitHubService= require("../services/github.service");
const logger= require('../utils/logger');

async function runWorkFlow(options){
    const {message, private: isPrivate} = options;

    // console.log("Commit message received:", message);
    // console.log("Private repo flag:", isPrivate);

    //!git Part
    logger.info("Starting Git workflow...");

    //!step-1: CHECK REPO
    if(!gitService.isGitRepository()){
        logger.info("Initialising Git repo...");
        gitService.initializeRepo();

        logger.info("Setting main branch...");
        gitService.ensureMainBranch();
    }

    //!STEP-2: STAGE FILES
    logger.info("Staging Files...");
    gitService.stageAll();


    //!STEP-3: COMMIT
    logger.info("Creating Commit...");
    const res= gitService.commit(message);
    if(!res.committed){
        logger.warn("Nothing to commit...");
        return;
    }

    logger.info("Commit created successfully...");

    //!STEP-4: CHECK REMOTE
    const hasRemote= gitService.remoteExists("origin");

    if(hasRemote){
        logger.warn("Remote already exists. Skipping Github repo creation.");
        return;

    }




    //!STEP-5: github Auth Part
    logger.info("Validating Github token...");

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
        logger.info("Repo created successfully");
    }else{
        logger.warn("Repo already exists on Github");
    }

    //!STEP-7: ADD REMOTE
    logger.info("Adding remote origin...");
    gitService.addRemote(repo.cloneUrl, token);

    logger.info("Remote added successfully");

    //!STEP-8: PUSH
    logger.info("Pushing to Github...");
    gitService.push("origin", "main");
    logger.info("Pushed to Github successfully");

}

module.exports= runWorkFlow;