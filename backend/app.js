const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());





///////////////hadhi bch torbot el bd//////////////////////
const db = new sqlite3.Database('../database.db');
//////////////////////////////////////////////////////////





/////////////////////////hadhi kifach nzidou user lel bd/////////////////////////////
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        function(err){
            if(err){
                if(err.message.includes('UNIQUE constraint failed'))
                    return res.status(409).json({error: 'Email or username already used !'});
            }
            res.status(201).json({ message: 'User registered successfully' })
        }
    );
});
//////////////////////////////////////////////////////////////////////////////////////





//////////////////////hadhi bch  ythabet fl login idha kanah l email w pswd mawjoudin w s7a7//////////////////////////////
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) 
            return res.status(500).json({ message: 'Server error, please try again.' });
        if (!row)
            return res.status(400).json({ message: 'Invalid credentials' });
        if(password != row.password)
            return res.status(400).json({ message: 'wrong password !'});

        res.status(200).json({ message : 'Login successful!' , username : row.username} );
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////hadhi kifach nzidou post lel bd////////////////////////////////////////
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    const date = new Date().toISOString();
  
    db.run(
      'INSERT INTO posts (title, content, author, date) VALUES (?, ?, ?, ?)',
      [title, content, author, date],
      res.status(201).json({ message : 'post added successfully !'})
    );
  });
///////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////hadhi bach ybda server ye5dem 3l port mta3na//////////////////////////////
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
///////////////////////////////////////////////////////////////////////////////////////////////////





///////////////hadhi kifach nejbdou l posts elli mawjoudin fl bd lkol////////////
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
//////////////////////////////////////////////////////////////////////////////////





////////////////hadhi kifach tzzid cmntr fl bd//////////////////////////////////////
app.post('/api/posts/:postID/comments', ( req , res ) => {
    const{author , content }=req.body;
    const postId = req.params.postID;
    const date = new Date().toISOString();
    db.run(
        'insert into comments (postId,author,content,date) values( ? , ? , ? , ?)',
        [postId,author,content,date],
        res.status(201).json({ message : 'comment addeed successfully !'})
    );
});
//////////////////////////////////////////////////////////////////////////////////





///////////////hadhiii kifach nejbdou l commentaraite elli mawjoudin fl bd////////////////////////
app.get('/api/posts/:postID/comments' , ( req , res ) => {
    const postId = req.params.postID;
    db.all('select * from comments where postId = ? ' , [postId] , ( err , rows ) =>{
        if(err) {
            res.status(500).json({ message : 'something went wrong ! '});
            return;
        }
        res.json(rows);
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////////
