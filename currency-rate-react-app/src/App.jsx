import { useMemo, useRef, useState } from "react";
import RateChart from "./components/RateChart.jsx";
import RatesTable from "./components/RatesTable.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import { fetchRate } from "./services/nbuApi.js";
import { eachDate, formatApiDate, toInputDate } from "./utils/date.js";

const currencies = [
  { code: "USD", label: "USD - долар США" },
  { code: "EUR", label: "EUR - євро" },
  { code: "GBP", label: "GBP - фунт стерлінгів" },
  { code: "PLN", label: "PLN - польський злотий" },
  { code: "CHF", label: "CHF - швейцарський франк" },
  { code: "CAD", label: "CAD - канадський долар" },
];

function getDefaultDates() {
  const today = new Date();
  const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);

  return {
    startDate: toInputDate(start),
    endDate: toInputDate(end),
  };
}

export default function App() {
  const defaults = useRef(getDefaultDates());
  const [currency, setCurrency] = useState("USD");
  const [startDate, setStartDate] = useState(defaults.current.startDate);
  const [endDate, setEndDate] = useState(defaults.current.endDate);
  const [rates, setRates] = useState([]);
  const [message, setMessage] = useState("Дані ще не завантажено.");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rangeLabel = useMemo(() => {
    if (!rates.length) return "";
    return `${rates[0].date} - ${rates.at(-1).date}`;
  }, [rates]);

  async function handleLoadRates() {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T00:00:00.000Z`);

    if (!startDate || !endDate) {
      setMessage("Оберіть початкову та кінцеву дату.");
      setIsError(true);
      return;
    }

    if (start > end) {
      setMessage("Початкова дата має бути раніше або дорівнювати кінцевій.");
      setIsError(true);
      return;
    }

    const dates = eachDate(start, end);

    if (dates.length > 31) {
      setMessage("Оберіть діапазон до 31 дня, щоб запит не був занадто довгим.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMessage("Завантажую курси валют...");

    try {
      const loadedRates = (
        await Promise.all(dates.map((date) => fetchRate(currency, formatApiDate(date), date)))
      ).filter(Boolean);

      setRates(loadedRates);

      if (!loadedRates.length) {
        setMessage("За вибраний період даних не знайдено.");
        setIsError(true);
        return;
      }

      setMessage(`Завантажено ${loadedRates.length} записів.`);
    } catch (error) {
      setRates([]);
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownloadCsv() {
    if (!rates.length) {
      setMessage("Спочатку завантажте дані для таблиці.");
      setIsError(true);
      return;
    }

    const header = "date,currency,name,rate";
    const rows = rates.map((rate) =>
      [rate.rawDate, rate.currency, `"${rate.name.replaceAll('"', '""')}"`, rate.value.toFixed(4)].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `rates-${currency}-${startDate}-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Національний банк України</p>
        <h1>Курс валют у вибраному діапазоні дат</h1>
        <p className="subtitle">
          Оберіть валюту та проміжок часу, щоб побачити офіційний курс НБУ,
          динаміку змін і таблицю значень за кожен день.
        </p>
      </section>

      <section className="controls" aria-label="Фільтри">
        <label>
          Валюта
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Початкова дата
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <label>
          Кінцева дата
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>

        <button type="button" disabled={isLoading} onClick={handleLoadRates}>
          {isLoading ? "Завантаження..." : "Показати курс"}
        </button>
      </section>

      <p className={`message ${isError ? "error" : ""}`} role="status">
        {message}
      </p>

      <SummaryCards rates={rates} />

      <section className="chart-panel">
        <div className="panel-heading">
          <h2>Графік курсу</h2>
          <span>{rangeLabel}</span>
        </div>
        <RateChart rates={rates} />
      </section>

      <section className="table-panel">
        <div className="panel-heading">
          <h2>Таблиця значень</h2>
          <button id="downloadButton" type="button" onClick={handleDownloadCsv}>
            Завантажити CSV
          </button>
        </div>
        <RatesTable rates={rates} />
      </section>
    </main>
  );
}
