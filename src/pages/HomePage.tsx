import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStorage } from '@/features/storage/useGameStorage';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useSound } from '@/hooks/useSound';
import { GlobalHeader } from '@/components/GlobalHeader/GlobalHeader';
import { HeroCoin } from '@/features/home/HeroCoin/HeroCoin';
import { ModeCard } from '@/features/mode/ModeCard/ModeCard';
import { LeaderBoard } from '@/features/home/LeaderBoard/LeaderBoard';

export function HomePage() {
  const { data } = useGameStorage();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { soundEnabled, toggleSound } = useSound();
  const navigate = useNavigate();

  const handleSelectTenRounds = useCallback(() => {
    void navigate('/game/tenRounds');
  }, [navigate]);

  const handleSelectSurvival = useCallback(() => {
    void navigate('/game/survival');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-light-gradient dark:bg-casino-gradient">
      <GlobalHeader
        darkMode={darkMode}
        soundEnabled={soundEnabled}
        onToggleDarkMode={toggleDarkMode}
        onToggleSound={toggleSound}
      />

      <HeroCoin />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
        <ModeCard
          title="🎯 10回モード"
          description="10回プレイして何回当てられる？"
          bestScore={data.topScores.tenRounds.at(0)?.score}
          onSelect={handleSelectTenRounds}
        />
        <ModeCard
          title="⚡ サバイバル"
          description="外れるまで続ける。あなたの限界は？"
          bestScore={data.topScores.survival.at(0)?.score}
          onSelect={handleSelectSurvival}
        />
      </div>

      <LeaderBoard topScores={data.topScores} />
    </div>
  );
}
