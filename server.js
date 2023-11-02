import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

app.listen(8081,()=>{
    console.log('Listening')
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
    db.query(sql,[id],(err,result)=>{
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


app.post('/regCustomer',(req,res)=>{
    const sql="INSERT INTO customer (name,address,mobileNo,repId) VALUES (?,?,?,?)";
    const values=[
        req.body.name,
        req.body.address,
        req.body.mobileNo,
        req.body.repId
    ]
    db.query(sql,[values],(err,result)=>{
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

app.post('/saveSale',(req,result)=>{
    const sql="INSERT INTO sales (repId,customerId,itemName,qty,paymentMethod,bank,branch,amount,remarks,time) VALUES (?,?,?,?,?,?,?,?,?,?)"
    const values=[
        req.body.repId,
        req.body.customerId,
        req.body.itemName,
        req.body.qty,
        req.body.paymentMethod,
        req.body.bank,
        req.body.branch,
        req.body.amount,
        req.body.remarks
    ]

    db.query(sql,[values],(err,res)=>{
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

    db.query(sql,[values],(err,result)=>{
        if(err) return res.json(err)
        return res.json(result)
    })
})

app.get('/getReps',(req,res)=>{
    const sql="SELECT * FROM user WHERE type=rep"

    db.query(sql,(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result)
    })
})

app.get('/getSalesLeaders',(req,res)=>{
    const sql ="SELECT * FROM user WHERE type=leader"

    db.query(sql,(err,result)=>{
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
    db.query(sql,[values],(err,result)=>{
        if(err) return res.json({Message:"Error"})
        return res.json(result);
    })
})

app.get('/getReps/:managerId', (req, res) => {
    const manageId = req.params.managerId;

    const sql = "SELECT * FROM user WHERE managerId = ?";

    db.query(sql, [manageId], (err, result) => {
        if (err) {
            return res.json({ Message: "Error" });
        }
        return res.json(result);
    });
});


app.get('/checkLastVisit',(req,res)=>{
    const values=[
            req.body.repId,
            req.body.customerId
    ]
    const sql="SELECT * FROM sales WHERE repId=? AND customerId=? ORDER BY time ASC"

    db.query(sql,values,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        const latestTimestamp = result[0].time;

        const currentDate = new Date();
        const timestampDiff = currentDate - latestTimestamp;

  
        const twoWeeksInMillis = 2 * 7 * 24 * 60 * 60 * 1000;
        return timestampDiff > twoWeeksInMillis;
    })
})

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

app.get('/getCustomerById',(req,res)=>{
    const id=req.body.id;
    const sql="SELECT * FROM customer WHERE id=?"
    db.query(sql,id,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        return res.json(result);
    })
})

app.get('/getCustomerByName',(req,res)=>{
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
    const value=req.params.val;
    const sql="SELECT time FROM sales WHERE salesId=?"
    db.query(sql,value,(err,result)=>{
        if(err){
            return res.json({Message:"Error"})
        }
        const latestTimestamp = result;

        const currentDate = new Date();
        const timestampDiff = currentDate - latestTimestamp;

  
        const oneWeeksInMillis =  7 * 24 * 60 * 60 * 1000;
        return timestampDiff <oneWeeksInMillis;
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