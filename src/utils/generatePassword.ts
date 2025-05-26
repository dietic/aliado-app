export const generateReadablePassword = () => {
  const words = ['cloud', 'mint', 'door', 'coffee', 'hill', 'light', 'sun', 'snow', 'tree', 'sky']
  const pick = () => words[Math.floor(Math.random() * words.length)]
  const num = Math.floor(10 + Math.random() * 90)
  return `${pick()}-${pick()}-${num}`
}
