import { SignUp } from '@clerk/nextjs';

export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center my-12">
      <SignUp />
      <div id='clerk-captcha' />
    </main>
  );
}