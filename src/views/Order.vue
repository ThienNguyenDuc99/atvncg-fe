<template>
  <div class="order">
    <h2>Thông tin đặt vé</h2>

    <p><strong>Các ghế đã chọn:</strong> {{ seatList.join(", ") }}</p>

    <p><strong>Giá / 1 ghế:</strong> {{ price.toLocaleString() }} VNĐ</p>

    <p><strong>Số lượng ghế:</strong> {{ seatList.length }}</p>

    <h3><strong>Tổng tiền:</strong> {{ totalPrice.toLocaleString() }} VNĐ</h3>

    <button @click="confirmOrder">Xác nhận đặt vé</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Lấy dữ liệu từ ZoneDetail.vue
const seatList = ref(JSON.parse(route.query.seats));
const price = Number(route.query.price);

// Tính tổng tiền
const totalPrice = price * seatList.value.length;

const confirmOrder = () => {
  alert(`Đặt vé thành công! Tổng tiền: ${totalPrice.toLocaleString()} VNĐ`);
};
</script>