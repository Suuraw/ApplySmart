import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading results...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
