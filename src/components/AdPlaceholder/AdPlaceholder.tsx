type Props = {
  isLoaded: boolean;
  hasError: boolean;
  clientId: string;
  adSlot: string;
  className: string;
};

export function AdPlaceholder({
  isLoaded,
  hasError,
  clientId,
  adSlot,
  className,
}: Props) {
  if (hasError || !isLoaded) {
    return (
      <div
        className={`rounded-lg bg-gray-100 p-8 text-center dark:bg-gray-800 ${className}`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">広告欄</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
