export default function ResetPasswordPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="w-full max-w-[460px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-8">
        <h1 className="text-3xl text-center mb-4">Set New Password</h1>
        <p className="text-sm text-[#a09a95] text-center mb-8">Choose a new password for your account</p>
        <form action="/api/auth/reset-password" method="POST" className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">New Password <span className="text-[#ef4444]">*</span></label>
            <input type="password" id="newPassword" name="password" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-mono text-[#6b6560] uppercase tracking-wider mb-1.5">Confirm Password <span className="text-[#ef4444]">*</span></label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#2a2a2a] rounded text-sm text-white outline-none focus:border-[#D4006A] transition-colors" placeholder="Repeat password" required minLength={8} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn--primary btn--block btn--lg">Update Password</button>
        </form>
        <div className="text-center mt-6 pt-5 border-t border-[#2a2a2a]">
          <p className="text-sm text-[#a09a95]"><a href="/auth/login" className="text-[#D4006A]">Back to login</a></p>
        </div>
      </div>
    </section>
  );
}
