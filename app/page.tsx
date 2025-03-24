import Hero from "@/components/hero";
import AtsScoreSection from "@/components/ats-score-section";
import JobFormSection from "@/components/job-form-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AtsScoreSection />
      <JobFormSection />
      <Footer />
    </main>
  );
}
