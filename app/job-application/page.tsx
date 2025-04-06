"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, ArrowLeft, FileText, Send, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import CopyButton from "@/components/copy-button"
import MinimalFooter from "@/components/minimal-footer"

export default function JobApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    currentPosition: "Senior Project Manager",
    yearsOfExperience: "8",
    education: "MBA, Business Administration",
    skills: "Project Management, Team Leadership, Strategic Planning, Data Analysis",
    coverLetter: "",
  })

  const [score, setScore] = useState(85)
  const [matchedSkills, setMatchedSkills] = useState([
    "Project Management",
    "Team Leadership",
    "Strategic Planning",
    "Data Analysis",
    "Customer Relations",
  ])
  const [missingSkills, setMissingSkills] = useState([
    "Python Programming",
    "SQL Database Management",
    "Agile Methodology",
  ])

  // Check if user is logged in
  useEffect(() => {
    // const token = localStorage.getItem("auth-token")
    // if (!token) {
    //   router.push("/login")
    // }
  }, [router])

  // Simulate loading data from URL params or state
  useEffect(() => {
    // In a real app, you would get this data from context, state management, or URL params
    const resumeLink = searchParams.get("resumeLink")
    const jobTitle = searchParams.get("jobTitle") || "Senior Project Manager"

    // Set page title
    document.title = `Application for ${jobTitle} - ATS Optimizer`
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col items-center justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl">Application Submitted Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your application has been submitted. You will receive a confirmation email shortly.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium">Application Reference</p>
                <p className="text-muted-foreground">
                  APP-
                  {Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <MinimalFooter />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32 min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Complete Your Application</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="flex gap-2">
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.fullName} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.email} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex gap-2">
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.phone} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentPosition">Current Position</Label>
                        <div className="flex gap-2">
                          <Input
                            id="currentPosition"
                            name="currentPosition"
                            value={formData.currentPosition}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.currentPosition} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                        <div className="flex gap-2">
                          <Input
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.yearsOfExperience} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <div className="flex gap-2">
                          <Input
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <CopyButton value={formData.education} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex gap-2">
                        <Input
                          id="skills"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          required
                          className="flex-1"
                        />
                        <CopyButton value={formData.skills} />
                      </div>
                      <p className="text-xs text-muted-foreground">Comma-separated list of skills</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="coverLetter"
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Write a brief cover letter or leave blank to auto-generate one based on your resume and the job description"
                          className="min-h-[150px] flex-1"
                        />
                        <div className="flex flex-col justify-start">
                          <CopyButton value={formData.coverLetter} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Job Match Score</h3>
                    <span className="text-lg font-bold text-primary">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Your resume is a strong match for this position</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Position</h3>
                  <p className="text-sm">Senior Project Manager</p>
                  <p className="text-xs text-muted-foreground">ABC Company</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Skills Match</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Matched Skills
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Missing Skills
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {missingSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Application Tips</h3>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-1 shrink-0" />
                      <span>Highlight your project management experience in your cover letter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-1 shrink-0" />
                      <span>Mention specific achievements with measurable results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-1 shrink-0" />
                      <span>Address how you plan to develop the missing skills</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MinimalFooter />
    </div>
  )
}

