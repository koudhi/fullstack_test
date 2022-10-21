import axios from "axios"
const buttomHandler = {
  edit: (setNewVar, id, apiUrl, subTabs) => {
    if (id != null) {
      axios
        .get(apiUrl + id)
        .then(response => {
          setNewVar(response.data)
        })
    }
    document.getElementById(subTabs[0]).style.display = "none";
    document.getElementById(subTabs[1]).style.display = "grid";
  },
  delete: (id, setVar, apiUrl, Var) => {

    if (id != null) {
      if (window.confirm('Remover o ' + Var + '?')) {
        console.log(id);
        axios
          .delete(apiUrl + id)
          .then(response => {
            setVar(response.data)
            window.alert(Var + " removido")
          })
          .catch(()=>window.alert(Var+" não encontrado no sistema"))
      }
    }
  },
  discard: (subTabs) => {
    document.getElementById(subTabs[0]).style.display = "grid";
    document.getElementById(subTabs[1]).style.display = "none";
  },
  save: (id, newVal, setVal, apiUrl, subTabs, unsetValues) => {
    let unsetKeys=[]
    for (const key in unsetValues) {
      if(unsetValues[key]=="unset")
        unsetKeys=unsetKeys.concat(key)
    }
    if (unsetKeys.length){
      window.alert("Todos os campos devem estar preenchidos")
    }else if (id == null) {
      axios
        .post(apiUrl, newVal)
        .then(response => {
          setVal(response.data)
          document.getElementById(subTabs[0]).style.display = "grid";
          document.getElementById(subTabs[1]).style.display = "none";
          window.alert("Adicionado com sucesso")
        })
        .catch(ax => window.alert(ax.response.data))
    } else {
      axios
        .put(apiUrl + id, newVal)
        .then(response => {
          setVal(response.data)
          window.alert("Modificado com sucesso")
        })
        .catch(ax => window.alert(ax.response.data))
          document.getElementById(subTabs[0]).style.display = "grid";
          document.getElementById(subTabs[1]).style.display = "none";
    }
  }
}
export default buttomHandler