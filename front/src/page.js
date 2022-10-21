const pageIncrement = (page, setPage, increment, limit, id) => {
    if ((page + increment) < limit)
      setPage(page + increment)
  }
  const pageReduce = (page, setPage, increment, limit, id) => {
    if ((page - increment) > limit)
      setPage(page - increment)
  }
  const PageSelector = ({page,pageNum,setPage,setPageLen, pageLen}) => {
    return (<div>
  
      <div  >
        <button onClick={() => pageReduce(page, setPage, 1, 0, "")}>-</button> Pagina {page} de {pageNum} <button onClick={() => pageIncrement(page, setPage, 1, pageNum + 1, "")}>+</button>
        {"   "}
        <select onChange={(event) => setPageLen(event.target.value)} value={pageLen} style={{textAlign: "end"}} >
          <option>12</option>
          <option>24</option>
          <option>36</option>
          <option>48</option>
          <option>100</option>
        </select></div>
    </div>
    )
  }
  export default PageSelector