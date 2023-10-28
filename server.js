import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app=express();
app.use(cors());
app.use(express.json());

app.listen(8081,()=>{
    console.log('Listening')
})

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"sales_track"
})


app.get('/getCustomerSales',(req,res)=>{
    const sql="SELECT * FROM sales WHERE customerId=?";
    const id=req.params.id;
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

app.post('/regUser',(req,res)=>{
    const sql="INSERT INTO user (name, userName, pw, mobileNo, address, type ) VALUES (?,?,?,?,?,?)"
    const values = [
        req.body.name,
        req.body.userName,
        req.body.pw,
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

    db.query(sql,[values],(err,result)=>{
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

app.get('/login',(req,res)=>{
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