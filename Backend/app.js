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
app.post('/registro', function (req, res) {
  // Devolver todos si se para un json vacio
  var user = req.body.user;
  var password = req.body.password;
  var name = req.body.name;

  console.log('Peticion de crear el usuario: ', req.body)

  //Ejemplo: CREATE (:Person{name:"Pepe Navarro", user:"Pepe", password:"Pepe123"})
  var query = "CREATE (n:Person{name:'" + name + "', user:'" + user + "', password:'" + password + "'})";


  console.log('Query: ', query)

  const resultPromise = session.run(query);
  resultPromise.then(result => {
    res.json({ ok: true })
    console.log('Se ha creado el usuario')
  })
});

//Obtener todas las tapas
app.post('/tapas', function (req, res) {
  // Devolver todas si se para un json vacio
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
      var tapasFiltro = [];

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
});

app.post('/buscarTapas', function (req, res) {
  // Devolver todos si se para un json vacio
  console.log('Peticion de buscar tapas que contengan: ', req.body.tapa)
  var tapa = req.body.tapa;

  var query = "MATCH (t:Tapa) WHERE toLower(t.tipoTapa) CONTAINS toLower('" + tapa + "') RETURN t.tipoTapa";

  const resultPromise = session.run(query);
  resultPromise.then(result => {

    if (result.records.length == 0) {
      res.send({ ok: false })
      console.log('No se han obtenido las tapas')
    }
    else {
      var tapas = result.records;
      var tapasFiltro = [];

      //Sacar el tipo de tapa -> devuelve Label: [values]
      for (var i = 0; i < tapas.length; i++) {
        console.log('Tapa: ', tapas[i]._fields[0])
        tapasFiltro.push(tapas[i]._fields[0])
      }
      res.json({ ok: true, datos: tapasFiltro });

    }
  })
});


//Buscar los bares en funcion de las tapas seleccionadas
app.post('/buscarBares', function (req, res) {
  console.log('Peticion de buscar bares con las tapas: ', req.body)
  const sessionOtra = driver.session();
  var tapas = req.body.tapas;
  var bares = [];
  //Primera prueba: devolvemos todos los bares que tienen alguna de las tapas seleccionadas porque tenemos pocos en la base
  //MATCH (b:Bar)-[:HASTAPA]->(t:Tapa) MATCH (b)-[:HASTAPA]->(t2:Tapa) WHERE t.tipoTapa IN ['Picadillo', 'Morcilla', 'Cangrejo']  RETURN b as Bar

  //Para coger solo los que tienen las tapas seleccionadas, ejemplo con 3 tapas:
  //MATCH (b:Bar)-[:HASTAPA]->(t1:Tapa)
  //MATCH (b)-[:HASTAPA]->(t2:Tapa)
  //MATCH (b)-[:HASTAPA]->(t3:Tapa)
  //MATCH (b)-[:HASTAPA]->(t:Tapa)
  //WHERE t1.tipoTapa = 'Picadillo' AND t2.tipoTapa='Morcilla' AND t3.tipoTapa ='Cangrejo' RETURN b,t1,t2,t3,t

  var query = "MATCH (b:Bar)-[:HASTAPA]->(t:Tapa) MATCH (b)-[:HASTAPA]->(t2:Tapa) WHERE t.tipoTapa IN [";
  console.log("Query parcial: ", query)
  for (var i = 0; i < tapas.length; i++) {
    if (i + 1 < tapas.length) {
      query = query.concat("'" + tapas[i] + "',");
    }
    else if (i + 1 == tapas.length) {
      query = query.concat("'" + tapas[i] + "'");
    }
  }
  console.log("Query prefinal: ", query)
  query = query.concat("] RETURN DISTINCT b as Bar, collect(t2.tipoTapa) as Tapas");
  console.log("Query final: ", query)


  const resultPromise = sessionOtra.run(query).subscribe({
    onNext: function (record) {
      var bar = record.get("Bar").properties;
      if (bar.name != undefined) {
        if (bar.address == undefined) {
          bar.address = "No tiene"
        }
        if (bar.telephone == undefined) {
          bar.telephone = "No tiene"
        }
        if (bar.web == undefined) {
          bar.web = "No tiene"
        }
        if (bar.perros == undefined) {
          bar.perros = "No acepta"
        }
        if (bar.futbolin == undefined) {
          bar.futbolin = "No tiene"
        }
        if (bar.sidra == undefined) {
          bar.sidra = "No tiene"
        }
        if (bar.cervezaArtesana == undefined) {
          bar.cervezaArtesana = "No tiene"
        }
        if (bar.despedidas == undefined) {
          bar.despedidas = "No tiene"
        }
        if (bar.futbol == undefined) {
          bar.futbol = "No tiene"
        }
        bar.tapas = record.get("Tapas")
        bares.push(bar);
      }
    },
    onCompleted: function () {
      if (bares.length == 0) {
        res.send({ ok: false })
        console.log('No se han obtenido los bares')
      }
      else {

        console.log('Se han encontrado ' + bares.length + ' bares')
        for (var i = 0; i < bares.length; i++) {
          console.log("Bar: " + bares[i].name)
          console.log("Bar: " + bares[i].futbol)
          console.log("Bar: " + bares[i].perros)
          console.log("Bar: " + bares[i].despedidas)

          for (var j = 0; j < bares[i].tapas.length; j++) {
            bares[i].tapas[j] = " " + bares[i].tapas[j]
          }
          console.log("Bar: " + bares[i].tapas)
        }
        res.json({ ok: true, datos: bares });
        console.log('Bares obtenidos correctamente')

      }
    },
    onError: function (error) {
      console.log(error);
    }
  });
  //sessionOtra.close();

});

