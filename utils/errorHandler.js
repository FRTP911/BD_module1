module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(v => v.message);
    return res.status(400).json({
      message: messages.join(', ')
    });
  }

  res.status(500).json({
    message: "Внутрішня помилка сервера"
  });
};