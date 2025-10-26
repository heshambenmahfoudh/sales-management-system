export const globalErr = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'err'

  process.env.NODE_ENV === 'development'
    ? development(res, err)
    : production(res, err)
}

const development = (res, err) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    err: err,
    stack: err.stack,
  })
}

const production = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
}
