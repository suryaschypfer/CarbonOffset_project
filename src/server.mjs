import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bodyParser from 'body-parser'; // Add this line to parse JSON request bodies
import nodemailer from 'nodemailer';
import crypto from 'crypto';


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;
const dbConfig = {
    HOST: '127.0.0.1',
    USER: 'root',
    PASSWORD: 'Vamsi@9490437848',
    DB: 'Offset_Carbon',
};

// Create a MySQL connection
const mysqlConnection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('Connected to MySQL');
    } else {
        console.error('Connection to MySQL failed:', err);
    }
});

// Define a route to handle admin login
app.post('/api/admin/login', cors(), (req, res) => {
    const { email, password } = req.body;

    // Replace this with your actual query to check the credentials
    const sql = `SELECT * FROM CRBN.admin WHERE email = ? AND password = ?`;
    mysqlConnection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            // Authentication successful
            return res.status(200).json({ message: 'Login successful' });
        } else {
            // Authentication failed
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Define a route to retrieve questions from the database
app.get('/api/questions', cors(),(req, res) => {
    const sql = 'SELECT * FROM Offset_Carbon.Questions_Table';

    // Execute the SQL query using the MySQL connection
    mysqlConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error.message);
            res.status(500).json({ error: 'Error retrieving questions from the database' });
            return;
        }

        // Send the retrieved questions as a JSON response
        res.json(results);
    });
});


app.get('/api/questions/:id', cors(), async (req, res) => {
    try {
        const questionId = req.params.id;  // Get the ID from the route parameter
        const [results] = await mysqlConnection.promise().query("SELECT * FROM Offset_Carbon.Questions_Table WHERE ques_id = ?", [questionId]);
        if (results.length > 0) {
            res.json(results[0]); // Send back the specific question
        } else {
            res.status(404).send('Question not found');
        }
    } catch (error) {
        console.error('Error fetching specific question:', error);
        res.status(500).send('Server error');
    }
});
// API for random fact fetching
app.get('/api/randomfact', async (req, res) => {
    try {
        const [rows, fields] = await mysqlConnection.promise().query("SELECT fact FROM Offset_Carbon.facts ORDER BY RAND() LIMIT 1;");
        
        if (rows && rows.length > 0) {
            return res.json(rows[0]);
        } else {
            return res.status(404).json({ message: "No fact found" });
        }
    } catch (error) {
        console.error("Error fetching random fact:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
// Route to calculate total number of qustions to display progress bar percentage in each question page
app.get('/api/totalquestions', cors(), async (req, res) => {
    try {
        const [results] = await mysqlConnection.promise().query("SELECT COUNT(*) as total FROM Offset_Carbon.Questions_Table");
        if (results.length > 0) {
            res.json(results[0].total);
        } else {
            res.status(404).send('No questions found');
        }
    } catch (error) {
        console.error('Error fetching total number of questions:', error);
        res.status(500).send('Server error');
    }
});


// Define a route to retrieve utility data based on the zipcode
app.get('/api/utility/:zipcode', cors(), (req, res) => {
    const zipcode = req.params.zipcode; // Extract zipcode from the request parameters

    // SQL query to fetch utility data for the given zipcode
    const sql = 'SELECT * FROM Offset_Carbon.Utility WHERE Zipcode = ?';

    // Execute the SQL query using the MySQL connection
    mysqlConnection.query(sql, [zipcode], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error.message);
            res.status(500).json({ error: 'Error retrieving utility data from the database' });
            return;
        }

        // If results are found, return them, otherwise, return a 404 with an error message
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Utility not found for the given zipcode' });
        }
    });
});





// Middleware for parsing JSON request body
app.use(express.json());

// Define a route to handle the toggle state update
app.post('/api/updateToggleState', (req, res) => {
    const { questionId, newState } = req.body;
    const sql = "UPDATE CRBN.questions SET question_flag = ? WHERE ques_id = ?;";
  
    // Execute the SQL query using the MySQL connection
    mysqlConnection.query(sql, [newState, questionId], (error, results) => {
      if (error) {
        console.error('Error executing SQL query:', error.message);
        res.status(500).json({ error: 'Error updating toggle state in the database' });
        return;
      }
      res.json({ message: 'Toggle state updated successfully' });
    });
  });

   

// Route to handle "Forgot Password" request
app.post('/api/forgotpassword', cors(), async (req, res) => {
    const { email } = req.body;
    // Check if the email exists in the 'admin' table
    const sql = `SELECT * FROM admin WHERE email = ?`;
    try {
        const [user] = await mysqlConnection.promise().query(sql, [email]);

        if (!user || user.length === 0) {
            // Email not found in the 'admin' table
            return res.status(404).json({ error: 'Email not found' });
        }

        // Generate a password reset token
        const resetToken = generateResetToken();

        // Store the reset token in the database along with the email (for validation)
        const updateTokenSql = `UPDATE admin SET reset_token = ? WHERE email = ?`;
        await mysqlConnection.promise().query(updateTokenSql, [resetToken, email]);

        // Send a password reset email with a link to a reset page
        const resetLink = `http://example.com/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(email, resetLink);

        return res.status(200).json({ message: 'Password reset email sent. Check your inbox.' });
    }
    catch (error) {
        console.error('Error processing password reset:', error);
        return res.status(500).json({ error: 'Error resetting password. Please try again later.' });
    }
});

// Helper function to generate a random reset token
function generateResetToken() {
    // Generate a random 32-character token
    return crypto.randomBytes(16).toString('hex');
}

// Helper function to send a password reset email
async function sendPasswordResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email service provider
        auth: {
            user: 'carbonoffset08@gmail.com', // Replace with your email address
            pass: 'vjbv uaeq cpro lsub', // Replace with your email password
        },
    });
    const mailOptions = {
        from: 'carbonoffset08@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
}
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
