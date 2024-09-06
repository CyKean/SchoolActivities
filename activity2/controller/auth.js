const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('db.db');

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAt = new Date().toISOString();

    const query = `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)`;
    db.run(query, [username, email, hashedPassword, createdAt], function (err) {
        if (err) {
            return res.render('auth/signup', { notification: err.message });
        }

        req.session.user = { id: this.lastID, username, email };
        res.render('auth/signup', { notification: 'User registered successfully!' });
    });
}

const signIn  = async (req, res) => {
    const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.render('auth/signin', { notification: err.message });
    }

    if (!user) {
      return res.render('auth/signin', { notification: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('auth/signin', { notification: 'Invalid password' });
    }
    req.session.user = { id: user.id, username: user.username, email: user.email }
    res.render('auth/signin', { notification: 'Login successful!' });
  });
}

const addAbout = (req, res) => {
    const userId = req.session.user.id;
    const { content } = req.body;

    const query = `INSERT INTO about (user_id, content) VALUES (?, ?)`;
    db.run(query, [userId, content], function(err) {
        if (err) {
            return res.render('client/about/addAbout', { notification: err.message, user: req.session.user });
        }
        res.redirect('/about');
    });
};

const editAbout = (req, res) => {
    const userId = req.session.user.id;
    const { content } = req.body;

    const query = `UPDATE about SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`;
    db.run(query, [content, userId], function(err) {
        if (err) {
            return res.render('client/about/editAbout', { notification: err.message, user: req.session.user });
        }
        res.redirect('/about');
    });
};

const deleteAbout = (req, res) => {
    const userId = req.session.user.id;

    if (!userId) {
        return res.redirect('/signin');
    }

    // Assuming `user_id` is the foreign key in the `about` table
    const query = `DELETE FROM about WHERE user_id = ?`;
    
    db.run(query, [userId], function(err) {
        if (err) {
            console.error('Database error:', err.message);  // Log the error
            return res.render('client/about', { notification: err.message, user: req.session.user });
        }
        res.redirect('/about');
    });
};

const editProfile = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.session.user.id;

    if (!userId) {
        return res.redirect('/signin');
    }

    let fieldsToUpdate = [];
    let values = [];

    if (username) {
        fieldsToUpdate.push('username = ?');
        values.push(username);
    }
    
    if (email) {
        fieldsToUpdate.push('email = ?');
        values.push(email);
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fieldsToUpdate.push('password = ?');
        values.push(hashedPassword);
    }

    if (fieldsToUpdate.length === 0) {
        return res.render('client/profile/editProfile', { notification: 'No fields to update' });
    }

    values.push(userId);

    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

    db.run(query, values, function (err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.render('client/profile/editProfile', { notification: 'Failed to update user info' });
        }

        if (username) req.session.user.username = username;
        if (email) req.session.user.email = email;

        res.redirect('/profile'); 
    });
}

const deleteProfile = (req, res) => {
    const userId = req.session.user.id;

    if (!userId) {
        return res.redirect('/signin');
    }

    const query = `DELETE FROM users WHERE id = ?`;
    db.run(query, [userId], (err) => {
    if (err) {
        return res.render('error', { message: 'Failed to delete user' });
    }
    req.session.destroy(); // End the session
    res.redirect('/signin');
  });
}

module.exports = {
    signIn,
    signUp,
    addAbout,
    editAbout,
    deleteAbout,
    editProfile,
    deleteProfile,
}