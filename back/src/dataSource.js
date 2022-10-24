
var typeorm = require("typeorm")
var dataSource = new typeorm.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "koudhi",
    password: "teste",
    database: "gazin",
    synchronize: true,
    entities: [require("./models/level"), require("./models/dev")],
  })

dataSource
.initialize()
.then(async function () {

  console.log("Data Source opened")

})
.catch(function (error) {
  console.log(error)
})

  module.exports = dataSource