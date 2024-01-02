const express = require('express');
const app = express();
const users = require('./MOCK_DATA.json');
app.get('/user', (req, res)=>{
    const html = `
        <ul>
            ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
        </ul>
    `
    res.send(html);
})


// REST API
app.get('/api/user',(req,res)=>{
    return res.json(users);
})

app
.route('/api/user/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((users)=> users.id === id);
    return res.json(user);}
    )
.patch((req,res)=>{
    // Edit with id
    return res.json({status:"Pending"});
})
.post((req, res)=>{
    return res.json({status:"Pending"});
})
.delete((req, res)=>{
    return res.json({status:"Pending"});
})



app.post('/api/user',(req,res)=>{
    // Create New Users

})


app.patch('/api/user/:id',(req,res)=>{
    // Edit the user with id
    
})

app.delete('/api/user/:id',(req,res)=>{
    // Delete the specific id 
    
})



const port = 8000;
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})