/* =========================================================
   EDIT THIS FILE TO ADD OR CHANGE TRIPS
   ---------------------------------------------------------
   - place:   the big cut-out word (keep it short; long names shrink to fit)
   - cities:  optional smaller line under it (e.g. the cities on that trip)
   - when:    shown on the page ("July 2017");  year: used for the cover's date range
   - folder:  put photos in  photos/<folder>/  and list their file names under "photos"
   - The FIRST photo listed is the one that shows through the place name (pick a wide, bright one).
     The rest appear in the order listed. Photos came from the "Mom&Sky" album, sorted by date taken.
   - "cover" is the painting shown behind the section title (in photos/covers-art/).
   - "caption" is optional per photo. "focus" (optional, e.g. "50% 12%") picks which part of a tall opening photo stays in view. w/h are the photo's pixel size (keeps the page from jumping while photos load). "notes" are optional handwritten lines for that trip, e.g. notes: ["First line", "Second line"].
   - A missing photo shows a tinted panel with its expected path.
   - Openings rotate (dive into a letter, letters part, word splits).
     To choose one for a trip, add  transition: "dive"  (or "part" / "split").
   ========================================================= */

const TRIPS = [
  {
    place: "Scandinavia",
    cities: "Oslo · Copenhagen · Stockholm",
    when: "July 2017", year: 2017,
    folder: "scandinavia-2017",
    cover: "scandinavia.jpg",
    color: "#B7C7D6",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1800, h: 1350 },
      { file: "2.jpg", w: 1800, h: 422 },
      { file: "3.jpg", w: 1350, h: 1800 },
      { file: "4.jpg", w: 1800, h: 1350 },
      { file: "5.jpg", w: 1800, h: 1350 },
      { file: "6.jpg", w: 1350, h: 1800 },
      { file: "7.jpg", w: 1280, h: 960 },
      { file: "8.jpg", w: 1350, h: 1800 },
      { file: "9.jpg", w: 1800, h: 1350 },
      { file: "10.jpg", w: 1800, h: 1350 },
      { file: "14.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1800, h: 1350 },
      { file: "12.jpg", w: 1800, h: 1350 },
      { file: "13.jpg", w: 1350, h: 1800 }
    ]
  },
  {
    place: "Utah",
    when: "March 2018", year: 2018,
    folder: "utah-2018",
    cover: "utah.jpg",
    color: "#D9B39A",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1800, h: 1350 },
      { file: "2.jpg", w: 1800, h: 1350 },
      { file: "3.jpg", w: 1800, h: 1350 },
      { file: "4.jpg", w: 1800, h: 1350 },
      { file: "5.jpg", w: 1280, h: 720 },
      { file: "6.jpg", w: 1800, h: 1350 }
    ]
  },
  {
    place: "Portugal",
    when: "February 2019", year: 2019,
    folder: "portugal-2019",
    cover: "portugal.jpg",
    color: "#E3CB9E",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1351, h: 1800 },
      { file: "2.jpg", w: 1800, h: 878 },
      { file: "3.jpg", w: 1659, h: 1800 },
      { file: "4.jpg", w: 1800, h: 1350 },
      { file: "7.jpg", w: 1800, h: 602 },
      { file: "5.jpg", w: 1800, h: 1350 },
      { file: "6.jpg", w: 1800, h: 1350 },
      { file: "8.jpg", w: 1800, h: 1605 },
      { file: "9.jpg", w: 1800, h: 1350 }
    ]
  },
  {
    place: "College Tours",
    when: "July 2021", year: 2021,
    folder: "college-tours-2021",
    cover: "college-tours.jpg",
    color: "#C4CDB2",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "2.jpg", w: 1800, h: 1350 },
      { file: "3.jpg", w: 1800, h: 1350 },
      { file: "4.jpg", w: 1350, h: 1800 },
      { file: "5.jpg", w: 1800, h: 1350 },
      { file: "6.jpg", w: 1350, h: 1800 },
      { file: "7.jpg", w: 1800, h: 1350 },
      { file: "8.jpg", w: 1800, h: 1350 },
      { file: "9.jpg", w: 1350, h: 1800 },
      { file: "10.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1800, h: 1350 },
      { file: "12.jpg", w: 1350, h: 1800 },
      { file: "13.jpg", w: 1350, h: 1800 },
      { file: "14.jpg", w: 1350, h: 1800 },
      { file: "15.jpg", w: 1350, h: 1800 }
    ]
  },
  {
    place: "Spain",
    when: "June 2022", year: 2022,
    folder: "spain-2022",
    cover: "spain.jpg",
    color: "#E4C1A2",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "2.jpg", w: 1350, h: 1800 },
      { file: "5.jpg", w: 1350, h: 1800 },
      { file: "17.jpg", w: 1800, h: 1350 },
      { file: "6.jpg", w: 1800, h: 1350 },
      { file: "7.jpg", w: 1350, h: 1800 },
      { file: "8.jpg", w: 1350, h: 1800 },
      { file: "9.jpg", w: 1350, h: 1800 },
      { file: "10.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1800, h: 1350 },
      { file: "12.jpg", w: 1800, h: 1350 },
      { file: "13.jpg", w: 1800, h: 1350 }
    ]
  },
  {
    place: "Zurich",
    when: "June 2022", year: 2022,
    folder: "zurich-2022",
    cover: "zurich.jpg",
    color: "#B5D3CF",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "2.jpg", w: 1800, h: 1350 },
      { file: "3.jpg", w: 1350, h: 1800 },
      { file: "4.jpg", w: 1350, h: 1800 }
    ]
  },
  {
    place: "Thailand",
    when: "December 2022", year: 2022,
    folder: "thailand-2022",
    cover: "thailand.jpg",
    color: "#B4D0C2",
    notes: [],
    photos: [
      { file: "16.jpg", w: 1350, h: 1800 },
      { file: "3.jpg", w: 1800, h: 1350 },
      { file: "17.jpg", w: 1350, h: 1800 },
      { file: "4.jpg", w: 1350, h: 1800 },
      { file: "8.jpg", w: 1800, h: 1350 },
      { file: "10.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1350, h: 1800 },
      { file: "18.jpg", w: 1800, h: 1347 },
      { file: "12.jpg", w: 1200, h: 1600 },
      { file: "13.jpg", w: 1350, h: 1800 },
      { file: "19.jpg", w: 1800, h: 1350 },
      { file: "14.jpg", w: 983, h: 1800 }
    ]
  },
  {
    place: "Paris",
    when: "May 2024", year: 2024,
    folder: "paris-prague-2024",
    cover: "paris.jpg",
    color: "#D6C2CF",
    notes: [],
    photos: [
      { file: "2.jpg", w: 1350, h: 1800 },
      { file: "17.jpg", w: 1350, h: 1800 },
      { file: "3.jpg", w: 1350, h: 1800 },
      { file: "4.jpg", w: 1350, h: 1800 },
      { file: "18.jpg", w: 1350, h: 1800 },
      { file: "19.jpg", w: 1800, h: 1350 },
      { file: "7.jpg", w: 1350, h: 1800 },
      { file: "20.jpg", w: 1350, h: 1800 }
    ]
  },
  {
    place: "Prague",
    when: "May 2024", year: 2024,
    folder: "paris-prague-2024",
    cover: "prague.jpg",
    color: "#D8C9A8",
    notes: [],
    photos: [
      { file: "8.jpg", w: 1800, h: 1350 },
      { file: "10.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1350, h: 1800 },
      { file: "12.jpg", w: 1350, h: 1800 },
      { file: "13.jpg", w: 1800, h: 1350 },
      { file: "14.jpg", w: 1350, h: 1800 },
      { file: "15.jpg", w: 1350, h: 1800 },
      { file: "16.jpg", w: 1350, h: 1800 }
    ]
  },
  {
    place: "Mexico",
    cities: "Guadalajara · Mexico City",
    when: "August 2025", year: 2025,
    folder: "mexico-2025",
    cover: "mexico.jpg",
    color: "#E0B6A4",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "2.jpg", w: 1800, h: 1369 },
      { file: "3.jpg", w: 1800, h: 1350 },
      { file: "4.jpg", w: 1800, h: 1350 },
      { file: "5.jpg", w: 1800, h: 1350 },
      { file: "25.jpg", w: 1350, h: 1800 },
      { file: "7.jpg", w: 1350, h: 1800 },
      { file: "8.jpg", w: 1350, h: 1800 },
      { file: "9.jpg", w: 1350, h: 1800 },
      { file: "10.jpg", w: 1800, h: 1350 },
      { file: "11.jpg", w: 1800, h: 1350 },
      { file: "13.jpg", w: 1350, h: 1800 },
      { file: "14.jpg", w: 1350, h: 1800 },
      { file: "15.jpg", w: 1800, h: 1350 },
      { file: "16.jpg", w: 1800, h: 1350 },
      { file: "17.jpg", w: 1800, h: 1350 },
      { file: "18.jpg", w: 1350, h: 1800 },
      { file: "19.jpg", w: 1800, h: 1350 },
      { file: "21.jpg", w: 1800, h: 1350 },
      { file: "22.jpg", w: 1800, h: 1350 },
      { file: "23.jpg", w: 1350, h: 1800 },
      { file: "24.jpg", w: 1800, h: 1350 }
    ]
  },
  {
    place: "CES",
    cities: "Las Vegas",
    when: "January 2026", year: 2026,
    folder: "ces-2026",
    cover: "ces.jpg",
    color: "#BFC6E0",
    notes: [],
    photos: [
      { file: "2.jpg", w: 1800, h: 1350 },
      { file: "3.jpg", w: 1350, h: 1800 },
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "4.jpg", w: 1350, h: 1800 },
      { file: "5.jpg", w: 1350, h: 1800 },
      { file: "6.jpg", w: 1800, h: 1350 },
      { file: "7.jpg", w: 1800, h: 1350 }
    ]
  },
  {
    place: "China",
    when: "May 2026", year: 2026,
    folder: "china-2026",
    cover: "china.jpg",
    color: "#E3B9A6",
    notes: [],
    photos: [
      { file: "1.jpg", w: 1350, h: 1800 },
      { file: "2.jpg", w: 1350, h: 1800 },
      { file: "3.jpg", w: 1800, h: 1350 },
      { file: "6.jpg", w: 1800, h: 1350 },
      { file: "5.jpg", w: 1800, h: 1350 },
      { file: "7.jpg", w: 1350, h: 1800 },
      { file: "8.jpg", w: 1350, h: 1800 },
      { file: "18.jpg", w: 1350, h: 1800 },
      { file: "9.jpg", w: 1350, h: 1800 },
      { file: "10.jpg", w: 1350, h: 1800 },
      { file: "11.jpg", w: 1800, h: 1350 },
      { file: "12.jpg", w: 1350, h: 1800 },
      { file: "13.jpg", w: 1350, h: 1800 },
      { file: "14.jpg", w: 1800, h: 1350 },
      { file: "15.jpg", w: 1350, h: 1800 },
      { file: "16.jpg", w: 1800, h: 1350 }
    ]
  }
];
