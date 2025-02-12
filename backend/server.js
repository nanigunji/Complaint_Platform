const exp=require('express')
const app=exp()
require('dotenv').config()
const path=require('path')

//deploy react build to this server
app.use(exp.static(path.join(__dirname,'../frontend/build')))

app.use(exp.json())

const mc=require('mongodb').MongoClient

mc.connect('mongodb://localhost:27017')
.then(client=>{
    const dbObj=client.db('complaintsdb')
    const complaintsCollectionObj=dbObj.collection('complaintsCollection')
    app.set('complaintsCollectionObj',complaintsCollectionObj)
    console.log('DB connection success')
  })
  .catch(err=>{
    console.log("DB connection error: ",err)
  })

const userApp=require('./APIs/user-api')
const adminApp = require('./APIs/admin-api')

app.use('/user-api',userApp)
app.use('/admin-api',adminApp)

app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})
//express error handler
app.use((err,req,res,next)=>{
  res.send({message:"error",payload:err.message})
  console.log(err)
})

const port=process.env.PORT || 5000
//assign port number
app.listen(port,()=>console.log(`Web server running on port ${port}`))