require('dotenv').config();
var express = require('express')
var app = express()
app.use(express.json());
app.listen(3000);
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const cors = require('cors');
app.use(cors())
app.get("/",(req,res)=>
{
    res.send('welcome')
}
)
const value = require('./mongoose')
app.use(express.json())
app.get("/login",async (req,res)=>
{
    try{
        const values = await value.findOne({mail:req.body.mail})
        if(values)
        {
            console.log(values.pass);
            console.log(req.body.pass);
            console.log(await bcrypt.compare(req.body.pass,values.pass))
            if(await bcrypt.compare(req.body.pass,values.pass)==true)
            {console.log("Password is correct")}
            else
            {console.log("Incorrect password")}
            
        }
        else
        console.log("user  not exists");
        res.json(values)

    }
    catch(err)
    {
        (res.send(err))
    }
}
)
app.post("/register",async (req,res)=>
{
    const values = new value({
        name:req.body.name,
        mail:req.body.mail,
        pass:req.body.pass

    })    
        
    try{
        const oneuser = values
        const token = process.env.JWT_KEY
        console.log(token)
        const accessToken = jwt.sign({oneuser},token)
     console.log("PPPP")
     const salt = await bcrypt.genSalt(10)
     const new_pass = await bcrypt.hashSync(req.body.pass,salt)
    //  const bearerHeader = req.headers["authorization"];
    //    bearerHeader.value = "Bearer"+" "+{accessToken}
     //console.log(new_pass)
     values.pass=new_pass
     await values.save()
  //res.json({accessToken:accessToken})
   res.json(values)
     //res.json(accessToken)
     //res.send(accessToken)
     //res.send("ded")
    }
    catch(err)
    {
        res.send(err)
    }
}
)
app.get("/protected",authentication,(req,res)=>
{
    jwt.verify(req.accessToken,process.env.JWT_KEY, function(err, data){
        if(err)
        res.sendStatus(403)
        else
        {res.json({text:"This is the protected page",data:data })
        
    }
    })
   

})
function authentication(req,res,next) 
{
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !='undefined')
    {
        const bearer = bearerHeader.split(" ");
        const bearertoken = bearer[1];
        req.accessToken = bearertoken;
        next();
    }
    else
    res.sendStatus(403);

}