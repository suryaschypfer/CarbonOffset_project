import express from "express";
import cors from "cors";
import mysql from "mysql2";
import mysql1 from "mysql2/promise";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import multer from "multer";
import csvParser from "csv-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;
const codeport = 5173;

const storage = multer.memoryStorage();
const upload = multer();

const csvParserOptions = {
  mapHeaders: ({ header, index }) => header.trim(),
};

const hostmain = "18.222.248.198";

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "Sahil@123456", // Fix the case of 'PASSWORD' to 'password'
  database: "CRBN", // Fix the case of 'DB' to 'database'
};

// const dbConfig = {
//   host: "127.0.0.1",
//   user: "root",
//   password: "Sahil@123456", // Fix the case of 'PASSWORD' to 'password'
//   database: "CRBN", // Fix the case of 'DB' to 'database'
// };

// const port = 3001;

// Create a MySQL connection
const mysqlConnection = mysql.createConnection(dbConfig);

const pool = mysql1.createPool(dbConfig);
let multiplyingFactor = 0;
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected to MySQL");
  } else {
    console.error("Connection to MySQL failed:", err);
  }
});

app.post("/api/insertCustomerData", cors(), (req, res) => {
  const { zipcode, finalFootprint, finalTrees, age } = req.body;

  const insertQuery =
    "INSERT INTO CRBN.Customer (total_carbon_footprint, number_of_trees, zipcode, age, date_answered) VALUES (?, ?, ?, ?, CURDATE())";

  mysqlConnection.query(
    insertQuery,
    [finalFootprint, finalTrees, zipcode, age],
    (error, results) => {
      if (error) {
        console.error("Error inserting data into customer table:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        console.log("Data inserted into customer table successfully:", results);
        res.status(200).json({ message: "Data inserted successfully" });
      }
    }
  );
});

app.get("/api/Customer", cors(), (req, res) => {
  const query =
    "SELECT cust_id, age, total_carbon_footprint, number_of_trees, date_answered, zipcode FROM CRBN.Customer";
  mysqlConnection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
let connection;

app.get("/api/filterCustomer", cors(), (req, res) => {
  const {
    fromDate,
    toDate,
    zipcode,
    carbonComparison,
    carbonFootprintFilter,
    treesComparison,
    treesFilter,
  } = req.query;
  let query =
    "SELECT cust_id, age, total_carbon_footprint, number_of_trees, date_answered, zipcode FROM CRBN.Customer";

  if (
    fromDate &&
    toDate &&
    zipcode &&
    carbonComparison &&
    carbonFootprintFilter &&
    treesComparison &&
    treesFilter
  ) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d') AND zipcode = '${zipcode}' AND total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter} AND number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  } else if (
    fromDate &&
    toDate &&
    carbonComparison &&
    carbonFootprintFilter &&
    treesComparison &&
    treesFilter
  ) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d') AND total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter} AND number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  } else if (fromDate && toDate && zipcode) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d') AND zipcode = '${zipcode}'`;
  } else if (fromDate && toDate && carbonComparison && carbonFootprintFilter) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d') AND total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter}`;
  } else if (fromDate && toDate && treesComparison && treesFilter) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d') AND number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  } else if (fromDate && toDate) {
    const formattedFromDate = fromDate.split("/").reverse().join("-");
    const formattedToDate = toDate.split("/").reverse().join("-");
    query += ` WHERE date_answered BETWEEN STR_TO_DATE('${formattedFromDate}', '%Y-%m-%d') AND STR_TO_DATE('${formattedToDate}', '%Y-%m-%d')`;
  } else if (zipcode) {
    query += ` WHERE zipcode = '${zipcode}'`;
  } else if (
    carbonComparison &&
    carbonFootprintFilter &&
    treesComparison &&
    treesFilter
  ) {
    query += ` WHERE total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter} AND number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  } else if (carbonComparison && carbonFootprintFilter) {
    query += ` WHERE total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter}`;
  } else if (treesComparison && treesFilter) {
    query += ` WHERE number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  } else if (zipcode && carbonComparison && carbonFootprintFilter) {
    query += ` WHERE zipcode = '${zipcode}' AND total_carbon_footprint ${
      carbonComparison === "=" ? "=" : carbonComparison === ">" ? ">" : "<"
    } ${carbonFootprintFilter}`;
  } else if (zipcode && treesComparison && treesFilter) {
    query += ` WHERE zipcode = '${zipcode}' AND number_of_trees ${
      treesComparison === "=" ? "=" : treesComparison === ">" ? ">" : "<"
    } ${treesFilter}`;
  }

  mysqlConnection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/api/country_list", cors(), (req, res) => {
  console.log("Received request for /api/country_list");
  const sql = "SELECT country_name FROM CRBN.Country";

  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving countries from the database" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/utility_list", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.Utility";

  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving utilities from the database" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/get_utilities", cors(), (req, res) => {
  const sql = "SELECT utility_name FROM CRBN.Utility";

  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving utilities from the database" });
      return;
    }
    res.json(results);
  });
});

app.post("/api/new_utility_add", cors(), (req, res) => {
  const { utility_name, utility_units } = req.body;

  if (!utility_name || !utility_units) {
    return res
      .status(400)
      .json({ error: "Utility name and units are required" });
  }

  const sql =
    "INSERT INTO CRBN.Utility (utility_name, utility_units) VALUES (?, ?)";

  mysqlConnection.query(
    sql,
    [utility_name, utility_units],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error.message);
        return res
          .status(500)
          .json({ error: "Error adding utility to the database" });
      }

      // If the utility was added successfully, return the new utility details
      const newUtilityId = results.insertId;
      const newUtility = {
        utility_id: newUtilityId,
        utility_name,
        utility_units,
      };
      res.status(200).json(newUtility);
    }
  );
});

app.post(
  "/api/new_utilities_add_bulk",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Route reached");

      // Check if the request body has data property
      if (!req.body.data) {
        console.error("No data found in the request body.");
        return res.status(400).json({ error: "Bad Request" });
      }

      const newData = JSON.parse(req.body.data);

      // Using a transaction for atomicity (all or nothing)
      const connection = await pool.getConnection();
      console.log("Received data:", newData);

      try {
        await connection.beginTransaction();

        // Assuming 'utilities' is your table name
        const insertQuery =
          "INSERT INTO CRBN.utilities (Zipcode, Country, City, Utility, Utility_Value, Utility_Units, Sources, Date_of_Source) VALUES ?";

        // Mapping data to an array of values
        const values = newData.map((item) => [
          item.Zipcode,
          item.Country,
          item.City,
          item.Utility,
          item.Utility_Value,
          item.Utility_Units,
          item.Sources,
          item.Date_of_Source,
        ]);

        // Performing the bulk insert
        await connection.query(insertQuery, [values]);

        // Committing the transaction
        await connection.commit();

        res.status(200).json({ message: "Data saved successfully" });
      } catch (error) {
        // Rolling back the transaction in case of an error
        await connection.rollback();
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Internal server error" });
      } finally {
        // Releasing the connection back to the pool
        connection.release();
      }
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(400).json({ error: "Error processing file" });
    }
  }
);

