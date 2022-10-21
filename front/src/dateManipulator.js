const invertDate = (date) => {
    const splitDate = date.split("-")
    return (splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0])
}

const getAge = (date) => {
  const birthday = new Date(date + "T00:00:00")
  return new Date(Date.now() - birthday.getTime()).getFullYear() - 1970
}

export {invertDate, getAge}