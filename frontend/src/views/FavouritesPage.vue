<template>
  <div
    class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-lg shadow-xl mt-8 mb-8">
    <h1 class="text-3xl font-bold text-gray-100 mb-6 flex items-center">
      <HeartSolid class="w-10 h-10 mr-2 text-red-500 inline-block" />
      Your Favourites
    </h1>

    <div
      v-if="favourites.length === 0"
      class="text-gray-300 text-lg text-center py-6">
      You have no favourite movies or series yet.
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MovieCard
        v-for="item in favourites"
        :key="item.id"
        :item="item"
        :isFavourite="true"
        @toggle-favourite="removeFavourite" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
import MovieCard from "@/components/MovieCard.vue";
import { userState } from "../UserState";

interface Item {
  id: number;
  type: string;
  title: string;
  year: number;
  genre: string;
  description: string;
  image: string;
}

const router = useRouter();
const favourites = ref<Item[]>([]);
const token = localStorage.getItem("token");

if (!token) router.push("/login");

const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
const API_URL = import.meta.env.VITE_API_URL;

const fetchFavourites = async () => {
  try {
    const res = await axios.get<Item[]>(
      `${API_URL}/favourites`,
      axiosConfig
    );
    favourites.value = res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      userState.isLoggedIn.value = false;
      userState.username.value = "";
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    } else {
      console.error("Error fetching favourites:", err);
    }
  }
};

const removeFavourite = async (item: Item) => {
  try {
    await axios.delete(
      `${API_URL}/favourites/${item.id}`,
      axiosConfig
    );
    favourites.value = favourites.value.filter((f) => f.id !== item.id);
  } catch (err) {
    console.error("Error removing favourite:", err);
  }
};

onMounted(fetchFavourites);
</script>
