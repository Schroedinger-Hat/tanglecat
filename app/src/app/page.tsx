"use client";
import { SignUpForm } from "@/components/SignUpForm";
import Logo from "@/components/ui/logo";
import { useEffect, useState } from "react";
import { getEventCodeFromSubdomain } from "@/lib/utils/getEventCodeFromSubdomain";

export default function HomePage() {
  const [eventCode, setEventCode] = useState<string | null>(null);

  useEffect(() => {
    const detectedEventCode = getEventCodeFromSubdomain();
    setEventCode(detectedEventCode);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center background">
        <div className="w-full max-w-md px-4 py-8">
          {eventCode && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
              <p className="font-medium">🎯 Event Detected</p>
              <p>You&apos;re accessing the <strong>{eventCode.toUpperCase()}</strong> challenge</p>
            </div>
          )}

          {!eventCode && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-center">
              <p className="font-medium">🔧 Development Mode</p>
              <p>Running locally. You can manually enter any event code in the form below.</p>
            </div>
          )}

          <h1 className="text-3xl font-bold text-center mb-4 filter">
            Welcome to {eventCode ? eventCode.toUpperCase() : 'OSDay25'}
          </h1>
          <div className="flex justify-center items-center mb-4">
            <Logo width={180} height={180} />
          </div>

          <p className="text-center mb-8 filter text-lg font-bold">
            {eventCode
              ? `Join the ${eventCode.toUpperCase()} challenge and collect points through exciting activities! Unlock exclusive rewards with your earned points!`
              : 'Join the OSDay25 challenge and collect points through exciting activities! Unlock exclusive rewards with your earned points!'
            }
          </p>

          <div
            className="
                text-onlight
                w-full
                p-6
                space-y-4
                bg-white
                border-2
                border-neutral-950
                shadow-[4px_4px_0px_0px_rgba(23,23,23)]
                rounded-lg
            "
          >
            <SignUpForm />
          </div>
        </div>
      </div>
    </>
  );
}
