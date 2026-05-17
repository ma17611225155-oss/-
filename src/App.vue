<script setup>
import { computed } from 'vue'
import { useGame, TARGET } from './composables/useGame.js'
import HUD           from './components/HUD.vue'
import PlayZone      from './components/PlayZone.vue'
import HandZone      from './components/HandZone.vue'
import ActionBar     from './components/ActionBar.vue'
import ResultOverlay from './components/ResultOverlay.vue'

const {
  hand, selected, score, handsLeft, discardsLeft,
  gameStatus, lastPlayedCards, lastHandType,
  scorePopupText, scorePopupKey,
  selectedHandInfo,
  toggleSelect, playHand, discardHand, restartGame,
} = useGame()

const isPlaying   = computed(() => gameStatus.value === 'playing')
const hasSelection = computed(() => selected.value.length > 0)
</script>

<template>
  <div class="game-viewport">
    <HUD
      :target="TARGET"
      :score="score"
      :handsLeft="handsLeft"
      :discardsLeft="discardsLeft"
    />
    <PlayZone
      :lastPlayedCards="lastPlayedCards"
      :lastHandType="lastHandType"
      :scorePopupText="scorePopupText"
      :scorePopupKey="scorePopupKey"
    />
    <HandZone
      :hand="hand"
      :selected="selected"
      :isPlaying="isPlaying"
      @toggle="toggleSelect"
    />
    <ActionBar
      :selectedHandInfo="selectedHandInfo"
      :handsLeft="handsLeft"
      :discardsLeft="discardsLeft"
      :hasSelection="hasSelection"
      :isPlaying="isPlaying"
      @play="playHand"
      @discard="discardHand"
      @restart="restartGame"
    />
    <ResultOverlay
      :gameStatus="gameStatus"
      :score="score"
      @restart="restartGame"
    />
  </div>
</template>
