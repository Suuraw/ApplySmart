"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Added useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check, ArrowLeft } from "lucide-react"; // Added ArrowLeft icon
import { motion } from "framer-motion";

// Define the expected structure of the results data
interface ResultsData {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  formFields: Array<{ field: string; value: string }>;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router for navigation
  const [results, setResults] = useState<ResultsData | null>(null);
  const [editableFields, setEditableFields] = useState<Array<{ field: string; value: string }>>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // Track which field was copied

  // Extract and parse results data from query params when the page loads
  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data)) as ResultsData;
        setResults(parsedData);
        setEditableFields(parsedData.formFields); // Initialize editable fields
      } catch (error) {
        console.error("Failed to parse results data:", error);
      }
    }
  }, [searchParams]);

  // Handle changes to form field values
  const handleFieldChange = (index: number, newValue: string) => {
    setEditableFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, value: newValue } : field))
    );
  };

  // Copy text to clipboard and show green tick for 2 seconds
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index); // Set the copied field index
    setTimeout(() => {
      setCopiedIndex(null); // Reset after 2 seconds
    }, 2000);
  };

  // Navigate back to the home page
  const handleBackToHome = () => {
    router.push("/"); // Navigate to the home page
  };

  // Animation variants for hero section
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          No results available. Please process a job application from the form page first.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Back Navigation Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-primary border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Your ATS Match Results
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ATS Score Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Check className="h-6 w-6 text-primary" />
                    Job Match Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="relative h-48 w-48 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary">{results.score}%</span>
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
                          strokeDashoffset={2 * Math.PI * 45 * (1 - results.score / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="text-lg text-muted-foreground mt-4">
                      {results.score >= 80
                        ? "Excellent match! You're a strong candidate for this position."
                        : results.score >= 60
                        ? "Good match. Consider highlighting specific skills."
                        : "This position may not be the best fit for your current skills."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-2">Matched Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.matchedSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.missingSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Auto-filled Form Fields Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl">Auto-filled Application Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editableFields.map((field, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-muted-foreground">
                            {field.field}
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              value={field.value}
                              onChange={(e) => handleFieldChange(index, e.target.value)}
                              className="w-full border border-muted-foreground/20 focus:ring-2 focus:ring-primary"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleCopy(field.value, index)}
                              className={`hover:bg-primary/10 transition-colors border-none ${
                                copiedIndex === index ? "bg-green-500/10 border-green-500" : ""
                              }`}
                            >
                              {copiedIndex === index ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all">
                    Download Auto-fill Data
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}