app.post("/api/update_utility_name/:utilityId", cors(), (req, res) => {
  const utilityId = req.params.utilityId;
  console.log("Utility ID:", utilityId);

  const { utility_name, utility_units } = req.body;
  console.log("Utility Name:", utility_name);
  console.log("Utility Units:", utility_units);

  const query =
    "UPDATE CRBN.Utility SET utility_name = ?, utility_units = ? WHERE utility_id = ?";
  const values = [utility_name, utility_units, utilityId];

  mysqlConnection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating utility data: " + error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Utility data updated successfully" });
    }
  });
});

app.delete("/api/delete_utility_name/:utilityId", cors(), (req, res) => {
  const utilityId = req.params.utilityId;

  // Perform the deletion in the database
  const query = "DELETE FROM CRBN.Utility WHERE utility_id = ?";
  mysqlConnection.query(query, [utilityId], (error, results) => {
    if (error) {
      console.error("Error deleting utility data: " + error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Utility data deleted successfully" });
      } else {
        res.status(404).json({ message: "Utility data not found" });
      }
    }
  });
});

app.get("/api/utility_add", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.utilities";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving utility data from the database" });
      return;
    }
    // Send the retrieved utility data as a JSON response
    res.json(results);
  });
});

// Define a route to save new utility data
app.post("/api/new_utilities_add", (req, res) => {
  const {
    Zipcode,
    Country,
    City,
    Utility,
    Utility_Value,
    Utility_Units,
    // Carbon_Intensity,
    // Carbon_Intensity_Unit,
    // Ref_Value,
    Sources,
    Date_of_Source,
  } = req.body;
  const sql =
    "INSERT INTO CRBN.utilities (Zipcode, Country, City, Utility, Utility_Value, Utility_Units, Sources, Date_of_Source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    Zipcode,
    Country,
    City,
    Utility,
    Utility_Value,
    Utility_Units,
    // Carbon_Intensity,
    // Carbon_Intensity_Unit,
    // Ref_Value,
    Sources,
    Date_of_Source,
  ];

  mysqlConnection.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error saving utility data:", error);
      res.status(500).json({ error: "Error saving utility data" });
    } else {
      console.log("Utility data saved successfully.");
      res.json({ message: "Utility data saved successfully" });
    }
  });
});

app.get("/api/utility/:utilityId", (req, res) => {
  const { utilityId } = req.params;
  // Perform a query to retrieve the data based on the utility_id
  const query =
    "SELECT Val_Id, Zipcode, Country, City, Utility, Utility_Value, Utility_Units, Sources, Date_of_Source FROM CRBN.utilities WHERE Val_Id = ?";
  mysqlConnection.query(query, [utilityId], (error, rows) => {
    if (error) {
      console.error(
        `Error fetching utility data for utility ID ${utilityId}:`,
        error
      );
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Utility not found" });
      } else {
        res.json(rows[0]);
      }
    }
  });
});

app.post("/api/update_utility/:utilityId", (req, res) => {
  const utilityId = req.params.utilityId;
  const {
    Zipcode,
    Country,
    City,
    Utility,
    Utility_Value,
    Utility_Units,
    Sources,
    Date_of_Source,
  } = req.body;

  const query =
    "UPDATE CRBN.utilities SET Zipcode = ?, Country = ?, City = ?, Utility = ?, Utility_Value = ?, Utility_Units = ?, Sources = ?, Date_of_Source = ? WHERE Val_Id = ?";
  const values = [
    Zipcode,
    Country,
    City,
    Utility,
    Utility_Value,
    Utility_Units,
    Sources,
    Date_of_Source,
    utilityId,
  ];

  mysqlConnection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating utility data: " + error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Utility data updated successfully" });
    }
  });
});

app.delete("/api/utilities/delete", (req, res) => {
  const { utilityIds } = req.body;

  const query = "DELETE FROM  CRBN.utilities WHERE Val_Id IN (?)";
  mysqlConnection.query(query, [utilityIds], (error, results) => {
    if (error) {
      console.error("Error deleting utilities:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Utilities deleted successfully" });
    }
  });
});

app.post("/api/ContactUs", cors(), (req, res) => {
  const { email, query, firstName, lastName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // 1) Adding query to the Enquiry table
  const insertEnquirySql =
    "INSERT INTO enquiry (firstname, lastname, email, enquiry_question, enquiry_flag) VALUES (?, ?, ?, ?, ?)";
  mysqlConnection.query(
    insertEnquirySql,
    [firstName, lastName, email, query, 1],
    (err, result) => {
      if (err) {
        console.error("Error inserting into Enquiry table:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res
        .status(200)
        .json({ message: "Enquiry and Customer added successfully" });

      // const enquiryId = result.insertId;

      // // 2) Inserting a new entry into the Customer table
      // const insertCustomerSql = `INSERT INTO Customer (date_answered, session_id, first_name, last_name, email, total_carbon_footprint, answers, number_of_trees, zipcode)
      // VALUES (CURDATE(), "N/A", ?, ?, ?, 0, "N/A", 0, "N/A")`;
      // mysqlConnection.query(
      //   insertCustomerSql,
      //   [firstName, lastName, email],
      //   (err, insertResult) => {
      //     if (err) {
      //       console.error("Error inserting into Customer table:", err);
      //       return res.status(500).json({ error: "Internal Server Error" });
      //     }

      //     return res
      //       .status(200)
      //       .json({ message: "Enquiry and Customer added successfully" });
      //   }
      // );
    }
  );
});

// Define a route to handle updating the question
app.post("/api/slider", cors(), (req, res) => {
  const { question, options } = req.body;

  // Replace this with your actual query to update the question in the database
  const sql =
    'INSERT INTO CRBN.questions (questions, enabled, type_of_question) VALUES (?, 1, "Slider")';
  mysqlConnection.query(sql, [question], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 1) {
      const queId = results.insertId;

      // Insert options into the "Options" table with queId as a foreign key
      const insertOptionsSql =
        "INSERT INTO CRBN.Options (id, given_option, option_type, equivalent_carbon) VALUES ?";
      const optionsData = options.map((option) => [
        queId,
        option.baseline,
        option.optiontype,
        option.carbonOffset,
      ]);

      mysqlConnection.query(
        insertOptionsSql,
        [optionsData],
        (err, optionsResults) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Error saving options" });
          }

          res.status(201).json({
            message: "Question and options saved successfully",
            queId,
          });
        }
      );
    } else {
      res.status(500).send("Error saving the question.");
    }
  });
});
app.get("/api/getFormula/:formulaName", async (req, res) => {
  const { formulaName } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT formulaName, var1, var2, var3, var4 FROM formulasTable WHERE formulaName = ?",
      [formulaName]
    );
    connection.release();

    if (rows.length === 0) {
      res.status(404).json({ error: "Formula not found" });
      return;
    }

    const formulaData = rows[0];
    res.json(formulaData);
  } catch (error) {
    console.error("Error fetching formula:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/dropdown", cors(), (req, res) => {
  const { question, options } = req.body;

  // Insert the question into the "questions" table
  const insertQuestionSql =
    'INSERT INTO CRBN.questions (questions, enabled, type_of_question) VALUES (?, 1, "Dropdown")';
  mysqlConnection.query(insertQuestionSql, [question], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 1) {
      const queId = results.insertId;

      // Insert options into the "Options" table with queId as a foreign key
      const insertOptionsSql =
        "INSERT INTO CRBN.Options (id, given_option, option_type, equivalent_carbon) VALUES ?";
      const optionsData = options.map((option) => [
        queId,
        option.dropdown,
        option.optiontype,
        option.carbonOffset,
      ]);

      mysqlConnection.query(
        insertOptionsSql,
        [optionsData],
        (err, optionsResults) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Error saving options" });
          }

          res.status(201).json({
            message: "Question and options saved successfully",
            queId,
          });
        }
      );
    } else {
      res.status(500).send("Error saving the question.");
    }
  });
});

