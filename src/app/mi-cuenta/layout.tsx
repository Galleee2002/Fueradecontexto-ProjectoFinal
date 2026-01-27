import { AccountSidebar } from "@/components/account/account-sidebar"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Cuenta</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <AccountSidebar />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
