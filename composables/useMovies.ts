import { ref } from 'vue';
import type { Movie } from '@/types/movie';

export function useMovies() {
  const searchQuery = ref('')
  const form = ref({
    title: '',
    year: null as number | null,
    plot: '',
    poster: '',
  })
  const editedMovie = ref<Partial<Movie> | null>(null)

  const {
    data: moviesRaw,
    error,
    refresh,
  } = useAsyncData<Movie[]>(
    'movies',
    () => $fetch('/api/movies', { params: { search: searchQuery.value } }),
    { watch: [searchQuery] }
  )

  const movies = computed(() => moviesRaw.value || []);

  function resetForm() {
    if (editedMovie.value) {
      // Restore original values if we were editing
      form.value = {
        title: editedMovie.value.title ?? '',
        year: editedMovie.value.year ?? null,
        plot: editedMovie.value.plot ?? '',
        poster: editedMovie.value.poster ?? '',
      };
    } else {
      // Full reset if not editing
      form.value = { title: '', year: null, plot: '', poster: '' };
    }
  }

  function editMovie(movie: Movie) {
    editedMovie.value = movie
    form.value = {
      title: movie.title ?? '',
      year: movie.year ?? null,
      plot: movie.plot ?? '',
      poster: movie.poster ?? '',
    }
  }

  async function saveMovie() {
    if (editedMovie.value?._id) {
      await $fetch(`/api/movies/${editedMovie.value._id}`, {
        method: 'PUT',
        body: { ...form.value },
      })
    } else {
      await $fetch('/api/movies', {
        method: 'POST',
        body: { ...form.value },
      })
    }
    await refresh()
    resetForm()
  }

  async function deleteMovie(id: string) {
    await $fetch(`/api/movies/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return {
    movies,
    error,
    searchQuery,
    form,
    editedMovie,
    editMovie,
    saveMovie,
    deleteMovie,
    resetForm,
  }
}