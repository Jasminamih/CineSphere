<template>
  <div class="flex flex-col items-center w-full h-full bg-gray-900">
    <div
      class="w-full bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 py-10 flex flex-col items-center">
      <div
        class="w-30 h-30 rounded-full bg-slate-800 flex items-center justify-center text-white text-6xl font-bold shadow-lg mb-4">
        {{ username[0].toUpperCase() }}
      </div>
      <h2 class="text-3xl font-bold text-white">{{ username }}</h2>
      <p class="text-gray-300 text-lg mt-1">CineSphere User</p>
    </div>

    <!-- Quick Actions / Stats -->
    <div
      class="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 px-4 sm:px-6 lg:px-8">
      <!-- Favourites -->
      <router-link
        to="/favourites"
        class="bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex flex-col items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-red-400"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <p class="text-gray-300 uppercase text-sm font-semibold">Favourites</p>
        <p class="text-white font-bold text-3xl mt-1">{{ favouritesCount }}</p>
      </router-link>

      <router-link
        to="/add"
        class="bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4" />
        </svg>
        <p class="text-gray-300 uppercase text-sm font-semibold">Add Movie</p>
      </router-link>
    </div>

    <div class="max-w-7xl w-full mt-12 mb-12 px-4 sm:px-6 lg:px-8">
      <button
        @click="logout"
        class="w-full px-6 py-3 bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 cursor-pointer hover:bg-gray-600 rounded-xl text-white font-semibold text-lg transition-colors shadow-md">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { userState } from "../UserState";

const username = userState.username;
const favouritesCount = ref(0);
const router = useRouter();

const token = localStorage.getItem("token");
const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

const fetchFavourites = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/favourites",
      axiosConfig
    );
    favouritesCount.value = res.data.length;
  } catch (err) {
    console.error("Error fetching favourites:", err);
  }
};

onMounted(fetchFavourites);

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  userState.isLoggedIn.value = false;
  userState.username.value = "";
  router.push("/login");
};
</script>