// Define a route to handle admin login
app.post("/api/admin/login", cors(), (req, res) => {
  const { email, password } = req.body;

  // Replace this with your actual query to check the credentials
  const sql = `SELECT * FROM CRBN.admin WHERE email = ? AND password = ? and flag=1`;
  mysqlConnection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      // Authentication successful
      return res.status(200).json({ message: "Login successful" });
    } else {
      // Authentication failed
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Define a route to retrieve questions from the database
app.get("/api/questionsadmin", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.questions";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Middleware for parsing JSON request body
app.use(express.json());

// Define a route to handle the toggle state update
app.post("/api/updateToggleState", (req, res) => {
  const { questionId, newState } = req.body;
  const sql = "UPDATE CRBN.questions SET enabled = ? WHERE id = ?;";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, [newState, questionId], (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error updating toggle state in the database" });
      return;
    }
    res.json({ message: "Toggle state updated successfully" });
  });
});

// Define a route to retrieve Utility table from the database
app.get("/api/Utility", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.Utility";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Define a route to retrieve Category table from the database
app.get("/api/Category", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.Category";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

app.get("/api/Category", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.Category";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

app.delete("/api/Category/delete", (req, res) => {
  const { categoryIds } = req.body;

  // Retrieve category names before deletion
  const getCategoryNamesQuery =
    "SELECT category_name FROM CRBN.Category WHERE category_id IN (?)";
  mysqlConnection.query(
    getCategoryNamesQuery,
    [categoryIds],
    (selectError, selectResults) => {
      if (selectError) {
        console.error("Error retrieving category names:", selectError);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        const categoryNames = selectResults.map(
          (result) => result.category_name
        );

        // Perform deletion
        const deleteCategoryQuery =
          "DELETE FROM CRBN.Category WHERE category_id IN (?)";
        mysqlConnection.query(
          deleteCategoryQuery,
          [categoryIds],
          (deleteError, deleteResults) => {
            if (deleteError) {
              console.error("Error deleting categories:", deleteError);
              res.status(500).json({ message: "Internal Server Error" });
            } else {
              // Update CRBN.questionsTable to set enabled = 0 where label = category_name
              const updateQuestionsQuery =
                "UPDATE CRBN.questionsTable SET enabled = 0 WHERE label IN (?)";
              mysqlConnection.query(
                updateQuestionsQuery,
                [categoryNames],
                (updateError, updateResults) => {
                  if (updateError) {
                    console.error(
                      "Error updating questionsTable:",
                      updateError
                    );
                    res.status(500).json({ message: "Internal Server Error" });
                  } else {
                    res.status(200).json({
                      message:
                        "Categories deleted and questions updated successfully",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/api/toggleQuestion", async (req, res) => {
  const { ques_id } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT enabled FROM questionsTable WHERE id = ?",
      [ques_id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const currentEnabledState = rows[0].enabled;

    // Toggle the value
    const newEnabledState = currentEnabledState === 1 ? 0 : 1;

    // Update the enabled state in the database
    await connection.query(
      "UPDATE questionsTable SET enabled = ? WHERE id = ?",
      [newEnabledState, ques_id]
    );

    connection.release();
    res.json({ enabled: newEnabledState });
  } catch (error) {
    console.error("Error toggling question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/category_name", cors(), (req, res) => {
  const sql = "SELECT category_name FROM CRBN.Category";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Define a route to add a question to question table
app.post("/api/newquestion", (req, res) => {
  const { question, enabled, type_of_question } = req.body;
  const sql =
    "INSERT INTO CRBN.questions (questions, enabled, type_of_question) VALUES (?, ?, ?);";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(
    sql,
    [question, enabled, type_of_question],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error.message);
        res
          .status(500)
          .json({ error: "Error updating toggle state in the database" });
        return;
      }
      res.json({ message: "New Question added successfully" });
    }
  );
});

// Define a route to get a question by its content
app.post("/api/questionsfind", (req, res) => {
  const { questions } = req.body;
  const sql = "SELECT * FROM CRBN.questions WHERE questions = ?";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, [questions], (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving the question from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Define a route to get a question by its content
app.post("/api/optionsfind", (req, res) => {
  const { id } = req.body;
  const sql = "SELECT * FROM CRBN.Options WHERE id = ?";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving the options from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Options not found" });
    } else {
      res.json(results);
    }
  });
});

// Define a route to add new question and its options by its content
app.post("/api/question/multiplechoice", cors(), (req, res) => {
  const { question, enabled, type_of_question, options } = req.body;
  const sql =
    "INSERT INTO CRBN.questions (questions, enabled, type_of_question) VALUES (?, ?, ?);";

  mysqlConnection.query(
    sql,
    [question, enabled, type_of_question],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("New Question added successfully");
      }

      if (results.affectedRows === 1) {
        const queId = results.insertId;

        // Insert options into the "Options" table with queId as a foreign key
        const insertOptionsSql =
          "INSERT INTO Options (id, given_option, option_type, equivalent_carbon) VALUES ?";
        const optionsData = options.map((option) => [
          queId,
          option.option,
          option.optiontype,
          option.carbonOffset,
        ]);

        mysqlConnection.query(
          insertOptionsSql,
          [optionsData],
          (err, optionsResults) => {
            if (err) {
              console.error("Database query error:", err);
              return res.status(500).json({ error: "Error saving options" });
            }

            res.status(201).json({
              message: "Question and options saved successfully",
              queId,
            });
          }
        );
      } else {
        res.status(500).send("Error saving the question.");
      }
    }
  );
});

// Define a route to add new question and its options by its content
app.post("/api/question/fillintheblank", cors(), (req, res) => {
  const { question, carbonOffsetValue, answer, selectedTextType } = req.body;
  const sql =
    "INSERT INTO CRBN.questions (questions, enabled, type_of_question) VALUES (?, 0, 'Fill in the blank');";

  mysqlConnection.query(sql, [question], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("New Question added successfully");
    }

    if (results.affectedRows === 1) {
      const queId = results.insertId;

      // Insert options into the "Options" table with queId as a foreign key
      const insertOptionsSql =
        "INSERT INTO Options (id, given_option, option_type, equivalent_carbon) VALUES (?, ?, ?, ?)";

      mysqlConnection.query(
        insertOptionsSql,
        [queId, answer, selectedTextType, carbonOffsetValue],
        (err, optionsResults) => {
          if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Error saving options" });
          }
          res.status(201).json({
            message: "Question and options saved successfully",
            queId,
          });
        }
      );
    } else {
      res.status(500).send("Error saving the question.");
    }
  });
});
app.post("/api/savevariables", async (req, res) => {
  const { variables } = req.body;

  try {
    const connection = await pool.getConnection();

    // Loop through the variables and update the database
    for (const { name, value } of variables) {
      await connection.query(
        "UPDATE conversion_table SET value = ? WHERE name = ?",
        [value, name]
      );
    }

    connection.release();
    res.status(200).json({ message: "Variables saved successfully" });
  } catch (error) {
    console.error("Error saving variables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route to retrieve admin table from the database
app.get("/api/admin_main", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.admin where flag=1";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }
    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Define a route to retrieve admin table for the add new admin from the database
app.get("/api/admin_add", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.admin";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }
    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Define a route to save new admin data
app.post("/api/new_admin_add", (req, res) => {
  const { Name, Email, password } = req.body;
  const sql = "INSERT INTO CRBN.admin (Name, Email, password) VALUES (?, ?, ?)";
  const values = [Name, Email, password];

  mysqlConnection.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error saving admin data:", error);
      res.status(500).json({ error: "Error saving admin data" });
    } else {
      console.log("Admin data saved successfully.");
      res.json({ message: "Admin data saved successfully" });
    }
  });
});

// Define a route to update the flag
app.post("/api/update_flag", (req, res) => {
  const { Email, password, flag } = req.body;
  console.log("Received Password:", password);

  const sql = "UPDATE admin SET flag = ? , password = ? WHERE Email = ?";
  mysqlConnection.query(sql, [flag, password, Email], (error, result) => {
    if (error) {
      console.error("Error updating flag and password :", error);
      res.status(500).json({ error: "Error updating flag and password " });
    } else {
      console.log("Flag and password updated successfully.");
      res.json({ message: "Flag and password updated successfully" });
    }
  });
});

app.delete("/api/admins/delete", (req, res) => {
  const { adminIds } = req.body;

  if (!adminIds || !Array.isArray(adminIds)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const sql = "UPDATE CRBN.admin SET flag = 0 WHERE admin_id IN (?)";

  // Execute the SQL query using the MySQL connection and the list of adminIds
  mysqlConnection.query(sql, [adminIds], (error, result) => {
    if (error) {
      console.error("Error deleting admin records:", error);
      res.status(500).json({ error: "Error deleting admin records" });
    } else {
      console.log("Admins deleted successfully.");
      res.json({ message: "Admins deleted successfully" });
    }
  });
});

app.get("/api/admin/:adminId", (req, res) => {
  const { adminId } = req.params;
  // Perform a query to retrieve the name and email based on the admin_id
  const query =
    "SELECT admin_id , Name, Email FROM CRBN.admin WHERE admin_id = ?";
  mysqlConnection.query(query, [adminId], (error, rows) => {
    if (error) {
      console.error(
        `Error fetching admin data for admin ID ${adminId}:`,
        error
      );
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Admin not found" });
      } else {
        res.json(rows[0]);
      }
    }
  });
});

app.post("/api/update_admin/:adminId", (req, res) => {
  const adminId = req.params.adminId;
  console.log("adminID:", adminId);
  const { Name, Email } = req.body;
  console.log("name", Name);
  console.log("Email", Email);

  const query = "UPDATE CRBN.admin SET Name = ?, Email = ? WHERE admin_id = ?";
  const values = [Name, Email, adminId];

  mysqlConnection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating admin data: " + error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Admin data updated successfully" });
    }
  });
});

// Define a route to retrieve admin table for the add new admin from the database
app.get("/api/category_add", cors(), (req, res) => {
  const sql = "SELECT category_name FROM CRBN.Category";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }
    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Define a route to save new admin data
app.post("/api/new_add_category", (req, res) => {
  const { category_name } = req.body;
  const sql = "INSERT INTO CRBN.Category (category_name) VALUES (?)";
  const values = [category_name];

  mysqlConnection.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error saving admin data:", error);
      res.status(500).json({ error: "Error saving admin data" });
    } else {
      console.log("Admin data saved successfully.");
      res.json({ message: "Admin data saved successfully" });
    }
  });
});

app.get("/api/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  // Perform a query to retrieve the name and email based on the category_id
  const query =
    "SELECT category_id , category_name FROM CRBN.Category WHERE category_id = ?";
  mysqlConnection.query(query, [categoryId], (error, rows) => {
    if (error) {
      console.error(
        `Error fetching admin data for admin ID ${categoryId}:`,
        error
      );
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Admin not found" });
      } else {
        res.json(rows[0]);
      }
    }
  });
});

app.post("/api/update_category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  console.log("categoryID:", categoryId);
  const { category_name, Email } = req.body;
  console.log("name", category_name);

  const query =
    "UPDATE CRBN.Category SET category_name = ? WHERE category_id = ?";
  const values = [category_name, categoryId];

  mysqlConnection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating admin data: " + error);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Admin data updated successfully" });
    }
  });
});

