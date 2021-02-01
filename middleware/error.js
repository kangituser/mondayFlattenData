module.exports = (error, req, res, next) => {
  return res.status(500).res({ message: error.message });
}