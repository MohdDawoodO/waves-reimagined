function floorNumber(number: number, decimals: number) {
  const pow = 10 ** decimals;

  const roundedNumber = Math.trunc(number * pow) / pow;

  if (!roundedNumber.toString().includes(".")) {
    return roundedNumber.toFixed(decimals);
  }

  return roundedNumber;
}

export function formatNumber(number: number) {
  let formattedNumber: string = number.toString();

  switch (true) {
    case number >= 1000 && number < 1000000:
      formattedNumber =
        floorNumber(number / 1000, number < 10000 ? 2 : 1) + "K";
      break;
    case number >= 1000000 && number < 1000000000:
      formattedNumber =
        floorNumber(number / 1000000, number < 10000000 ? 2 : 1) + "K";
      break;
    case number >= 1000000000 && number < 1000000000000:
      formattedNumber =
        floorNumber(number / 1000000000, number < 1000000000 ? 2 : 1) + "K";
      break;
  }

  // I dont even expect 1000 or 1k lol
  return formattedNumber;
}
