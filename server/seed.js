import 'dotenv/config';
import connectDB from './configs/db.js';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

await connectDB();

const allIndianMovies = [
    {
        "_id": "1234139",
        "title": "Jailer 2",
        "overview": "When a dangerous international syndicate expands its reach to threaten his family's hard-won peace, retired jailer Tiger Muthuvel Pandian must return to the shadows to protect his legacy.",
        "poster_path": "https://image.tmdb.org/t/p/original/upwdEyhhYZ7pT2hD535fr2MGfpx.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/zpHTOdRl7GEPqFsDGqsN6Hi9Ylt.jpg",
        "genres": [
            { "id": 28, "name": "Action" },
            { "id": 35, "name": "Comedy" },
            { "id": 80, "name": "Crime" }
        ],
        "casts": [
            { "name": "Rajinikanth", "profile_path": "https://image.tmdb.org/t/p/original/cQBcrXqcQPfXOQfNfgO3slJM2xi.jpg" },
            { "name": "S. J. Suryah", "profile_path": "https://image.tmdb.org/t/p/original/7Q8510XwxPU1193cteaFQsiq2rv.jpg" },
            { "name": "Suraj Venjaramoodu", "profile_path": "https://image.tmdb.org/t/p/original/2FUs0wmR3eHBd8g4GVbCmhkUzeI.jpg" },
            { "name": "Ramya Krishnan", "profile_path": "https://image.tmdb.org/t/p/original/7C1bj7z3XhqxjDIGoCs6MFJdSVa.jpg" }
        ],
        "release_date": "2026-10-14",
        "original_language": "ta",
        "tagline": "The Tiger returns to settle the score.",
        "vote_average": 8.1,
        "runtime": 163,
    },
    {
        "_id": "1269325",
        "title": "Drishyam: The Conclusion",
        "overview": "Years after outsmarting the system, Vijay Salgaonkar's buried past resurfaces when startling new forensic evidence threatens to expose his family's long-protected secret.",
        "poster_path": "https://image.tmdb.org/t/p/original/67FsF2kpgEZ1T5Qos4adgqm9dLf.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/nq73eRdEooripf3k0XHLtX14zyC.jpg",
        "genres": [
            { "id": 53, "name": "Thriller" },
            { "id": 18, "name": "Drama" },
            { "id": 9648, "name": "Mystery" },
            { "id": 80, "name": "Crime" }
        ],
        "casts": [
            { "name": "Ajay Devgn", "profile_path": "https://image.tmdb.org/t/p/original/vnHQQFzTjJ0sv14DGMIoKa3qTxN.jpg" },
            { "name": "Jaideep Ahlawat", "profile_path": "https://image.tmdb.org/t/p/original/uILn4y8EWbMdeu71laMsh8zHY0M.jpg" },
            { "name": "Tabu", "profile_path": "https://image.tmdb.org/t/p/original/cvt5nvCHr1ICf5u8A2mlzLQ8LsV.jpg" },
            { "name": "Shriya Saran", "profile_path": "https://image.tmdb.org/t/p/original/ioOgKBSCJhOdKoZpg86ld7zANbf.jpg" }
        ],
        "release_date": "2026-10-02",
        "original_language": "hi",
        "tagline": "Can visual deception conquer the final truth?",
        "vote_average": 7.6,
        "runtime": 148,
    },
    {
        "_id": "1376856",
        "title": "The Paradise",
        "overview": "In 1980s Secunderabad, a marginalized community battles systemic oppression and fights for identity under an unyielding young rebel who rallies against powerful land barons.",
        "poster_path": "https://image.tmdb.org/t/p/original/smghVMoMWSIFi5dgIz4w1UIcEcY.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/7AcH5TFppoMusNkCBLaQP6UOODp.jpg",
        "genres": [
            { "id": 28, "name": "Action" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": [
            { "name": "Nani", "profile_path": "https://image.tmdb.org/t/p/original/jfOH4sUWs3VXuGUlo0VLMYNRBQ4.jpg" },
            { "name": "Mohan Babu", "profile_path": "https://image.tmdb.org/t/p/original/zwqcXtnk0ju0nhuhvZXSLL2nLIy.jpg" },
            { "name": "Kayadu Lohar", "profile_path": "https://image.tmdb.org/t/p/original/pHaMPnrfnWvTPZA4IOmZk8BHY0U.jpg" },
            { "name": "Sonali Kulkarni", "profile_path": "https://image.tmdb.org/t/p/original/aQeM6N2JgGFbI5VoltWhkxw6OQC.jpg" }
        ],
        "release_date": "2026-09-23",
        "original_language": "te",
        "tagline": "A revolution forged in sweat and steel.",
        "vote_average": 7.4,
        "runtime": 170,
    },
    {
        "_id": "1375156",
        "title": "Udta Teer",
        "overview": "An amnesiac undercover operative wakes up believing he is an ordinary middle-class government officer, only to be pursued by counter-terrorism agencies and eccentric assassins.",
        "poster_path": "https://image.tmdb.org/t/p/original/tvICKypVlW7Iio4KVs7NousbSKi.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/ncVecUcDZe1EOWtHaU2f8BFvbx4.jpg",
        "genres": [
            { "id": 35, "name": "Comedy" },
            { "id": 28, "name": "Action" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": [
            { "name": "Ayushmann Khurrana", "profile_path": "https://image.tmdb.org/t/p/original/qbdclvnDkJxPX7OQqmMY7w9ekBP.jpg" },
            { "name": "Sara Ali Khan", "profile_path": "https://image.tmdb.org/t/p/original/nRtF9kNgIt9q52jy89cyZBimUPs.jpg" },
            { "name": "Rahul Bose", "profile_path": "https://image.tmdb.org/t/p/original/6T0xhsganOB8SI48HCGd99XKj9l.jpg" },
            { "name": "Supriya Pilgaonkar", "profile_path": "https://image.tmdb.org/t/p/original/zCAqu5hpjvjpC9J1Y9Xs7Di0hUC.jpg" }
        ],
        "release_date": "2026-10-23",
        "original_language": "hi",
        "tagline": "Identity lost, chaos found.",
        "vote_average": 7.5,
        "runtime": 137,
    },
    {
        "_id": "1389379",
        "title": "Ranabaali",
        "overview": "Set in 19th-century British India, a fearless warrior leader rises from a drought-stricken plateau to ignite an unprecedented uprising against colonial rule.",
        "poster_path": "https://image.tmdb.org/t/p/original/cXaCyYYbafVyMrs8rwKmxezBYPJ.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/xpImgnsxuqb3VOp0QRtXTS5uBRi.jpg",
        "genres": [
            { "id": 36, "name": "History" },
            { "id": 28, "name": "Action" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": [
            { "name": "Vijay Deverakonda", "profile_path": "https://image.tmdb.org/t/p/original/8oVIWyIoFUal8SJFnmCUtkkm1HP.jpg" },
            { "name": "Rashmika Mandanna", "profile_path": "https://image.tmdb.org/t/p/original/lj16BGfdqygHF8PZVt2KO8GUXn1.jpg" },
            { "name": "Arnold Vosloo", "profile_path": "https://image.tmdb.org/t/p/original/o23Z1EvWEYR7PArq2w5UpreVipV.jpg" },
            { "name": "Easwari Rao", "profile_path": "https://image.tmdb.org/t/p/original/fjyvQ45YZcovy2Egj2eux8UiuHU.jpg" }
        ],
        "release_date": "2026-10-15",
        "original_language": "te",
        "tagline": "A warrior's rebellion etched in blood.",
        "vote_average": 7.8,
        "runtime": 179,
    },
    {
        "_id": "1590718",
        "title": "Dhoomakethu",
        "overview": "On the morning of his wedding, an ordinary young man wakes from a surreal omen that turns his world upside down, unraveling an unexpected comedic rollercoaster across suburban Kerala.",
        "poster_path": "https://image.tmdb.org/t/p/original/kZCKwhUx7r9HRDqpGbavdMtd8f5.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/4YxZxGPt702wGaNqgXwN6Jaq390.jpg",
        "genres": [
            { "id": 35, "name": "Comedy" },
            { "id": 14, "name": "Fantasy" },
            { "id": 18, "name": "Drama" }
        ],
        "casts": [
            { "name": "Nikhila Vimal", "profile_path": "https://image.tmdb.org/t/p/original/9Y5DAApG8LozGUKw00fnFwtZYtE.jpg" },
            { "name": "Sajin Gopu", "profile_path": "https://image.tmdb.org/t/p/original/l8kpWfPvD7Gzp2LgvRSWVRsrxWd.jpg" },
            { "name": "Ganapathi S. Poduval", "profile_path": "https://image.tmdb.org/t/p/original/15g6TQroqoLmcK1E8CniGZjm72l.jpg" },
            { "name": "Shine Tom Chacko", "profile_path": "https://image.tmdb.org/t/p/original/lIfhgkTK8bgM5jS2R91ZvCxKIwj.jpg" }
        ],
        "release_date": "2026-09-25",
        "original_language": "ml",
        "tagline": "The universe has other wedding plans.",
        "vote_average": 7.2,
        "runtime": 122,
    },
    {
        "_id": "1735270",
        "title": "Premada Oorali",
        "overview": "Set in the scenic hills of Karnataka, two estranged generations reunite during a grand village festival to rediscover love, loyalty, and forgotten bonds.",
        "poster_path": "https://image.tmdb.org/t/p/original/6eP8D6HDRw315Gmmc7RmGBaeTyO.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/r22LSVD46wOY3rkavnM4gWc3sz2.jpg",
        "genres": [
            { "id": 10751, "name": "Family" },
            { "id": 18, "name": "Drama" },
            { "id": 10749, "name": "Romance" }
        ],
        "casts": [
            { "name": "Rangayana Raghu", "profile_path": "https://image.tmdb.org/t/p/original/zYvl4RCUkhSFCZ8paZ1H9lV6nJa.jpg" },
            { "name": "Shri Mahadev", "profile_path": "https://image.tmdb.org/t/p/original/ymPC1XQKvR7X3Xsh7b38uIwzTUs.jpg" },
            { "name": "Thapaswini", "profile_path": "https://image.tmdb.org/t/p/original/4txmaMjrR5lCZOiM7Xe64gUaD8e.jpg" },
            { "name": "Ramika Shivu", "profile_path": "https://image.tmdb.org/t/p/original/ydAzhlMFTuAXEak2EW8bzN0FpUh.jpg" }
        ],
        "release_date": "2026-10-18",
        "original_language": "kn",
        "tagline": "A heartfelt journey back to our roots.",
        "vote_average": 7.5,
        "runtime": 155,
    },
    {
        "_id": "1187038",
        "title": "Manduka",
        "overview": "When a cryptic disappearance shocks a close-knit coastal hamlet, an unorthodox detective unravels a dense labyrinth of local folklore, betrayal, and dark secrets.",
        "poster_path": "https://image.tmdb.org/t/p/original/yrPf3xKqWYv8GjIwsQZI8nyDYaY.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/nn57ukin9IJ1i1io8EWWLQESpuj.jpg",
        "genres": [
            { "id": 9648, "name": "Mystery" },
            { "id": 80, "name": "Crime" },
            { "id": 53, "name": "Thriller" }
        ],
        "casts": [
            { "name": "Anjala", "profile_path": "https://image.tmdb.org/t/p/original/kFsFIwEdYRKKD4zRAq5H8hnYLoU.jpg" },
            { "name": "Madhan", "profile_path": "https://image.tmdb.org/t/p/original/uOTDxn6301IxN8Py6RXGfdINnLW.jpg" },
            { "name": "Bhushan", "profile_path": "https://image.tmdb.org/t/p/original/bz4ZxBqFeNwlUPIojpL03VQW85h.jpg" },
            { "name": "Mysore raju", "profile_path": "https://image.tmdb.org/t/p/original/2tNHYugVhe8jjiYTboNwUwIFlrF.jpg" }
        ],
        "release_date": "2026-10-09",
        "original_language": "kn",
        "tagline": "Every silence conceals a truth.",
        "vote_average": 7.9,
        "runtime": 134,
    }
];

// 1. Upsert all Indian movies
for (const m of allIndianMovies) {
    await Movie.findByIdAndUpdate(m._id, m, { upsert: true, new: true });
}
console.log(`Upserted ${allIndianMovies.length} Indian movies into MongoDB.`);

// 2. Configure upcoming shows ONLY for movies that have configured showtimes
// Manduka (1187038) is left without configured shows to demonstrate showtime restriction requirement
const configuredMovieIds = ["1234139", "1269325", "1376856", "1375156", "1389379", "1590718", "1735270"];
const now = new Date();
const futureShows = [];

for (const m of allIndianMovies) {
    if (!configuredMovieIds.includes(m._id)) continue;

    for (let day = 0; day <= 14; day++) {
        const d = new Date(now);
        d.setDate(d.getDate() + day);
        const dateStr = d.toISOString().split('T')[0];

        const times = ['09:30', '12:30', '16:00', '19:30', '22:30'];
        for (const t of times) {
            futureShows.push({
                movie: m._id,
                showDateTime: new Date(`${dateStr}T${t}:00`),
                showPrice: 250,
                occupiedSeats: {}
            });
        }
    }
}

await Show.insertMany(futureShows);
console.log(`Inserted ${futureShows.length} upcoming shows for configured Indian movies across the next 14 days!`);

process.exit(0);
