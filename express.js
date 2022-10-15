const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

console.log(path.join(__dirname+'/website/index.html'));
const staticpath =path.join(__dirname+'/website/index.html')

app.use(express.static(staticpath));

app.get("/",(req,res)=>{
 res.sendFile(staticpath);
})


app.listen(port,()=>{
    console.log( `server is running perfectly on port ${port}`)
})