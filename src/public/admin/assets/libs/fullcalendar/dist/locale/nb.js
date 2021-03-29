!(function (e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t(require('moment'), require('fullcalendar')))
        : 'function' == typeof define && define.amd
        ? define(['moment', 'fullcalendar'], t)
        : 'object' == typeof exports
        ? t(require('moment'), require('fullcalendar'))
        : t(e.moment, e.FullCalendar);
})('undefined' != typeof self ? self : this, function (e, t) {
    return (function (e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var a = (n[r] = { i: r, l: !1, exports: {} });
            return e[r].call(a.exports, a, a.exports, t), (a.l = !0), a.exports;
        }
        var n = {};
        return (
            (t.m = e),
            (t.c = n),
            (t.d = function (e, n, r) {
                t.o(e, n) ||
                    Object.defineProperty(e, n, {
                        configurable: !1,
                        enumerable: !0,
                        get: r,
                    });
            }),
            (t.n = function (e) {
                var n =
                    e && e.__esModule
                        ? function () {
                              return e.default;
                          }
                        : function () {
                              return e;
                          };
                return t.d(n, 'a', n), n;
            }),
            (t.o = function (e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (t.p = ''),
            t((t.s = 165))
        );
    })({
        0: function (t, n) {
            t.exports = e;
        },
        1: function (e, n) {
            e.exports = t;
        },
        165: function (e, t, n) {
            Object.defineProperty(t, '__esModule', { value: !0 }), n(166);
            var r = n(1);
            r.datepickerLocale('nb', 'nb', {
                closeText: 'Lukk',
                prevText: '&#xAB;Forrige',
                nextText: 'Neste&#xBB;',
                currentText: 'I dag',
                monthNames: [
                    'januar',
                    'februar',
                    'mars',
                    'april',
                    'mai',
                    'juni',
                    'juli',
                    'august',
                    'september',
                    'oktober',
                    'november',
                    'desember',
                ],
                monthNamesShort: [
                    'jan',
                    'feb',
                    'mar',
                    'apr',
                    'mai',
                    'jun',
                    'jul',
                    'aug',
                    'sep',
                    'okt',
                    'nov',
                    'des',
                ],
                dayNamesShort: [
                    'søn',
                    'man',
                    'tir',
                    'ons',
                    'tor',
                    'fre',
                    'lør',
                ],
                dayNames: [
                    'søndag',
                    'mandag',
                    'tirsdag',
                    'onsdag',
                    'torsdag',
                    'fredag',
                    'lørdag',
                ],
                dayNamesMin: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
                weekHeader: 'Uke',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: '',
            }),
                r.locale('nb', {
                    buttonText: {
                        month: 'Måned',
                        week: 'Uke',
                        day: 'Dag',
                        list: 'Agenda',
                    },
                    allDayText: 'Hele dagen',
                    eventLimitText: 'til',
                    noEventsMessage: 'Ingen hendelser å vise',
                });
        },
        166: function (e, t, n) {
            !(function (e, t) {
                t(n(0));
            })(0, function (e) {
                return e.defineLocale('nb', {
                    months: 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split(
                        '_',
                    ),
                    monthsShort: 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split(
                        '_',
                    ),
                    monthsParseExact: !0,
                    weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split(
                        '_',
                    ),
                    weekdaysShort: 'sø._ma._ti._on._to._fr._lø.'.split('_'),
                    weekdaysMin: 'sø_ma_ti_on_to_fr_lø'.split('_'),
                    weekdaysParseExact: !0,
                    longDateFormat: {
                        LT: 'HH:mm',
                        LTS: 'HH:mm:ss',
                        L: 'DD.MM.YYYY',
                        LL: 'D. MMMM YYYY',
                        LLL: 'D. MMMM YYYY [kl.] HH:mm',
                        LLLL: 'dddd D. MMMM YYYY [kl.] HH:mm',
                    },
                    calendar: {
                        sameDay: '[i dag kl.] LT',
                        nextDay: '[i morgen kl.] LT',
                        nextWeek: 'dddd [kl.] LT',
                        lastDay: '[i går kl.] LT',
                        lastWeek: '[forrige] dddd [kl.] LT',
                        sameElse: 'L',
                    },
                    relativeTime: {
                        future: 'om %s',
                        past: '%s siden',
                        s: 'noen sekunder',
                        ss: '%d sekunder',
                        m: 'ett minutt',
                        mm: '%d minutter',
                        h: 'en time',
                        hh: '%d timer',
                        d: 'en dag',
                        dd: '%d dager',
                        M: 'en måned',
                        MM: '%d måneder',
                        y: 'ett år',
                        yy: '%d år',
                    },
                    dayOfMonthOrdinalParse: /\d{1,2}\./,
                    ordinal: '%d.',
                    week: { dow: 1, doy: 4 },
                });
            });
        },
    });
});
