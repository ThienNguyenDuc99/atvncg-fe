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
      <div class="event-card"
           v-for="ev in events"
           :key="ev.eventId"
           @click="loadZones(ev.eventId)">
        <h3>{{ ev.eventName }}</h3>
        <p><strong>Địa điểm:</strong> {{ ev.eventLocation }}</p>
        <p><strong>Ngày:</strong> {{ ev.eventDate }}</p>
      </div>
    </div>

    <div v-if="zones.length > 0" class="zone-list">
      <h2>Danh sách Zone cho sự kiện {{ selectedEventId }}</h2>

      <div class="zone-card"
           v-for="z in zones"
           :key="z.zoneId"
           @click="goToZone(z.zoneId)">
        <p><strong>Zone ID:</strong> {{ z.zoneId }}</p>
        <p><strong>Tên:</strong> {{ z.name }}</p>
        <p><strong>Giá:</strong> {{ z.price.toLocaleString() }} VNĐ</p>
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
import { useRouter } from "vue-router";

const events = ref([]);
const zones = ref([]);
const selectedEventId = ref(null);
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


// 👉 Hàm load zone khi click vào event
const loadZones = async (eventId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get(`/business/getZonesByEvent/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        orderId: 6,
        status: "SUCCESS",
        totalPrice: 100,
        seatIds: [7, 8],
      },
    });

    if (res.data.success) {
      zones.value = res.data.zones;     // danh sách zone
      selectedEventId.value = eventId;  // đánh dấu event nào đang xem
    }
  } catch (err) {
    console.error("Load zones failed", err);
  }
};


const router = useRouter();
const goToZone = (zoneId) => {
  router.push(`/zone/${zoneId}`);
};
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

.zone-list {
  margin-top: 25px;
  padding: 15px;
  background: #f7f7f7;
  border-radius: 12px;
}

.zone-card {
  background: white;
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
</style>