import { useState, useEffect } from 'react'
import './style.css'
import ShowDevs from './devs.js'
import ShowLevels from './levels.js'
const apiUrl = 'http://localhost:3001/api'

const openTab = (event, tab, setRefresh) => {
  var i, tabcontent, tablinks;
  setRefresh(tab)
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tab).style.display = "block";
  event.currentTarget.className += " active";
}


const App = () => {

  const [refresh, setRefresh] = useState("devs")
  const [levels, setLevels] = useState([])

  return (
    <div>
      <div className="tab">
        <button className="tablinks active" onClick={(event) => openTab(event, "devs", setRefresh)}> Desenvolvedores </button>
        <button className="tablinks" onClick={(event) => openTab(event, "levels", setRefresh)}> Níveis </button>
      </div>
      <div className="tabcontent" id="devs">
        <p> </p>
        < ShowDevs refresh={refresh} levels={levels} />
        {/* <NewOrEditDev /> */}
      </div>
      <p> </p>
      <div className="tabcontent" id="levels">
        < ShowLevels id="levels" levels={levels} setLevels={setLevels} refresh={refresh} />
      </div>

    </div>

  )
}

export default App