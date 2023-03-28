<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("chat");
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
