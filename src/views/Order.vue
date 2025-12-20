<template>
  <div class="order">
    <h2>Thông tin đặt vé</h2>

    <p><strong>Các ghế đã chọn:</strong> {{ seatList.join(", ") }}</p>

    <p><strong>Giá / 1 ghế:</strong> {{ price.toLocaleString() }} VNĐ</p>

    <p><strong>Số lượng ghế:</strong> {{ seatList.length }}</p>

    <h3><strong>Tổng tiền:</strong> {{ totalPrice.toLocaleString() }} VNĐ</h3>

    <!-- BUTTON ĐẶT VÉ -->
    <button @click="confirmOrder" :disabled="loading">
      {{ loading ? "Đang xử lý..." : "Xác nhận đặt vé" }}
    </button>

    <!-- KẾT QUẢ ĐẶT VÉ + BUTTON THANH TOÁN -->
    <div v-if="orderSuccess" class="payment-box">
      <p style="color: green;">
        <strong>Đặt vé thành công! Mã đơn:</strong> {{ orderId }}
      </p>

      <button @click="confirmPayment" :disabled="paymentLoading">
        {{ paymentLoading ? "Đang thanh toán..." : "Xác nhận thanh toán" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import api from "../api";

// ======================
// LẤY DATA TỪ router
// ======================
const route = useRoute();
const seatList = ref(JSON.parse(route.query.seats));
const price = Number(route.query.price);
const totalPrice = price * seatList.value.length;

// ======================
// STATE
// ======================
const orderSuccess = ref(false);
const orderId = ref(null);
const loading = ref(false);
const paymentLoading = ref(false);

// ======================
// API: ĐẶT VÉ
// ======================
const confirmOrder = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
        "/business/order",
        {
          userId: 1,                  // TODO: sau lấy từ token decode
          seatIds: seatList.value,
          price: price
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    );

    if (res.data.status === "SUCCESS") {
      orderSuccess.value = true;
      orderId.value = res.data.orderId;
    } else {
      alert("Đặt vé thất bại!");
    }

  } catch (err) {
    console.error(err);
    alert("Lỗi khi đặt vé!");
  }

  loading.value = false;
};

// ======================
// API: THANH TOÁN
// ======================
const confirmPayment = async () => {
  paymentLoading.value = true;

  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
        "/business/payment",
        {
          orderId: orderId.value,
          status: "SUCCESS",
          totalPrice: totalPrice,
          seatIds: seatList.value
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
    );

    if (res.data.status === "SUCCESS") {
      alert("🎉 Thanh toán thành công!");
    } else if (res.data.status === "ALREADY_PAID") {
      alert("⚠️ Đơn hàng này đã được thanh toán trước đó!");
    } else {
      alert("❌ Thanh toán thất bại!");
    }

  } catch (err) {
    console.error(err);
    alert("Lỗi khi thanh toán!");
  }

  paymentLoading.value = false;
};
</script>

<style scoped>
.order {
  max-width: 600px;
  margin: 20px auto;
}

button {
  padding: 10px 18px;
  margin-top: 15px;
  font-size: 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #0d47a1;
}

.payment-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  background: #f5f5f5;
  text-align: center;
}
</style>
