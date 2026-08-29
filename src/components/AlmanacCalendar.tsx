import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift, Bell } from 'lucide-react';
import { usePersistedState } from '../hooks/usePersistedState';
import { isSameCalendarDay } from '../utils/almanac';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Birthday' | 'Anniversary' | 'Tradition' | 'Memorial' | 'Harvest';
  personOrGroup: string;
  notes: string;
}

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Grandmother Rose's 102nd Birth Anniversary",
    date: "2026-08-14",
    type: "Birthday",
    personOrGroup: "Rose Sterling Harrison",
    notes: "Bake her favorite blackberry cardamom pie & share memories over dinner."
  },
  {
    id: "evt-2",
    title: "David & Clara 45th Sapphire Wedding Anniversary",
    date: "2026-09-18",
    type: "Anniversary",
    personOrGroup: "David & Clara Harrison",
    notes: "Family weekend trip to Emerald Bay Cottage."
  },
  {
    id: "evt-3",
    title: "Annual Autumn Harvest Lantern Walk",
    date: "2026-10-18",
    type: "Tradition",
    personOrGroup: "Entire Family",
    notes: "Craft parchment lanterns & gather at Pine Hill Orchard at dusk."
  },
  {
    id: "evt-4",
    title: "Great-Grandfather Arthur's Memorial Remembrance Day",
    date: "2026-11-03",
    type: "Memorial",
    personOrGroup: "Arthur Sterling",
    notes: "Light a memorial candle in the library & read his woodshop journal entry."
  }
];

const today = new Date();

export const AlmanacCalendar: React.FC = () => {
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.getMonth());
  const [events, setEvents] = usePersistedState<CalendarEvent[]>('keepsake_calendar_events', INITIAL_CALENDAR_EVENTS);
  const [showAddEvent, setShowAddEvent] = useState<boolean>(false);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState<'Birthday' | 'Anniversary' | 'Tradition' | 'Memorial'>('Birthday');
  const [newEventNotes, setNewEventNotes] = useState('');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setViewYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setViewYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      type: newEventType,
      personOrGroup: "Family",
      notes: newEventNotes
    };

    setEvents([newEvt, ...events]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventNotes('');
    setShowAddEvent(false);
  };

  const daysInMonth = new Date(viewYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, currentMonthIndex, 1).getDay();

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Bar */}
      <div className="bg-white/90 rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif-title font-bold text-stone-900">
            Heirloom Calendar & Anniversaries
          </h2>
          <p className="text-sm text-stone-600 font-garamond italic">
            Track family birthdays, wedding jubilees, seasonal lore, and remembrance days
          </p>
        </div>

        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-amber-100 font-medium text-xs rounded-lg transition shadow-xs flex items-center space-x-2 self-start sm:self-auto"
        >
          <Bell className="w-4 h-4 text-amber-300" aria-hidden="true" />
          <span>{showAddEvent ? 'Close Form' : '+ Add Anniversary / Date'}</span>
        </button>
      </div>

      {/* Add Event Form Modal / Inline */}
      {showAddEvent && (
        <form onSubmit={handleAddEventSubmit} className="bg-amber-100/70 p-6 rounded-2xl border border-amber-300 shadow-sm space-y-4">
          <h3 className="text-base font-serif-title font-bold text-amber-950">Add New Family Anniversary or Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="cal-event-title" className="block text-xs font-semibold text-amber-900 mb-1">Event Title</label>
              <input
                id="cal-event-title"
                type="text"
                required
                placeholder="e.g. Uncle John's Birthday"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="cal-event-date" className="block text-xs font-semibold text-amber-900 mb-1">Date</label>
              <input
                id="cal-event-date"
                type="date"
                required
                value={newEventDate}
                onChange={e => setNewEventDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor="cal-event-type" className="block text-xs font-semibold text-amber-900 mb-1">Category Type</label>
              <select
                id="cal-event-type"
                value={newEventType}
                onChange={e => setNewEventType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Tradition">Tradition</option>
                <option value="Memorial">Memorial</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="cal-event-notes" className="block text-xs font-semibold text-amber-900 mb-1">Notes / Instructions</label>
            <input
              id="cal-event-notes"
              type="text"
              placeholder="e.g. Call at 10 AM, Send handwritten card"
              value={newEventNotes}
              onChange={e => setNewEventNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-900 text-amber-100 font-medium text-xs rounded-lg hover:bg-amber-950"
          >
            Save Event to Calendar
          </button>
        </form>
      )}

      {/* Main Grid Layout: Month View + Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Month View (2 Cols) */}
        <div className="lg:col-span-2 bg-white/90 rounded-2xl p-6 border border-amber-200 shadow-sm space-y-6">

          {/* Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif-title font-bold text-stone-900 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-amber-700" aria-hidden="true" />
              <span>{monthNames[currentMonthIndex]} {viewYear}</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-2 rounded-lg bg-amber-100/60 hover:bg-amber-200 text-amber-900 transition"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-2 rounded-lg bg-amber-100/60 hover:bg-amber-200 text-amber-900 transition"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-amber-900 uppercase tracking-wider py-2 border-y border-amber-200/60">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank slots */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-20 bg-amber-50/20 rounded-lg" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedDateStr = `${viewYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvts = events.filter(e => e.date === formattedDateStr);
              const isToday = isSameCalendarDay(new Date(viewYear, currentMonthIndex, dayNum), today);

              return (
                <div
                  key={`day-${dayNum}`}
                  aria-current={isToday ? 'date' : undefined}
                  className={`h-20 p-2 rounded-lg border transition flex flex-col justify-between ${
                    isToday
                      ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-500/40'
                      : dayEvts.length > 0
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-white/60 border-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isToday ? 'text-amber-900' : 'text-stone-700'}`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" aria-hidden="true" />
                    )}
                  </div>

                  {dayEvts.length > 0 && (
                    <div className="space-y-1 overflow-hidden">
                      {dayEvts.map(de => (
                        <div
                          key={de.id}
                          className="px-1.5 py-0.5 text-[9px] bg-amber-900 text-amber-100 rounded truncate font-medium"
                          title={de.title}
                        >
                          {de.type === 'Birthday' ? '🎂' : '💍'} {de.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Sidebar: Upcoming Countdown Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-amber-50 p-6 rounded-2xl border border-amber-800/40 shadow-sm space-y-4">
            <h3 className="text-lg font-serif-title font-bold text-amber-100 flex items-center space-x-2">
              <Gift className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <span>Upcoming Keepsake Dates</span>
            </h3>

            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl bg-amber-900/40 border border-amber-700/40 space-y-1">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                    <span>{evt.type}</span>
                    <span>{evt.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-amber-100">
                    {evt.title}
                  </h4>
                  {evt.notes && (
                    <p className="text-xs text-amber-200/70 font-garamond italic">
                      "{evt.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
