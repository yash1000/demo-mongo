
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwtToken = require('./helper/jwtToken');
const { adminTokenAuth, managerTokenAuth } = require('./helper/middleware');
const { successResponseData, successResponseWithoutData } = require('./helper/Response');
const { Role } = require('./schema/roles');
const { User } = require('./schema/users');
const app = express();
const PORT = 3000;
app.use(bodyParser());

mongoose.connect("mongodb://localhost:27017/demo");
  
app.get('/hello', (req, res)=>{
});
app.post('/create-user', (req, res)=>{
       User.insertMany([
        {
            email: "manager@gmail.com",
            role: "manager",
            name: "manager",
            password:"manager"
        },
        {
            email: "admin@gmail.com",
            name: "admin",
            role: "admin",
            password:"admin"
        },
        {
            email: "employee@gmail.com",
            role: "employee",
            name: "employee",
            password:"employee"
        }
       ])
       Role.insertMany([{
        name:"manager"
       },{
        name:"employee"
       },{
        name:"admin"
       }])
       return successResponseWithoutData(
        res,
        'success'
      )
});
app.post('/role/create', adminTokenAuth, (req,res) => {
    const roleName = req.body.role
    const role = new Role({
        name: roleName,
       });
       role.save()
       return successResponseWithoutData(
        res,
        'success'
      )
})

app.post('/role/access', adminTokenAuth, async (req,res) => {
    const roleName = req.body.role
    const roleNameAccess = req.body.roleAccess
    await Role.updateOne({
        role: roleName,
    },{
        $push: { accessibility: roleNameAccess }
    })
       return successResponseWithoutData(
        res,
        'success'
      )
})
  
app.post('/login', async (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({
        email: email,
        password: password
    })
    if(user) {
        const meta = {
            token: jwtToken.issue(user.id),
          }
          return successResponseData(
            res,
            meta,
            1,
          )
    }
})

app.post('/test/manager',managerTokenAuth, async (req,res) => {
          return successResponseData(
            res,
            "success",
            1,
          )
})
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);