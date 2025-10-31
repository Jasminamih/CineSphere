<template>
  <div
    class="flex flex-col items-center justify-center h-full w-full px-4 bg-gray-900">
    <div
      class="w-full max-w-sm p-6 rounded-2xl shadow-lg bg-gradient-to-br from-slate-800 via-blue-gray-600 to-slate-700">
      <h1 class="text-2xl font-bold text-center mb-6 text-indigo-400">
        Create Account
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1 text-gray-200"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-50"
            :class="usernameError ? 'border-red-500' : 'border-gray-600'" />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-200"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-50"
            :class="emailError ? 'border-red-500' : 'border-gray-600'" />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-200"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-50"
            :class="passwordError ? 'border-red-500' : 'border-gray-600'" />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1 text-gray-200"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 rounded-md bg-gray-700 border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-50"
            :class="
              confirmPasswordError ? 'border-red-500' : 'border-gray-600'
            " />
          <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">
            {{ confirmPasswordError }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition transform hover:scale-105">
          Register
        </button>
      </form>

      <p class="text-gray-400 mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="underline hover:text-indigo-400">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Errors
const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const validateForm = () => {
  usernameError.value = "";
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";

  let valid = true;

  if (!username.value.trim()) {
    usernameError.value = "Username is required.";
    valid = false;
  }

  if (!email.value.trim()) {
    emailError.value = "Email is required.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Invalid email format.";
    valid = false;
  }

  if (!password.value.trim()) {
    passwordError.value = "Password is required.";
    valid = false;
  } else if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters.";
    valid = false;
  }

  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = "Passwords do not match.";
    valid = false;
  }

  return valid;
};
const API_URL = import.meta.env.VITE_API_URL;

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    toast.success("Registration successful! Redirecting to login...", {
      timeout: 1500,
    });
    setTimeout(() => router.push("/login"), 1500);
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Registration failed.");
    console.error(err);
  }
};
</script>

<style scoped>
/* Force mobile input outline to indigo instead of yellow */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6366f1;
}
</style>
