<template>
  <div>
    {{users}}
<!--    <NuxtRouteAnnouncer />-->
<!--    <NuxtWelcome />-->
    test
  </div>
</template>

<script lang="ts" setup>
const { data: users } = await useFetch('/api/users')
</script>
