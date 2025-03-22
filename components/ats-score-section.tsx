"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, Send, CheckCircle, XCircle, AlertCircle, MessageSquare, BarChart, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function AtsScoreSection() {
  const [file, setFile] = useState<File | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I can answer questions about your resume and provide suggestions for improvement. Upload your resume to get started.",
    },
  ])
  const [score, setScore] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [strengths, setStrengths] = useState<string[]>([])
  const [weaknesses, setWeaknesses] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setScore(78)
      setSuggestions([
        "Add more quantifiable achievements to highlight your impact",
        "Include relevant industry keywords like 'data analysis' and 'project management'",
        "Improve formatting for better readability by ATS systems",
        "Add a skills section with technical and soft skills",
      ])
      setKeywords([
        "Project Management",
        "Data Analysis",
        "Team Leadership",
        "Strategic Planning",
        "Customer Relations",
      ])
      setStrengths([
        "Clear work history with dates and responsibilities",
        "Good education section with relevant degrees",
        "Contact information is complete and professional",
      ])
      setWeaknesses([
        "Missing important keywords for target industry",
        "Too many graphics and complex formatting",
        "Skills section needs more technical competencies",
      ])
      setIsAnalyzing(false)

      // Add a system message to the chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've analyzed your resume! Your ATS score is 78/100. Ask me specific questions about how to improve it or what areas need work.",
        },
      ])
    }, 2500)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: chatMessage }])

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (chatMessage.toLowerCase().includes("keyword")) {
        response =
          "Based on your resume, I recommend adding these keywords: 'data visualization', 'agile methodology', 'stakeholder management', and 'business intelligence'. These are commonly sought after in your industry."
      } else if (chatMessage.toLowerCase().includes("format")) {
        response =
          "Your resume format could be improved by using a single-column layout, removing tables and graphics, and ensuring all text is selectable. This will help ATS systems parse your information correctly."
      } else if (chatMessage.toLowerCase().includes("improve")) {
        response =
          "To improve your score, focus on adding more quantifiable achievements (e.g., 'increased sales by 20%'), using industry-specific terminology, and ensuring your skills section directly matches job descriptions you're targeting."
      } else {
        response =
          "I'd be happy to help with that. Could you provide more specific details about what aspect of your resume you'd like me to address?"
      }

      setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)

    setChatMessage("")
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
    <section id="ats-score" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Optimize Your Resume for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              ATS Systems
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume to get an ATS compatibility score, personalized suggestions, and chat with our AI
            assistant for tailored advice.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-primary" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-muted-foreground/70" />
                    <span className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</span>
                    <span className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</span>
                  </Label>
                </div>

                <Button onClick={handleUpload} className="w-full" disabled={!file || isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>

                {score !== null && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">ATS Score</div>
                      <div className="relative h-36 w-36 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold">{score}</span>
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
                          ? "Excellent! Your resume is ATS-friendly."
                          : score >= 60
                            ? "Good, but there's room for improvement."
                            : "Needs significant improvements for ATS."}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Suggestions</span>
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Keywords</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Resume Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about your resume..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button size="icon" onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Improvement Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[500px] overflow-y-auto">
                    {!score ? (
                      <div className="text-center text-muted-foreground py-12">
                        Upload your resume to get personalized suggestions
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2 bg-green-500/10 p-3 rounded-md">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            Areas to Improve
                          </h3>
                          <ul className="space-y-2">
                            {weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start gap-2 bg-red-500/10 p-3 rounded-md">
                                <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            Recommendations
                          </h3>
                          <ul className="space-y-2">
                            {suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-md">
                                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Keyword Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[500px] overflow-y-auto">
                    {!score ? (
                      <div className="text-center text-muted-foreground py-12">
                        Upload your resume to analyze keywords
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Keywords Found in Your Resume</h3>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                              <div
                                key={index}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Suggested Keywords to Add</h3>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Data Visualization",
                              "Agile Methodology",
                              "Business Intelligence",
                              "Stakeholder Management",
                              "Process Optimization",
                              "Cross-functional Collaboration",
                            ].map((keyword, index) => (
                              <div
                                key={index}
                                className="bg-muted px-3 py-1 rounded-full text-sm font-medium border border-dashed border-primary/50"
                              >
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3">Keyword Relevance</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Industry Relevance</span>
                                <span className="text-sm font-medium">65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Technical Skills</span>
                                <span className="text-sm font-medium">78%</span>
                              </div>
                              <Progress value={78} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Soft Skills</span>
                                <span className="text-sm font-medium">82%</span>
                              </div>
                              <Progress value={82} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

