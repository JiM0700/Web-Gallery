const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path') 
const router = new express.Router()

const node = express();
node.use(cors());
node.use(bodyparser.json());
node.use(express.json());
node.use(bodyparser.urlencoded({require:true}));
node.use(express.static('./public'));
node.use('/storage',express.static("./storage"));

const link = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'Janaki12',
    database:'web_gallery'
})

link.connect(function(error){
    if(error) return console.log(error);
    return console.log("Connection Successfull");
})

//STORE IMAGE
var storage = multer.diskStorage({
    destination:(request,file,callback)=>{
        callback(null,'./storage')
    },
    filename:(request,file,callback)=>{
        callback(null,`image_${Date.now()}.${file.originalname}`)
    }
})

var upload = multer({
    storage:storage
})

//ADD IMAGE
node.post('/addimg',upload.single("photo"),(request,response)=>{
    const {filename} = request.file;
    const {description} = request.body;
    try{

        link.query("INSERT INTO gallery SET ?",{image:filename,description:description},(error,result)=>{
            if(error) return console.log(error)
            else {
        console.log("Image Added")
        response.status(200).json({status:200,data:request.body})
        }
    })
    } catch(error){
        response.status(500).json({status:500,error})
    }
})

//FETCH IMAGE
node.get('/getimg',(request,response)=>{
    try{
        link.query("SELECT * FROM gallery",(error,result)=>{
            if(error) return console.log(error)
            else{
                // console.log("Success")
                response.send(result)
            }
        })

    } catch(error) {
        response.status(500).json({status:500,error})
    }

})

//DELETE IMAGE

node.delete('/dltimg/:id',(request,response)=>{
    let {id} = request.params
    link.query("DELETE FROM gallery WHERE id = ? ",id,(error,result)=>{
        if(error) return response.send(error); console.log("Image Deleted");
        return response.send(result)
    })
})

node.listen(3012,()=> console.log("Running on Port 3012"))