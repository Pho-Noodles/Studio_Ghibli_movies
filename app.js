const movieListEl = document.querySelector('.movie-list');

async function renderMovies() {
    try {
        const response = await fetch('https://ghibliapi.vercel.app/films');
        const moviesData = await response.json();
        localStorage.setItem("moviesData", JSON.stringify(moviesData)); // Store data for reuse
        movieListEl.innerHTML = moviesData.map((movie) => selectedMovie(movie)).join("");
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function searchMovies() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const moviesData = JSON.parse(localStorage.getItem("moviesData"));

    if (!query) {
        renderMovies();
        return;
    }

    const filteredMovies = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );

    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = filteredMovies.map((movie) => selectedMovie(movie)).join("");
}

function selectedMovie(movie) {
    return `
        <div class="movie">
                        <div class="movie__title">
                            Movie Title: ${movie.title}
                        </div>
                        <div class="movie__director">
                            Directed by: ${movie.director}
                        </div>
                    </div>`;
}

// Event listener for the search button and for pressing enter
document.getElementById('search-button').addEventListener('click', searchMovies);
document.getElementById('search-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

// Load all movies on page load
renderMovies();