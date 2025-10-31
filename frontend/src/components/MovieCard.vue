<template>
  <div
    class="bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden transform hover:-translate-y-2 flex flex-col">
    
    <div class="relative h-56">
  <img
  :src="item.image"
  :alt="item.title"
  class="w-full h-full object-cover rounded-t-xl"
  width="400"
  height="560"
  :loading="loading"
  :fetchpriority="isFirst ? 'high' : undefined"
/>


      <!-- Badge -->
      <span
        class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold uppercase"
        :class="item.type === 'movie' ? 'bg-gray-900 text-white' : 'bg-purple-900 text-white'">
        {{ item.type }}
      </span>

      <!-- Heart button -->
      <div class="absolute bottom-2 right-2">
        <button
          @click="handleFavouriteClick"
          class="relative group transition transform hover:scale-110"
          :aria-label="isFavourite ? 'Remove from favourites' : 'Add to favourites'"
        >
          <HeartSolid
            class="w-6 h-6 cursor-pointer"
            :class="isFavourite ? 'text-red-500' : 'text-white'"
            aria-hidden="true"
          />

          <!-- Tooltip for non-logged-in users -->
          <span
            v-if="!isLoggedIn && showTooltip"
            class="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg
                   transition-all duration-200 shadow-md whitespace-nowrap pointer-events-none"
          >
            Log in to favourite
          </span>
          <span
            v-if="!isLoggedIn"
            class="hidden md:block absolute -top-8 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg
                   opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 
                   shadow-md whitespace-nowrap pointer-events-none"
          >
            Log in to favourite
          </span>
        </button>
      </div>
    </div>

    <!-- Movie details -->
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="font-semibold text-lg mb-1 text-gray-50">
        {{ item.title }} ({{ item.year }})
      </h3>
      <p class="text-sm text-gray-200 mb-2">{{ item.genre }}</p>
      <p class="text-gray-100 min-h-[3rem] text-sm flex-1">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";
import { userState } from "../UserState";

interface Item {
  id: number;
  type: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  image: string;
}

const props = defineProps<{
  item: Item;
  isFavourite: boolean;
    loading?: 'lazy' | 'eager';
      isFirst?: boolean;


}>();
const emit = defineEmits(["toggle-favourite"]);

const isLoggedIn = userState.isLoggedIn; 

const showTooltip = ref(false);

const handleFavouriteClick = () => {
  if (!isLoggedIn.value) {
    // show tooltip briefly on mobile/tap
    showTooltip.value = true;
    setTimeout(() => (showTooltip.value = false), 1500);
    return;
  }
  emit("toggle-favourite", props.item);
};
</script>
