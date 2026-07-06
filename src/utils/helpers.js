const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const WEEKDAYS_FULL = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado'
];


export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatWeekday(dateStr, { full = false } = {}) {
  const date = parseDate(dateStr);
  return full ? WEEKDAYS_FULL[date.getDay()] : WEEKDAYS[date.getDay()];
}

export function formatDay(dateStr) {
  const date = parseDate(dateStr);
  return date.getDate();
}

export function isToday(dateStr) {
  const date = parseDate(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function round(value) {
  return Math.round(value);
}

export function dayProgress(sunriseStr, sunsetStr) {
  const now = new Date();
  const toMinutes = (t) => {
    const [time, meridian] = t.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (meridian === 'PM' && h !== 12) h += 12;
    if (meridian === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sunrise = toMinutes(sunriseStr);
  const sunset = toMinutes(sunsetStr);

  if (nowMinutes <= sunrise) return 0;
  if (nowMinutes >= sunset) return 1;
  return (nowMinutes - sunrise) / (sunset - sunrise);
}
