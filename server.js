import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'

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

const verifyJwt=(req,res,next)=>{
    const token=req.headers["access-token"];
    if(!token){
        return res.json("we need token");
    }else{
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                res.json("Not authenticated");
            }else{
                req.userId=decoded.id;
                next();
            }
        })
    }
}

app.post('/getCustomerSales',verifyJwt,(req,res)=>{
    const sql="SELECT * FROM sales WHERE customerId=?";
    const id=req.body.id;
    db.query(sql,id,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);

    })
})

app.get('/getSalesData',verifyJwt,(req,res)=>{
    const sql="SELECT sales.*, user.name AS repUserName, user.mobileNo as userMobile, customer.* FROM sales JOIN user ON sales.repId = user.id JOIN customer ON sales.customerId = customer.id"
    
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


app.post('/regUser',verifyJwt,(req,res)=>{
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
        const response = {
            userName: req.body.userName,
            generatedPassword: generatedPassword,
            result: result
        };

        return res.json(response);
    })
})

app.get('/SalesData/:id', verifyJwt,(req, res) => {
    const id = req.params.id;
    const sql = " SELECT sales.*, user.name AS repUserName, user.mobileNo, customer.name FROM sales JOIN user ON sales.repId = user.id JOIN customer ON sales.customerId = customer.id WHERE sales.salesId=?"
    

    db.query(sql, id, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getSalesData/:id', verifyJwt,(req, res) => {
    const repId = req.params.id;

    // Corrected SQL query with JOIN to fetch sales data and rep details
    const sql = `
        SELECT u.name, u.mobileNo, s.*
        FROM user AS u
        LEFT JOIN sales AS s ON u.id = s.repId
        WHERE u.id = ?;
    `;

    db.query(sql, repId, (err, result) => {
        if (err) {
            return res.json(err);
        }
        return res.json(result);
    });
});

app.post('/getCustomerSalesByRep',verifyJwt,(req,res)=>{
    const sql="SELECT sales.*, customer.name AS customerName FROM sales JOIN customer ON sales.customerId = customer.id WHERE sales.repId = ?";
    const id=req.body.id;
    db.query(sql,id,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);

    })
})



app.get('/getrepContact', verifyJwt,(req, res) => {
    const sql = "SELECT id,mobileNo FROM user"
    db.query(sql, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getrepContacts/:repId', verifyJwt,(req, res) => {
    const repId = req.params.repId;
    const sql = "SELECT mobileNo FROM user WHERE id = ?"

    db.query(sql,repId, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getRepsLocation/:repId', verifyJwt,(req, res) => {
    const repId = req.params.repId;

    const sql = "SELECT lat, lng FROM location WHERE repId = ? AND DATE(timestamp) = CURDATE()";

    db.query(sql, repId, (err, result) => {
        if (err) {
            return res.json({Message: "Error"});
        }
        console.log(result);
        return res.json(result);
    })
})


app.get('/getSalesDataBydate/:repId', verifyJwt,(req, res) => {
    const repId = req.params.repId;
    const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in 'YYYY-MM-DD' format
    const sql = "SELECT sales.*, user.name AS repUserName, user.mobileNo, customer.name FROM sales JOIN user ON sales.repId = user.id JOIN customer ON sales.customerId = customer.id WHERE sales.repId = ? AND DATE(sales.time) = ?";

    db.query(sql, [repId, currentDate], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    })
})

app.post('/saveLocation',verifyJwt,(req,res)=>{
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


app.post('/regCustomer',verifyJwt,(req,res)=>{
    const sql="INSERT INTO customer (name,address,mobileNo,repId,lat,lng,postalCode,province,district,wmCustomerOrNot,additionalNo,eMail,socialMediaLinks,machines,machineCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values=[
        req.body.name,
        req.body.address,
        req.body.contactDetails,
        req.body.repId,
        req.body.lat,
        req.body.lng,
        req.body.pcode,
        req.body.province,
        req.body.district,
        req.body.iscustomer,
        req.body.addMno,
        req.body.eMail,
        req.body.socialLink,
        req.body.machines,
        req.body.machinecount        
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err);
        return res.json(result);
    })
})

app.post('/saveSale',verifyJwt,(req,res)=>{
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
    const sql="SELECT * FROM user WHERE userName=? AND pw=? AND type=?";
    const values=[
        req.body.userName,
        req.body.pw,
        'rep'
    ]

    db.query(sql, values, (err, result) => {
    if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
    const id=result[0].id;
    const token =jwt.sign({id},process.env.JWT_SECRET_KEY,{ expiresIn: '1h' })
    return res.json({Login:true,token,result})
    })
})

app.get('/getReps/:id',verifyJwt, (req, res) => {
    const repId = req.params.id;

    const sql = "SELECT * FROM user WHERE id = ?";

    db.query(sql, repId, (err, result) => {
        if (err) {
            return res.json({Message: "Error"});
        }
        return res.json(result);
    });
});

app.get('/getAllReps', verifyJwt,(req, res) => {
    const type = "rep";
    const sql = "SELECT u.*, m.name AS managerName FROM user AS u LEFT JOIN user AS m ON u.managerId = m.id WHERE u.type = ?"

    db.query(sql, type, (err, result) => {
        if (err) return res.json({Message: "Error"})
        return res.json(result)
    })
})