//Voy a tener TapO'N
//Buscar los bares en funcion de la tapa más buscada
app.post('/recomendacion', function (req, res) {
  console.log('Peticion de buscar bares con la tapa: ', req.body.tapa)
  const sessionOtra = driver.session();
  var tapa = req.body.tapa;
  var bares = [];
  
  var query = "MATCH (b:Bar)-[:HASTAPA]->(t:Tapa) MATCH (b)-[:HASTAPA]->(t2:Tapa) WHERE t.tipoTapa='"+tapa+"' RETURN DISTINCT b as Bar, collect(t2.tipoTapa) as Tapas";
  console.log("Query final: ", query)

  const resultPromise = sessionOtra.run(query).subscribe({
    onNext: function (record) {
      var bar = record.get("Bar").properties;
      if (bar.name != undefined) {
        if (bar.address == undefined) {
          bar.address = "No tiene"
        }
        if (bar.telephone == undefined) {
          bar.telephone = "No tiene"
        }
        if (bar.web == undefined) {
          bar.web = "No tiene"
        }
        if (bar.perros == undefined) {
          bar.perros = "No acepta"
        }
        if (bar.futbolin == undefined) {
          bar.futbolin = "No tiene"
        }
        if (bar.sidra == undefined) {
          bar.sidra = "No tiene"
        }
        if (bar.cervezaArtesana == undefined) {
          bar.cervezaArtesana = "No tiene"
        }
        if (bar.despedidas == undefined) {
          bar.despedidas = "No tiene"
        }
        if (bar.futbol == undefined) {
          bar.futbol = "No tiene"
        }
        bar.tapas = record.get("Tapas")
        bares.push(bar);
      }
    },
    onCompleted: function () {
      if (bares.length == 0) {
        res.send({ ok: false })
        console.log('No se han obtenido los bares')
      }
      else {

        console.log('Se han encontrado ' + bares.length + ' bares')
        for (var i = 0; i < bares.length; i++) {
          console.log("Bar: " + bares[i].name)
          console.log("Bar: " + bares[i].futbol)
          console.log("Bar: " + bares[i].perros)
          console.log("Bar: " + bares[i].despedidas)

          for (var j = 0; j < bares[i].tapas.length; j++) {
            bares[i].tapas[j] = " " + bares[i].tapas[j]
          }
          console.log("Bar: " + bares[i].tapas)
        }
        res.json({ ok: true, datos: bares });
        console.log('Bares obtenidos correctamente')

      }
    },
    onError: function (error) {
      console.log(error);
    }
  });
  //sessionOtra.close();

});

