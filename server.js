const express = require("express");
const app = express();
const registerUser = require("./route/userRoute");
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const PORT = 5000;

app.use(express.json());

app.use("/auth", registerUser);

app.get('/api', () =>{
console.log('api accessed')
})

app.listen(PORT , () => {
  console.log("Server started!");
});
