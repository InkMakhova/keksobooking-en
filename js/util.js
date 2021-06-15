function getRandomInteger(min, max) {
  if (min < 0 || max < 0) {
    return -1;
  } else if (max < min) {
    return -1;
  } else if (min === max) {
    if (min === Math.floor(min)) {
      return min;
    }
    return -1;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, numberOfDigitsAfterComma) {
  if (min < 0 || max < 0) {
    return -1;
  } else if (max < min) {
    return -1;
  } else if (min === max) {
    return min.toFixed(numberOfDigitsAfterComma);
  }
  return ((Math.random() * (max - min)) + min).toFixed(numberOfDigitsAfterComma);
}

export {getRandomInteger, getRandomFloat};
