export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  //In case we get an invalid date string (like '', or not YYYY-MM-DD)
  if (!isFinite(date)) return dateStr
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refusé"
  }
}

export const parseFrenchDate = (frenchDate) => {
  if (!/((\d)|([1-2]\d)|(3[0-1]))\s((Jan)|(Fév)|(Mar)|(Avr)|(Mai)|(Jui)|(Aoû)|(Sep)|(Oct)|(Nov)|(Déc))\.\s\d{2}/.test(frenchDate)) {
    //In case it's not formated like a French Date
    const dateObj = new Date(frenchDate)
    if (isFinite(dateObj)) return dateObj
    //We couldn't parse the date so we leave it at the end
    return -1000000000000000000000
  }
  const splitDate = frenchDate.split(' ')
  const monthFr = splitDate[1].slice(0,3)
  const day = splitDate[0]
  const year = splitDate[2]
  let monthEn;
  switch (monthFr) {
    case 'Fév':
      monthEn = 'Feb'
      break
    case 'Avr':
      monthEn = 'Apr'
      break
    case 'Mai':
      monthEn = 'May'
      break
    case 'Jui':
      monthEn = 'Jun'
      break
    case 'Aoû':
      monthEn = 'Aug'
      break
    case 'Déc':
      monthEn = 'Dec'
      break
    default:
      monthEn = monthFr;
  }
  const updatedDateString = `${day} ${monthEn} ${year}`
  return new Date(updatedDateString)
}