const express=require('express')
const bodyparser= require('body-parser')
const app=express()
app.use(bodyparser.urlencoded({extended:true}))
const ejs=require('ejs')
const pg = require('pg')
var quiz
var question 
var isOver=false
var correct
var score=0
var ans

const db= new pg.Client({
  //  order matters or serial matter
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "vaibhav",
    port: 5432,
});
db.connect();
db.query('SELECT * FROM capitals', (err,res)=>
{
  if(err){
    console.log(err)
  }else{
    quiz=res.rows

  }

  db.end();

});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.post('/',(req,res)=>
{
  ans =req.body.ans
  if(ans.toLowerCase()==correct)
  {
    score=score+1
  }
  else{
    isOver=true
    res.render('oops',{score:score})
    score=0
  }

  askques();
  res.render("index.ejs", {
    quest: question.country,
    isOver: isOver,
    score: score
  });
})
app.get('/',async(req,res)=>
{
  await askques();
  res.locals.score=0
  res.render('index.ejs',{quest:question.country})
})

app.post('/oops',(req,res)=>
{
  res.locals.score=0
  res.render('index.ejs',{quest:question.country})
})

 async function askques()
 {
  question = quiz[Math.floor(Math.random()*151)];
  correct=question.capital.toLowerCase()
 }

app.listen(3000)