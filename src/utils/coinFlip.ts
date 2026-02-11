import type { CoinSide } from '@/consts/game';
import { COIN_SIDES } from '@/consts/game';

export const flipCoin = (): CoinSide =>
  Math.random() < 0.5 ? COIN_SIDES.heads : COIN_SIDES.tails;
