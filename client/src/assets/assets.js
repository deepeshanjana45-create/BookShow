import logo from './logo.svg'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profile from './profile.png'

export const assets = {
    logo,
    marvelLogo,
    googlePlay,
    appStore,
    screenImage,
    profile
}

// Curated trailers for English & Hindi blockbusters
export const dummyTrailers = [
    {
        title: "Drishyam: The Conclusion - Official Trailer",
        image: "/movies/ramayana.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=74nF-FWAS6M'
    },
    {
        title: "In the Lost Lands - Official Trailer",
        image: "/movies/kalki.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk'
    },
    {
        title: "Udta Teer - Official Trailer",
        image: "/movies/devara.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=IC7ZRZ6xcRk'
    },
    {
        title: "Until Dawn - Official Trailer",
        image: "/movies/pushpa2.jpg",
        videoUrl: 'https://www.youtube.com/watch?v=1kVK0MZlbI4'
    },
]

// 5 curated movies — mixed Hindi & English — all with configured showtimes
// Admin can add more via the admin panel
export const dummyShowsData = [
    {
        "_id": "1269325",
        "id": 1269325,
        "title": "Drishyam: The Conclusion",
        "overview": "Years after outsmarting the police, Vijay Salgaonkar's past resurfaces when new evidence threatens to expose his family's secret, leading to a high-stakes battle of wits.",
        "poster_path": "/67FsF2kpgEZ1T5Qos4adgqm9dLf.jpg",
        "backdrop_path": "/nq73eRdEooripf3k0XHLtX14zyC.jpg",
        "genres": [
            { "id": 53, "name": "Thriller" },
            { "id": 18, "name": "Drama" },
            { "id": 9648, "name": "Mystery" },
            { "id": 80, "name": "Crime" }
        ],
        "casts": [
            { "name": "Ajay Devgn", "profile_path": "/profile.png" },
            { "name": "Tabu", "profile_path": "/profile.png" },
            { "name": "Shriya Saran", "profile_path": "/profile.png" },
            { "name": "Akshaye Khanna", "profile_path": "/profile.png" }
        ],
        "release_date": "2026-10-02",
        "original_language": "hi",
        "tagline": "Truth can never stay hidden.",
        "vote_average": 7.6,
        "vote_count": 11,
        "runtime": 148,
        "hasConfiguredShows": true
    },
    {
        "_id": "552524",
        "id": 552524,
        "title": "Lilo & Stitch",
        "overview": "The wildly funny and touching live-action story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.",
        "poster_path": "/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg",
        "backdrop_path": "/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg",
        "genres": [
            { "id": 10751, "name": "Family" },
            { "id": 35, "name": "Comedy" },
            { "id": 878, "name": "Sci-Fi" }
        ],
        "casts": [
            { "name": "Maia Kealoha", "profile_path": "/profile.png" },
            { "name": "Chris Sanders", "profile_path": "/profile.png" }
        ],
        "release_date": "2025-05-17",
        "original_language": "en",
        "tagline": "Hold on to your coconuts.",
        "vote_average": 7.4,
        "vote_count": 530,
        "runtime": 108,
        "hasConfiguredShows": true
    },
    {
        "_id": "1375156",
        "id": 1375156,
        "title": "Udta Teer",
        "overview": "An amnesiac Pakistani spy wakes up believing he is a patriotic Indian counter-terrorism officer, leading to a hilarious yet dangerous cross-border chaos.",
        "poster_path": "/tvICKypVlW7Iio4KVs7NousbSKi.jpg",
        "backdrop_path": "/ncVecUcDZe1EOWtHaU2f8BFvbx4.jpg",
        "genres": [
            { "id": 35, "name": "Comedy" },
            { "id": 28, "name": "Action" }
        ],
        "casts": [
            { "name": "Ayushmann Khurrana", "profile_path": "/profile.png" },
            { "name": "Jaideep Ahlawat", "profile_path": "/profile.png" }
        ],
        "release_date": "2026-10-23",
        "original_language": "hi",
        "tagline": "Mission Impossible, Desi Style.",
        "vote_average": 7.5,
        "vote_count": 8,
        "runtime": 137,
        "hasConfiguredShows": true
    },
    {
        "_id": "668489",
        "id": 668489,
        "title": "Havoc",
        "overview": "When a drug heist swerves lethally out of control, a jaded cop fights his way through a corrupt city's criminal underworld to rescue an innocent life.",
        "poster_path": "/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg",
        "backdrop_path": "/65MVgDa6YjSdqzh7YOA04mYkioo.jpg",
        "genres": [
            { "id": 28, "name": "Action" },
            { "id": 80, "name": "Crime" },
            { "id": 53, "name": "Thriller" }
        ],
        "casts": [
            { "name": "Tom Hardy", "profile_path": "/profile.png" },
            { "name": "Forest Whitaker", "profile_path": "/profile.png" }
        ],
        "release_date": "2025-04-25",
        "original_language": "en",
        "tagline": "No laws in the dark.",
        "vote_average": 7.3,
        "vote_count": 320,
        "runtime": 115,
        "hasConfiguredShows": true
    },
    {
        "_id": "1654581",
        "id": 1654581,
        "title": "Nayyi Navelli",
        "overview": "A new bride's arrival turns a turbulent household in Meerut into a picture of domestic harmony, until an unexpected family secret emerges.",
        "poster_path": "/aZEKuzGt7ObqoKjTM4kcMd0klYy.jpg",
        "backdrop_path": "/3aXMkyp0Pv2WGyvm2NUdtMXwY2P.jpg",
        "genres": [
            { "id": 35, "name": "Comedy" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": [
            { "name": "Pankaj Tripathi", "profile_path": "/profile.png" },
            { "name": "Bhumi Pednekar", "profile_path": "/profile.png" }
        ],
        "release_date": "2026-10-16",
        "original_language": "hi",
        "tagline": "Family, laughter and a pinch of chaos.",
        "vote_average": 6.8,
        "vote_count": 7,
        "runtime": 138,
        "hasConfiguredShows": true
    }
]

export const configuredShowMovieIds = [
    "1269325",
    "552524",
    "1375156",
    "668489",
    "1654581"
];

const generateUpcomingDates = () => {
    const dates = {};
    const today = new Date();
    for (let i = 0; i < 4; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dates[dateStr] = [
            { time: `${dateStr}T10:00:00.000Z`, showId: `show_${dateStr}_1` },
            { time: `${dateStr}T13:30:00.000Z`, showId: `show_${dateStr}_2` },
            { time: `${dateStr}T17:00:00.000Z`, showId: `show_${dateStr}_3` },
            { time: `${dateStr}T20:30:00.000Z`, showId: `show_${dateStr}_4` }
        ];
    }
    return dates;
};

export const dummyDateTimeData = generateUpcomingDates();

export const dummyDashboardData = {
    "totalBookings": 124,
    "totalRevenue": 48250,
    "totalUser": 85,
    "activeShows": [
        {
            "_id": "show_1269325_1",
            "movie": dummyShowsData[0],
            "showDateTime": new Date(Date.now() + 3600000 * 2).toISOString(),
            "showPrice": 250,
            "occupiedSeats": { "A1": "user_1", "B1": "user_2" }
        },
        {
            "_id": "show_324544_1",
            "movie": dummyShowsData[1],
            "showDateTime": new Date(Date.now() + 3600000 * 5).toISOString(),
            "showPrice": 220,
            "occupiedSeats": {}
        }
    ]
};
