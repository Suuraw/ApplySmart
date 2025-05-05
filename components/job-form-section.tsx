"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  FileUp,
  LinkIcon,
  CheckCircle2,
  FileText,
  ArrowRight,
  Loader2,
  Clipboard,
} from "lucide-react";
import { useAuthContext } from "@/hooks/authContext";

import CopyButton from "./copy-button";
import { Textarea } from "@/components/ui/textarea";

export default function JobFormSection() {
  const router = useRouter();
  const [resumeLink, setResumeLink] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(
    null
  );
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isPdfMode, setIsPdfMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const { isLoggedIn } = useAuthContext();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle file function is hit");
    if (!isLoggedIn) return;
    if (e.target.files && e.target.files[0]) {
      setJobDescriptionFile(e.target.files[0]);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleProcess = () => {
    console.log("handle file function is hit");
    if (!isLoggedIn) return;
    const isValidInput =
      resumeLink &&
      (isPdfMode ? jobDescriptionFile : jobDescriptionText.trim());
    if (!isValidInput || !isLoggedIn) return;

    setIsProcessing(true);

    setTimeout(() => {
      setScore(85);
      setMatchedSkills([
        "Project Management",
        "Team Leadership",
        "Strategic Planning",
        "Data Analysis",
        "Customer Relations",
      ]);
      setMissingSkills([
        "Python Programming",
        "SQL Database Management",
        "Agile Methodology",
      ]);
      setIsProcessing(false);

      router.push(
        `/job-application?resumeLink=${encodeURIComponent(
          resumeLink
        )}&jobTitle=${encodeURIComponent("Senior Project Manager")}`
      );
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

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
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Automate Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Job Applications
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Save time by automatically filling out job application forms based
            on your resume and get an ATS score against specific job
            descriptions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Card: Input */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-primary" />
                  Upload Job Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resume Link Input */}
                <div className="space-y-2">
                  <Label htmlFor="resume-link">Resume Google Drive Link</Label>
                  <div className="flex gap-2">
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
                    <CopyButton value={resumeLink} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provide a Google Drive link to your resume
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="input-mode">Input Mode</Label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        !isPdfMode ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Text
                    </span>
                    <Switch
                      id="input-mode"
                      checked={isPdfMode}
                      onCheckedChange={setIsPdfMode}
                    />
                    <span
                      className={`text-sm font-bold ${
                        isPdfMode ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      PDF
                    </span>
                  </div>
                </div>

                {/* PDF or Text input */}
                {isPdfMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="job-description-file">
                      Job Description PDF
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      {isLoggedIn&&<Input
                        type="file"
                        id="job-description-file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />}
                      <Label
                        htmlFor="job-description-file"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <FileText className="h-10 w-10 text-muted-foreground/70" />
                        <span className="text-sm font-medium">
                          {jobDescriptionFile
                            ? jobDescriptionFile.name
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF (Max 5MB)
                        </span>
                      </Label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="job-description-text">
                      Job Description Text
                    </Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="job-description-text"
                        placeholder="Paste the job description here..."
                        className="min-h-[100px] flex-1"
                        value={jobDescriptionText}
                        onChange={(e) => setJobDescriptionText(e.target.value)}
                      />
                      <CopyButton value={jobDescriptionText} />
                    </div>
                  </div>
                )}

                {/* Process Button */}
                <Button
                  onClick={handleProcess}
                  className="w-full"
                  disabled={
                    !resumeLink ||
                    (isPdfMode
                      ? !jobDescriptionFile
                      : !jobDescriptionText.trim()) ||
                    isProcessing
                  }
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

          {/* Right Card: ATS Results */}
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
                      <div className="text-2xl font-bold mb-2">
                        Job Match Score
                      </div>
                      <div className="relative h-36 w-36 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold">{score}%</span>
                        </div>
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 100 100"
                          style={{ transform: "rotate(-90deg)" }}
                        >
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
                            strokeDashoffset={
                              2 * Math.PI * 45 * (1 - score / 100)
                            }
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
                        <h3 className="text-sm font-medium mb-2">
                          Matched Skills
                        </h3>
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
                        <h3 className="text-sm font-medium mb-2">
                          Missing Skills
                        </h3>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
