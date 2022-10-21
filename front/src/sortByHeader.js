const changeSort = (sortBy,setSortBy,value) =>{
    if (sortBy===value){
      setSortBy("-"+value)
    }else{
      setSortBy(value)
    }
  }
const TableHeader = ({ tag, sortBy, sortTag, setSortBy }) => {
  let symbol = ""
  if (sortBy === sortTag)
    symbol = <code>&#8593;</code>
  if (sortBy === "-" + sortTag)
    symbol = <code>&#8595;</code>
  return (<th onClick={() => { changeSort(sortBy, setSortBy, sortTag); }}>{tag}{symbol}</th>)
}
const sortByTag = (a, b, sortBy) => {
  let sortType = sortBy
  let mult = 1
  if (sortType[0] === '-') {
    sortType = sortType.slice(1)
    mult = -1
  }
  if (sortType === "idade") {
    sortType = "datanascimento"
    mult *= -1
  }
  if (b[sortType] > a[sortType])
    return -mult;
  if (b[sortType] < a[sortType])
    return mult;
  return 0;
}

  export {changeSort,TableHeader, sortByTag} 