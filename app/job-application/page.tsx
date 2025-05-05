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
import {
  CheckCircle2,
  ArrowLeft,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  Download,
  FileDown,
  FileType,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import CopyButton from "@/components/copy-button"
import MinimalFooter from "@/components/minimal-footer"
import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function JobApplicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGeneratingFile, setIsGeneratingFile] = useState(false)
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
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // Simulate loading data from URL params or state
  useEffect(() => {
    // In a real app, you would get this data from context, state management, or URL params
    const resumeLink = searchParams.get("resumeLink")
    const jobTitle = searchParams.get("jobTitle") || "Senior Project Manager"

    // Set page title
    document.title = `Application for ${jobTitle} - ATS Optimizer`

    // Simulate getting a cover letter from backend
    setTimeout(() => {
      const sampleCoverLetter = `Dear Hiring Manager,

I am writing to express my interest in the Senior Project Manager position at ABC Company. With 8 years of experience in project management and a proven track record of delivering complex projects on time and within budget, I believe I am an excellent fit for this role.

Throughout my career, I have developed strong skills in team leadership, strategic planning, and data analysis. I have successfully led cross-functional teams to achieve project goals and have consistently received recognition for my ability to manage stakeholder expectations effectively.

I am particularly drawn to ABC Company because of its innovative approach to [specific company value or project]. I am confident that my experience in [relevant experience] would allow me to make significant contributions to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.

Sincerely,
John Smith`

      setFormData((prev) => ({
        ...prev,
        coverLetter: sampleCoverLetter,
      }))
    }, 1000)
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

  // Function to generate and download PDF
  const generatePDF = () => {
    setIsGeneratingFile(true)

    try {
      const doc = new jsPDF()

      // Add company letterhead
      doc.setFontSize(24)
      doc.setTextColor(128, 0, 128) // Purple color
      doc.text("ATS Optimizer", 105, 20, { align: "center" })

      // Add a line
      doc.setDrawColor(128, 0, 128)
      doc.setLineWidth(0.5)
      doc.line(20, 25, 190, 25)

      // Add date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(new Date().toLocaleDateString(), 20, 35)

      // Add recipient
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Hiring Manager", 20, 45)
      doc.text("ABC Company", 20, 52)

      // Add cover letter content with proper formatting
      doc.setFontSize(12)

      // Split the cover letter into lines that fit the page width
      const splitText = doc.splitTextToSize(formData.coverLetter, 170)
      doc.text(splitText, 20, 65)

      // Add signature
      doc.text(`Sincerely,`, 20, doc.internal.pageSize.height - 40)
      doc.text(`${formData.fullName}`, 20, doc.internal.pageSize.height - 30)
      doc.text(`${formData.email} | ${formData.phone}`, 20, doc.internal.pageSize.height - 20)

      // Save the PDF
      doc.save(`Cover_Letter_${formData.fullName.replace(/\s+/g, "_")}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating your PDF. Please try again.")
    } finally {
      setIsGeneratingFile(false)
    }
  }

  // Function to generate and download DOCX
  const generateDOCX = async () => {
    setIsGeneratingFile(true)

    try {
      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "ATS Optimizer",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: new Date().toLocaleDateString(),
                alignment: AlignmentType.LEFT,
              }),
              new Paragraph({}), // Empty paragraph for spacing
              new Paragraph({
                text: "Hiring Manager",
              }),
              new Paragraph({
                text: "ABC Company",
              }),
              new Paragraph({}), // Empty paragraph for spacing
              ...formData.coverLetter.split("\n").map(
                (line) =>
                  new Paragraph({
                    text: line,
                  }),
              ),
              new Paragraph({}), // Empty paragraph for spacing
              new Paragraph({
                text: "Sincerely,",
              }),
              new Paragraph({
                text: formData.fullName,
              }),
              new Paragraph({
                text: `${formData.email} | ${formData.phone}`,
              }),
            ],
          },
        ],
      })

      // Generate and save document
      const buffer = await Packer.toBuffer(doc)
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Cover_Letter_${formData.fullName.replace(/\s+/g, "_")}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating DOCX:", error)
      alert("There was an error generating your DOCX file. Please try again.")
    } finally {
      setIsGeneratingFile(false)
    }
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
                      <div className="flex justify-between items-center">
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                disabled={!formData.coverLetter.trim() || isGeneratingFile}
                              >
                                {isGeneratingFile ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <FileDown className="h-4 w-4" />
                                )}
                                Download
                                <ChevronDown className="h-3 w-3 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <motion.div whileHover={{ scale: 1.02 }}>
                                <DropdownMenuItem onClick={generatePDF} className="cursor-pointer gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span>Download as PDF</span>
                                </DropdownMenuItem>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.02 }}>
                                <DropdownMenuItem onClick={generateDOCX} className="cursor-pointer gap-2">
                                  <FileType className="h-4 w-4" />
                                  <span>Download as DOCX</span>
                                </DropdownMenuItem>
                              </motion.div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          id="coverLetter"
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder="Write a brief cover letter or leave blank to auto-generate one based on your resume and the job description"
                          className="min-h-[250px] flex-1"
                        />
                        <div className="flex flex-col justify-start">
                          <CopyButton value={formData.coverLetter} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          {formData.coverLetter ? `${formData.coverLetter.length} characters` : "No content yet"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download options available
                        </span>
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

                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Document Downloads
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Download your cover letter in your preferred format for your records or to submit with your
                    application.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generatePDF}
                      disabled={!formData.coverLetter.trim() || isGeneratingFile}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateDOCX}
                      disabled={!formData.coverLetter.trim() || isGeneratingFile}
                      className="flex items-center gap-1"
                    >
                      <FileType className="h-3 w-3" />
                      DOCX
                    </Button>
                  </div>
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

