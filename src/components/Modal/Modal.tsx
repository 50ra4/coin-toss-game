const STOP_PROPAGATION = (e: React.MouseEvent) => {
  e.stopPropagation();
};

type Props = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
};

export function Modal({ children, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-casino-darkGray dark:shadow-card"
        onClick={STOP_PROPAGATION}
      >
        {children}
      </div>
    </div>
  );
}
