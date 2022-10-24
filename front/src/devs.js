import axios from 'axios'
import { useState, useEffect } from 'react'
import { TableHeader, sortByTag } from './sortByHeader'
import buttomHandler from './buttom'
import PageSelector from './page'
import { invertDate, getAge } from './dateManipulator'

const nullDev = { id: null, level: "", nome: "", sexo: "", datanascimento: "1995-10-17", hobby: "" }
const apiUrl = 'http://localhost:3001/api/devs/'
//const apiUrl = '/api/devs/'
const devSubTabs = ["devsTable", "devsEdit"]

const NewButtomHandler = (setNewDev, levels) => {
  setNewDev({
    id: null,
    level: levels[0],
    nome: "",
    sexo: "",
    datanascimento: "1995-10-17",
    hobby: ""
  })
  document.getElementById("devsTable").style.display = "none";
  document.getElementById("devsEdit").style.display = "grid";
}
const NewOrEditDev = ({ newDev, setNewDev, setDevs, levels }) => {
  let id = newDev.id;
  let unsetValues = { 
    level: newDev.nome.trim() === "" ? "unset" : "set",
    nome: newDev.nome.trim() === "" ? "unset" : "set",
    sexo: newDev.sexo.trim() === "" ? "unset" : "set",
    datanascimento: newDev.datanascimento.trim() === "" ? "unset" : "set",
    hobby: newDev.hobby.trim() === "" ? "unset" : "set",
  }
  const editDev = (value, varName) => {
    let tempDev = { ...newDev }
    if (varName =="level")
      tempDev[varName] = levels.find(level=> level.nome==value)
    else
      tempDev[varName] = value
    
    setNewDev(tempDev)
    if (value.trim() === "") {
      unsetValues[varName] = "unset"
    } else {
      unsetValues[varName] = "set"
    }
  }
  const SetSymbol = ({ isSet }) => {
    if (isSet === "set")
      return (<code>&#9989;</code>)
    else if (isSet === "unset")
      return (<code>&#10060;</code>)
  }
  console.log(newDev);
  const OptLevels = levels.map(level => { return (<option key={level.nome}>{level.nome}</option>) })
  return (
    <div className="FullTable">
      <table >
        <tbody>
          <tr><th>Nome </th><td><input onChange={(event) => { editDev(event.target.value, "nome") }} value={newDev.nome} placeholder="nome" /> <SetSymbol isSet={unsetValues.nome} /> </td></tr>
          <tr><th>Level </th><td><select onChange={(event) => { editDev(event.target.value, "level") }} className="devSelector" value={newDev.level.nome}> {OptLevels} </select><SetSymbol isSet={unsetValues.datanascimento} /> </td></tr>
          <tr><th>Sexo </th><td><input onChange={(event) => { editDev(event.target.value, "sexo") }} value={newDev.sexo} placeholder="sexo" /> <SetSymbol isSet={unsetValues.sexo} /> </td></tr>
          <tr><th>Nascimento </th><td><input onChange={(event) => { editDev(event.target.value, "datanascimento") }} value={newDev.datanascimento} type="date" /> <SetSymbol isSet={unsetValues.datanascimento} /> </td></tr>
          <tr><th>Hobby </th><td><input onChange={(event) => { editDev(event.target.value, "hobby") }} value={newDev.hobby} placeholder="hobby" /> <SetSymbol isSet={unsetValues.hobby} /> </td></tr>
        </tbody>
      </table>
      <div >
        <button onClick={() => buttomHandler.save(id, newDev, setDevs, apiUrl, devSubTabs, unsetValues)}>Salvar</button>

        <button onClick={() => buttomHandler.discard(devSubTabs)}>Descartar</button>
      </div>
    </div>
  )
}

const ShowDevs = ({ refresh, levels }) => {

  const [devs, setDevs] = useState([])
  useEffect(() => {
    axios.get(apiUrl).then(response => setDevs(response.data))
  }, [refresh])

  const [newDev, setNewDev] = useState( nullDev )
  const [searchDev, setSearchDev] = useState('')
  const [sortBy, setSortBy] = useState("id")
  const [pageLen, setPageLen] = useState(12)
  const [page, setPage] = useState(1)
  const [pageNum, setPageNum] = useState(1)
  useEffect(() => {
    setPageNum(Math.ceil(devs.length / pageLen))
    setPage(1)
  }, [devs, pageLen])

  const ordenateDevs = devs.sort((a, b) => sortByTag(a, b, sortBy))
    .filter((dev) => (dev.nome.match(RegExp(searchDev, "i")) || searchDev === ""))

  const printDevs = ordenateDevs.map((dev, idx) => {
    if (idx >= pageLen * (page - 1) && idx < pageLen * (page))
      return (
        <tr key={dev.id}>
          <td>{dev.id}</td>
          <td>{dev.nome}</td>
          <td>{dev.level.nome}</td>
          <td>{dev.sexo}</td>
          <td>{invertDate(dev.datanascimento)}</td>
          <td>{getAge(dev.datanascimento)}</td>
          <td>{dev.hobby}</td>
          <td><button onClick={() => buttomHandler.edit(setNewDev, dev.id, apiUrl, devSubTabs)}>Editar</button>
            <button onClick={() => buttomHandler.delete(dev.id, setDevs, apiUrl, "desenvolvedor")}>Remover</button></td>
        </tr>)
  })

  return (
    <div>
      <div id="devsTable" className="FullTable">
        <input value={searchDev} placeholder="Buscar"
          onChange={(event) => setSearchDev(event.target.value)} style={{ "minInlineSize": "-webkit-fill-available" }} />
        <table>
          <thead>
            <tr>
              <TableHeader tag="ID" sortTag="id" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Nome" sortTag="nome" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Nivel" sortTag="level" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Sexo" sortTag="sexo" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Nascimento" sortTag="datanascimento" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Idade" sortTag="idade" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Hobby" sortTag="hobby" sortBy={sortBy} setSortBy={setSortBy} />
              <th><button onClick={() => { NewButtomHandler(setNewDev, levels) }}>Adicionar Dev</button></th>
            </tr>
          </thead>
          <tbody>
            {printDevs}
          </tbody>
        </table>
        < PageSelector page={page} pageNum={pageNum} setPage={setPage} setPageLen={setPageLen} pageLen={pageLen} />
      </div>
      <div id="devsEdit" style={{ display: "none" }}>
        <NewOrEditDev newDev={newDev} setNewDev={setNewDev} setDevs={setDevs} levels={levels} />
      </div>
    </div>
  )
}

export default ShowDevs