app.post("/api/send-email", async (req, res) => {
  const { subject, body } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "carbonoffset08@gmail.com",
      pass: "vjbv uaeq cpro lsub",
    },
  });

  try {
    mysqlConnection.query(
      "SELECT Email FROM CRBN.Customer",
      (error, results, fields) => {
        if (error) {
          console.error("Error querying the database:", error);
          res.status(500).send("Failed to fetch customer emails");
          return;
        }

        const customerEmails = results.map((row) => row.Email); // Ensure the field name matches your database structure

        customerEmails.forEach((customerEmail) => {
          const mailOptions = {
            from: "carbonoffset08@gmail.com",
            to: customerEmail, // Set the recipient's email address
            subject: subject,
            text: body,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
            }
          });
        });

        res.status(200).send("Emails sent successfully");
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send emails");
  }
});

app.post("/api/update-notification", (req, res) => {
  const { subject, body } = req.body;

  console.log("Received request to update notification:", { subject, body });

  const queryupdate =
    "INSERT INTO CRBN.notification (notification_subject, notification_message) VALUES (?, ?)";
  mysqlConnection.query(queryupdate, [subject, body], (err, result) => {
    if (err) {
      console.error("Error inserting into notification table:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Notification updated successfully");
    res.status(200).json({ message: "Notification updated successfully" });
  });
});

app.get("/api/enquiry_main_fetch_waiting_for_response", (req, res) => {
  const query =
    "SELECT enquiry_id ,firstname,lastname,enquiry_date,email,enquiry_question,enquiry_response FROM CRBN.enquiry where enquiry_flag=1";
  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(query, (error, results) => {
    // Change 'sql' to 'query'
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }
    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

app.get("/api/enquiry_main_fetch_answered_enquiries", (req, res) => {
  const query =
    "SELECT enquiry_id ,firstname,lastname,enquiry_date,email,enquiry_question,enquiry_response FROM CRBN.enquiry where enquiry_flag=0";
  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(query, (error, results) => {
    // Change 'sql' to 'query'
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }
    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

// Route to get customer details by enquiry_id
app.get("/api/getenquiryCustomerDetails", (req, res) => {
  const { enquiry_id } = req.query;

  if (!enquiry_id) {
    return res.status(400).json({ error: "enquiry_id is required" });
  }
  // SQL query to fetch customer details by enquiry_id
  const sql =
    "SELECT enquiry_id,firstname,lastname,email,enquiry_question  FROM CRBN.enquiry WHERE enquiry_id = ?";

  mysqlConnection.query(sql, [enquiry_id], (err, results) => {
    if (err) {
      console.error("Error fetching customer details: " + err);
      return res.status(500).json({ error: "Error fetching customer details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer details not found" });
    }

    res.json(results[0]);
  });
});

// Extend the /api/sendCustomerEnquiryEmail route
app.post("/api/sendCustomerEnquiryEmail", (req, res) => {
  const { ID, to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "carbonoffset08@gmail.com",
      pass: "vjbv uaeq cpro lsub",
    },
  });

  const mailOptions = {
    from: "carbonoffset08@gmail.com",
    to,
    subject,
    text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });

      // Update the flag of the customer inquiry to 0 and store the response sent
      const query = `
                UPDATE CRBN.enquiry SET enquiry_flag = 0, enquiry_response = ?  WHERE enquiry_id = ?`;

      mysqlConnection.query(query, [text, ID], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating customer inquiry:", updateError);
        }
        // Handle success or failure here
      });
    }
  });
});

