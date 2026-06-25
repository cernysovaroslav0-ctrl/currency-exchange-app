export default function RatesTable({ rates }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Валюта</th>
            <th>Назва</th>
            <th>Курс, грн</th>
          </tr>
        </thead>
        <tbody>
          {!rates.length ? (
            <tr>
              <td colSpan="4">Дані ще не завантажено.</td>
            </tr>
          ) : (
            rates.map((rate) => (
              <tr key={rate.rawDate}>
                <td>{rate.date}</td>
                <td>{rate.currency}</td>
                <td>{rate.name}</td>
                <td>{rate.value.toFixed(4)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
