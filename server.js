import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import {config} from 'dotenv'

const app=express();
config();
app.use(cors());
app.use(express.json());

app.listen(8080,()=>{
    console.log('Listening')
    db.connect((err)=>{
        if(err){
            console.error("Database not connecting",err);
            return
        }
        console.log("Databse conected");
    });
})

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

app.post('/getCustomerSales',(req,res)=>{
    const sql="SELECT * FROM sales WHERE customerId=?";
    const id=req.body.id;
    db.query(sql,id,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);

    })
})

app.get('/getSalesData',(req,res)=>{
    const sql="SELECT * FROM sales"
    
    db.query(sql,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}


app.post('/regUser',(req,res)=>{
    const generatedPassword = generateRandomPassword(8);
    const sql="INSERT INTO user (name, userName, pw, mobileNo, address, type ) VALUES (?,?,?,?,?,?)"
    const values = [
        req.body.name,
        req.body.userName,
        generatedPassword,
        req.body.mobileNo,
        req.body.address,
        req.body.type,
    ];
    
    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);
    })
})

app.get('/SalesData/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM sales WHERE salesId = ?"

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getSalesData/:repsId', (req, res) => {
    const repId = req.params.repsId;
    const sql = "SELECT * FROM sales WHERE repId = ?"

    db.query(sql, repId, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.post('/getCustomerSalesByRep',(req,res)=>{
    const sql="SELECT * FROM sales WHERE repId=?";
    const id=req.body.id;
    db.query(sql,id,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);

    })
})



app.get('/getrepContact', (req, res) => {
    const sql = "SELECT id,mobileNo FROM user"

    db.query(sql, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getrepContacts/:repId', (req, res) => {
    const repId = req.params.repId;
    const sql = "SELECT mobileNo FROM user WHERE id = ?"

    db.query(sql,repId, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getRepsLocation/:repId', (req, res) => {
    const repId = req.params.repId;

    const sql = "SELECT lat,lng FROM location WHERE repId = ?";

    db.query(sql, repId, (err, result) => {
        if (err) {
            return res.json({Message: "Error"});
        }
        console.log(result);
        return res.json(result);
    })
})


app.get('/getSalesDataBydate/:repId', (req, res) => {
    const repId = req.params.repId;
    const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in 'YYYY-MM-DD' format
    const sql = "SELECT * FROM sales WHERE repId = ? AND DATE(time) = ?";

    db.query(sql, [repId, currentDate], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.post('/saveLocation',(req,res)=>{
    const sql="INSERT INTO location (repId,lat,lng) VALUES (?,?,?)";
    const values=[
        req.body.repId,
        req.body.lat,
        req.body.long
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})


app.post('/regCustomer',(req,res)=>{
    const sql="INSERT INTO customer (name,address,mobileNo,repId) VALUES (?,?,?,?)";
    const values=[
        req.body.name,
        req.body.address,
        req.body.mobileNo,
        req.body.repId
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);
    })
})


app.post('/saveLocation',(req,res)=>{
    const sql="INSERT INTO location (repId,location) VALUES (?,?)";
    const values=[
        req.body.repId,
        req.body.location
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.post('/saveSale',(req,res)=>{
    const sql="INSERT INTO sales (repId,customerId,itemName,qty,paymentMethod,bank,cheque_no,branch,amount,remarks) VALUES (?,?,?,?,?,?,?,?,?,?)"
    const values=[
        req.body.repId,
        req.body.customerId,
        req.body.itemName,
        req.body.qty,
        req.body.paymentMethod,
        req.body.bank,
        req.body.chequeNo,
        req.body.branch,
        req.body.amount,
        req.body.remarks
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result)
    })
})


app.post('/login',(req,res)=>{
    const sql="SELECT * FROM user WHERE userName=? AND pw=?";
    const values=[
        req.body.userName,
        req.body.pw
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result)
    })
})

app.get('/getReps', (req, res) => {
    const type = "rep";
    const sql = "SELECT * FROM user WHERE type=?"

    db.query(sql, type, (err, result) => {
        if (err) return res.json({Message: "Error"})
        return res.json(result)
    })
})
app.get('/getReps/:managerId', (req, res) => {
    const manageId = req.params.managerId;

    const sql = "SELECT * FROM user WHERE managerId = ?";

    db.query(sql, manageId, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }
        return res.json(result);
    });
});

app.get('/getSalesLeaders',(req,res)=>{
    const val='leader'
    const sql ="SELECT * FROM user WHERE type=?"

    db.query(sql,val,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})

app.get('/getRepRoot',(req,res)=>{
    const sql="SELECT * FROM "
})


app.get('/getCustomerDetails',(req,res)=>{
    const sql="SELECT * FROM customer WHERE name=? OR mobileNo=?"
    const values=[
        req.body.name,
        req.body.mobileNo
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})



app.get('/getReps/:id', (req, res) => {
    const repId = req.params.id;

    const sql = "SELECT * FROM user WHERE id = ?";

    db.query(sql, repId, (err, result) => {
        if (err) {
            return res.json({Message: "Error"});
        }
        return res.json(result);
    });
});

app.post('/checkLastVisit', (req, res) => {
    console.log(req.body);
    const repId = req.body.repId; // Get repId from query parameters
    const twoWeeksInMillis = 2 * 7 * 24 * 60 * 60 * 1000; // Two weeks in milliseconds

    const sql = `
        SELECT c.id, MAX(s.time) AS lastSaleTime
        FROM customer AS c
        LEFT JOIN sales AS s ON c.id = s.customerId
        WHERE c.repId = ? AND s.repId = ?
        GROUP BY c.id
    `;

    const values = [repId, repId];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }

        const currentDate = new Date();
        const customers = result.map((row) => {
            const lastSaleTime = row.lastSaleTime ? new Date(row.lastSaleTime) : null;
            const isWithinTwoWeeks =
                lastSaleTime !== null && currentDate - lastSaleTime <= twoWeeksInMillis;

            return {
                customerId: row.id,
                lastSaleTime: lastSaleTime,
                isWithinTwoWeeks: isWithinTwoWeeks,
            };
        });

        const customersNotVisitedWithinTwoWeeks = customers
            .filter((customer) => !customer.isWithinTwoWeeks)
            .map((customer) => customer.customerId); // Extract only the customer IDs

        const customerIdsCSV = customersNotVisitedWithinTwoWeeks.join(','); // Convert to a comma-separated string

        return res.json({ customerIds: customerIdsCSV }); // Send the comma-separated list in the response
    });
});



