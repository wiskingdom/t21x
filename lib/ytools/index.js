module.exports = {
  functools: {
    pipe,
    tap,
    logTap,
    memoize,
  },
  convtools: {
    exdateToDate,
    DatetoString,
  },
};

function pipe(funcs) {
  return (initData) => funcs.reduce((data, f) => f(data), initData);
}

function tap(func) {
  return (action) => (arg) => {
    action(arg);
    return func(arg);
  };
}

function logTap(func, log) {
  const action = () => console.log(log);
  return tap(func)(action);
}

function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    const result = cache.has(arg) ? cache.get(arg) : fn(arg);
    cache.set(arg, result);
    return result;
  };
}

function exdateToDate(excelDate) {
  return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
}

function DatetoString(unixDate) {
  const year = unixDate.getFullYear();
  const month = unixDate.getMonth() + 1;
  const day = unixDate.getDate();
  const pad = (int) => `${int}`.padStart(2, 0);
  return `${year}-${pad(month)}-${pad(day)}`;
}
