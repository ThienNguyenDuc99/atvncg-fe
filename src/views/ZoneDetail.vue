<template>
  <div class="zone-detail">
    <h2>Danh sách ghế cho Zone {{ zoneId }}</h2>

    <div v-if="loading" class="loading">Đang tải ghế...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="seats.length > 0" class="seat-grid">
      <div
          v-for="s in seats"
          :key="s.seatId"
          class="seat"
          :class="{
            booked: s.status !== 'Available',
            available: s.status === 'Available',
            selected: selectedSeats.includes(s.seatId)
          }"
          @click="toggleSeat(s)"
      >
        {{ s.seatId }}
      </div>
    </div>

    <!-- ⭐ BUTTON ĐẶT VÉ -->
    <div class="order-box" v-if="selectedSeats.length > 0">
      <p><strong>Đã chọn:</strong> {{ selectedSeats.length }} ghế</p>

      <button class="order-btn" @click="goToOrder">
        Tiếp tục đặt vé
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";

const route = useRoute();
const router = useRouter();

const zoneId = route.params.id;
const price = Number(route.query.price);    // <-- LẤY PRICE TỪ HOME
const zoneName = route.query.name;          // <-- LẤY NAME TỪ HOME

const seats = ref([]);
const loading = ref(true);
const error = ref("");

const selectedSeats = ref([]);

// Load seats
onMounted(async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(`/business/getSeatsByZone/${zoneId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        orderId: 6,
        status: "SUCCESS",
        totalPrice: 100,
        seatIds: [7, 8]
      }
    });

    if (res.data.success) {
      seats.value = res.data.seats;
    } else {
      error.value = "API trả về lỗi!";
    }

  } catch (err) {
    console.error(err);
    error.value = "Không thể tải dữ liệu!";
  } finally {
    loading.value = false;
  }
});

// Toggle chọn ghế
const toggleSeat = (s) => {
  if (s.status !== "Available") return;

  if (selectedSeats.value.includes(s.seatId)) {
    selectedSeats.value = selectedSeats.value.filter(id => id !== s.seatId);
  } else {
    selectedSeats.value.push(s.seatId);
  }
};

// ⭐ Redirect sang Order.vue
const goToOrder = () => {
  router.push({
    name: "order",
    query: {
      seats: JSON.stringify(selectedSeats.value),
      zoneId,
      zoneName,
      price
    }
  });
};
</script>

<style scoped>
.zone-detail {
  max-width: 800px;
  margin: 20px auto;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
  grid-gap: 10px;
}

.seat {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.available {
  background-color: green;
}

.booked {
  background-color: red;
  opacity: 0.6;
  cursor: not-allowed;
}

.selected {
  border: 3px solid yellow;
}

/* --- BOX ĐẶT VÉ --- */
.order-box {
  margin-top: 25px;
  padding: 15px;
  background: #f4f4f4;
  border-radius: 8px;
  text-align: center;
}

.order-btn {
  margin-top: 10px;
  padding: 10px 18px;
  font-size: 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.order-btn:hover {
  background: #0d47a1;
}
</style>
