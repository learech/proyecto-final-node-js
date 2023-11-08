import bcrypt from 'bcrypt'

const createHash = (pass) => {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}
const isValidPass = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
}
export default { createHash, isValidPass }