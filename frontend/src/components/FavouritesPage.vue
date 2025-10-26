<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-lg shadow-xl mt-8 mb-8">
    <h1 class="text-4xl font-bold text-gray-100 mb-6">❤️ Your Favourites</h1>

    <div v-if="favourites.length === 0" class="text-gray-300 text-lg">
      You have no favourite movies or series yet.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" v-else>
      <div v-for="item in favourites" :key="item.id" class="bg-gray-700 rounded-xl shadow-lg flex flex-col">
        <div class="relative h-56">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover rounded-t-xl" />
          <button
            @click="removeFavourite(item.id)"
            class="absolute bottom-2 right-2 text-2xl text-red-500 hover:scale-110 transition"
          >❤️</button>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-semibold text-lg mb-1 text-gray-50">{{ item.title }} ({{ item.year }})</h3>
          <p class="text-sm text-gray-400 mb-2">{{ item.genre }}</p>
          <p class="text-gray-300 text-sm flex-1">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

interface Item {
  id: number;
  type: string;
  title: string;
  year: number;
  genre: string;
  description: string;
  image: string;
}

export default defineComponent({
  name: "Favourites",
  setup() {
    const router = useRouter();
    const favourites = ref<Item[]>([]);
    const token = localStorage.getItem("token"); // JWT token

    if (!token) {
      router.push("/login"); // redirect immediately if no token
    }

    const axiosConfig = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const fetchFavourites = async () => {
      try {
        const res = await axios.get<Item[]>("http://localhost:5000/favourites", axiosConfig);
        favourites.value = res.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Unauthorized, redirect to login
          localStorage.removeItem("token");
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

    return { favourites, removeFavourite };
  }
});
</script>
