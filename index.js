const yargs=require('yargs');
const {hideBin}=require('yargs/helpers');  //to read commands with spaces in them, like "node index.js add --title='My Title' --body='My Body'"
const {initRepo}=require('./controllers/init');
const {addFiles}=require('./controllers/add');
const {commitChanges}=require('./controllers/commit');
const {pushChanges}=require('./controllers/push');
const {pullChanges}=require('./controllers/pull');
const {revertChanges}=require('./controllers/revert');


yargs(hideBin(process.argv))           //reads the commands and extracts the arguments
.command("init","Initialize new repository",{},initRepo)
.command("add <file>","Add a new file to repository",(yargs)=>{yargs.positional("file",{
    describe:"Name of the file to be added",
    type:"string",
    demandOption:true
})},
(argv)=>addFiles(argv.file))
.command("commit <message>","Commit changes to the repository",(yargs)=>{yargs.positional("message",{
    describe:"Commit message",
    type:"string",
    demandOption:true
})},(argv)=>commitChanges(argv.message))
.command("push","Push changes to remote repository",{},pushChanges)
.command("pull","Pull changes from remote repository",{},pullChanges)
.command("revert <commit>","Revert to a previous commit",(yargs)=>{yargs.positional("commit",{
    describe:"Commit hash to revert to",
    type:"string",
    demandOption:true
})},revertChanges)
.demandCommand(1,"Please provide a valid command") //ensures that at least one command is provided, otherwise shows the message
.help()  //to show the help message when the user types "node index.js --help"
.argv;   //to parse the arguments and execute the command