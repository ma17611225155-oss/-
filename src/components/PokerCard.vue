<script setup>
defineProps({
  card:      { type: Object,  required: true },
  selected:  { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  large:     { type: Boolean, default: false },
})
defineEmits(['click'])

const isRed = (suit) => suit === '♥' || suit === '♦'
</script>

<template>
  <div
    class="poker-card"
    :class="{
      'red-card':   isRed(card.suit),
      'black-card': !isRed(card.suit),
      'selected':   selected,
      'large':      large,
      'disabled':   !clickable && !large,
    }"
    @click="clickable && $emit('click')"
  >
    <div class="corner tl">
      <span class="rank">{{ card.rank }}</span>
      <span class="suit">{{ card.suit }}</span>
    </div>
    <div class="center-suit">{{ card.suit }}</div>
    <div class="corner br">
      <span class="rank">{{ card.rank }}</span>
      <span class="suit">{{ card.suit }}</span>
    </div>
  </div>
</template>
