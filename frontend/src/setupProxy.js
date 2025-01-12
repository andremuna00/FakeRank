const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const challenge = process.env.CHALLENGE_ADDRESS;
  const codeExecution = process.env.CODEEXECUTION_ADDRESS;
  const submission = process.env.SUBMISSION_ADDRESS;
  const userManagement = process.env.USERMANAGEMENT_ADDRESS;

  //challenge service
  const challenge_proxy = createProxyMiddleware({
    target: 'http://' + challenge + ':8081',
    changeOrigin: true,
  });

  app.use(
    '/api/challenges',
    challenge_proxy
  );

  app.use(
    '/api/exercises',
    challenge_proxy
  );

  app.use(
    '/api/testcases',
    challenge_proxy
  );

  //codeExecution service
  const codeExecution_proxy = createProxyMiddleware({
    target: 'http://' + codeExecution + ':8082',
    changeOrigin: true,
  })

  app.use(
    '/api/execute',
    codeExecution_proxy
  );

  app.use(
    '/api/results',
    codeExecution_proxy
  );

  //submission service
  const submission_proxy = createProxyMiddleware({
    target: 'http://' + submission + ':8083',
    changeOrigin: true,
  })

  app.use(
    '/api/exercise_submissions',
    submission_proxy
  );

  app.use(
    '/api/submissions',
    submission_proxy
  );

  //userManagement service
  const userManagement_proxy = createProxyMiddleware({
    target: 'http://' + userManagement + ':8084',
    changeOrigin: true,
  })

  app.use(
    '/api/users',
    userManagement_proxy
  );


};