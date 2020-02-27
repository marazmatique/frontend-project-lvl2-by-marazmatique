export const isObject = (ele) => typeof ele === 'object';

export const stringify = (obj) => Object.fromEntries(Object.entries(obj)
  .map(([key, value]) => [key, !/[^0-9]/.test(value) ? parseInt(value, 10) : value]));

export const diff = (ast) => {
  const iter = (arr) => arr
    .reduce((acc, [key, status, value, newValue]) => {
      if (Array.isArray(value)) {
        acc[key] = iter(value);
      }

      switch (true) {
        case (status === 'changed'):
          acc[key] = ['was changed', value, newValue];
          return acc;
        case (status === '-'):
          acc[key] = 'was deleted';
          return acc;
        case (status === '+'):
          acc[key] = ['was added with value', isObject(value) ? stringify(value) : value];
          return acc;
        default:
          return acc;
      }
    }, {});

  return JSON.stringify(iter(ast), null, 2);
};

export default diff;
