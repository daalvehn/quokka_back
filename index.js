const express = require('express');
const app = express();
const connection = require('./db-config');
const port = process.env.PORT || 5000;
const homeRouter = express.Router();
const postsRouter = express.Router();
const Joi = require('joi');
const KeanuRoad = require('./keanu')
var cors = require('cors')

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(KeanuRoad)
require('dotenv');

homeRouter.get('/', (req,res) => {
  res.send('ça marche!')
});


app.use('/', homeRouter)



app.get('/recipes', (req, res) =>  {
  connection.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('err retrieving precious from db');
    } else {
      res.json(results)
    }
  })
})



app.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  connection.promise()
    .query('SELECT * FROM recipes WHERE id = ?', [id])
    .then(([results]) => {
      if (results.length) {
        res.json(results[0]);
      } else {
        res.sendStatus(404);
      }
    });
});

app.post('/recipes', (req, res) => {
  const { title, image, ingredients, steps1, steps2, steps3, steps4, steps5, isfavorite } = req.body;
  
  connection.promise()
        .query('INSERT INTO recipes (title, image, ingredients, steps1, steps2, steps3, steps4, steps5, isfavorite) VALUES (?,?,?,?,?,?,?,?,?)', [title, image, ingredients, steps1, steps2, steps3, steps4, steps5, isfavorite])
        .then(([result]) => {
            const createdRecipe = {id: result.insertId, title, image, ingredients, steps1, steps2, steps3, steps4, steps5, isfavorite};
            res.json(createdRecipe);
        }).catch((err) => {console.error(err); res.sendStatus(500); });

})







connection.getConnection((err) => {
    if (err) {
      console.error('error connecting to db');
      console.log(err)
    } else {
      console.log('connected to db');
    }
  });
  
  
  
  app.listen(port, (err) => {
    if(err){
      throw new Error('something wrong happened')
    }
    console.log(`server is listening on port ${port}`)
  })