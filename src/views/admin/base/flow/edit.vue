<template>
    <div class="p-3">
        <p>
            创建流程
            <Form :id="id"/>
        </p>
    </div>

</template>

<script setup lang='ts'>
const route = useRoute()
let id = route.params.id
import Form from './form.vue'
</script>

<style></style>