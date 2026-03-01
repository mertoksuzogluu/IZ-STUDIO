"use client"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-[var(--fg)] mb-2">
            E-postanızı Kontrol Edin
          </h1>
          <p className="text-[var(--muted)]">
            Giriş linkiniz e-posta adresinize gönderildi. Linke tıklayarak giriş yapabilirsiniz.
          </p>
        </div>

        <div className="mt-8 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
          <p className="text-sm text-[var(--muted)]">
            E-postayı görmediyseniz spam klasörünüzü kontrol edin.
          </p>
        </div>
      </div>
    </div>
  )
}

