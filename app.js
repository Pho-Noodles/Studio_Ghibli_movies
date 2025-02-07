// Add image and filter for release date and so on (IMPORTANT)

const movieListEl = document.querySelector(".movie-list");

document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filter-button");
  const filterMenu = document.getElementById("filter-menu");

  // Toggle dropdown when button is clicked
  filterButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevents default link behavior
    filterMenu.classList.toggle("active"); // Toggle dropdown visibility
  });

  // closes dropdown if clicking away
  document.addEventListener("click", function (event) {
    if (
      !filterButton.contains(event.target) &&
      !filterMenu.contains(event.target)
    ) {
      filterMenu.classList.remove("active");
    }
  });
});

// Event listeners for both checkboxes
document.getElementById("filter-date").addEventListener("change", filterMovies);
document.getElementById("filter-time").addEventListener("change", filterMovies);

function filterMovies() {
  const checkedDate = document.getElementById("filter-date").checked;
  const checkedTime = document.getElementById("filter-time").checked;
  const moviesData = JSON.parse(localStorage.getItem("moviesData"));

  let filteredMovies = moviesData;

  if (checkedDate) {
    filteredMovies = filteredMovies.sort(
      (a, b) => a.release_date.localeCompare(b.release_date)
    );
  }

  if (checkedTime) {
    filteredMovies = filteredMovies.sort(
      (a, b) => a.running_time - b.running_time
    );
  }

  // Render filtered movies
  movieListEl.innerHTML = filteredMovies.map((movie) => selectedMovie(movie)).join("");

}

async function renderMovies() {
  try {
    const response = await fetch("https://ghibliapi.vercel.app/films");
    const moviesData = await response.json();
    localStorage.setItem("moviesData", JSON.stringify(moviesData)); // Store data for reuse
    filterMovies();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function searchMovies() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const moviesData = JSON.parse(localStorage.getItem("moviesData"));

  if (!query) {
    renderMovies();
    return;
  }

  const filteredMovies = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );

  const movieList = document.getElementById("movie-list");
  movieList.innerHTML = filteredMovies
    .map((movie) => selectedMovie(movie))
    .join("");
}

function selectedMovie(movie) {
  return `
        <div class="movie">
                        <div class="movie__title">
                            Movie Title: ${movie.title}
                            <br>
                            <span class="movie__director">Directed By: ${movie.director}</span>
                            <br>
                            <span class="movie__date">Release Date: ${movie.release_date}</span>
                            <br>
                            <span class="movie__run-time">Run Time: ${movie.running_time} min</span>
                        </div>
                        <img src="${movie.image}" alt="poster" class="movie__img">
                    </div>`;
}

// Event listener for the search button and for pressing enter
document
  .getElementById("search-button")
  .addEventListener("click", searchMovies);
document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

// Load all movies on page load
renderMovies();