app.get('/customerSearch/:val',(req,res)=>{
    const value=req.params.val
    const sql="SELECT * FROM customer WHERE name=? OR mobileNo=?"
    const values=[
        value,
        value
    ]
    db.query(sql,values,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })
})

app.post('/getCustomerById',(req,res)=>{
    const id=req.body.id;
    const sql="SELECT * FROM customer WHERE id=?"
    db.query(sql,id,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })
})

app.post('/getCustomerByName',(req,res)=>{
    const nme=req.body.name;
    const sql="SELECT * FROM customer WHERE name=?"
    db.query(sql,nme,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })

})



app.get('/chechEnteredDate/:id',(req,res)=>{
    const value=req.params.id;
    const sql="SELECT time FROM sales WHERE salesId=?"
    db.query(sql,value,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        const latestTimestamp = result;

        const currentDate = new Date();
        const timestampDiff = currentDate - latestTimestamp;

  
        const oneWeeksInMillis =  7 * 24 * 60 * 60 * 1000;
         return res.json({ isWithinOneWeek: timestampDiff < oneWeeksInMillis });
    })
})


app.put('/updateSales',(req,res)=>{
    const values=[       
        req.body.repId,
        req.body.customerId,
        req.body.itemName,
        req.body.qty,
        req.body.paymentMethod,
        req.body.bank,
        req.body.branch,
        req.body.cheque_no,
        req.body.amount,
        req.body.remarks,
        req.body.salesId
    ]

    const sql="UPDATE sales SET repId=?,customerId=?,itemName=?,qty=?,paymentMethod=?,bank=?,branch=?,cheque_no=?,amount=?,remarks=? WHERE salesId=?"

    db.query(sql,values,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }

        return res.json(result);
    })
})

app.get('/getCustomerLocations', (req, res) => {
    const sql = "SELECT lat,lng FROM customer"
    db.query(sql, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getAllCustomerDetails', (req, res) => {
    const sql = "SELECT * FROM customer"

    db.query(sql, (err, result) => {
        if (err) return res.json({Message: "Error"})
        return res.json(result);
    })
})


app.get('/leaderlogin', (req, res) => {
    const {userName, pw} = req.query;
    const type = "leader";
    const sql = "SELECT * FROM user WHERE userName=? AND pw=? AND type=?";
    const values = [
        userName,
        pw,
        type
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(401).send('Login failed');
        }
    });
});

app.get('/adminlogin', (req, res) => {
    const {userName, pw} = req.query;
    const type = "admin";
    const sql = "SELECT * FROM user WHERE userName=? AND pw=? AND type=?";
    const values = [
        userName,
        pw,
        type
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json(err);
        }
        if (result.length > 0) {
            return res.send('Login successful');
        } else {
            return res.status(401).send('Login failed');
        }
    });
});

app.put('/updateUser', (req, res) => {

    const sql = 'UPDATE user SET name = ?,userName = ?,pw = ?,mobileNo = ?,address = ?,type = ?,managerId = ? WHERE id =?';

    const values = [
        req.body.name,
        req.body.userName,
        req.body.pw,
        req.body.mobileNo,
        req.body.address,
        req.body.type,
        req.body.manageId,
        req.body.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.json({Message: "Error"})
        return res.json(result);
    })
})

app.delete('/deletUser/:id',(req,res)=>{
    const sql="DELETE FROM user WHERE id =?"
    const id=req.params.id;

    db.query(sql,id,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})
