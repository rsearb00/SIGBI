const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
var cors = require("cors");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "1234")
);
const session = driver.session();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.post("/login", function (req, res) {
console.log('Peticion POST con params: ',req.body)
  var user = req.body.user;
  var password = req.body.password;

  var query = "MATCH (n:Person) WHERE n.user='" + user + "' AND n.password='" + password + "' RETURN n";

  const resultPromise = session.run(query);
  resultPromise.then(result => {
    //No podemos cerrar la sesion porque si no falla
    //session.close();

    if (result.records.length == 0) {
      res.send({ ok: false })
      console.log('Inicio de sesión fallido')
    }
    else {
      var record = result.records[0].get(0).properties.user;
      res.send({ ok: true });
      console.log('Inicio de sesión correcto con el usuario ', record)
    }
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

//Prueba de neo4j
app.post('/usuario', function (req,res) {

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});