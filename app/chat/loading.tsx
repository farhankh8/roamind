export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#63d2ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/50 text-sm">Starting AI chat...</p>
      </div>
    </div>
  )
}
