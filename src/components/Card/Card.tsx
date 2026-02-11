type Props = {
  children: React.ReactNode;
  className: string;
};

export function Card({ children, className }: Props) {
  return (
    <div
      className={`rounded-xl bg-card-gradient shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
