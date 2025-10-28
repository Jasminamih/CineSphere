<template>
  <div
    class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-lg shadow-xl mt-8 mb-8"
  >
    <h1 class="text-3xl font-bold text-gray-100 mb-6 flex items-center">
      <HeartSolid class="w-10 h-10 mr-2 text-red-500 inline-block" />
      Your Favourites
    </h1>

    <div v-if="favourites.length === 0" class="text-gray-300 text-lg text-center py-6">
      You have no favourite movies or series yet.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in favourites"
        :key="item.id"
        class="bg-gray-700 rounded-xl shadow-lg flex flex-col hover:shadow-2xl transition transform hover:-translate-y-1"
      >
        <div class="relative h-56">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover rounded-t-xl"
          />
          <button
            @click="removeFavourite(item.id)"
            class="absolute bottom-2 right-2 hover:scale-110 transition transform"
          >
            <HeartSolid class="w-6 h-6 text-red-500" />
          </button>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-semibold text-lg mb-1 text-gray-50">
            {{ item.title }} ({{ item.year }})
          </h3>
          <p class="text-sm text-gray-400 mb-2">{{ item.genre }}</p>
          <p class="text-gray-300 text-sm flex-1 min-h-[3rem]">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
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

const fetchFavourites = async () => {
  try {
    const res = await axios.get<Item[]>("http://localhost:5000/favourites", axiosConfig);
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

const removeFavourite = async (id: number) => {
  try {
    await axios.delete(`http://localhost:5000/favourites/${id}`, axiosConfig);
    favourites.value = favourites.value.filter(f => f.id !== id);
  } catch (err) {
    console.error("Error removing favourite:", err);
  }
};

onMounted(fetchFavourites);
</script>
