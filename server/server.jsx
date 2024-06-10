// server.jsx
require('dotenv').config();
const { v4: uuidv4} = require('uuid')
const express = require('express');
const pool = require('./db.jsx')
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 4000;


app.use(cors())
app.use(express.json()) // Middleware to parse JSON


// Create a pool instance and configure it
/*const pool = new Pool({
    user: 'moneysingh',
    host: 'localhost',
    database: 'todoapp',
    password: '1234',
    port: 5432,
});
*/
// Middleware to parse JSON
//app.use(express.json());

// Route to get all todos
//I faced issue not getting an object output because i leave a extra space after the userEmail.
app.get('/todos/:useremail', async (req, res) => {
    //check wheather the particular email user is present or not
    const useremail = req.params.useremail;
    //console.log(userEmail);
    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [useremail]); //$1 indicate the first item we put in our array.
        res.json(todos.rows);
    } catch (err) {
        console.error(err.message);
        //res.status(500).send('Server error');
    }
});

// Default route to handle other requests
app.get('/', (req, res) => {
    res.send('Welcome to the Todo App!');
});


//create a new todo

app.post('/todos', async(req, res) => {
    const {user_email, title, progress, date} = req.body
    ///console.log(user_email, title, progress, date)
    const id = uuidv4()

    try{
        const newToDo = await pool.query("INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)",
            [id, user_email, title, progress, date])
        res.json(newToDo)

    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Bad Request'})
    }
})

//edit a new todo

app.put('/todos/:id', async(req, res) => {
    const { id } = req.params
    const {user_email, title, progress, date} = req.body
    try {
        const editToDo = 
            await pool.query("UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5", 
            [user_email, title, progress, date, id])
        res.json(editToDo.rows)
    } catch(err) {
        console.error(err)
    }
});

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try{
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
        res.json("Delete data successfully")
    } catch (err) {
        console.error(err)
    }
})


//signup
app.post("/signup",async(req,res)=>{
    const {email,password}=req.body;
    const salt = bcrypt.genSaltSync(10)
    const hashedpassword =bcrypt.hashSync(password,salt);
    try {
        const usersignup = await pool.query(`INSERT INTO users(email,hashed_password) VALUES($1,$2)`,[email,hashedpassword]);
        const token = jwt.sign({email},'secret',{expiresIn:'1hr'})
        res.json({email,token});        
    } catch (error) {
      console.log(error);  
    }
})



// login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const users = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
        if(!users.rows.length) return res.json({detail:"User does not exist"});
        const success = await bcrypt.compare(password,users.rows[0].hashed_password);
        const token = jwt.sign({email},'secret',{expiresIn:'1hr'})
        if(success){
            res.json({"email":users.rows[0].email,token})
        }
        else{
            res.json({detail:"Login Failed"});
        }
    } catch (error) {
        console.log(error);
    }
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});