<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div class="shots-gallery">
      <div class="card flex justify-content-center">
        <Galleria
          v-model:activeIndex="activeIndex"
          v-model:visible="displayCustom"
          :value="shots"
          :responsiveOptions="responsiveOptions"
          :numVisible="7"
          containerStyle="max-width: 850px"
          :circular="true"
          :fullScreen="true"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.data"
              :alt="slotProps.item.name"
              style="width: 100%; display: block"
              class="border-round shadow-4"
            />
          </template>
          <template #thumbnail="slotProps">
            <img
              :src="slotProps.item.data"
              :alt="slotProps.item.name"
              style="width: 100%; display: block"
              class="border-round shadow-4"
            />
          </template>
          <template #caption="slotProps">
            <div class="text-xl mb-2 font-bold">{{ slotProps.item.name }}</div>
            <p class="text-white">{{ slotProps.item.date }}</p>
          </template>
        </Galleria>

        <div v-if="shots" class="grid">
          <div v-for="(image, index) of shots" :key="index" class="col-4">
            <Card style="width: 25rem; overflow: hidden" unstyled>
              <template #header>
                <img
                  :src="image.data"
                  :alt="image.name"
                  style="cursor: pointer"
                  @click="imageClick(index)"
                  width="350"
                  class="border-round shadow-4"
                />
              </template>
              <template #title>{{ image.name }}</template>
              <template #subtitle>{{ image.date }}</template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Galleria from "primevue/galleria";
import { ScreenshotManagerDB } from "../db/screenshot-manager-db.js";
const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const shots = ref([]);
const activeIndex = ref(0);
const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 5,
  },
  {
    breakpoint: "768px",
    numVisible: 3,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
]);
const displayCustom = ref(false);
const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
const screenshotManagerDB = new ScreenshotManagerDB();

onMounted(async () => {
  loadShots();
});

async function loadShots() {
  try {
    await screenshotManagerDB.getAllShots((items) => {
      shots.value = items.map(
        (shotData) => new Shot(shotData.data, shotData.name, shotData.timestamp)
      );
    });
  } catch (error) {
    console.error("Error fetching shots:", error);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "loadShots") {
    console.log("Loading shots...");
    loadShots();
  }
});

class Shot {
  constructor(data, name, date) {
    this.data = data;
    this.name = name;
    this.date = date;
  }
}
</script>

<style>
/* Existing styles... */

.shots-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px; /* This sets space between the cards */
}

.shot-card {
  flex: 0 1 calc(33.333% - 20px); /* Adjust the 20px to account for the gap */
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  box-sizing: border-box; /* Include padding and border in the width calculation */
}

.card {
  /* background: var(--surface-card); */
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: 100%;
}

.wrapper .p-image-preview {
  max-width: 80% !important;
  max-height: 80vh !important;
  /* Other styles */
}

.shot-card img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Media query for smaller screens, adjust the breakpoint as needed */
@media (max-width: 600px) {
  .shot-card {
    flex: 0 1 calc(50% - 20px); /* Adjust for smaller screens */
  }
}

/* Rest of your styles... */
</style>
