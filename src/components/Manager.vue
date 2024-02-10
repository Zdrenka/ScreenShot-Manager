<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div class="shots-gallery">
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
          />
        </template>
        <template #thumbnail="slotProps">
          <img
            :src="slotProps.item.data"
            :alt="slotProps.item.name"
            style="width: 100%; display: block"
          />
        </template>
      </Galleria>
      <div v-if="shots" class="grid" style="max-width: 400px">
        <div v-for="(image, index) of shots" :key="index" class="col-4">
          <img
            :src="image.data"
            :alt="image.name"
            style="cursor: pointer"
            @click="imageClick(index)"
            width="250"
          />
        </div>
      </div>
      <!-- 
      <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :value="images" :responsiveOptions="responsiveOptions" :numVisible="7"
    containerStyle="max-width: 850px" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
    <template #item="slotProps">
        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
    </template>
    <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
    </template>
</Galleria> -->

      <!-- <div style="width: 25em" v-for="shot in shots" :key="shot.name"> -->
      <!-- <img
            alt="{{shot.name}}"
            style="width: -webkit-fill-available"
            :src="shot.data"
            :alt="shot.name"
          /> -->
      <!-- <Image alt="Image" width="250" preview>
          <template #indicatoricon>
            <i class="pi pi-search"></i>
          </template>
          <template #image>
            <img :src="shot.data" :alt="shot.name" />
          </template>
          <template #preview="slotProps">
            <img
              :src="shot.data"
              :alt="shot.name"
              :style="slotProps.style"
              @click="slotProps.onClick"
            />
          </template>
        </Image> -->
      <!-- <div class="wrapper">
          <Image :src="shot.data" :alt="shot.name" width="200" preview />
        </div> -->
      <!-- <Button icon="pi pi-check" label="Save" />
          <Button
            icon="pi pi-times"
            label="Cancel"
            severity="secondary"
            style="margin-left: 0.5em"
          /> -->
      <!-- <div class="flex gap-3 mt-1">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            class="w-full"
            icon="pi pi-check"
          />
          <Button label="Save" class="w-full" icon="pi pi-times" /> -->
      <!-- </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Image from "primevue/image";
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
  // Load shots
  try {
    await screenshotManagerDB.getAllShots((items) => {
      shots.value = items.map(
        (shotData) => new Shot(shotData.data, shotData.name, shotData.timestamp)
      );
    });
  } catch (error) {
    console.error("Error fetching shots:", error);
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
