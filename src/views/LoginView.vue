<template>
  <div class="login">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <input v-model="user.username" placeholder="Username" required />
      <input v-model="user.password" type="password" placeholder="Password" required />
      <button type="submit">Đăng nhập</button>
    </form>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();
const user = ref({ username: "", password: "" });
const message = ref("");

async function login() {
  try {
    const res = await api.post("/auth/login", user.value);
    localStorage.setItem("token", res.data.token); // lưu token
    message.value = "Đăng nhập thành công!";

    // ✅ redirect đến home
    router.push("/home");
  } catch (err) {
    message.value = "Sai tài khoản hoặc mật khẩu!";
    console.error(err);
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 50px auto;
}
</style>
