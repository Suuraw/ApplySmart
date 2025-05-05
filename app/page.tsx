'use client'
import dynamic from 'next/dynamic'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
const AtsScoreSection = dynamic(() => import('@/components/ats-score-section'), { ssr: false })
const JobFormSection = dynamic(() => import('@/components/job-form-section'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AtsScoreSection />
      <JobFormSection />
      <Footer />
    </main>
  )
}
