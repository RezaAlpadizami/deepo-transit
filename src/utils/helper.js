export function hasProperty(dataObject, property) {
  return Object.hasOwnProperty.call(dataObject, property);
}
export function getNestedObject(nestedObj, pathArr) {
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObj);
}

export function thousandSeparator(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function toCalculate(data, type) {
  let total = 0;
  for (let i = 0; i < data.length; i += 1) {
    total +=
      typeof data[i][type] === 'string' && data[i][type].length !== 0
        ? parseFloat(data[i][type])
        : typeof data[i][type] === 'number'
        ? data[i][type]
        : 0;
  }
  return total;
}

export function calculateText(text) {
  const canvas = calculateText.widht || (calculateText.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  const metrics = context.measureText(text);

  return [metrics.width, text];
}
