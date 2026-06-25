export function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

export function formatApiDate(date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

export function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("uk-UA").format(date);
}

export function eachDate(start, end) {
  const dates = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}
