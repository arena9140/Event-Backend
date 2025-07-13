const express = require('express');
const app = express();
const { config } = require('dotenv')
const DBconnection = require('./config/db.js')
const AdminRoutes = require('./routes/AdminRoutes.js')
const Tournament = require('./routes/TournamentRoutes.js')
const PlayerAuthRoute = require("./routes/PlayerRoutes/AuthPlayerRoute.js")
const PlayerMatchaccess = require("./routes/PlayerRoutes/TounamentAccessRoute.js")
const cors = require("cors")

config();
DBconnection();
app.use(cors())
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hello")
})
app.use("/api/admin",AdminRoutes)
app.use("/api/tournaments", Tournament);
app.use("/api/playerauth", PlayerAuthRoute);
app.use("/api/match", PlayerMatchaccess);

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`server runniing on ${PORT}`); 
})