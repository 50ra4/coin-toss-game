import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  generateShareText,
  getAppUrl,
  shareToX,
  shareToThreads,
} from './share.service';

describe('getAppUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('VITE_BASE_URLが設定されている場合はそれを返す', () => {
    vi.stubEnv('VITE_BASE_URL', 'https://50ra4.github.io/coin-toss-game');

    expect(getAppUrl()).toBe('https://50ra4.github.io/coin-toss-game');
  });

  it('VITE_BASE_URLが未設定の場合はoriginとBASE_URLから組み立てる', () => {
    vi.stubEnv('VITE_BASE_URL', '');
    vi.stubEnv('BASE_URL', '/coin-toss-game/');

    expect(getAppUrl()).toBe('http://localhost:3000/coin-toss-game');
  });

  it('BASE_URLの末尾スラッシュが除去される', () => {
    vi.stubEnv('VITE_BASE_URL', '');
    vi.stubEnv('BASE_URL', '/app/');

    expect(getAppUrl()).toBe('http://localhost:3000/app');
  });
});

describe('generateShareText', () => {
  it('1位の新記録テキストを生成する', () => {
    const text = generateShareText({
      mode: 'tenRounds',
      score: 9,
      bestScore: 8,
      isNewRecord: true,
      rank: 1,
    });

    expect(text).toContain('自己ベスト更新');
    expect(text).toContain('10回モード');
    expect(text).toContain('9回正解');
    expect(text).toContain('前回ベスト：8回正解');
    expect(text).toContain('#コイントスゲーム');
  });

  it('1位の新記録でbestScoreが0の場合は前回ベストを省略する', () => {
    const text = generateShareText({
      mode: 'survival',
      score: 5,
      bestScore: 0,
      isNewRecord: true,
      rank: 1,
    });

    expect(text).toContain('自己ベスト更新');
    expect(text).not.toContain('前回ベスト');
  });

  it('2位以下の新記録テキストを生成する', () => {
    const text = generateShareText({
      mode: 'survival',
      score: 10,
      bestScore: 15,
      isNewRecord: true,
      rank: 2,
    });

    expect(text).toContain('サバイバルモード');
    expect(text).toContain('10連続正解');
    expect(text).toContain('自己TOP3入り');
  });

  it('新記録でない場合の通常テキストを生成する', () => {
    const text = generateShareText({
      mode: 'tenRounds',
      score: 5,
      bestScore: 8,
      isNewRecord: false,
      rank: null,
    });

    expect(text).toContain('コイントス予想ゲーム');
    expect(text).toContain('5回正解');
    expect(text).toContain('自己ベスト：8回正解');
  });

  it('ハッシュタグが含まれる', () => {
    const text = generateShareText({
      mode: 'tenRounds',
      score: 5,
      bestScore: 8,
      isNewRecord: false,
      rank: null,
    });

    expect(text).toContain('#コイントスゲーム');
    expect(text).toContain('#暇つぶし');
    expect(text).toContain('#ミニゲーム');
  });
});

describe('shareToX', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('X(Twitter)のインテントURLでwindow.openを呼ぶ', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    shareToX('テスト投稿');

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://twitter.com/intent/tweet?text='),
      '_blank',
      'noopener,noreferrer,width=600,height=400',
    );
  });

  it('テキストがURLエンコードされる', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    shareToX('テスト 投稿');

    const url = openSpy.mock.calls.at(0)?.at(0) as string;
    expect(url).toContain(encodeURIComponent('テスト 投稿'));
  });
});

describe('shareToThreads', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ThreadsのインテントURLでwindow.openを呼ぶ', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    shareToThreads('テスト投稿');

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://threads.net/intent/post?text='),
      '_blank',
      'noopener,noreferrer,width=600,height=400',
    );
  });
});
