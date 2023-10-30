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
    PASSWORD: "",
    DB: "Offset_Carbon"
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

// Define a route to retrieve questions with a specific flag from the database
app.get('/api/questions', cors(),(req, res) => {
    const sql = 'SELECT * FROM Offset_Carbon.Questions_Table WHERE question_flag = 1 ORDER BY label, ques_id';

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

app.post('/api/ContactUs', cors(), (req, res) => {
    const { email, query, firstName, lastName } = req.body;

    // 1) Adding query to the Enquiry table
    const insertEnquirySql = 'INSERT INTO CarbnOffset.Enquiry (enquiry_question, enquiry_flag) VALUES (?, ?)';
    mysqlConnection.query(insertEnquirySql, [query, 1], (err, result) => {
        if (err) {
            console.error('Error inserting into Enquiry table:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const enquiryId = result.insertId;

        // 2) Inserting a new entry into the Customer table
        const insertCustomerSql = `INSERT INTO CarbnOffset.Customer (date_answered, session_id, first_name, last_name, email, total_carbon_footprint, answers, number_of_trees, enquiry_id) 
        VALUES (CURDATE(), "N/A", ?, ?, ?, 0, "N/A", 0, ?)`;
        mysqlConnection.query(insertCustomerSql, [firstName, lastName, email, enquiryId], (err, insertResult) => {
            if (err) {
                console.error('Error inserting into Customer table:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            return res.status(200).json({ message: 'Enquiry and Customer added successfully' });
        });
    });
});

// API for random fact fetching
app.get('/api/randomfact/:index', async (req, res) => {
    try {
        const questionIndex = req.params.index;
        const [rows] = await mysqlConnection.promise().query("SELECT fact FROM Offset_Carbon.facts ORDER BY RAND() LIMIT 1;");
        // console.log(rows);  // log the entire result

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
        const [results] = await mysqlConnection.promise().query("SELECT COUNT(*) as total FROM Offset_Carbon.Questions_Table Where question_flag=1");
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

// Accept user answers, calculate, and return carbon footprint and trees required
app.post('/api/calculateFootprint', cors(), async (req, res) => {
    const answers = req.body; // Array or object containing question IDs and user answers
    console.log("Received answers:", answers);

    let totalCarbonFootprint = 0;
    
    try {
        for (let answer of answers) {
            const ques_id = answer.ques_id;
            const userValue = answer.value; 
            console.log("Querying for ques_id:", ques_id);

            
            // Fetch ref (constant or formula) for the question
            const [results] = await mysqlConnection.promise().query("SELECT refs FROM Offset_Carbon.Questions_Table WHERE ques_id = ?", [ques_id]);
            if(results.length === 0) {
                console.error(`No data found for ques_id: ${ques_id}`);
                continue;  // Skip the rest of this iteration and proceed to next ques_id in the loop
            }
            console.log("Results from database:", results);
            const refValue = parseFloat(results[0].refs);

            // Calculate carbon footprint for this answer
            const carbonValue = refValue * userValue; // Modify this line if refs stores complex data

            totalCarbonFootprint += Math.ceil(carbonValue);
        }

        const CO2_PER_TREE_PER_YEAR = 48;
        const totalTreesRequired = Math.ceil(totalCarbonFootprint / CO2_PER_TREE_PER_YEAR);

        res.json({
            carbonFootprint: totalCarbonFootprint,
            numberOfTrees: totalTreesRequired
        });
    } catch (error) {
        console.error("Error calculating values:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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