//Buscar los bares en funcion de las tapas seleccionadas
app.post('/buscarBaresPersonalizados', function (req, res) {

  const sessionOtra = driver.session();
  var tapas = req.body.tapas;
  var propiedades = req.body.propiedades;
  var bares = [];
  console.log('Peticion de buscar bares con las tapas: ', tapas)
  console.log('Y las propiedades: ', propiedades)

  var query = "MATCH (b:Bar)-[:HASTAPA]->(t:Tapa) MATCH (b)-[:HASTAPA]->(t2:Tapa) WHERE t.tipoTapa IN [";
  console.log("Query parcial: ", query)
  //Primero metemos las tapas en el array
  for (var i = 0; i < tapas.length; i++) {
    if (i + 1 < tapas.length) {
      query = query.concat("'" + tapas[i] + "',");
    }
    else if (i + 1 == tapas.length) {
      query = query.concat("'" + tapas[i] + "'");
    }
  }
  console.log("Query prefinal con tapas: ", query)



  //Ahora, en función de la propiedad añadida, hacemos AND
  query = query.concat("] ");
  for (var j = 0; j < propiedades.length; j++) {
    if (propiedades[j] == 'Fútbol') {
      query = query.concat("AND b.futbol='si' ");
    }
    if (propiedades[j] == 'Acepta Perros') {
      query = query.concat("AND b.perros='si' ");
    }
    if (propiedades[j] == 'Despedidas de solteros') {
      query = query.concat("AND b.despedidas='si' ");
    }
    if (propiedades[j] == 'Cerveza artesana') {
      query = query.concat("AND b.cervezaArtesana='si' ");
    }
    if (propiedades[j] == 'Sidra artesana') {
      query = query.concat("AND b.sidra='si' ");
    }
    if (propiedades[j] == 'Futbolín') {
      query = query.concat("AND b.futbolin='si' ");
    }
  }
  query = query.concat(" RETURN DISTINCT b as Bar, collect(t2.tipoTapa) as Tapas");
  console.log("Query final: ", query)


  const resultPromise = sessionOtra.run(query).subscribe({
    onNext: function (record) {
      var bar = record.get("Bar").properties;
      if (bar.name != undefined) {
        if (bar.address == undefined) {
          bar.address = "No tiene"
        }
        if (bar.telephone == undefined) {
          bar.telephone = "No tiene"
        }
        if (bar.web == undefined) {
          bar.web = "No tiene"
        }
        if (bar.perros == undefined) {
          bar.perros = "No acepta"
        }
        if (bar.futbolin == undefined) {
          bar.futbolin = "No tiene"
        }
        if (bar.sidra == undefined) {
          bar.sidra = "No tiene"
        }
        if (bar.cervezaArtesana == undefined) {
          bar.cervezaArtesana = "No tiene"
        }
        if (bar.despedidas == undefined) {
          bar.despedidas = "No tiene"
        }
        if (bar.futbol == undefined) {
          bar.futbol = "No tiene"
        }
        bar.tapas = record.get("Tapas")
        bares.push(bar);
      }
    },
    onCompleted: function () {
      if (bares.length == 0) {
        res.send({ ok: false })
        console.log('No se han obtenido los bares')
      }
      else {

        console.log('Se han encontrado ' + bares.length + ' bares')
        for (var i = 0; i < bares.length; i++) {
          console.log("Bar: " + bares[i].name)
          console.log("Bar: " + bares[i].futbol)
          console.log("Bar: " + bares[i].perros)
          console.log("Bar: " + bares[i].despedidas)

          for (var j = 0; j < bares[i].tapas.length; j++) {
            bares[i].tapas[j] = " " + bares[i].tapas[j]
          }
          console.log("Bar: " + bares[i].tapas)
        }
        res.json({ ok: true, datos: bares });
        console.log('Bares obtenidos correctamente')

      }
    },
    onError: function (error) {
      console.log(error);
    }
  });
  //sessionOtra.close();

});


//Método que agrega un bar a la lista de mis bares
app.post('/agregarBar', function (req, res) {
  // Devolver todos si se para un json vacio
  var bar = req.body.bar;
  var user = req.body.user;
  console.log('Peticion de añadir el bar: ', req.body)

  //Usamos Merge, si ya existía la relación no la crea, si no existía, sí
  var query = "MATCH (n:Person), (b:Bar) WHERE n.user='" + user + "' AND b.name='" + bar + "' MERGE (n)-[:HASBAR]->(b)";

  console.log('Query: ', query)

  const resultPromise = session.run(query);
  resultPromise.then(result => {
    res.json({ ok: true })
    console.log('Se ha creado la relación')
  })
});


//Método que agrega una tapa a la lista de Mis Tapas
//No funciona todavía
app.post('/agregarMisTapas', function (req, res) {
  // Devolver todos si se para un json vacio
  var tapas = req.body.tapas;
  var user = req.body.user;
  var nuevo = req.body.nuevo;
  console.log('Peticion de añadir la tapa ', tapas)
  const sessionOtra = driver.session();
  if (tapas.length == 1) {
    console.log('Tapas 0: ' + tapas[0])
  }
  //Falla, hay que hacerlo todo en una consulta
  // var query = "";
  /*for (var i = 0; i < tapas.length; i++) {
    query = query.concat("MATCH (n:Person), (t:Tapa) WHERE n.user='" + user + "' AND t.tipoTapa='" + tapas[i] + "' CREATE (n)-[:HASSEARCHED]->(t);\n");


  }*/
  var query = "MATCH (n:Person) WHERE n.user='" + user + "' SET n.misTapas =";

  //Si aún no tiene tapas guardadas:
  if (nuevo == true) {
    query = query.concat("[")
    /*if(tapas.length==1){
      query = query.concat("'" + tapas[0] + "'")
      
    }*/
    for (var i = 0; i < tapas.length; i++) {
      console.log('Tapas ' + i + " " + tapas[i])
      if (i == 0)
        query = query.concat("'" + tapas[i] + "'")
      else
        query = query.concat(", '" + tapas[i] + "'")
    }
    query = query.concat("]")

  }
  else if (nuevo == false) {
    query = query.concat("n.misTapas ")
    for (var i = 0; i < tapas.length; i++) {

      query = query.concat("+ '" + tapas[i] + "'")

    }
  }
  console.log('Query final: ', query)

  const resultPromise = sessionOtra.run(query);
  resultPromise.then(result => {
    res.json({ ok: true })
    console.log('Se han añadido las tapas al perfil del usuario')
    //sessionOtra.close();
  })
});

