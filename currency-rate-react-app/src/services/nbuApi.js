import { formatDisplayDate, toInputDate } from "../utils/date.js";

const API_URL = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange";

export async function fetchRate(currency, apiDate, originalDate) {
  const response = await fetch(`${API_URL}?valcode=${currency}&date=${apiDate}&json`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати дані від НБУ.");
  }

  const [rate] = await response.json();

  if (!rate) {
    return null;
  }

  return {
    date: formatDisplayDate(originalDate),
    rawDate: toInputDate(originalDate),
    currency: rate.cc,
    name: rate.txt,
    value: Number(rate.rate),
  };
}
