<script setup>
import PokerCard from './PokerCard.vue'

defineProps({
  hand:      { type: Array,   required: true },
  selected:  { type: Array,   required: true },
  isPlaying: { type: Boolean, required: true },
})
defineEmits(['toggle'])
</script>

<template>
  <div class="hand-zone">
    <div class="hand-zone-label">手牌 · {{ hand.length }} 张</div>
    <div class="hand-cards">
      <PokerCard
        v-for="(card, i) in hand"
        :key="i"
        :card="card"
        :selected="selected.includes(i)"
        :clickable="isPlaying"
        @click="$emit('toggle', i)"
      />
    </div>
  </div>
</template>
