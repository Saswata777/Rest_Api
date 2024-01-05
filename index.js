const express = require('express');
const app = express();
const users = require('./MOCK_DATA.json');
const fs = require('fs');
const { Console } = require('console');
app.get('/user', (req, res) => {
    const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `
    res.send(html);
})


app.use((req, res, next)=>{
    console.log("Hello, Middleware 1");
    console.log("Time = ",Date.now());
    req.name = "Saswata";
    // res.send("Hello, Middleware 1");
    next();
})

app.use((req, res, next)=>{
    console.log("Hello, Middleware 2", req.name);
    // res.send("Hello, Middleware 2");
    next();
})
app.use((req, res,next)=>{
    fs.appendFile("log.txt", `${Date.now()}: ${req.method} : ${req.path}\n`, (err, data)=>{
        res.send("File created");
    })
})
// REST API
app.get('/api/user', (req, res) => {
    return res.json(users);
})

// Middleware
app.use(express.urlencoded({ extended: false }));

app
    .route('/api/user/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((users) => users.id === id);
        return res.json(user);
    }
    )
    .patch((req, res) => {
        const id = Number(req.params.id);
        const updatedFirstName = req.body.first_name;

        fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
            if (err){
                return res.status(500).json({ status: 'Error reading file' });
            }
            let updatedUsers = JSON.parse(data);
            const userToUpdate = updatedUsers.find((user) => user.id === id);
            if (userToUpdate) {
                userToUpdate.first_name = updatedFirstName;
                fs.writeFile('./MOCK_DATA.json', JSON.stringify(updatedUsers, null, 2), 'utf8', (err) => {
                    if (err) {
                        return res.status(500).json({ status: 'Error writing to file' });
                    }
                    return res.json({ status: 'Success', id: id });
                });
            } else {
                return res.status(404).json({ status: 'User not found' });
            }
        });
    })
    .post((req, res) => {
        // return res.json({status:"Pending"});
        const body = req.body;
        // console.log(body);
        users.push({ ...body, id: users.length + 1 });
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.json({ status: "Success", id: users.length });
        })
    })
    .delete((req, res) => {
        const id = Number(req.params.id);

        fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ status: 'Error reading file' });
            }

            let updatedUsers = JSON.parse(data);

            // Find the index of the user with the specified ID
            const userIndex = updatedUsers.findIndex((user) => user.id === id);

            // If the user is found, remove it from the array
            if (userIndex !== -1) {
                updatedUsers.splice(userIndex, 1);

                // Write the updated data back to the file
                fs.writeFile('./MOCK_DATA.json', JSON.stringify(updatedUsers, null, 2), 'utf8', (err) => {
                    if (err) {
                        return res.status(500).json({ status: 'Error writing to file' });
                    }

                    return res.json({ status: 'Success', id: id });
                });
            } else {
                return res.status(404).json({ status: 'User not found' });
            }
        });
    });




app.post('/api/user', (req, res) => {
    // Create New Users

})


app.patch('/api/user/:id', (req, res) => {
    // Edit the user with id

})

app.delete('/api/user/:id', (req, res) => {
    // Delete the specific id 

})



const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})