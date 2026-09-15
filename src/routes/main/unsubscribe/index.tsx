import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useUnsubscribeFromNewsletter } from "@/hooks/useApi";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const unsubscribeMutation = useUnsubscribeFromNewsletter();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const hasRun = useRef(false);

  // Only the actual API call belongs in the effect — the "no token" case is
  // derived straight from the URL below, no setState needed for it.
  useEffect(() => {
    if (hasRun.current || !token) return;
    hasRun.current = true;

    unsubscribeMutation.mutate(token, {
      onSuccess: (msg) => setResult({ ok: true, message: msg || "You've been unsubscribed." }),
      onError: (err) =>
        setResult({
          ok: false,
          message: err instanceof Error ? err.message : "This unsubscribe link is invalid or has already been used.",
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const missingToken = !token;
  const isPending = !missingToken && result === null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-24 bg-white dark:bg-black transition-colors">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        {isPending && (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-white/15 border-t-green-500 animate-spin" />
            <p className="font-manrope text-gray-600 dark:text-gray-300">Unsubscribing…</p>
          </>
        )}
        {!isPending && (missingToken || !result?.ok) && (
          <>
            <h1 className="font-bebas text-3xl text-[#060A0F] dark:text-white">Something went wrong</h1>
            <p className="font-manrope text-gray-600 dark:text-gray-300 text-sm">
              {missingToken ? "This unsubscribe link is missing its token." : result?.message}
            </p>
          </>
        )}
        {!isPending && !missingToken && result?.ok && (
          <>
            <h1 className="font-bebas text-3xl text-[#060A0F] dark:text-white">You're unsubscribed</h1>
            <p className="font-manrope text-gray-600 dark:text-gray-300 text-sm">{result.message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;

