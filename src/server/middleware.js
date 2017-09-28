const setDefaultResponseLocals = (request, response, next) => {
  if (request.session.userId) {
    response.locals.session = true;
    response.locals.role = request.session.role;
    response.locals.userId = request.session.userId;
  } else {
    response.locals.session = false;
    response.locals.role = undefined;
    response.locals.userId = undefined;
  }

  response.locals.book = undefined;
  response.locals.errorMessage = undefined;
  next();
};

module.exports = setDefaultResponseLocals;