app.get('/getRepsByManager/:managerId', verifyJwt,(req, res) => {
    const manageId = req.params.managerId;

    const sql = "SELECT * FROM user WHERE managerId = ?";

    db.query(sql, manageId, (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }
        return res.json(result);
    });
});

app.get('/getSalesLeaders',verifyJwt,(req,res)=>{
    const val='leader'
    const sql ="SELECT * FROM user WHERE type=?"

    db.query(sql,val,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})

app.get('/getRepRoot',verifyJwt,(req,res)=>{
    const sql="SELECT * FROM "
})


app.get('/getCustomerDetails',verifyJwt,(req,res)=>{
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



app.post('/checkLastVisit', verifyJwt,(req, res) => {
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



app.get('/customerSearch',verifyJwt,(req,res)=>{
    const value=req.body.val
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

app.post('/getCustomerById',verifyJwt,(req,res)=>{
    const id=req.body.id;
    const sql="SELECT * FROM customer WHERE id=?"
    db.query(sql,id,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })
})

app.post('/getCustomerByName',verifyJwt,(req,res)=>{
    const nme=req.body.name;
    const sql="SELECT * FROM customer WHERE name=?"
    db.query(sql,nme,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })

})


app.post('/getCustomerByContact',verifyJwt,(req,res)=>{
    const nme=req.body.contact;
    const sql="SELECT * FROM customer WHERE mobileNo=?"
    db.query(sql,nme,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })

})



app.get('/chechEnteredDate/:id',verifyJwt,(req,res)=>{
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


app.put('/updateSales',verifyJwt,(req,res)=>{
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

app.get('/getCustomerLocations', verifyJwt,(req, res) => {
    const sql = "SELECT lat,lng FROM customer"
    db.query(sql, (err, result) => {
        if (err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getAllCustomerDetails', verifyJwt,(req, res) => {
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
            const id=result[0].id;
            const token =jwt.sign({id},process.env.JWT_SECRET_KEY,{ expiresIn: '1h' })
            return res.json({Login:true,token,result})
        } else {
            return res.status(401).send('Login failed');
        }
    });
});

app.get('/adminlogin',(req, res) => {
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
            const id=result[0].id;
            const token =jwt.sign({id},process.env.JWT_SECRET_KEY,{ expiresIn: '1h' })
            return res.json({Login:true,token,result})
        } else {
            return res.status(401).send('Login failed');
        }
    });
});

app.put('/updateUser',verifyJwt, (req, res) => {

    const sql = 'UPDATE user SET name = ?,userName = ?,pw = ?,mobileNo = ?,address = ?,type = ?,managerId = ? WHERE id =?';

    const values = [
        req.body.name,
        req.body.userName,
        req.body.pw,
        req.body.mobileNo,
        req.body.address,
        req.body.type,
        req.body.managerId,
        req.body.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.json({Message: "Error"})
        return res.json(result);
    })
})

app.put('/deletUser/:id',verifyJwt,(req,res)=>{
    const sql="UPDATE user SET type=? WHERE id =?"
    const values=[
        'nullUser',
        req.params.id
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})

app.put('/deleteUser/:id',(req,res)=>{
    const sql="UPDATE user SET type=? WHERE id =?"
    const values=[
        'nullUser',
        req.params.id
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})

app.get('/getRepLatestLocation',verifyJwt,(req,res)=>{
    const sql="SELECT l.repId, r.name, r.mobileNo, r.address, l.lat, l.lng, l.timeStamp FROM location l JOIN user r ON l.repId = r.id JOIN (SELECT repId, MAX(timestamp) as max_timestamp FROM location GROUP BY repId) latest ON l.repId = latest.repId AND l.timeStamp = latest.max_timestamp"
    
    db.query(sql,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})

app.get('/getNoOfTimeRepVisited',verifyJwt,(req,res)=>{
    const sql="SELECT COUNT(*) AS noOfTimeRepVisited FROM sales WHERE repId = ? AND customerId=? AND time >= CURDATE() - INTERVAL 1 MONTH AND time < CURDATE()"
    const values=[
        req.body.repId,
        req.body.customerId
    ]
    db.query(sql,id,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})

app.get('/saleForGivenCustomer/:id',verifyJwt,(req,res)=>{
    const sql="SELECT COUNT(*) AS allSales FROM sales WHERE customerId = ? AND qty != 0"
    const id=req.params.id;
    db.query(sql,id,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})

app.post('/saveProducts',verifyJwt,(req,res)=>{
    const sql="INSERT INTO products (productName) VALUES (?)";
    const values=[
        req.body.productName
    ]

    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.get('/getProducts',verifyJwt,(req,res)=>{
    const sql="SELECT * FROM products";

    db.query(sql,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.get('/searchProduct/:productName',verifyJwt,(req,res)=>{
    const sql="SELECT * FROOM products WHERE productName=?";
    const val=req.params.productName
    db.query(sql,val,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.put('/updateProducts',verifyJwt,(req,res)=>{
    const sql="UPDATE products SET productName = ? WHERE id = ?";
    const values=[
        req.body.productName,
        req.body.id
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.delete('/deleteProducts/:id',verifyJwt,(req,res)=>{
    const sql="DELETE FROM products WHERE id = ?";
    const id=req.params.id
    db.query(sql,id,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

app.put('/updateRep',verifyJwt,(req,res)=>{
    const sql="UPDATE customer SET repId = ? WHERE id = ?";
    const values=[
        req.body.repId,
        req.body.id
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json(err)
        return res.json(result);
    })
})

