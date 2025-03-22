"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, LinkIcon, CheckCircle2, FileText, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function JobFormSection() {
  const [resumeLink, setResumeLink] = useState("")
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [matchedSkills, setMatchedSkills] = useState<string[]>([])
  const [missingSkills, setMissingSkills] = useState<string[]>([])
  const [formFields, setFormFields] = useState<Array<{ field: string; value: string }>>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJobDescriptionFile(e.target.files[0])
    }
  }

  const handleProcess = () => {
    if (!resumeLink || !jobDescriptionFile) return

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setScore(85)
      setMatchedSkills([
        "Project Management",
        "Team Leadership",
        "Strategic Planning",
        "Data Analysis",
        "Customer Relations",
      ])
      setMissingSkills(["Python Programming", "SQL Database Management", "Agile Methodology"])
      setFormFields([
        { field: "Full Name", value: "John Smith" },
        { field: "Email", value: "john.smith@example.com" },
        { field: "Phone", value: "(555) 123-4567" },
        { field: "Current Position", value: "Senior Project Manager" },
        { field: "Years of Experience", value: "8" },
        { field: "Education", value: "MBA, Business Administration" },
        { field: "Skills", value: "Project Management, Team Leadership, Strategic Planning, Data Analysis" },
      ])
      setIsProcessing(false)
    }, 3000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <section id="job-form" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Automate Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Job Applications
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl mx-auto">
            Save time by automatically filling out job application forms based on your resume and get an ATS score
            against specific job descriptions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-primary" />
                  Upload Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume-link">Resume Google Drive Link</Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resume-link"
                        placeholder="https://drive.google.com/your-resume"
                        className="pl-10"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Provide a Google Drive link to your resume</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description PDF</Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Input
                      type="file"
                      id="job-description"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="job-description" className="cursor-pointer flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-muted-foreground/70" />
                      <span className="text-sm font-medium">
                        {jobDescriptionFile ? jobDescriptionFile.name : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-xs text-muted-foreground">PDF (Max 5MB)</span>
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={handleProcess}
                  className="w-full"
                  disabled={!resumeLink || !jobDescriptionFile || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Process Job Application
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  ATS Match Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!score ? (
                  <div className="text-center text-muted-foreground py-12">
                    Upload your resume and job description to see results
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">Job Match Score</div>
                      <div className="relative h-36 w-36 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold">{score}%</span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeOpacity="0.1"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-primary"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={2 * Math.PI * 45 * (1 - score / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {score >= 80
                          ? "Excellent match! You're a strong candidate for this position."
                          : score >= 60
                            ? "Good match. Consider highlighting specific skills."
                            : "This position may not be the best fit for your current skills."}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Matched Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Missing Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {missingSkills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Auto-filled Form Fields</h3>
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                        {formFields.map((field, index) => (
                          <div key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                            <span className="font-medium">{field.field}:</span>
                            <span className="text-muted-foreground">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">Download Auto-fill Data</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

