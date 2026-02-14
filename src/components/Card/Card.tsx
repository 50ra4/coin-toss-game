type Props = {
  children: React.ReactNode;
  className: string;
};

export function Card({ children, className }: Props) {
  return (
    <div
      className={`rounded-xl bg-white shadow-md dark:bg-card-gradient dark:shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
