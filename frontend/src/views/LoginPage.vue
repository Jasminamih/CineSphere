<template>
  <div class="flex flex-col items-center justify-center h-full w-full px-4">
    <div
      class="w-full max-w-sm bg-gradient-to-br from-slate-800 via-blue-gray-600 to-slate-700 p-6 rounded-2xl shadow-md flex-shrink-0">
      <h1 class="text-2xl font-bold text-center mb-6 text-[#737DEC]">
        Welcome Back
      </h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border"
            :class="usernameError ? 'border-red-500' : 'border-gray-600'" />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border"
            :class="passwordError ? 'border-red-500' : 'border-gray-600'" />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition font-semibold">
          Login
        </button>
      </form>

      <p class="text-gray-400 mt-4 text-center">
        Don’t have an account?
        <router-link to="/register" class="underline hover:text-[#737DEC]">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { userState } from "../UserState";
import { useToast } from "vue-toastification";

const username = ref("");
const password = ref("");
const usernameError = ref("");
const passwordError = ref("");
const router = useRouter();
const toast = useToast();

const validateForm = () => {
  usernameError.value = "";
  passwordError.value = "";
  let valid = true;

  if (!username.value.trim()) {
    usernameError.value = "Username is required.";
    valid = false;
  }

  if (!password.value.trim()) {
    passwordError.value = "Password is required.";
    valid = false;
  }

  return valid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      username: username.value,
      password: password.value,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.username);

    userState.isLoggedIn.value = true;
    userState.username.value = res.data.username;

    toast.success(`Welcome back, ${res.data.username}!`, { timeout: 1000 });

    setTimeout(() => {
      router.push("/");
    }, 300);
  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed.");
  }
};
</script>
