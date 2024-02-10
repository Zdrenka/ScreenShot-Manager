<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div class="shots-gallery">
      <!-- <div
        v-for="shot in shots"
        :key="shot.name"
        class="shot-card border-1 surface-border border-round m-2 text-center py-5 px-3"
      >
        <img :src="shot.data" :alt="shot.name" />
        <h2>{{ shot.name }}</h2>
        <h4>{{ shot.date }}</h4>
      </div> -->

      <Card style="width: 25em" v-for="shot in shots" :key="shot.name">
        <template #header>
          <img
            alt="{{shot.name}}"
            style="width: -webkit-fill-available"
            :src="shot.data"
            :alt="shot.name"
          />
        </template>
        <template #title>{{ shot.name }}</template>
        <template #subtitle>{{ shot.date }}</template>
        <template #footer>
          <Button icon="pi pi-check" label="Save" />
          <Button
            icon="pi pi-times"
            label="Cancel"
            severity="secondary"
            style="margin-left: 0.5em"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ScreenshotManagerDB } from "../db/screenshot-manager-db.js";
import Card from "primevue/card";

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});

const shots = ref([]);
const screenshotManagerDB = new ScreenshotManagerDB();

onMounted(async () => {
  // Load the settings
  chrome.storage.sync.get(function (data) {
    // Example of setting the checked property
    for (let key in data) {
      // Use Vue's reactivity system instead of direct DOM manipulation
      // ...
    }
    console.log("Found sync data");
  });

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

<style scoped>
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
