<template>
  <div>
    <Galleria
      v-model:activeIndex="activeIndex"
      v-model:visible="displayCustom"
      :value="shots"
      :responsiveOptions="responsiveOptions"
      :numVisible="numVisible"
      containerStyle="width: 100%; max-width: 850px"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      :showThumbnails="false"
      class="galleria-custom"
    >
      <template #item="slotProps">
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
        <Button
          icon="pi pi-download"
          type="button"
          class="p-button-text"
        ></Button>
        <Button
          icon="pi pi-times"
          type="button"
          class="p-button-text"
          style="color: rgb(244, 133, 133)"
        ></Button>
      </template>
    </Galleria>
    <div class="grid">
      <div class="col-12 lg:col-12 xl:col-12">
        <div v-if="shots" class="grid-container">
          <div
            v-for="(image, index) of shots"
            :key="index"
            class="grid-item card mb-0"
          >
            <img
              :src="image.data"
              :alt="image.name"
              style="cursor: pointer"
              @click="imageClick(index)"
              width="350"
              class="border-round shadow-4"
            />
            <p>{{ image.name }}</p>
            <p>{{ image.date }}</p>
            <Button
              icon="pi pi-download"
              type="button"
              class="p-button-text"
            ></Button>
            <Button
              icon="pi pi-times"
              type="button"
              class="p-button-text"
              style="color: rgb(244, 133, 133)"
            ></Button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="shots" class="grid-container">
          <div v-for="(image, index) of shots" :key="index" class="grid-item">
            <img
              :src="image.data"
              :alt="image.name"
              style="cursor: pointer"
              @click="imageClick(index)"
              width="350"
              class="border-round shadow-4"
            />
          </div>
        </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Galleria from "primevue/galleria";
import Button from "primevue/button";
import { ScreenshotManagerDB } from "../db/screenshot-manager-db.js";
import Shot from "../models/shot.js";
import { useLayout } from "@/layout/composables/layout";

const { isDarkTheme } = useLayout();

const screenshotManagerDB = new ScreenshotManagerDB();

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const shots = ref([]);
const activeIndex = ref(0);
const displayCustom = ref(false);
const lineOptions = ref(null);

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

const numVisible = ref(7); // This will change based on screen size, thanks to responsiveOptions

const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};

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

const applyLightTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };
};

const applyDarkTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: "#ebedef",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ebedef",
        },
        grid: {
          color: "rgba(160, 167, 181, .3)",
        },
      },
      y: {
        ticks: {
          color: "#ebedef",
        },
        grid: {
          color: "rgba(160, 167, 181, .3)",
        },
      },
    },
  };
};

watch(
  isDarkTheme,
  (val) => {
    if (val) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  },
  { immediate: true }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "loadShots") {
    console.log("Loading shots...");
    loadShots();
  }
});
</script>

<style>
/* Existing styles... */

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Start with 3 columns */
  gap: 10px; /* Space between items */
  padding: 10px;
}

.grid-item {
  min-width: 0; /* Ensure the content can shrink */
  overflow: hidden; /* Prevent content from spilling out */
}

.grid-item img {
  width: 100%; /* This will make the image responsive within the grid item */
  height: auto;
  object-fit: cover; /* This will cover the area of the container without stretching the image */
}
/* Rest of your styles... */
</style>
