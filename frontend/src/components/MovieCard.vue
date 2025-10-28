<template>
  <div
    class="bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden transform hover:-translate-y-2 flex flex-col">
    <div class="relative h-56">
      <img
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover rounded-t-xl" />

      <span
        class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold uppercase"
        :class="
          item.type === 'movie'
            ? 'bg-gray-900 text-white'
            : 'bg-purple-900 text-white'
        ">
        {{ item.type }}
      </span>

      <!-- Heart Icon -->
      <button
        @click="$emit('toggle-favourite', item)"
        class="absolute bottom-2 right-2 transition transform hover:scale-110">
        <HeartSolid
          class="w-6 h-6"
          :class="isFavourite ? 'text-red-500' : 'text-white'" />
      </button>
    </div>

    <div class="p-4 flex-1 flex flex-col">
      <h3 class="font-semibold text-lg mb-1 text-gray-50">
        {{ item.title }} ({{ item.year }})
      </h3>
      <p class="text-sm text-gray-400 mb-2">{{ item.genre }}</p>
      <p class="text-gray-300 min-h-[3rem] text-sm flex-1">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { HeartIcon as HeartSolid } from "@heroicons/vue/24/solid";

interface Item {
  id: number;
  type: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  image: string;
}

defineProps<{
  item: Item;
  isFavourite: boolean;
}>();

defineEmits(["toggle-favourite"]);
</script>
