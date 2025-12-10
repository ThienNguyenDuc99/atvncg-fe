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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api";

const route = useRoute();
const zoneId = route.params.id;

const seats = ref([]);
const loading = ref(true);
const error = ref("");

const selectedSeats = ref([]); // ghế người dùng chọn

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
  // Nếu ghế đã book → không cho chọn
  if (s.status !== "Available") return;

  if (selectedSeats.value.includes(s.seatId)) {
    selectedSeats.value = selectedSeats.value.filter(id => id !== s.seatId);
  } else {
    selectedSeats.value.push(s.seatId);
  }
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
</style>
