"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, LinkIcon, FileText, ArrowRight, Loader2, Clipboard, CheckCircle2 } from "lucide-react"; // Added Clipboard icon
import { motion } from "framer-motion";

export default function JobFormSection() {
  const [resumeLink, setResumeLink] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter(); // Initialize router

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJobDescriptionFile(e.target.files[0]);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Optional feedback
  };

  const handleProcess = () => {
    if (!resumeLink || (!jobDescriptionFile && !jobDescriptionText.trim())) return;

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const results = {
        score: 85,
        matchedSkills: [
          "Project Management",
          "Team Leadership",
          "Strategic Planning",
          "Data Analysis",
          "Customer Relations",
        ],
        missingSkills: ["Python Programming", "SQL Database Management", "Agile Methodology"],
        formFields: [
          { field: "Full Name", value: "John Smith" },
          { field: "Email", value: "john.smith@example.com" },
          { field: "Phone", value: "(555) 123-4567" },
          { field: "Current Position", value: "Senior Project Manager" },
          { field: "Years of Experience", value: "8" },
          { field: "Education", value: "MBA, Business Administration" },
          { field: "Skills", value: "Project Management, Team Leadership, Strategic Planning, Data Analysis" },
        ],
      };

      // Redirect to results page with data
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(results))}`);
      setIsProcessing(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopy(resumeLink)}
                      disabled={!resumeLink}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Provide a Google Drive link to your resume</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description-file">Job Description PDF</Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Input
                      type="file"
                      id="job-description-file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <Label
                      htmlFor="job-description-file"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FileText className="h-10 w-10 text-muted-foreground/70" />
                      <span className="text-sm font-medium">
                        {jobDescriptionFile ? jobDescriptionFile.name : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-xs text-muted-foreground">PDF (Max 5MB)</span>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description-text">Or Enter Job Description Manually</Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="job-description-text"
                      placeholder="Paste the job description here..."
                      className="min-h-[100px] flex-1"
                      value={jobDescriptionText}
                      onChange={(e) => setJobDescriptionText(e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopy(jobDescriptionText)}
                      disabled={!jobDescriptionText.trim()}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alternatively, paste the job description text directly
                  </p>
                </div>

                <Button
                  onClick={handleProcess}
                  className="w-full"
                  disabled={!resumeLink || (!jobDescriptionFile && !jobDescriptionText.trim()) || isProcessing}
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
                <div className="text-center text-muted-foreground py-12">
                  Upload your resume and job description (file or text) to see results
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}