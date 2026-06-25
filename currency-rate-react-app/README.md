# Курс валют НБУ на React

React-застосунок для перегляду офіційного курсу валют у вибраному діапазоні дат.

## Можливості

- вибір валюти;
- вибір початкової та кінцевої дати;
- завантаження курсу з відкритого API НБУ;
- підсумок: початковий курс, кінцевий курс, зміна, середнє значення;
- графік динаміки;
- таблиця значень;
- експорт таблиці у CSV.

## Як запустити

### Варіант 1: через файл запуску на Windows

Відкрийте файл `start.bat`.

### Варіант 2: через термінал

```bash
npm install
npm run dev
```

Після запуску відкрийте адресу, яку покаже Vite, зазвичай:

```text
http://localhost:5173
```

## Структура

```text
src/
  components/
    RateChart.jsx
    RatesTable.jsx
    SummaryCards.jsx
  services/
    nbuApi.js
  utils/
    date.js
  App.jsx
  main.jsx
  styles.css
```

## Джерело даних

Дані беруться з API Національного банку України:

```text
https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange
```
