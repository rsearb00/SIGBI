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

//Inicio de Sesión
app.post("/login", function (req, res) {
  console.log('Peticion POST con params: ', req.body)
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
      console.log('Inicio de sesión correcto con el usuario', record)
    }
  })
});

//Registro de usuario nuevo


//Obtener todas las tapas
app.post('/tapas', function (req, res) {
  // Devolver todos si se para un json vacio
  var query = "MATCH (n:Tapa) RETURN n.tipoTapa";

  const resultPromise = session.run(query);
  resultPromise.then(result => {
    //session.close();

    if (result.records.length == 0) {
      res.send({ ok: false })
      console.log('No se han obtenido las tapas')
    }
    else {
      var tapas = result.records;
      var tapasFiltro=[];
      
      //Sacar el tipo de tapa -> devuelve Label: [values]
      for (var i = 0; i < tapas.length; i++) {
        console.log('Tapa: ', tapas[i]._fields[0])
        tapasFiltro.push(tapas[i]._fields[0])
      }
      res.json({ ok: true, datos: tapasFiltro });
      /*try {
        var tapas = [];
        for (var i = 0; i < result.records.length; i++) {
          const unaTapa = result.records[i].get(i).properties.tipoTapa;
          console.log(unaTapa)
          tapas.push(unaTapa)
        }
        //res.send({ ok: true }, tapas)
      }
      finally {
        console.log('Fallo en la obtención')
      }*/
      /* for (var i = 0; i <result.records.length; i++) {
         unaTapa=result.records[i].get(i).properties.tipoTapa
         console.log(unatapa)
         tapas.push(unaTapa)
      }*/
      /*res.json({ ok: true, datos: data });
      const singleRecord = result.records[0]
    const unatapa = singleRecord.get(0)
*/
      //console.log(unatapa.properties.tipoTapa)
      /* var record = result.records.get.properties.tipoTapa;
       res.send(record);
       console.log('Tapas obtenidas correctamente: ', record)*/
    }

  })


  /*if (Object.keys(req.body).length === 0) {
      models.Usuarios.findAll({}
      ).then((data) => {
          res.json({ ok: true, datos: data });
      }).catch((val) => {
          res.json({ ok: false, error: val.name });
      });
  } else {
      // Devolver el usuario consultado
      models.Usuarios.findAll(
          {
              where: req.body
          }
      ).then((data) => {
          res.json({ ok: true, datos: data });
      }).catch((val) => {
          res.json({ ok: false, error: val.name });
      });
    }*/
});


app.get('/', (req, res) => {
  res.send('Hello World!')
});

//Prueba de neo4j
app.post('/usuario', function (req, res) {

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});