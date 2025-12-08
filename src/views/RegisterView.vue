<template>
  <div class="register">
    <h1>Đăng ký tài khoản</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="Tên đăng nhập" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng ký</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <button
        v-if="showLoginButton"
        @click="goToLogin"
        class="login-btn"
    >
      Đi đến đăng nhập
    </button>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const successMessage = ref('')
const showLoginButton = ref(false)

const handleRegister = async () => {
  try {
    const res = await axios.post('http://localhost:8080/auth/register', {
      username: username.value,
      password: password.value,
    })
    successMessage.value = 'Đăng ký thành công!'
    showLoginButton.value = true

    // ✅ reset input fields
    username.value = ''
    password.value = ''

    console.log(res.data)
  } catch (err) {
    alert('Đăng ký thất bại!')
    console.error(err)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 50px auto;
}
.success {
  color: green;
  margin-top: 10px;
}
.login-btn {
  margin-top: 10px;
}
</style>
