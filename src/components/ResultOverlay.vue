<script setup>
defineProps({
  gameStatus: { type: String, required: true },
  score:      { type: Number, required: true },
})
defineEmits(['restart'])
</script>

<template>
  <div class="overlay" :class="{ visible: gameStatus !== 'playing' }">
    <div class="result-modal" :class="gameStatus === 'win' ? 'win' : 'lose'">
      <div class="result-title">
        {{ gameStatus === 'win' ? 'Beat the Blind！' : '挑战失败' }}
      </div>
      <div class="result-score">{{ score }}</div>
      <div class="result-sub">
        {{ gameStatus === 'win' ? '目标达成！' : '出牌机会耗尽' }}
      </div>
      <button class="btn btn-restart" @click="$emit('restart')">再来一局</button>
    </div>
  </div>
</template>
