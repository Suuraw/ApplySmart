import Hero from "@/components/hero"
import AtsScoreSection from "@/components/ats-score-section"
import JobFormSection from "@/components/job-form-section"
import Footer from "@/components/footer"
import AuthCheck from "@/components/auth-check"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AuthCheck>
        <AtsScoreSection />
      </AuthCheck>
      <AuthCheck>
        <JobFormSection />
      </AuthCheck>
      <Footer />
    </main>
  )
}

 