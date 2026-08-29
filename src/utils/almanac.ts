import * as SunCalc from 'suncalc';
import type { AlmanacDay } from '../data/keepsakeData';

const MOON_NAMES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];
const MOON_ICONS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

const SEASONS: [number, string][] = [
  [11, 'Winter'], [0, 'Winter'], [1, 'Late Winter'],
  [2, 'Early Spring'], [3, 'Spring'], [4, 'Late Spring'],
  [5, 'Early Summer'], [6, 'High Summer'], [7, 'High Summer'],
  [8, 'Early Autumn'], [9, 'Autumn'], [10, 'Late Autumn'],
];

const WEATHER_LORE = [
  'Red sky at night, sailor\'s delight; red sky at morning, sailors take warning.',
  'When dew lies thick upon the morning grass, expect a clear, warm day to pass.',
  'When leaves show their undersides, be very sure that rain betides.',
  'A ring around the moon means rain will come soon.',
  'Clear moon, frost soon.',
  'Rain before seven, fine before eleven.',
  'When smoke descends, good weather ends.',
];

const DEFAULT_LOCATION = { lat: 45.5152, lon: -122.6784 }; // Portland, OR — replace with the operator's real reference location

export function getSeasonName(date: Date): string {
  return SEASONS.find(([m]) => m === date.getMonth())?.[1] ?? 'Unknown Season';
}

export function getLunarPhase(date: Date): { icon: string; label: string } {
  const illum = SunCalc.getMoonIllumination(date);
  const idx = Math.round(illum.phase * 8) % 8;
  const pct = Math.round(illum.fraction * 100);
  return { icon: MOON_ICONS[idx], label: `${MOON_NAMES[idx]} (${pct}% Light)` };
}

export function getSunTimes(date: Date, lat = DEFAULT_LOCATION.lat, lon = DEFAULT_LOCATION.lon) {
  const times = SunCalc.getTimes(date, lat, lon);
  const fmt = (d: Date | null) =>
    !d || isNaN(d.getTime()) ? '—' : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return { sunrise: fmt(times.sunrise), sunset: fmt(times.sunset) };
}

export function getWeatherLore(date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return WEATHER_LORE[dayOfYear % WEATHER_LORE.length];
}

export function toMonthDay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildTodayAlmanac(
  date: Date,
  onThisDayEvents: AlmanacDay['onThisDayEvents'] = []
): AlmanacDay {
  const lunar = getLunarPhase(date);
  return {
    dateString: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    seasonName: getSeasonName(date),
    lunarPhase: lunar.label,
    lunarIcon: lunar.icon,
    sunInfo: getSunTimes(date),
    weatherLore: getWeatherLore(date),
    quote: {
      text: 'The stories we tell our children become the foundation stones upon which they build their tomorrows.',
      author: 'Eleanor Vance, 1948',
    },
    onThisDayEvents,
  };
}
