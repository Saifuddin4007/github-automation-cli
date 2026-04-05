const {Command}= require("commander");
const { runCommitOnly, runFullWorkflow, runPushOnly, runInitOnly }= require("./workflow");
const inquirer= require("inquirer").default;

function handleAction(action){
    return async (...args) =>{
        try{
            await action(...args);
        }catch(err){
            const logger= require("../utils/logger");
            logger.error(err.message);
            process.exit(1);
        }
    }
}


async function askQuestions(){
    return inquirer.prompt([
        {
            type:"input",
            name:"message",
            message:"Enter commit message:",
            validate: (input) => {
                if(!input.trim()){
                    return "Commit message can not be empty";
                }
                return true;
            }
        },
        {
            type:"confirm",
            name:"private",
            message:"Make repository private?",
            default:false
        }
    ]);
}


function startParser(){
    const program= new Command();

    program
    .name("mygit")
    .description("Github Automation CLI")
    .version("1.0.0");


    //!Default Command (Full work flow)
    program
    .argument("[message]")
    .option("--private", "Create private repository")
    .action(handleAction(async (msg, options) => {

        let isPrivate = options.private || false;

        if (!msg || !msg.trim()) {
            const answers = await askQuestions();
            msg = answers.message;
            isPrivate = answers.private;
        }

        // Clean message
        msg = msg.trim().replace(/^["']|["']$/g, "");

        await runFullWorkflow({
            message: msg,
            private: isPrivate
        });

    }));



    //!Commit Only
    program
    .command("commit [message] [files...]")
    .action(handleAction(
        async (msg, files) => {
            const isFile= msg && msg.includes(".");
            if(!msg || isFile){
                const answers= await askQuestions();
                if(isFile){
                    files= [msg, ...files];
                }
                msg= answers.message;
            }

            msg= msg.trim().replace(/^["']|["']$/g, ""); // Remove surrounding quotes if any
            await runCommitOnly({
                message: msg,
                files: files || []
            });
        }
    ));



    //! Push Only
    program
    .command("push")
    .action(handleAction(async () => {
        await runPushOnly();
    }));



    //! Init Only
    program
    .command("init")
    .option("--private", "Create a private repo")
    .action(handleAction(
        async (options) =>{
            await runInitOnly({
                private: options.private || false
            });
        }
    ));

    program.parse(process.argv);

}



module.exports= startParser;