<template>
  <div class="order">
    <h2>Xác nhận đặt vé</h2>

    <p><strong>Ghế đã chọn:</strong></p>
    <ul>
      <li v-for="s in seatList" :key="s">Ghế {{ s }}</li>
    </ul>

    <p class="total">
      <strong>Tổng tiền:</strong>
      {{ totalPrice.toLocaleString() }} VNĐ
    </p>

    <button class="confirm-btn" @click="confirmOrder">
      Xác nhận đặt vé
    </button>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// ⭐ Nhận từ query
const seatList = JSON.parse(route.query.seats || "[]")
const price = Number(route.query.price || 0)

const totalPrice = price * seatList.length

function confirmOrder() {
  alert("Đặt vé thành công!")
  // TODO: gọi API đặt vé thật
}
</script>

<style scoped>
.order {
  max-width: 600px;
  margin: 20px auto;
}

.total {
  margin: 20px 0;
  font-size: 20px;
}

.confirm-btn {
  padding: 12px 20px;
  background: green;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
