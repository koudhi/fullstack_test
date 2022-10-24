import axios from 'axios'
import { useState, useEffect } from 'react'
import { TableHeader, sortByTag } from './sortByHeader'
import buttomHandler from './buttom'
import PageSelector from './page'

const levelSubTabs = ["levelTable", "levelEdit"]
const apiUrl = 'http://localhost:3001/api/levels/'
//const apiUrl = '/api/levels/'

const NewButtomHandler = (setNewLevel) => {
  setNewLevel({
    id: null,
    level: ""
  })
  document.getElementById("levelTable").style.display = "none";
  document.getElementById("levelEdit").style.display = "grid";
}

const NewOrEditLevel = ({ newLevel, setNewLevel, setLevels }) => {
  let id = newLevel.id;
  const editLevel = (value, varName) => {
    console.log(value);
    let tempLevel = { ...newLevel }
    tempLevel[varName] = value
    setNewLevel(tempLevel)
    if (newLevel.nome.trim() === "")
      unsetValues.nome = "unset"
    else
      unsetValues.nome = "set"


  }
  let unsetValues = {
    level: "set",
    //level: newLevel.nome.trim() === "" ? "unset" : "set",
  }
  const SetSymbol = ({ isSet }) => {
    if (isSet === "set")
      return (<code>&#9989;</code>)
    else if (isSet === "unset")
      return (<code>&#10060;</code>)
  }
  return (
    <div className="FullTable">
      <table>
        <tbody>
          <tr><th>Nível </th><td><input onChange={(event) => { editLevel(event.target.value, "nome") }} value={newLevel.nome} placeholder="nível" /><SetSymbol isSet={unsetValues.nome} /></td></tr>
        </tbody>
      </table>
      <div>
        <button onClick={() => buttomHandler.save(id, newLevel, setLevels, apiUrl, levelSubTabs, unsetValues)}>Salvar</button>
        <button onClick={() => buttomHandler.discard(levelSubTabs)}>Descartar</button>
      </div>
    </div>
  )
}
const ShowLevels = ({ refresh, levels, setLevels }) => {
  const [searchLevel, setSearchLevel] = useState('')
  const [newLevel, setNewLevel] = useState({id: undefined,level:""})
  const [sortBy, setSortBy] = useState("id")
  const [pageLen, setPageLen] = useState(12)
  const [page, setPage] = useState(1)
  const [pageNum, setPageNum] = useState(1)
  useEffect(() => {
    setPageNum(Math.ceil(levels.length / pageLen))
    setPage(1)
  }, [levels, pageLen])

  useEffect(() => {
    axios
      .get(apiUrl)
      .then(response => setLevels(response.data) )
  }, [refresh, setLevels])
  
  const ordenanteLevels = levels.sort((a, b) => sortByTag(a, b, sortBy))
    .filter(level =>(level.nome.match(RegExp(searchLevel, "i")) || searchLevel === ""))

  const printLevels = ordenanteLevels.map((level, idx) => {
    if (idx >= pageLen * (page - 1) && idx < pageLen * (page))
      return (
        <tr key={level.id}>
          <td>{level.id}</td>
          <td>{level.nome}</td>
          <td>{level.numberOfDevs}</td>
          <td>
            <button onClick={() => buttomHandler.edit(setNewLevel, level.id, apiUrl, levelSubTabs)}>Editar</button>
            <button onClick={() => buttomHandler.delete(level.id, setLevels, apiUrl, "nível")}>Remover</button>
          </td>
        </tr>)
  })

  return (
    <div >
      <div id="levelTable" className="FullTable">
        <input value={searchLevel} placeholder="Buscar"
          onChange={(event) => setSearchLevel(event.target.value)} style={{ "minInlineSize": "-webkit-fill-available" }} />
        <table>
          <thead>
            <tr>
              <TableHeader tag="ID" sortTag="id" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="Nível" sortTag="level" sortBy={sortBy} setSortBy={setSortBy} />
              <TableHeader tag="# Devs" sortTag="numberOfDevs" sortBy={sortBy} setSortBy={setSortBy} />
              <th><button onClick={() => { NewButtomHandler(setNewLevel) }}>Adicionar nível</button></th>
            </tr>
          </thead>
          <tbody>
            {printLevels}
          </tbody>
        </table>
        < PageSelector page={page} pageNum={pageNum} setPage={setPage} setPageLen={setPageLen} pageLen={pageLen} />
      </div>
      <div id="levelEdit" style={{ display: "none" }}>
        <NewOrEditLevel newLevel={newLevel} setNewLevel={setNewLevel} setLevels={setLevels} />
      </div>
    </div>
  )
}
export default ShowLevels