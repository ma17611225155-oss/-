import { ref, computed } from 'vue'

const SUITS  = ['♥', '♦', '♣', '♠']
const RANKS  = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const VALUES = { A: 11, J: 10, Q: 10, K: 10 }

export const TARGET       = 300
export const MAX_HAND     = 8
export const MAX_PLAYS    = 4
export const MAX_DISCARDS = 3
export const MAX_SELECT   = 5

export const HAND_TYPES = {
  ROYAL_FLUSH:     ['皇家同花顺', 100, 8],
  STRAIGHT_FLUSH:  ['同花顺',     100, 8],
  FOUR_OF_A_KIND:  ['四条',        60, 7],
  FULL_HOUSE:      ['葫芦',        40, 4],
  FLUSH:           ['同花',        35, 4],
  STRAIGHT:        ['顺子',        30, 4],
  THREE_OF_A_KIND: ['三条',        30, 3],
  TWO_PAIR:        ['两对',        20, 2],
  PAIR:            ['对子',        10, 2],
  HIGH_CARD:       ['高牌',         5, 1],
}

function cardValue(rank) {
  return VALUES[rank] !== undefined ? VALUES[rank] : parseInt(rank, 10)
}

function buildDeck() {
  return SUITS.flatMap(suit =>
    RANKS.map(rank => ({ suit, rank, value: cardValue(rank) }))
  )
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function rankIndex(rank) { return RANKS.indexOf(rank) }

export function detectHand(cards) {
  if (!cards || cards.length === 0) return null
  const n = cards.length

  const rc = {}
  cards.forEach(c => { rc[c.rank] = (rc[c.rank] || 0) + 1 })
  const counts = Object.values(rc).sort((a, b) => b - a)

  const isFlush = n === 5 && cards.every(c => c.suit === cards[0].suit)

  let isStraight = false
  if (n === 5) {
    const idxs = [...new Set(cards.map(c => rankIndex(c.rank)))].sort((a, b) => a - b)
    if (idxs.length === 5) {
      if (idxs[4] - idxs[0] === 4) isStraight = true
      if (JSON.stringify(idxs) === JSON.stringify([0, 9, 10, 11, 12])) isStraight = true
    }
  }

  const isRoyal = isFlush && isStraight &&
    ['A', 'K', 'Q', 'J', '10'].every(r => cards.some(c => c.rank === r))

  if (isRoyal)                          return 'ROYAL_FLUSH'
  if (isStraight && isFlush)            return 'STRAIGHT_FLUSH'
  if (counts[0] === 4)                  return 'FOUR_OF_A_KIND'
  if (counts[0] === 3 && counts[1] === 2) return 'FULL_HOUSE'
  if (isFlush)                          return 'FLUSH'
  if (isStraight)                       return 'STRAIGHT'
  if (counts[0] === 3)                  return 'THREE_OF_A_KIND'
  if (counts[0] === 2 && counts[1] === 2) return 'TWO_PAIR'
  if (counts[0] === 2)                  return 'PAIR'
  return 'HIGH_CARD'
}

export function calcScore(cards) {
  const key = detectHand(cards)
  if (!key) return { points: 0, handName: '-', handKey: null }
  const [handName, base, mult] = HAND_TYPES[key]
  const cardSum = cards.reduce((s, c) => s + c.value, 0)
  return { points: (base + cardSum) * mult, handName, handKey: key }
}

export function useGame() {
  const deck          = ref([])
  const hand          = ref([])
  const selected      = ref([])
  const score         = ref(0)
  const handsLeft     = ref(MAX_PLAYS)
  const discardsLeft  = ref(MAX_DISCARDS)
  const gameStatus    = ref('playing')
  const lastPlayedCards = ref([])
  const lastHandType  = ref(null)
  const scorePopupText = ref('')
  const scorePopupKey  = ref(0)

  function deal(n) {
    return deck.value.splice(0, Math.min(n, deck.value.length))
  }

  const selectedCards = computed(() => selected.value.map(i => hand.value[i]))

  const selectedHandInfo = computed(() => {
    if (selectedCards.value.length === 0) return null
    return calcScore(selectedCards.value)
  })

  function toggleSelect(idx) {
    if (gameStatus.value !== 'playing') return
    const pos = selected.value.indexOf(idx)
    if (pos >= 0) {
      selected.value.splice(pos, 1)
    } else {
      if (selected.value.length >= MAX_SELECT) return
      selected.value.push(idx)
    }
  }

  function playHand() {
    if (selected.value.length === 0 || handsLeft.value === 0 || gameStatus.value !== 'playing') return

    const played = selected.value.map(i => hand.value[i])
    const { points, handName } = calcScore(played)

    score.value    += points
    handsLeft.value--
    lastPlayedCards.value = played
    lastHandType.value    = handName

    const selSet = new Set(selected.value)
    hand.value = hand.value.filter((_, i) => !selSet.has(i))
    selected.value = []
    hand.value.push(...deal(MAX_HAND - hand.value.length))

    scorePopupText.value = '+' + points
    scorePopupKey.value++

    if (score.value >= TARGET) {
      gameStatus.value = 'win'
    } else if (handsLeft.value === 0) {
      gameStatus.value = 'lose'
    }
  }

  function discardHand() {
    if (selected.value.length === 0 || discardsLeft.value === 0 || gameStatus.value !== 'playing') return

    discardsLeft.value--
    const selSet = new Set(selected.value)
    hand.value = hand.value.filter((_, i) => !selSet.has(i))
    selected.value = []
    hand.value.push(...deal(MAX_HAND - hand.value.length))

    if (handsLeft.value === 0) gameStatus.value = 'lose'
  }

  function restartGame() {
    deck.value          = shuffle(buildDeck())
    hand.value          = deal(MAX_HAND)
    selected.value      = []
    score.value         = 0
    handsLeft.value     = MAX_PLAYS
    discardsLeft.value  = MAX_DISCARDS
    gameStatus.value    = 'playing'
    lastPlayedCards.value = []
    lastHandType.value  = null
  }

  restartGame()

  return {
    hand, selected, score, handsLeft, discardsLeft,
    gameStatus, lastPlayedCards, lastHandType,
    scorePopupText, scorePopupKey,
    selectedCards, selectedHandInfo,
    toggleSelect, playHand, discardHand, restartGame,
  }
}
