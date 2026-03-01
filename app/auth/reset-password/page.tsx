import { Suspense } from "react"
import ResetPasswordForm from "./ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
          <div className="text-[var(--muted)]">Yükleniyor...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
