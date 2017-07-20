import { WARN, ERROR, LOG } from './constants';

const logger = console;

[
  [ 'warn', WARN ],
  [ 'error', ERROR ],
  [ 'log', LOG ]
].forEach(function(pair) {
  var method = pair[0], reset = '\x1b[0m', color = '\x1b[36m' + pair[1];
  logger[method] = logger[method].bind(console, color, method.toUpperCase(), reset);
});

export default logger;
