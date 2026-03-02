const express=require('express');   
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const http=require('http');
const { Server } = require('socket.io');
const mainRouter=require('./routes/main.router');
dotenv.config();

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
.command("start", "Start backend server", {}, startServer)
.demandCommand(1,"Please provide a valid command") //ensures that at least one command is provided, otherwise shows the message
.help()  //to show the help message when the user types "node index.js --help"
.argv;   //to parse the arguments and execute the command


function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("Unable to connect : ", err));

  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });


  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}