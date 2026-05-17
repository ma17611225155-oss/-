<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  target:       { type: Number, required: true },
  score:        { type: Number, required: true },
  handsLeft:    { type: Number, required: true },
  discardsLeft: { type: Number, required: true },
})

const scoreBump    = ref(false)
const playsBump    = ref(false)
const discardsBump = ref(false)

async function doBump(bumpRef) {
  bumpRef.value = false
  await nextTick()
  bumpRef.value = true
  setTimeout(() => { bumpRef.value = false }, 300)
}

watch(() => props.score,        () => doBump(scoreBump))
watch(() => props.handsLeft,    () => doBump(playsBump))
watch(() => props.discardsLeft, () => doBump(discardsBump))
</script>

<template>
  <div class="hud">
    <div class="hud-item">
      <div class="hud-label">目标分</div>
      <div class="hud-value target">{{ target }}</div>
    </div>
    <div class="hud-item">
      <div class="hud-label">当前分</div>
      <div class="hud-value score" :class="{ bump: scoreBump }">{{ score }}</div>
    </div>
    <div class="hud-item">
      <div class="hud-label">剩余出牌</div>
      <div class="hud-value plays" :class="{ bump: playsBump, exhausted: handsLeft === 0 }">{{ handsLeft }}</div>
    </div>
    <div class="hud-item">
      <div class="hud-label">剩余弃牌</div>
      <div class="hud-value discards" :class="{ bump: discardsBump, exhausted: discardsLeft === 0 }">{{ discardsLeft }}</div>
    </div>
  </div>
</template>
