<script setup>
import { ref, watch, nextTick } from 'vue'
import PokerCard from './PokerCard.vue'

const props = defineProps({
  lastPlayedCards: { type: Array,  required: true },
  lastHandType:    { type: String,  default: null },
  scorePopupText:  { type: String,  required: true },
  scorePopupKey:   { type: Number,  required: true },
})

const showPopup = ref(false)

watch(() => props.scorePopupKey, async () => {
  showPopup.value = false
  await nextTick()
  showPopup.value = true
  setTimeout(() => { showPopup.value = false }, 1600)
})
</script>

<template>
  <div class="play-zone">
    <div class="hand-type-badge" :class="{ visible: lastPlayedCards.length > 0 }">
      {{ lastHandType }}
    </div>

    <div class="play-cards">
      <template v-if="lastPlayedCards.length > 0">
        <PokerCard
          v-for="(card, i) in lastPlayedCards"
          :key="i"
          :card="card"
          :large="true"
        />
      </template>
      <template v-else>
        <div v-for="i in 5" :key="i" class="play-placeholder">+</div>
      </template>
    </div>

    <div class="zone-hint" :style="{ opacity: lastPlayedCards.length > 0 ? 0 : 1 }">
      选中 1–5 张牌后点击「出牌」
    </div>

    <div class="score-popup" :class="{ show: showPopup }">{{ scorePopupText }}</div>
  </div>
</template>
