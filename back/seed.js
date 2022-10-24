const express = require('express')
var typeorm = require("typeorm")
const app = express()
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(require('./src/router.js'))
let seedDevs = require('./devs.json')
let seedLevels = require('./levels.json')
const { exit } = require('process')
const level = require('./src/models/level')


var dataSource = new typeorm.DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "koudhi",
  password: "teste",
  database: "gazin",
  synchronize: true,
  entities: [require("./src/models/level"), require("./src/models/dev")],
})
    const levelRepository = dataSource.getRepository("Level")
    const devRepository = dataSource.getRepository("Dev")
dataSource
  .initialize()
  .then(function () {

    
    seedLevels.forEach(async sampleLevel => {

      let newLevel = await levelRepository.findOneBy({nome: sampleLevel.nome})
      if(newLevel==null ){
      await levelRepository
        .save(sampleLevel)
        .then(function (savedLevel) {
          console.log("Post has been saved: ", savedLevel)
          console.log("Now lets load all posts: ")
          return levelRepository.find()
        })
        .catch((err) => { console.log('base não atualizada', err.errno); })
        .then(function (allLevels) {
          console.log("All posts: ", allLevels)
        })
      }
    })

    seedDevs.forEach(async dev => {
        let oldDev = await devRepository.findOneBy({nome: dev.nome })
        const level = await levelRepository.findOneBy({nome: dev.level})
        
        const newDev = {
          nome: dev.nome,
          sexo: dev.sexo,
          datanascimento: new Date(dev.datanascimento),
          hobby: dev.hobby,
          level: level
        }
      if (oldDev==null ){
        await devRepository
        .save(newDev)
        .then(function (savedDev) {
          console.log("Now lets load all posts: ")
        })
        .catch((err) => { console.log('base não atualizada', err); })
        .then(function (allDevs) {
          console.log("All Devs: ", allDevs)
        })
      }
      else{
        await devRepository
        .update({nome: dev.nome},newDev)
        .then(function (savedDev) {
          
        })
        .catch((err) => { console.log('base não atualizada', err); })
      }
    })
    
  })
  .catch(function (error) {
    console.log(error)
  })
  .then(async ()=>{
    let levels = await levelRepository.find()
    let devs = await devRepository
    .createQueryBuilder('dev')
    .leftJoinAndSelect('dev.level', 'level')
    .getMany()
    levels.forEach(async level=> {level.numberOfDevs = await devRepository.countBy({level: level})
      await levelRepository.save(level)    
    })
    
    console.log("done");
  }
  )
