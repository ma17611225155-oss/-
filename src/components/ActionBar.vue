<script setup>
defineProps({
  selectedHandInfo: { type: Object,  default: null },
  handsLeft:        { type: Number,  required: true },
  discardsLeft:     { type: Number,  required: true },
  hasSelection:     { type: Boolean, required: true },
  isPlaying:        { type: Boolean, required: true },
})
defineEmits(['play', 'discard', 'restart'])
</script>

<template>
  <div class="action-bar">
    <div class="hand-hint" :class="{ active: hasSelection }">
      {{ selectedHandInfo ? selectedHandInfo.handName : '选牌后查看牌型' }}
    </div>
    <button
      class="btn btn-play"
      :disabled="!hasSelection || !isPlaying || handsLeft === 0"
      @click="$emit('play')"
    >出牌</button>
    <button
      class="btn btn-discard"
      :disabled="!hasSelection || !isPlaying || discardsLeft === 0"
      @click="$emit('discard')"
    >弃牌</button>
    <button class="btn btn-restart" @click="$emit('restart')">重新开始</button>
  </div>
</template>
