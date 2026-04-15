export default function RestaurantsLoading() {
  return (
    <div className="min-h-screen bg-[#020810] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff6b6b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Finding best restaurants...</p>
      </div>
    </div>
  )
}
