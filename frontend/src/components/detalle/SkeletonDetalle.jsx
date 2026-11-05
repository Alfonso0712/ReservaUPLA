// Skeleton con estructura de dos columnas para Detalle · Cambio 6
export default function SkeletonDetalle() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-pulse">
      <div className="xl:col-span-2 p-6 rounded-tarjeta border border-borde bg-superficie space-y-6">
        <div className="space-y-3 pb-5 border-b border-borde">
          <div className="flex items-center justify-between">
            <div className="h-7 w-2/5 bg-superficie-2 rounded-md" />
            <div className="h-6 w-20 bg-superficie-2 rounded-pill" />
          </div>
          <div className="h-5 w-28 bg-superficie-2 rounded-md" />
          <div className="h-4 w-48 bg-superficie-2 rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-superficie-2 rounded-md" />
          <div className="h-10 bg-superficie-2 rounded-md" />
          <div className="h-14 bg-superficie-2 rounded-md" />
        </div>
      </div>
      <div className="xl:col-span-1 p-6 rounded-tarjeta border border-borde bg-superficie space-y-4">
        <div className="h-6 w-1/3 bg-superficie-2 rounded-md" />
        <div className="h-4 w-full bg-superficie-2 rounded-md" />
        <div className="h-10 bg-superficie-2 rounded-md" />
        <div className="h-10 bg-superficie-2 rounded-md" />
      </div>
    </div>
  );
}