// Define a route to retrieve questions with a specific flag from the database
app.get("/api/questionsuser", cors(), (req, res) => {
  const sql =
    "SELECT * FROM CRBN.questionsTable  WHERE enabled = 1  ORDER BY  CASE  WHEN label = 'InfoPersonal' THEN 1 WHEN label = 'Household' THEN 2 WHEN label = 'Air Travel' THEN 3 WHEN label = 'Personal Vehicles' THEN 4 WHEN label = 'Public Transit' THEN 5 WHEN label = 'Shopping' THEN 6 ELSE 7 END,  id;";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving questions from the database" });
      return;
    }

    // Send the retrieved questions as a JSON response
    res.json(results);
  });
});

app.get("/api/questions/:id", cors(), async (req, res) => {
  try {
    const questionId = req.params.id; // Get the ID from the route parameter
    const [results] = await mysqlConnection
      .promise()
      .query("SELECT * FROM CRBN.questionsTable WHERE id = ?", [questionId]);
    console.log("results are:", results);
    if (results.length > 0) {
      res.json(results[0]); // Send back the specific question
    } else {
      res.status(404).send("Question not found");
    }
  } catch (error) {
    console.error("Error fetching specific question:", error);
    res.status(500).send("Server error");
  }
});

// API for random fact fetching
app.get("/api/randomfact/:index", async (req, res) => {
  try {
    const questionIndex = req.params.index;
    const [rows] = await mysqlConnection
      .promise()
      .query("SELECT fact FROM CRBN.facts ORDER BY RAND() LIMIT 1;");
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
// app.get("/api/totalquestions", cors(), async (req, res) => {
//   try {
//     const [results] = await mysqlConnection
//       .promise()
//       .query(
//         "SELECT COUNT(*) as total FROM CRBN.questionsTable Where enabled=1"
//       );
//     if (results.length > 0) {
//       res.json(results[0].total);
//     } else {
//       res.status(404).send("No questions found");
//     }
//   } catch (error) {
//     console.error("Error fetching total number of questions:", error);
//     res.status(500).send("Server error");
//   }
// });

// Route to calculate total number of qustions to display progress bar percentage in each question page
app.get("/api/totalquestions", cors(), async (req, res) => {
  try {
    const [results] = await mysqlConnection
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM CRBN.questionsTable Where enabled=1"
      );
    if (results.length > 0) {
      res.json(results[0].total);
    } else {
      res.status(404).send("No questions found");
    }
  } catch (error) {
    console.error("Error fetching total number of questions:", error);
    res.status(500).send("Server error");
  }
});

// // Define a route to retrieve utility data based on the zipcode
// app.get("/api/utility/:zipcode", cors(), (req, res) => {
//   const zipcode = req.params.zipcode; // Extract zipcode from the request parameters

//   // SQL query to fetch utility data for the given zipcode
//   const sql = "SELECT * FROM CRBN.Utility WHERE Zipcode = ?";

//   // Execute the SQL query using the MySQL connection
//   mysqlConnection.query(sql, [zipcode], (error, results) => {
//     if (error) {
//       console.error("Error executing SQL query:", error.message);
//       res
//         .status(500)
//         .json({ error: "Error retrieving utility data from the database" });
//       return;
//     }

//     // If results are found, return them, otherwise, return a 404 with an error message
//     if (results.length > 0) {
//       res.json(results[0]);
//     } else {
//       res
//         .status(404)
//         .json({ error: "Utility not found for the given zipcode" });
//     }
//   });
// });

app.get("/api/getvardata", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT name, value FROM CRBN.conversion_table"
    );
    connection.release();
    const variableValues = {};
    rows.forEach((row) => {
      variableValues[row.name] = row.value;
    });
    res.json(variableValues);
  } catch (error) {
    console.error("Error fetching variable values:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const connection = await createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM CRBN.conversion_table"
    );
    connection.end();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// New endpoint to add data
app.post("/api/addData", async (req, res) => {
  const {
    questionContent,
    household,
    zipcode,
    questionType,
    enabled,
    choiceAns,
    choice1,
    choice2,
    choice3,
    choice4,
    ref1,
    ref2,
    ref3,
    ref4,
    selectedUnits,
    selectedUnitRefs,
  } = req.body;

  try {
    const connection = await createConnection(dbConfig);

    // Adjust this query based on your table structure
    await connection.execute(
      `
        INSERT INTO CRBN.admin_questions (
          questionContent,
          household,
          zipcode,
          questionType,
          enabled,
          choiceAns,
          choice1,
          choice2,
          choice3,
          choice4,
          ref1,
          ref2,
          ref3,
          ref4,
          selectedUnits,
          selectedUnitRefs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        questionContent,
        household,
        zipcode,
        questionType,
        enabled,
        choiceAns,
        choice1,
        choice2,
        choice3,
        choice4,
        ref1,
        ref2,
        ref3,
        ref4,
        selectedUnits,
        selectedUnitRefs,
      ]
    );

    connection.end();

    res.status(201).json({ message: "Data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/getUniqueUtilities", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT DISTINCT Utility FROM CRBN.utilities"
    );
    connection.release();

    const uniqueUtilities = rows.map((row) => row.Utility);
    res.json(uniqueUtilities);
  } catch (error) {
    console.error("Error fetching unique utilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... (previous code)

app.get("/api/getUnits", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT name FROM CRBN.units_table");
    connection.release();
    const unitNames = rows.map((row) => row.name);
    res.json(unitNames);
  } catch (error) {
    console.error("Error fetching unit names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/allformulas", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT formulaName FROM CRBN.formulasTable"
    );
    connection.release();
    const formulaNames = rows.map((row) => row.formulaName);
    res.json(formulaNames);
  } catch (error) {
    console.error("Error fetching formula names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to update a variable value
app.put("/api/updatevar/:name", async (req, res) => {
  const { name } = req.params;
  const { value } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "UPDATE CRBN.conversion_table SET value = ? WHERE name = ?",
      [value, name]
    );
    connection.release();
    res.json({ value });
  } catch (error) {
    console.error("Error updating variable value:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addConversion", async (req, res) => {
  const { name, value } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO CRBN.conversion_table (name, value) VALUES (?, ?)",
      [name, value]
    );
    connection.release();
    res.status(201).json({ message: "Var added successfully" });
  } catch (error) {
    console.error("Error adding Var:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addUnit", async (req, res) => {
  const { name, value } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO CRBN.units_table (name) VALUES (?)", [
      name,
    ]);
    connection.release();
    res.status(201).json({ message: "Var added successfully" });
  } catch (error) {
    console.error("Error adding Var:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addQuestion", async (req, res) => {
  const {
    questionContent,
    household,
    zipcode,
    questionType,
    enabled,
    choiceAns,
    choices,
    refs,
    selectedUnits,
    selectedFormulas,
    label,
  } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO CRBN.questionsTable (questionContent, household, zipcode, questionType, enabled, choiceAns, choices, refs, selectedUnits, selectedFormulas, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        questionContent,
        household,
        zipcode,
        questionType,
        enabled,
        choiceAns,
        JSON.stringify(choices),
        JSON.stringify(refs),
        JSON.stringify(selectedUnits),
        JSON.stringify(selectedFormulas),
        label,
      ]
    );
    connection.release();
    res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/addFormula", async (req, res) => {
  const { formulaName, var1, var2, var3, var4 } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO CRBN.formulasTable (formulaName, var1, var2, var3, var4) VALUES (?, ?, ?, ?, ?)",
      [formulaName, var1, var2, var3, var4]
    );
    connection.release();
    res.status(201).json({ message: "Formula added successfully" });
  } catch (error) {
    console.error("Error adding formula:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM CRBN.questionsTable");
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/question/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM CRBN.questionsTable WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.json(rows[0]); // Assuming that ID is unique, so there should be only one result
    }
  } catch (error) {
    console.error("Error fetching a specific question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/formulas", async (req, res) => {
  try {
    // Use the global connection variable
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT formulaName, var1, var2, var3, var4 FROM formulasTable"
    );
    connection.release();
    const formulaNames = rows.map((row) => ({
      formulaName: row.formulaName,
      var1: row.var1,
      var2: row.var2,
      var3: row.var3,
      var4: row.var4,
    }));
    res.json(formulaNames);
  } catch (error) {
    console.error("Error fetching formula names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.patch("/api/updateQuestion/:id", async (req, res) => {
  const { id } = req.params;

  // Destructure the properties you want to update from the request body
  const {
    questionContent,
    household,
    zipcode,
    questionType,
    enabled,
    choiceAns,
    choices,
    refs,
    selectedUnits,
    selectedFormulas,
    label,
  } = req.body;

  try {
    const connection = await pool.getConnection();

    // Update the corresponding row in the questionsTable
    await connection.query(
      `
        UPDATE CRBN.questionsTable 
        SET 
          questionContent = ?, 
          household = ?, 
          zipcode = ?, 
          questionType = ?, 
          enabled = ?, 
          choiceAns = ?, 
          choices = ?, 
          refs = ?, 
          selectedUnits = ?, 
          selectedFormulas = ?, 
          label = ?
        WHERE id = ?
        `,
      [
        questionContent,
        household,
        zipcode,
        questionType,
        enabled,
        choiceAns,
        JSON.stringify(choices),
        JSON.stringify(refs),
        JSON.stringify(selectedUnits),
        JSON.stringify(selectedFormulas),
        label,
        id,
      ]
    );

    connection.release();
    res.status(200).json({ message: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/utilities", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM CRBN.utilities");
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching utilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getCategories", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM CRBN.Category");
    connection.release();

    const categories = rows.map((row) => ({
      categoryId: row.category_id,
      categoryName: row.category_name,
    }));

    res.json(categories);
  } catch (error) {
    console.error("Error fetching Category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getUtilityValue(utilityName, zipcode) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT Utility_Value FROM utilities WHERE Utility = ? AND Zipcode = ?",
      [utilityName, zipcode]
    );
    const [avg] = await connection.query(
      "SELECT Avg(Utility_Value) as av FROM utilities WHERE Utility = ? ",
      [utilityName]
    );
    connection.release();

    if (rows.length === 0) {
      // Handle the case where the utility value is not found
      return avg[0].av; // or any default value as needed
    }

    return rows[0].Utility_Value;
  } catch (error) {
    console.error("Error fetching utility value:", error);
    throw error;
  }
}

// Your existing route handler
app.post("/api/calculateFormula", async (req, res) => {
  try {
    //sjjsjsjs
    const { formulaName, zipcode } = req.body;

    // Fetch the formula from the database based on the formulaName
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT var1, var2, var3, var4 FROM formulasTable WHERE formulaName = ?",
      [formulaName]
    );
    const [utilRows] = await connection.query(
      "SELECT utility_name FROM Utility"
    );
    connection.release();

    if (rows.length === 0) {
      res.status(404).json({ error: "Formula not found" });
      return;
    }
    if (utilRows.length === 0) {
      res.status(404).json({ error: "No Utilities found" });
      return;
    }

    // Extract variables from the database response
    const { var1, var2, var3, var4 } = rows[0];
    const utilities = utilRows.map((row) => row.utility_name);
    console.log(var1, var2, var3, var4);
    // Check if var1 is present in the conversion_table, if not, parse as float
    const parsedVar1 = utilities.includes(var1)
      ? await getUtilityValue(var1, zipcode)
      : await getVariableValue(var1);
    const parsedVar2 = utilities.includes(var2)
      ? await getUtilityValue(var2, zipcode)
      : await getVariableValue(var2);
    const parsedVar3 = utilities.includes(var3)
      ? await getUtilityValue(var3, zipcode)
      : await getVariableValue(var3);
    const parsedVar4 = utilities.includes(var4)
      ? await getUtilityValue(var4, zipcode)
      : await getVariableValue(var4);

    // Perform the calculation based on the parsed variables
    console.log(parsedVar1, parsedVar2, parsedVar3, parsedVar4);
    const result = (parsedVar1 * parsedVar2) / (parsedVar3 * parsedVar4);

    res.json({ result });
  } catch (error) {
    console.error("Error calculating formula:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/api/calculateFormula", async (req, res) => {
//   try {
//     const { formulaName, zipcode } = req.body;

//     // Fetch the formula from the database based on the formulaName
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query(
//       "SELECT var1, var2, var3, var4 FROM formulasTable WHERE formulaName = ?",
//       [formulaName]
//     );
//     const [utilRows] = await connection.query(
//       "SELECT utility_name FROM Utility"
//     );
//     connection.release();
//     console.log(formulaName, zipcode, utility);
//     if (rows.length === 0) {
//       res.status(404).json({ error: "Formula not found" });
//       return;
//     }
//     if (utilRows.length === 0) {
//       res.status(404).json({ error: "No Utilities found" });
//       return;
//     }

//     // Extract variables from the database response
//     const { var1, var2, var3, var4 } = rows[0];
//     // const utils = utilRows;
//     const utilities = utilRows.map((row) => row.utility_name);
//     console.log(var1, var2, var3, var4);
//     console.log("This is utils", utilities);

//     // Check if var1 is present in the conversion_table, if not, parse as float

//     const parsedVar1 = utilities.includes(var1)
//       ? await getUtilityValue(var1)
//       : await getVariableValue(var1);
//     const parsedVar2 = utilities.includes(var2)
//       ? 1.5
//       : await getVariableValue(var2);
//     const parsedVar3 = utilities.includes(var3)
//       ? 1
//       : await getVariableValue(var3);
//     const parsedVar4 = utilities.includes(var4)
//       ? 1
//       : await getVariableValue(var4);
//     console.log(parsedVar1, parsedVar2, parsedVar3, parsedVar4);
//     // Perform the calculation based on the parsed variables
//     const result = (parsedVar1 * parsedVar2) / (parsedVar3 * parsedVar4);

//     res.json({ result });
//   } catch (error) {
//     console.error("Error calculating formula:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/api/calculateFormula", async (req, res) => {
//   try {
//     const { formulaName, zipcode, utility } = req.body;
//     console.log(formulaName, zipcode, utility);

//     // Fetch the formula from the database based on the formulaName
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query(
//       "SELECT var1, var2, var3, var4 FROM formulasTable WHERE formulaName = ?",
//       [formulaName]
//     );
//     console.log()
//     connection.release();

//     if (rows.length === 0) {
//       // Formula not found, return 0 as the result
//       res.json({ result: 0 });
//       return;
//     }

//     // Extract variables from the database response
//     const { var1, var2, var3, var4 } = rows[0];

//     const parsedVar1 =
//       var1 && var1 === utility
//         ? await getUtilityValue(zipcode, utility)
//         : var1
//         ? await getVariableValue(var1)
//         : 1;
//     const parsedVar2 =
//       var2 && var2 === utility
//         ? await getUtilityValue(zipcode, utility)
//         : var2
//         ? await getVariableValue(var2)
//         : 1;
//     const parsedVar3 =
//       var3 && var3 === utility
//         ? await getUtilityValue(zipcode, utility)
//         : var3
//         ? await getVariableValue(var3)
//         : 1;
//     const parsedVar4 =
//       var4 && var4 === utility
//         ? await getUtilityValue(zipcode, utility)
//         : var4
//         ? await getVariableValue(var4)
//         : 1;
//     console.log("Debugging vars:", parsedVar1, var2, var3, var4); // Add this line
//     // Fetch utility information from the utilities table based on the given zipcode and utility
//     const [utilityRows] = await connection.query(
//       "SELECT Utility_Value FROM utilities WHERE Zipcode = ? AND Utility = ?",
//       [zipcode, utility]
//     );

//     connection.release();

//     if (utilityRows.length === 0) {
//       // Utility information not found, return an error or handle it appropriately
//       const [averageUtilityRows] = await connection.query(
//         "SELECT AVG(Utility_Value) AS avgUtilityValue FROM utilities WHERE Utility = ?",
//         [utility]
//       );

//       if (
//         averageUtilityRows.length === 0 ||
//         averageUtilityRows[0].avgUtilityValue === null
//       ) {
//         // No utility information found, return an error or handle it appropriately
//         res.status(404).json({ error: "Utility information not found" });
//         connection.release();
//         return;
//       }

//       const averageUtilityValue = parseFloat(
//         averageUtilityRows[0].avgUtilityValue
//       );

//       return;
//     }

//     // Extract utility values from the database response
//     const { Utility_Value } = utilityRows[0];

//     // Convert utility values to appropriate data types if needed
//     const parsedUtilityValue = parseFloat(Utility_Value);
//     // Perform the calculation based on the parsed variables
//     const result = (parsedVar1 * parsedVar2) / (parsedVar3 * parsedVar4);

//     res.json({ result });
//     multiplyingFactor = result;
//     console.log("multiplying Factor", result);
//   } catch (error) {
//     console.error("Error calculating formula:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// async function getUtilityValue(zipcode, utility) {
//   try {
//     // Establish a database connection
//     const connection = await pool.getConnection();

//     // Fetch utility information from the utilities table based on the given zipcode and utility
//     const [utilityRows] = await connection.query(
//       "SELECT Utility_Value FROM utilities WHERE Zipcode = ? AND Utility = ?",
//       [zipcode, utility]
//     );

//     if (utilityRows.length === 0) {
//       // Utility information not found for the specified zipcode and utility
//       // Calculate the average utility value for all rows where utility = utility name
//       const [averageUtilityRows] = await connection.query(
//         "SELECT AVG(Utility_Value) AS avgUtilityValue FROM utilities WHERE Utility = ?",
//         [utility]
//       );

//       connection.release();

//       if (
//         averageUtilityRows.length === 0 ||
//         averageUtilityRows[0].avgUtilityValue === null
//       ) {
//         // No utility information found, return null or handle it appropriately
//         return null;
//       }

//       // Extract the average utility value from the database response
//       const averageUtilityValue = parseFloat(
//         averageUtilityRows[0].avgUtilityValue
//       );

//       return averageUtilityValue;
//     }

//     // Extract utility value from the database response
//     const { Utility_Value } = utilityRows[0];

//     // Convert utility value to the appropriate data type if needed
//     const parsedUtilityValue = parseFloat(Utility_Value);

//     connection.release();

//     return parsedUtilityValue;
//   } catch (error) {
//     console.error("Error fetching utility value:", error);
//     return null;
//   }
// }

// app.get("/formulas", async (req, res) => {
//   try {
//     // Use the global connection variable
//     connection = await pool.getConnection();
//     const [rows] = await connection.query(
//       "SELECT formulaName, var1, var2, var3, var4 FROM formulasTable"
//     );
//     connection.release();
//     const formulaNames = rows.map((row) => ({
//       formulaName: row.formulaName,
//       var1: row.var1,
//       var2: row.var2,
//       var3: row.var3,
//       var4: row.var4,
//     }));
//     res.json(formulaNames);
//   } catch (error) {
//     console.error("Error fetching formula names:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.post("/api/calculateFootprint", cors(), async (req, res) => {
  console.log("Answers Array", req.body.answersArr);
  console.log("Indexes Array", req.body.unitIndexArr);
  console.log("Formula Values Array", req.body.formulaValArr);

  const answers = req.body.answersArr; // Array containing question IDs, user answers, and household values
  const unitIndexes = req.body.unitIndexArr;
  const formulaVals = req.body.formulaValArr;

  let totalCarbonFootprint = 0;
  console.log("Answers ---->", answers);
  try {
    for (let answer of answers) {
      console.log("answer", answer);
      const id = answer.id;
      const userValue = answer.value;
      let unit_Index;
      let formulaValue;

      for (let arr of unitIndexes) {
        if (arr.id == id) {
          if (arr.index === undefined) {
            unit_Index = arr.unitIndex;
          } else {
            unit_Index = arr.index;
          }
        }
      }

      for (let arr of formulaVals) {
        if (arr.id == id) {
          formulaValue = arr.formulaVal;
        }
      }
      // Fetch refs (constants or formulas) for the question based on questionType and choiceAns
      const [results] = await mysqlConnection
        .promise()
        .query(
          "SELECT refs, questionType, household, choiceAns FROM CRBN.questionsTable WHERE id = ?",
          [id]
        );

      if (results.length === 0) {
        continue; // Skip the rest of this iteration and proceed to the next id in the loop
      }
      const refs = results[0].refs;
      let household = results[0].household;
      const questionType = results[0].questionType;
      const choiceAns = results[0].choiceAns;
      if (familyMembers === undefined) {
        familyMembers = 1;
      }
      // Calculate carbon footprint based on questionType and choiceAns using the dynamically set familyMembers
      let carbonValue = 0;
      if (questionType === 1) {
        if (choiceAns === "1") {
          carbonValue = household
            ? (refs * userValue) / familyMembers
            : refs * userValue; // Use the user-selected choice's refValue
        } else if (choiceAns === "2") {
          if (userValue >= 0 && userValue < refs[0].length) {
            carbonValue = household
              ? refs[0][userValue] / familyMembers
              : refs[0][userValue];
          } else {
            console.error("Invalid user-selected choice index:", userValue);
          }
        } else if (choiceAns === "3") {
          // User can select multiple choices
          if (Array.isArray(userValue)) {
            const selectedChoices = userValue;
            // Calculate footprint based on selected choices
            for (const choiceIndex of selectedChoices) {
              if (choiceIndex >= 0 && choiceIndex < refs[0].length) {
                carbonValue += household
                  ? refs[0][choiceIndex] / familyMembers
                  : refs[0][choiceIndex];
              } else {
                console.error(
                  "Invalid user-selected choice index:",
                  choiceIndex
                );
              }
            }
          } else {
            console.error("Invalid user-selected choices:", userValue);
          }
        }
      } else {
        if (choiceAns === "1") {
          console.log("family members", familyMembers);
          carbonValue = (userValue * formulaValue) / familyMembers;
        } else if (choiceAns === "2") {
          if (unit_Index >= 0 && userValue >= 0) {
            carbonValue =
              (refs[unit_Index][userValue] * formulaValue) / familyMembers;
          }
        } else if (choiceAns === "3") {
          // User can select multiple choices
          if (Array.isArray(userValue)) {
            const selectedChoices = userValue;
            // Calculate footprint based on selected choices
            for (const choiceIndex of selectedChoices) {
              if (choiceIndex >= 0 && choiceIndex < refs[0].length) {
                carbonValue += household
                  ? (refs[unit_Index][choiceIndex] * formulaValue) /
                    familyMembers
                  : refs[unit_Index][choiceIndex] * formulaValue;
              } else {
                console.error(
                  "Invalid user-selected choice index:",
                  choiceIndex
                );
              }
            }
          } else {
            console.error("Invalid user-selected choices:", userValue);
          }
        }
      }

      totalCarbonFootprint += Math.ceil(carbonValue);
    }

    const CO2_PER_TREE_PER_YEAR = 48;
    const totalTreesRequired = Math.ceil(
      totalCarbonFootprint / CO2_PER_TREE_PER_YEAR
    );

    res.json({
      carbonFootprint: totalCarbonFootprint,
      numberOfTrees: totalTreesRequired,
    });
  } catch (error) {
    console.error("Error calculating values:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/forgotpassword", cors(), async (req, res) => {
  const { email } = req.body;
  // Check if the email exists in the 'admin' table
  const sql = `SELECT * FROM CRBN.admin WHERE email = ? and flag=1`;
  try {
    const [user] = await mysqlConnection.promise().query(sql, [email]);

    if (!user || user.length === 0) {
      // Email not found in the 'admin' table
      return res.status(404).json({ error: "Email not found" });
    }

    // Generate a password reset token
    const resetToken = generateResetToken();

    // Store the reset token in the database along with the email (for validation)
    const updateTokenSql = `UPDATE CRBN.admin SET reset_token = ? WHERE email = ?`;
    await mysqlConnection.promise().query(updateTokenSql, [resetToken, email]);

    // Send a password reset email with a link to a reset page
    const resetLink = `http://${hostmain}:${codeport}/resetpassword?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    return res
      .status(200)
      .json({ message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    console.error("Error processing password reset:", error);
    return res
      .status(500)
      .json({ error: "Error resetting password. Please try again later." });
  }
});

// Helper function to generate a random reset token
function generateResetToken() {
  // Generate a random 32-character token
  return randomBytes(32).toString("hex");
}

// Helper function to send a password reset email
async function sendPasswordResetEmail(email, resetLink) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Replace with your email service provider
    auth: {
      user: "carbonoffset08@gmail.com", // Replace with your email address
      pass: "vjbv uaeq cpro lsub", // Replace with your email password
    },
  });
  const mailOptions = {
    from: "carbonoffset08@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click on the following link to reset your password:\n ${resetLink}`,
  };

  return transporter.sendMail(mailOptions);
}

// API for random image fetching
app.get("/api/randomimage/:index", async (req, res) => {
  try {
    const questionIndex = req.params.index;
    const [rows] = await mysqlConnection
      .promise()
      .query("SELECT img_name FROM CRBN.facts_img ORDER BY RAND() LIMIT 1;");
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

let familyMembers; // Declare a module-scoped variable

app.post("/api/setFamilyMembers", cors(), (req, res) => {
  familyMembers = req.body.familyMembers; // Assign the value to the module-scoped variable
  ageGroup = req.body.ageGroup;
  console.log("Received familyMembers:", familyMembers);
  res.status(200).json({ message: "Family members set successfully" });
});

app.post("/api/contact/insert", cors(), (req, res) => {
  const { email, phone, address } = req.body;

  // Replace this with your actual database update logic
  const updateSql = `UPDATE CRBN.admincontact SET email = ? ,phone= ?, address = ? WHERE admincontactid = 1`;

  mysqlConnection.query(
    updateSql,
    [email, phone, address],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Database update query error:", updateErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if the update was successful
      if (updateResults.affectedRows > 0) {
        return res
          .status(200)
          .json({ message: "Contact details updated successfully" });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to update contact details" });
      }
    }
  );
});

app.get("/api/contact", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.admincontact";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving utility data from the database" });
      return;
    }
    // Send the retrieved utility data as a JSON response
    res.json(results);
  });
});

