const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());





const db = new sqlite3.Database('../database.db');






app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        function(err){
            if(err){
                if(err.message.includes('UNIQUE constraint failed'))
                    return res.status(409).json({message: 'Email or username already used !'});
            }
            res.status(201).json({ message: 'User registered successfully' })
        }
    );
});
//////////////////////////////////////////////////////////////////////////////////////




 
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) 
            return res.status(500).json({ message: 'Server error, please try again.' });
        if (!row)
            return res.status(400).json({ message: 'Invalid credentials' });
        if(password != row.password)
            return res.status(400).json({ message: 'Wrong password !'});
        if(email != row.email)
            return res.status(400).json({ message: 'Wrong email !'});

        res.status(200).json({ message : 'Login successful!' , username : row.username} );
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





app.post('/api/posts', (req, res) => {
    const { title, content, author ,category} = req.body;
    const date = new Date().toISOString();
    if (!title || !content || !author || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    db.run(
      'INSERT INTO posts (title, content, author, date, category) VALUES (?, ?, ?, ?,?)',
      [title, content, author, date, category],
        res.status(201).json({ message : 'post added successfully !'})
    );
  });
///////////////////////////////////////////////////////////////////////////////////////////////


app.delete('/api/posts/:postID', (req, res) => {
    const postId = req.params.postID;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run('DELETE FROM comments WHERE postId = ?', [postId], function(err) {
            if (err) {
                db.run('ROLLBACK');
                console.error("Error deleting comments:", err);
                return res.status(500).json({ message: 'Failed to delete comments' });
            }

            db.run('DELETE FROM posts WHERE postID = ?', [postId], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error("Error deleting post:", err);
                    return res.status(500).json({ message: 'Failed to delete post' });
                }

                if (this.changes === 0) {
                    db.run('ROLLBACK');
                    return res.status(404).json({ message: 'Post not found' });
                }

                db.run('COMMIT');
                res.json({ 
                    message: 'Post and comments deleted successfully',
                    deletedPostId: postId
                });
            });
        });
    });
});

app.delete('/api/comments/:id', (req, res) => {
    const commentId = req.params.id;
    
    db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
        if (err) {
            console.error("Error deleting comment:", err);
            return res.status(500).json({ message: 'Failed to delete comment' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        res.json({ message: 'Comment deleted successfully' });
    });
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
///////////////////////////////////////////////////////////////////////////////////////////////////





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
