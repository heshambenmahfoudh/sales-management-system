
export default  function getInitialName(fullName) {
  const words = fullName?.split(' ')
  const initial = words?.map((w) => w?.charAt(0))?.join('')
  return initial?.toUpperCase()
}
