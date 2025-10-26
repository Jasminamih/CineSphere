<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Navbar -->
    <nav class="bg-gray-800 shadow-lg py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
          <img src="/logo2.png" alt="CineSphere Logo" class="h-12 w-12 object-contain" />
          <span class="text-3xl font-semibold text-indigo-300 tracking-wide leading-none">
            Cine<span class="text-indigo-400">Sphere</span>
          </span>
        </router-link>

        <!-- Desktop Links + Auth -->
        <div class="hidden sm:flex flex-wrap items-center gap-2 md:gap-4 ml-0 sm:ml-4">
          <!-- Links -->
          <router-link
            v-if="isLoggedIn"
            to="/add"
            class="px-3 py-1 rounded-lg font-medium text-sm transition"
            :class="$route.path === '/add' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'"
          >
            Add Movie
          </router-link>

          <router-link
            v-if="isLoggedIn"
            to="/favourites"
            class="px-3 py-1 rounded-lg font-medium text-sm transition"
            :class="$route.path === '/favourites' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'"
          >
            My Favourites
          </router-link>

          <!-- Auth -->
          <div v-if="isLoggedIn" class="flex flex-wrap items-center gap-2">
            <span class="px-2 py-1 text-sm rounded-full text-white font-medium" style="background-color: #737DEC;">
              Welcome, {{ username }}!
            </span>
            <button
              @click="logout"
              class="px-3 py-1 text-sm rounded-lg bg-gray-900 hover:bg-indigo-600 text-white font-semibold transition"
            >
              Logout
            </button>
          </div>

          <div v-else>
            <button
              @click="$router.push('/login')"
              class="px-3 py-1 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
            >
              Login
            </button>
          </div>
        </div>

        <!-- Mobile Hamburger -->
        <button
          @click="isOpen = !isOpen"
          class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none transition"
        >
          <svg v-if="!isOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div v-if="isOpen" class="sm:hidden mt-3 px-4 flex flex-col gap-2">
        <router-link
          v-if="isLoggedIn"
          to="/add"
          class="block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 text-center"
          :class="$route.path === '/add' ? 'bg-indigo-600 text-white' : ''"
          @click="isOpen = false"
        >
          Add Movie
        </router-link>

        <router-link
          v-if="isLoggedIn"
          to="/favourites"
          class="block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 text-center"
          :class="$route.path === '/favourites' ? 'bg-indigo-600 text-white' : ''"
          @click="isOpen = false"
        >
          My Favourites
        </router-link>

        <!-- Mobile Auth -->
        <div v-if="isLoggedIn" class="flex flex-col gap-2 items-center mt-2">
          <span class="px-3 py-1 rounded-full bg-[#737DEC] text-white font-medium text-center">
            Welcome, {{ username }}!
          </span>
          <button
            @click="logout"
            class="px-4 py-2 rounded-lg bg-gray-900 hover:bg-indigo-600 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>

        <div v-else class="mt-2 flex justify-center">
          <button
            @click="$router.push('/login'); isOpen = false"
            class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>
    </nav>

    <!-- Pages will render here -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { userState } from "./UserState";

export default defineComponent({
  setup() {
    const router = useRouter();
    const isOpen = ref(false);

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      userState.isLoggedIn.value = false;
      userState.username.value = "";
      router.push("/login");
    };

    return {
      isOpen,
      isLoggedIn: userState.isLoggedIn,
      username: userState.username,
      logout,
    };
  },
});
</script>
