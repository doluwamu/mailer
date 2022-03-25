const environment = process.env.NODE_ENV;

const errorHandler = (err, req, res, next) => {
  const data = {
    status: "error",
    message: err.message,
  };
  if (environment === "development") {
    data.error = err.stack;
  }
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  if (environment !== "development" && err.statusCode === 500) {
    data.message = "Something went very wrong";
  }
  console.error(err.message);
  res.status(err.statusCode).json(data);
};

export default errorHandler;
