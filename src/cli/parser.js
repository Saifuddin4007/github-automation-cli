const {Command}= require("commander");
const runWorkFlow= require("./workflow");

function startParser(){
    const program= new Command();

    program
    .name("mygit")
    .description("Github Automation CLI")
    .version("1.0.0");



    program
    .argument("<message>", "Commit Message")
    .option("--private", "Create private repository")
    .action(
        async (msg, options)=>{
            const workflowOptions={
                message: msg,
                private: options.private || false
            };

            await runWorkFlow(workflowOptions);
        }
    );

    program.parse(process.argv);

}

module.exports= startParser;