// Helper function to get the variable value from the conversion_table
const getVariableValue = async (variableName) => {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT value FROM conversion_table WHERE name = ?",
    [variableName]
  );
  connection.release();

  // If the variable is present in the conversion_table, return its value, otherwise parse as float
  return rows.length > 0 ? rows[0].value : parseFloat(variableName);
};

app.post("/api/resetpassword", cors(), (req, res) => {
  const { password, reset_token } = req.body;

  const updateSql = `UPDATE CRBN.admin SET password = ? WHERE reset_token = ?`;

  mysqlConnection.query(
    updateSql,
    [password, reset_token],
    (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Database update query error:", updateErr);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: updateErr.message });
      }

      if (updateResults.affectedRows > 0) {
        return res.status(200).json({ message: "Successfully reset password" });
      } else {
        return res.status(500).json({
          error: "Failed to update password",
          details: "No rows affected",
        });
      }
    }
  );
});

app.get("/api/get-notifications", cors(), (req, res) => {
  const sql = "SELECT * FROM CRBN.notification";

  // Execute the SQL query using the MySQL connection
  mysqlConnection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error.message);
      res
        .status(500)
        .json({ error: "Error retrieving utility data from the database" });
      return;
    }
    // Send the retrieved utility data as a JSON response
    res.json(results);
  });
});

app.post("/api/utilityzipcode", (req, res) => {
  const { zipcode } = req.body; // Assuming the zipcode is sent in the request body
  // Perform a query to retrieve the data based on the utility_id
  const query = "SELECT * FROM CRBN.utilities WHERE Zipcode = ?";
  mysqlConnection.query(query, [zipcode], (error, rows) => {
    if (error) {
      console.error(
        `Error fetching utility data for zipcode ${zipcode}:`,
        error
      );
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: "Zipcode not found" });
      } else {
        res.json(rows[0]);
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
