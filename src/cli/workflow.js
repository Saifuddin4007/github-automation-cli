const path= require("path");
const gitService= require("../services/git.service");
const tokenService= require("../services/token.service");
const GitHubService= require("../services/github.service");
const logger= require('../utils/logger');


async function runWorkFlow(options){

    let repoCreated= false;
    let repoOwner= null;
    let repoName= null;

    try{
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
    }
    else{
        logger.success("Commit created successfully...");
    }

    

    //!STEP-4: github Auth Part
    logger.info("Validating Github token...");

    const token= await tokenService.getToken();

    const github= new GitHubService(token);

    const user= await github.getAuthenticatedUser();

    logger.success(`Authenticated as ${user.login}`);


    //!STEP-5: CHECK REMOTE
    const hasRemote= gitService.remoteExists("origin");

    //! IF NO REMOTE EXISTS, CREATE REPO AND ADD REMOTE
    if(!hasRemote){
        repoName= path.basename(process.cwd());
        logger.info(`Creating Github repo: ${repoName}`);

        const repo= await github.createRepository({
            name: repoName,
            private: isPrivate
        });

        repoName= repo.name; //update with actual repo name from github (in case of any formatting changes)
        repoCreated= repo.created;
        repoOwner= repo.owner;


        if(repo.created){
            logger.success("Repo created successfully");
        }else{
            logger.warn("Repo already exists on Github");
        }

        //! ADD REMOTE
        logger.info("Adding remote origin...");
        gitService.addRemote(repo.cloneUrl, token);
        logger.success("Remote added successfully");

    }else{
        logger.info("Remote origin already exists, skipping repo creation...");
    }

    //!OLD CODES 
    // CREATE REPO
    // repoName= path.basename(process.cwd());

    // logger.success(`Creating Github repo: ${repoName}`);

    // const repo= await github.createRepository({
    //     name: repoName,
    //     private: isPrivate
    // });
    // repoName= repo.name; //update with actual repo name from github (in case of any formatting changes)
    // repoCreated= repo.created;
    // repoOwner= repo.owner;

    // if(repo.created){
    //     logger.success("Repo created successfully");
    // }else{
    //     logger.warn("Repo already exists on Github");
    // }

    //ADD REMOTE
    // logger.info("Adding remote origin...");
    // gitService.addRemote(repo.cloneUrl, token);

    // logger.success("Remote added successfully");



    //!STEP-6: PUSH
    try{
        logger.info("Pushing to Github...");
        gitService.push("origin", "main");
        logger.success("Pushed to Github successfully");
    }catch(err){
        logger.error("Push Failed");

        //*ROLLBACK
        if(repoCreated){
            logger.warn("Rolling back Github repo...");

            await github.deleteRepository(repoOwner, repoName);

            logger.success("Repository deleted, ROLLBACK successful");
        }
        throw err; //rethrow to be caught by outer catch
    }
    }catch(err){
        const logger= require("../utils/logger");
        logger.error(err.message);
        process.exit(1);
    }

}

module.exports= runWorkFlow;