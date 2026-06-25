export default function SummaryCards({ rates }) {
  if (!rates.length) {
    return (
      <section className="summary" aria-label="Підсумок">
        <SummaryCard label="Початковий курс" value="-" />
        <SummaryCard label="Кінцевий курс" value="-" />
        <SummaryCard label="Зміна" value="-" />
        <SummaryCard label="Середній курс" value="-" />
      </section>
    );
  }

  const first = rates[0].value;
  const last = rates.at(-1).value;
  const change = last - first;
  const average = rates.reduce((sum, item) => sum + item.value, 0) / rates.length;

  return (
    <section className="summary" aria-label="Підсумок">
      <SummaryCard label="Початковий курс" value={first.toFixed(4)} />
      <SummaryCard label="Кінцевий курс" value={last.toFixed(4)} />
      <SummaryCard
        label="Зміна"
        value={`${change >= 0 ? "+" : ""}${change.toFixed(4)}`}
        className={change >= 0 ? "positive" : "negative"}
      />
      <SummaryCard label="Середній курс" value={average.toFixed(4)} />
    </section>
  );
}

function SummaryCard({ label, value, className = "" }) {
  return (
    <article>
      <span>{label}</span>
      <strong className={className}>{value}</strong>
    </article>
  );
}
