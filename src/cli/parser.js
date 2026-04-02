const {Command}= require("commander");
const runWorkflow= require("./workflow");
const inquirer= require("inquirer").default;

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



    program
    .command("commit [message]")
    .option("--private", "Create private repository")
    .action(
        async (msg, options)=>{
            try{
                let isPrivate= options.private || false;

                if(!msg || !msg.trim()){
                    const answers= await askQuestions();
                    msg= answers.message;
                    isPrivate= answers.private;
                }
                const workflowOptions={
                    message: msg,
                    private: isPrivate
                };

                await runWorkflow(workflowOptions);
            }catch(err){
                console.error("Error:", err.message);
                process.exit(1);
            }
        }
    );

    program.parse(process.argv);

}



module.exports= startParser;