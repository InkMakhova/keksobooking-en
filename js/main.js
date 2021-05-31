function getRandomInteger(min, max) {
  if (min < 0 || max < 0) {
    return -1;
    //console.log('Числа не могут быть отрицательными');
  } else if (max < min) {
    return -1;
    //console.log('Число ДО не может быть меньше числа ОТ');
  } else if (min === max) {
    if (min === Math.floor(min)) {
      return min;
    }
    return -1;
    //console.log('В заданном диапазоне невозможно вычислить целое число');
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

getRandomInteger(35.3672, 87.67);

function getRandomFloat(min, max, numberOfDigitsAfterComma) {
  if (min < 0 || max < 0) {
    return -1;
    //console.log('Координаты не могут быть отрицательными');
  } else if (max < min) {
    return -1;
    //console.log('Координата ДО не может быть меньше координаты ОТ');
  } else if (min === max) {
    return min.toFixed(numberOfDigitsAfterComma);
    //console.log(min.toFixed(numberOfDigitsAfterComma));
  }
  return ((Math.random() * (max - min)) + min).toFixed(numberOfDigitsAfterComma);
  //console.log(((Math.random() * (max - min)) + min).toFixed(numberOfDigitsAfterComma));
}

getRandomFloat(575.6, 7990.7878, 2);
