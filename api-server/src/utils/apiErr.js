export default class ApiErr extends Error {
  constructor(status, statusCode, message) {
    super()
    this.status = status
    this.statusCode = statusCode
    this.message = message
  }
}
