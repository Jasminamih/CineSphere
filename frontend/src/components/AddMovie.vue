<template>
  <div class="min-h-screen bg-gray-900 flex items-start justify-center py-12">
    <div class="w-full max-w-md bg-gray-800 rounded-xl shadow-xl p-6">
      <h2 class="text-3xl font-bold mb-6 text-center text-indigo-400">➕ Add Movie / Series</h2>
      <form @submit.prevent="submitMovie" class="space-y-4">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
          required
        />
        <input
          v-model="year"
          type="number"
          placeholder="Year"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
          required
        />
        <input
          v-model="genre"
          type="text"
          placeholder="Genre"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
          required
        />
        <input
          v-model="image"
          type="text"
          placeholder="Image URL"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
        />
        <textarea
          v-model="description"
          placeholder="Description"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
        ></textarea>

        <select
          v-model="type"
          class="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 text-gray-100"
          required
        >
          <option value="">Select type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Add
        </button>
      </form>

      <p v-if="success" class="mt-4 text-green-500 font-semibold text-center">
        Movie/Series added successfully!
      </p>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "AddMovie",
  setup() {
    const title = ref("");
    const year = ref<number | null>(null);
    const genre = ref("");
    const description = ref("");
    const image = ref("");
    const type = ref("");
    const success = ref(false);

    const submitMovie = async () => {
      try {
        await axios.post("http://localhost:5000/items", {
          title: title.value,
          year: year.value,
          genre: genre.value,
          description: description.value,
          image: image.value,
          type: type.value,
        });
        success.value = true;

        // Reset form
        title.value = "";
        year.value = null;
        genre.value = "";
        description.value = "";
        image.value = "";
        type.value = "";
      } catch (err) {
        console.error(err);
      }
    };

    return {
      title,
      year,
      genre,
      description,
      image,
      type,
      success,
      submitMovie,
    };
  },
});
</script>
