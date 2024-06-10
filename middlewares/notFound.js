const notFound = (req, res, next) => {
    res.status(404).json({error: "La rotta non è stata trovata"})
}
module.exports= notFound;