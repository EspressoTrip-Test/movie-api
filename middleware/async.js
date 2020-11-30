/* THIS IS NOT USED IN THIS APPLICATION EXPRESS-ASYNC-ERRORS IS USED */

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncMiddleware;
