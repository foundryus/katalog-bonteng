export default function DetailLoading() {
  return (
    <div className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <div className="aspect-square w-full animate-pulse rounded-2xl border border-garis bg-permukaan" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-28 animate-pulse rounded bg-permukaan" />
        <div className="h-4 w-16 animate-pulse rounded bg-permukaan" />
        <div className="h-8 w-60 animate-pulse rounded bg-permukaan" />
        <div className="h-7 w-24 animate-pulse rounded bg-permukaan" />
        <div className="h-20 w-full animate-pulse rounded bg-permukaan" />
        <div className="h-12 w-48 animate-pulse rounded-lg bg-permukaan" />
      </div>
    </div>
  );
}

