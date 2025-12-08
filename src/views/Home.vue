<!--<template>-->
<!--  <div class="home">-->
<!--    <h1>Xin chào!</h1>-->
<!--    <p>Bạn đã đăng nhập thành công1 🎉</p>-->
<!--  </div>-->
<!--</template>-->


<template>
  <div class="home-container">
    <h1 class="title">Danh sách sự kiện 🎉</h1>

    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="event-list" v-if="events.length > 0">
      <div class="event-card" v-for="ev in events" :key="ev.eventId">
        <h3>{{ ev.eventName }}</h3>
        <p><strong>Địa điểm:</strong> {{ ev.eventLocation }}</p>
        <p><strong>Ngày:</strong> {{ ev.eventDate || "Không có ngày" }}</p>
      </div>
    </div>

    <div v-if="events.length === 0 && !loading" class="no-data">
      Không có sự kiện nào.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";

const events = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/business/getAllEvents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        orderId: 6,
        status: "SUCCESS",
        totalPrice: 100,
        seatIds: [7, 8],
      },
    });

    if (res.data.success) {
      // debugger;
      events.value = res.data.events;
    } else {
      error.value = "API trả về lỗi!";
    }
  } catch (err) {
    console.error(err);
    error.value = "Không thể load dữ liệu!";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 20px auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.loading,
.error,
.no-data {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 15px;
}

.event-card {
  background: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-card h3 {
  margin: 0 0 10px;
}

.event-card p {
  margin: 5px 0;
}
</style>