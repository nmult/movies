<template>
  <v-container fluid class="pa-6">
    <v-row align="center" justify="start" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-light">Movies</h1>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-text-field
            v-model="searchQuery"
            label="Search movies"
            hide-details
            prepend-inner-icon="mdi-magnify"
        />
      </v-col>
    </v-row>

    <v-divider class="my-6" />
    <v-form @submit.prevent="onSubmit" ref="formRef" class="pa-4" style="max-width: 500px; margin: auto">
      <v-text-field
          v-model="form.title"
          label="Title"
          :rules="[required]"
          required
      />
      <v-text-field
          v-model="form.year"
          label="Released (Year)"
          type="number"
          :rules="[required, yearRule]"
          required
      />
      <v-text-field
          v-model="form.poster"
          label="Poster URL"
      />
      <v-textarea
          v-model="form.plot"
          :rules="[required]"
          label="Plot"
      />

      <div class="d-flex justify-end mt-2">
        <v-btn :disabled="!formRef?.isValid" type="submit" color="primary" class="me-2">
          {{ editedMovie?._id ? 'Update' : 'Create' }}
        </v-btn>
        <v-btn color="grey" @click="cancelEdit" v-if="editedMovie">Cancel</v-btn>
      </div>
    </v-form>

    <v-row dense>
      <v-col
          v-for="movie in movies"
          :key="movie._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card elevation="1" class="pa-4">
          <v-card-title class="text-h6 font-weight-regular">
            {{ movie.title }}
          </v-card-title>
          <v-img
            :src="movie.poster"
            height="200px"
            class="mb-2"
            contain></v-img>
          <v-card-subtitle class="text-body-2 grey--text">
            {{ movie.year }}
          </v-card-subtitle>
          <v-divider class="my-2" />
          <v-card-text class="text-body-2">
            {{ movie.plot }}
          </v-card-text>
          <v-card-actions class="mt-2">
            <v-btn size="small" @click="editMovie(movie)">✏️ Edit</v-btn>
            <v-btn size="small" color="red" @click="confirmDelete(movie)">🗑 Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="error" class="text-center mt-6">
      <v-alert type="error" variant="outlined">
        Error loading movies: {{ error.message }}
      </v-alert>
    </div>

    <div v-if="movies?.length === 0" class="text-center mt-6">
      <v-alert type="info" variant="outlined">
        No movies found.
      </v-alert>
    </div>
  </v-container>

  <v-snackbar
      v-model="snackbar"
      timeout="2500"
      color="green"
      location="top right"
  >
    {{ snackbarText }}
  </v-snackbar>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6">
        Confirm Deletion
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete
        <strong>{{ movieToDelete?.title }}</strong>?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="red" @click="deleteConfirmed">Yes, Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
import { useMovies } from '@/composables/useMovies';

const required = (v: string) => !!v || 'Field is required'
const yearRule = (v: string) =>
    /^\d{4}$/.test(v) || 'Enter a valid 4-digit year'

const {
  movies,
  error,
  form,
  editedMovie,
  saveMovie,
  deleteMovie,
  editMovie,
  resetForm,
  searchQuery
} = useMovies();

const formRef = ref<HTMLFormElement | null>(null)
const snackbar = ref(false);
const snackbarText = ref('');
const dialog = ref(false);
const movieToDelete = ref<{ _id: string; title: string } | null>(null);

function showToast(message: string) {
  snackbarText.value = message;
  snackbar.value = true;
}

async function onSubmit() {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid) return;

  const wasUpdate = !!editedMovie.value?._id;

  await saveMovie();
  formRef.value?.resetValidation();

  showToast(wasUpdate ? 'Movie updated!' : 'Movie added!');
}

function cancelEdit() {
  resetForm();
  formRef.value?.resetValidation();
}

function confirmDelete(movie: { _id: string; title: string }) {
  movieToDelete.value = movie;
  dialog.value = true;
}

async function deleteConfirmed() {
  if (!movieToDelete.value) return;
  await deleteMovie(movieToDelete.value._id);
  dialog.value = false;
  movieToDelete.value = null;
  showToast('Movie deleted!');
}
</script>
