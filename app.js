
const express = require('express');
const app = express();
const port = 3000;


const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdvoiture'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});


app.get('/voitures', (req, res) => {
  db.query('SELECT * FROM voiture', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.post('/voiture', (req, res) => {
    const newCar = req.body;
    newCar.date_creation = new Date();
    db.query('INSERT INTO voiture SET ?', newCar, (err, results) => {
      if (err) throw err;
      res.json({ message: 'Voiture ajoutée avec succès', carId: results.insertId });
    });
  });


app.post('/voitures', (req, res) => {
    const cars = req.body;
    const currentTimestamp = new Date();
    const carsWithTimestamp = cars.map(car => ({ ...car, date_creation: currentTimestamp}));
    const carsValues = carsWithTimestamp.map(car => [car.nom, car.description, car.prix, car.quantite, car.categorie, car.date_creation, car.date_mise_a_jour]);
  
    db.query('INSERT INTO voiture (nom, description, prix, quantite, categorie, date_creation, date_mise_a_jour) VALUES ?', [carsValues], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Liste de voitures ajoutée avec succès' });
    });
  });
  

app.get('/voitures/:id', (req, res) => {
  const carId = req.params.id;
  db.query('SELECT * FROM voiture WHERE id = ?', carId, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});


app.put('/voitures/:id', (req, res) => {
    const carId = req.params.id;
    const updatedCar = req.body;
    updatedCar.date_mise_a_jour = new Date();
    db.query('UPDATE voiture SET ? WHERE id = ?', [updatedCar, carId], (err, results) => {
      if (err) throw err;
      res.json({ message: 'Voiture mise à jour avec succès' });
    });
  });


app.delete('/voitures/:id', (req, res) => {
  const carId = req.params.id;
  db.query('DELETE FROM voiture WHERE id = ?', carId, (err, results) => {
    if (err) throw err;
    res.json({ message: 'Voiture supprimée avec succès' });
  });
});
