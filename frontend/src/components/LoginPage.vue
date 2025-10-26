<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-100 mb-6 text-center">
        {{ isLogin ? 'Login' : 'Register' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="px-4 py-2 rounded-full bg-gray-700 text-gray-100 focus:outline-none"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="px-4 py-2 rounded-full bg-gray-700 text-gray-100 focus:outline-none"
        />
        <button
          type="submit"
          class="bg-gray-900 hover:bg-white hover:text-gray-900 text-white py-2 rounded-full font-semibold transition"
        >
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <p class="text-gray-400 mt-4 text-center">
        <span @click="isLogin = !isLogin" class="cursor-pointer underline">
          {{ isLogin ? 'Create account?' : 'Already have an account?' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import router from "../router";
import { userState } from "../UserState"; // global reactive state

export default defineComponent({
  setup() {
    const username = ref("");
    const password = ref("");
    const isLogin = ref(true);

    const handleSubmit = async () => {
      try {
        if (isLogin.value) {
          const res = await axios.post("http://localhost:5000/auth/login", {
            username: username.value,
            password: password.value,
          });

          // Save token and username in localStorage
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.username);

          // Update global reactive state
          userState.isLoggedIn.value = true;
          userState.username.value = res.data.username;

          router.push("/"); // go to home
        } else {
          await axios.post("http://localhost:5000/auth/register", {
            username: username.value,
            password: password.value,
          });
          alert("Registration successful! You can now login.");
          isLogin.value = true;
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Error");
      }
    };

    return { username, password, isLogin, handleSubmit };
  },
});
</script>
