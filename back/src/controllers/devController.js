
let devs = require('../../devs.json')
let levels = require('../../levels.json')
var dataSource = require('../dataSource')

var devRepository = dataSource.getRepository("Dev")
var levelRepository = dataSource.getRepository("Level")

const devById = async (id) => {
  const dev = await devRepository
    .createQueryBuilder('dev')
    .leftJoinAndSelect('dev.level', 'level')
    .where("dev.id = :id", { id: id }).getOne()
  return (dev)
}
const checkNumberOfDevs = async () => {
  let levels = await levelRepository.find()
  levels.forEach(async (level) => {
    level.numberOfDevs = await devRepository.countBy({level: level})
    levelRepository.save(level)
  })
}

const queryFilter = (queryString, response, objArray) => {
  if (Object.keys(queryString).length != 0) {
    let filtred = [...objArray]
    for (const key in queryString) {
      if (filtred[0].hasOwnProperty(key)) {
        filtred = filtred.filter(level =>
          (level[key].match(RegExp(queryString[key], "i")))
        )
      }
    }
    if (filtred.length != 0)
      response.end(JSON.stringify(filtred))
    else
      response.status(404).end("")
  } else {
    response.end(JSON.stringify(objArray))
  }
}

const showAllDevs = async (request, response) => {
  const devs = await devRepository
    .createQueryBuilder('dev')
    .leftJoinAndSelect('dev.level', 'level').getMany()
  queryFilter(request.query, response, devs)

}

const showOneDev = async (request, response) => {
  const id = Number(request.params.id)
  const dev = await devById(id)
  if (dev == null)
    response.status(404).end('dev not found')
  response.json(dev)
}

const createNewDev = async (request, response) => {

  if (!request.body) response.status(404).end()
  else {
    const level = await levelRepository.findOneBy({ nome: request.body.level.nome })
    if (level == null) {
      response.status(400).send("Nível " + level + " inexistente")
    } else {

      const newDev = {
        "level": level,
        "nome": request.body.nome,
        "sexo": request.body.sexo,
        "datanascimento": request.body.datanascimento,
        "hobby": request.body.hobby
      }
      await devRepository.save(newDev)
        .then(async () => {
          await checkNumberOfDevs()

          devs = await devRepository
            .createQueryBuilder('dev')
            .leftJoinAndSelect('dev.level', 'level')
            .getMany()
          response.status(201).json(devs)
        })
        .catch(erro => response.end(erro))
    }
  }
}

const editDev = async (request, response) => {
  const id = Number(request.params.id)
  if (!request.body) response.status(400).end()
  else {
    const oldDev = await devById(id)
    if (oldDev == null) {
      response.status(404).end("Desenvolvedor não foi encontrado no sistema\n Por favor, recadastrar")
    } else {
      const level = await levelRepository.findOneBy({ nome: request.body.level.nome })
      if (level == null) {
        response.status(400).send("Nível inexistente")
      } else {
        const editedDev = {
          "level": level,
          "nome": request.body.nome,
          "sexo": request.body.sexo,
          "datanascimento": request.body.datanascimento,
          "hobby": request.body.hobby
        }
        devRepository.update(id, editedDev)
          .then(async () => {
            await checkNumberOfDevs()
            const devs = await devRepository
              .createQueryBuilder('dev')
              .leftJoinAndSelect('dev.level', 'level')
              .orderBy("dev.nome", "ASC").getMany()
            response.status(201).json(devs)
          })
      }
    }
  }
}

const deleteDev = async (request, response) => {

  const id = Number(request.params.id)
  if (devRepository
    .createQueryBuilder('dev')
    .leftJoinAndSelect('dev.level', 'level')
    .where("dev.id = :id", { id: id }).getOne() == null)
    response.status(400).send("Não encontrado")
  else {
    devRepository.delete(id)
      .then(async () => {
        const devs = await devRepository
          .createQueryBuilder('dev')
          .leftJoinAndSelect('dev.level', 'level')
          .orderBy("dev.nome", "ASC").getMany()
        response.json(devs).status(204)
      })
  }
}
module.exports = {
  showAllDevs: showAllDevs,
  showOneDev: showOneDev,
  editDev: editDev,
  createNewDev: createNewDev,
  deleteDev: deleteDev
}

