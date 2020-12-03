const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const multer = require('multer');
const upload = multer({ dest: './upload' })

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

connection.connect();

app.get('/api/customers', (req, res) => {
    connection.query(
        'SELECT * FROM CUSTOMER WHERE isDeleted = 0',
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let image;
    {req.file ? image = '/image/' + req.file.filename : image = ''}
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.post('/api/customers/update', upload.single('image'), (req, res) => {
    let sql;
    let params;
    let fs1 = require('fs');
    let beforeFile;
    {req.body.beforeFilename ? beforeFile= req.body.beforeFilename +'' : beforeFile = ''} 

    let image;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;

    if(req.file){
        sql = 'UPDATE CUSTOMER SET image = ?, name = ?, birthday = ?, gender = ?, job = ? WHERE id = ?';
        

        image = '/image/' + req.file.filename;
        params = [image, name, birthday, gender, job, req.body.id];
        if(beforeFile != '')
            {fs1.unlink(beforeFile.replace('/image','./upload'), (err) => err ? console.log(err) : console.log(`${beforeFile} 를 정상적으로 삭제했습니다`))}
         
    }
    else{
        sql = 'UPDATE CUSTOMER SET name = ?, birthday = ?, gender = ?, job = ? WHERE id = ?';
        params = [name, birthday, gender, job, req.body.id];
    }
    

    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});

app.listen(port, () => console.log(`Listening on port ${port}`));