//Buscar Mis Tapas
app.post('/misTapas', function (req, res) {
  // Devolver todos si se para un json vacio
  console.log('Peticion de buscar Mis Tapas para el usuario: ', req.body.user)
  const sessionOtra = driver.session();
  var user = req.body.user;
  var tapas = [];

  var query = "MATCH (n:Person) WHERE n.user='" + user + "' RETURN DISTINCT n.misTapas AS Tapas";
  console.log("Query final: ", query)

  const resultPromise = sessionOtra.run(query).subscribe({
    onNext: function (record) {
      var tapa = record.get("Tapas");
      tapas.push(tapa);
    },
    onCompleted: function () {
      if (tapas[0] == null) {
        res.send({ ok: false })
        console.log('No se han obtenido las tapas')
      }
      else {
        //var arrayTapas = tapas.split(",")
        //console.log('Se han encontrado ' + arrayTapas.length + ' tapas')
        //for (var i = 0; i < arrayTapas.length; i++) {

          console.log("Tapas: " + tapas)
        //}
        res.json({ ok: true, datos: tapas[0] });
        console.log('Tapas obtenidas correctamente')

      }
    },
    onError: function (error) {
      console.log(error + ' El usuario no tiene tapas');
    }
  });
  //sessionOtra.close();
});


//Buscar Mis Bares
app.post('/misBares', function (req, res) {
  // Devolver todos si se para un json vacio
  console.log('Peticion de buscar Mis Bares para el usuario: ', req.body.user)
  var user = req.body.user;
  var bares = [];

  var query = "MATCH (n:Person)-[:HASBAR]->(b:Bar) MATCH (b)-[:HASTAPA]->(t:Tapa) WHERE n.user='" + user + "' RETURN DISTINCT b as Bar, collect(t.tipoTapa) as Tapas";
  console.log("Query final: ", query)

  const resultPromise = session.run(query).subscribe({
    onNext: function (record) {
      var bar = record.get("Bar").properties;
      if (bar.name != undefined) {
        if (bar.address == undefined) {
          bar.address = "No tiene"
        }
        if (bar.telephone == undefined) {
          bar.telephone = "No tiene"
        }
        if (bar.web == undefined) {
          bar.web = "No tiene"
        }
        if (bar.perros == undefined) {
          bar.perros = "No acepta"
        }
        if (bar.futbolin == undefined) {
          bar.futbolin = "No tiene"
        }
        if (bar.sidra == undefined) {
          bar.sidra = "No tiene"
        }
        if (bar.cervezaArtesana == undefined) {
          bar.cervezaArtesana = "No tiene"
        }
        if (bar.despedidas == undefined) {
          bar.despedidas = "No tiene"
        }
        if (bar.futbol == undefined) {
          bar.futbol = "No tiene"
        }
        bar.tapas = record.get("Tapas")
        bares.push(bar);
      }
    },
    onCompleted: function () {
      if (bares.length == 0) {
        res.send({ ok: false })
        console.log('No se han obtenido los bares')
      }
      else {

        console.log('Se han encontrado ' + bares.length + ' bares')
        for (var i = 0; i < bares.length; i++) {
          console.log("Bar: " + bares[i].name)
          console.log("Bar: " + bares[i].futbol)
          console.log("Bar: " + bares[i].perros)
          console.log("Bar: " + bares[i].despedidas)

          for (var j = 0; j < bares[i].tapas.length; j++) {
            bares[i].tapas[j] = " " + bares[i].tapas[j]
          }
          console.log("Bar: " + bares[i].tapas)
        }
        res.json({ ok: true, datos: bares });
        console.log('Bares obtenidos correctamente')

      }
    },
    onError: function (error) {
      console.log(error + ' El usuario no tiene bares');
    }
  });
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