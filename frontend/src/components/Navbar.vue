<template>
  <nav
    class="bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 shadow-lg px-4 sm:px-6 lg:px-8 py-3">
    <div
      class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
      <router-link
        to="/"
        class="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
        <img
          src="/logo2.png"
          alt="CineSphere Logo"
          class="h-12 w-12 object-contain" />
        <span class="text-3xl font-semibold text-indigo-300 tracking-wide">
          Cine<span class="text-indigo-400">Sphere</span>
        </span>
      </router-link>

      <div class="hidden sm:flex items-center gap-4">
        <template v-if="isLoggedIn">
          <router-link
            to="/"
            class="px-3 py-1 rounded-lg font-medium text-sm transition text-gray-300 hover:text-white hover:bg-gray-700"
            :class="
              $route.path === '/' ? 'bg-gray-700 text-white shadow-sm' : ''
            ">
            Homepage
          </router-link>
          <router-link
            to="/add"
            class="px-3 py-1 rounded-lg font-medium text-sm transition text-gray-300 hover:text-white hover:bg-gray-700"
            :class="
              $route.path === '/add' ? 'bg-gray-700 text-white shadow-sm' : ''
            ">
            Add Movie
          </router-link>
          <router-link
            to="/favourites"
            class="px-3 py-1 rounded-lg font-medium text-sm transition text-gray-300 hover:text-white hover:bg-gray-700"
            :class="
              $route.path === '/favourites'
                ? 'bg-gray-700 text-white shadow-sm'
                : ''
            ">
            My Favourites
          </router-link>

          <div class="relative">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="px-3 py-1 text-sm rounded-lg bg-slate-800 text-gray-200 font-medium flex items-center gap-1 focus:outline-none hover:bg-slate-700 transition-colors cursor-pointer">
              Welcome {{ username }}
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-40 bg-slate-800 rounded-lg shadow-lg flex flex-col py-2 z-50">
              <router-link
                to="/profile"
                class="px-4 py-2 text-gray-200 hover:text-white hover:bg-slate-700 transition-colors"
                @click="isDropdownOpen = false">
                Profile
              </router-link>
              <button
                @click="logout"
                class="px-4 py-2 text-gray-200 hover:text-white hover:bg-slate-700 w-full text-left transition-colors">
                Logout
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <button
            @click="$router.push('/login')"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 hover:bg-indigo-700 text-white font-semibold transition">
            Login
          </button>
        </template>
      </div>

      <!-- Mobile menu -->
      <button
        @click="isOpen = !isOpen"
        class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none transition">
        <svg
          v-if="!isOpen"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isOpen" class="sm:hidden mt-3 px-4 flex flex-col gap-2">
      <template v-if="isLoggedIn">
        <router-link
          to="/add"
          class="block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 text-center"
          :class="$route.path === '/add' ? 'bg-gray-700 text-white' : ''"
          @click="isOpen = false">
          Add Movie
        </router-link>
        <router-link
          to="/favourites"
          class="block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 text-center"
          :class="$route.path === '/favourites' ? 'bg-gray-700 text-white' : ''"
          @click="isOpen = false">
          My Favourites
        </router-link>
        <router-link
          to="/profile"
          class="block px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 text-center"
          :class="$route.path === '/profile' ? 'bg-gray-700 text-white' : ''"
          @click="isOpen = false">
          Profile
        </router-link>
        <button
          @click="logout"
          class="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-700 text-white w-full font-semibold transition">
          Logout
        </button>
      </template>

      <template v-else>
        <button
          @click="
            $router.push('/login');
            isOpen = false;
          "
          class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition w-full">
          Login
        </button>
      </template>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userState } from "../UserState";

export default defineComponent({
  setup() {
    const router = useRouter();
    const isOpen = ref(false);
    const isDropdownOpen = ref(false);

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      userState.isLoggedIn.value = false;
      userState.username.value = "";
      router.push("/login");
    };

    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.querySelector(".relative");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        isDropdownOpen.value = false;
      }
    };
    onMounted(() => document.addEventListener("click", handleClickOutside));

    return {
      isOpen,
      isDropdownOpen,
      isLoggedIn: userState.isLoggedIn,
      username: userState.username,
      logout,
    };
  },
});
</script>
