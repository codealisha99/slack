import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Image src="/slack-logo.png" alt="Slacki" width={32} height={32} className="w-8 h-8 rounded-lg border border-zinc-200" />
            <span className="text-[15px] font-bold tracking-tight">Slacki</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your workspace</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none border border-zinc-200 rounded-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-zinc-200 hover:bg-zinc-50",
              formButtonPrimary: "bg-zinc-900 hover:bg-black border-zinc-900 rounded-lg",
              footer: "bg-zinc-50 rounded-b-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
