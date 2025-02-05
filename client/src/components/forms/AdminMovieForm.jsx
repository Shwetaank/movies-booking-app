import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextInput,
  Label,
  Textarea,
  Spinner,
  Toast,
} from "flowbite-react";
import axios from "axios";

const AdminMovieForm = ({ onLogout, movie, onUpdateMovie }) => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [movieDuration, setMovieDuration] = useState("");
  const [movieDirector, setMovieDirector] = useState("");
  const [movieCast, setMovieCast] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType("");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (movie) {
      setMovieTitle(movie.title || "");
      setMovieDescription(movie.description || "");
      setMovieGenre((movie.genre || []).join(", "));
      setReleaseDate(movie.releaseDate || "");
      setMovieDuration(movie.duration || "");
      setMovieDirector(movie.director || "");
      setMovieCast((movie.cast || []).join(", "));
      setPosterUrl(movie.posterUrl || "");
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType("");

    const genres = movieGenre
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);
    const cast = movieCast
      .split(",")
      .map((member) => member.trim())
      .filter(Boolean);

    const movieData = {
      title: movieTitle,
      genre: genres,
      releaseDate,
      duration: parseInt(movieDuration, 10),
      description: movieDescription,
      director: movieDirector,
      cast: cast,
      posterUrl,
      featured: true,
    };

    try {
      if (movie) {
        // Update existing movie
        await axios.patch(
          `https://movies-booking-app.onrender.com/movie/${movie._id}`,
          movieData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setMessage("🎉 Movie updated successfully!");
      } else {
        // Add new movie
        await axios.post(
          "https://movies-booking-app.onrender.com/movie",
          movieData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setMessage("🎉 Movie added successfully!");
      }

      setMessageType("success");

      // Reset form fields
      setMovieTitle("");
      setMovieDescription("");
      setMovieGenre("");
      setReleaseDate("");
      setMovieDuration("");
      setMovieDirector("");
      setMovieCast("");
      setPosterUrl("");
      onUpdateMovie && onUpdateMovie(movieData); // Notify parent component if needed
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "⚠️ Failed to save movie. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-auto py-16 px-4 sm:px-8">
      <div
        className="max-w-4xl mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400
        dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          {movie ? "🎬 Update Your Movie" : "🎬 Add New Movie"}
        </h2>

        {/* Toast notifications */}
        {message && (
          <div className="w-full flex justify-center">
            <Toast
              className={`mb-4 ${
                messageType === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              show={true}
            >
              <div className="flex items-center">
                <span className="ml-2">{message}</span>
              </div>
            </Toast>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Left Side: Title, Genre, Release Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="movieTitle" value="Movie Title" />
              <TextInput
                id="movieTitle"
                type="text"
                placeholder="Enter movie title"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                required
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="releaseDate" value="Release Date" />
              <TextInput
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Middle: Duration, Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="movieDuration" value="Duration (minutes)" />
              <TextInput
                id="movieDuration"
                type="number"
                placeholder="Enter duration"
                value={movieDuration}
                onChange={(e) => setMovieDuration(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="movieDirector" value="Director" />
              <TextInput
                id="movieDirector"
                type="text"
                placeholder="Enter director name"
                value={movieDirector}
                onChange={(e) => setMovieDirector(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Right Side: Description */}
          <div>
            <Label htmlFor="movieDescription" value="Movie Description" />
            <Textarea
              id="movieDescription"
              placeholder="Enter description"
              value={movieDescription}
              onChange={(e) => setMovieDescription(e.target.value)}
              required
              className="mt-2 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Lower: Genre, Cast, Poster URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="movieGenre" value="Genre (comma-separated)" />
              <TextInput
                id="movieGenre"
                type="text"
                placeholder="Enter genre(s)"
                value={movieGenre}
                onChange={(e) => setMovieGenre(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="movieCast" value="Cast (comma-separated)" />
              <TextInput
                id="movieCast"
                type="text"
                placeholder="Enter cast members"
                value={movieCast}
                onChange={(e) => setMovieCast(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="posterUrl" value="Poster URL" />
              <TextInput
                id="posterUrl"
                type="text"
                placeholder="Enter poster URL"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="mt-2 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            gradientDuoTone="pinkToOrange"
            className="w-full font-bold mt-4"
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : movie ? (
              "Update Movie"
            ) : (
              "Add Movie"
            )}
          </Button>
        </form>

        <Button
          type="button"
          gradientDuoTone="purpleToPink"
          className="mt-4 font-bold w-full"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

AdminMovieForm.propTypes = {
  onLogout: PropTypes.func.isRequired,
  movie: PropTypes.object,
  onUpdateMovie: PropTypes.func,
};

export default AdminMovieForm;
