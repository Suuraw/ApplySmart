"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { flushSync } from "react-dom";
import {
  FileUp,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  BarChart,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { uploadResume } from "@/services/getAtsScore";
import Markdown from "react-markdown";

// Define types for chat history
interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

// Define types for resume analysis response
interface ResumeAnalysis {
  atsScore: string;
  recommendations: string[];
  keywordsFound: string[];
  strengths: string[];
  areasToImprove: string[];
  suggestedKeywords: string[];
  keywordRelevance: {
    industryRelevance: string;
    softSkills: number;
    technicalSkills: number;
  };
}

export default function AtsScoreSection() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for chat container
  const host = "http://localhost:5000";
  const streamUrl = `${host}/chat`;

  // State declarations
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [streamdiv, showStreamdiv] = useState<boolean>(false);
  const [toggled] = useState<boolean>(true); // Fixed to streaming
  const [waiting, setWaiting] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [industryRelevance, setIndustryRelevance] = useState<number | null>(null);
  const [softSkills, setSoftSkills] = useState<number | null>(null);
  const [technicalSkill, setTechnicalSkill] = useState<number | null>(null);

  // Scroll to the latest response within the chat container
  const scrollToLatest = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Validation check
  const validationCheck = useCallback((str: string): boolean => {
    return !str || /^\s*$/.test(str);
  }, []);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  // Handle resume upload
  const handleUpload = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const response = await uploadResume(file);
      const { finalData } = response as { finalData: ResumeAnalysis };

      setScore(parseInt(finalData.atsScore, 10));
      setSuggestions(finalData.recommendations);
      setKeywords(finalData.keywordsFound);
      setStrengths(finalData.strengths);
      setWeaknesses(finalData.areasToImprove);
      setSuggestedKeywords(finalData.suggestedKeywords);
      setIndustryRelevance(parseInt(finalData.keywordRelevance.industryRelevance, 10));
      setSoftSkills(finalData.keywordRelevance.softSkills);
      setTechnicalSkill(finalData.keywordRelevance.technicalSkills);

      setData((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: `I've analyzed your resume! Your ATS score is ${finalData.atsScore}/100. Ask me specific questions about how to improve it or what areas need work.`,
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsAnalyzing(false);
      scrollToLatest(); // Scroll to latest after upload
    }
  };

  // Handle chat submission
  const handleSendMessage = () => {
    const message = inputRef.current?.value;
    if (message && validationCheck(message)) {
      console.log("Empty or invalid entry");
      return;
    }
    handleStreamingChat();
  };

  // Streaming chat logic with no-file check
  const handleStreamingChat = async () => {
    const message = inputRef.current!.value;
    const chatData = {
      chat: message,
      history: data,
    };

    const ndata: ChatMessage[] = [
      ...data,
      { role: "user", parts: [{ text: message }] },
    ];

    flushSync(() => {
      setData(ndata);
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.placeholder = "Waiting for model's response";
      }
      setWaiting(true);
      showStreamdiv(true);
    });
    scrollToLatest(); // Scroll to latest after user message

    // Check if a file has been uploaded
    if (!file) {
      const noFileResponse: ChatMessage[] = [
        ...ndata,
        {
          role: "model",
          parts: [
            { text: "Please upload your resume first so I can assist you better!" },
          ],
        },
      ];
      flushSync(() => {
        setData(noFileResponse);
        if (inputRef.current) {
          inputRef.current.placeholder = "Ask about your resume...";
        }
        setWaiting(false);
        showStreamdiv(false);
      });
      scrollToLatest();
      return; // Exit the function early
    }

    // Proceed with backend call if file exists
    const headerConfig = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    let modelResponse = "";
    try {
      const response = await fetch(streamUrl, {
        method: "POST",
        headers: headerConfig,
        body: JSON.stringify(chatData),
      });

      if (!response.ok || !response.body) {
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        flushSync(() => {
          setAnswer((prev) => prev + chunk);
        });
        modelResponse += chunk;
        scrollToLatest(); // Scroll during streaming
      }
    } catch (err) {
      modelResponse = `Error occurred: ${err instanceof Error ? err.message : "Unknown error"}`;
      console.error("Streaming error:", err);
    } finally {
      const updatedData: ChatMessage[] = [
        ...ndata,
        { role: "model", parts: [{ text: modelResponse.trim() || "No response received" }] },
      ];
      flushSync(() => {
        setAnswer("");
        setData(updatedData);
        if (inputRef.current) {
          inputRef.current.placeholder = "Ask about your resume...";
        }
        setWaiting(false);
        showStreamdiv(false);
      });
      scrollToLatest(); // Scroll after model response
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Conversation display component
  const ConversationDisplayArea: React.FC<{
    data: ChatMessage[];
    streamdiv: boolean;
    answer: string;
  }> = ({ data, streamdiv, answer }) => (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2"
    >
      {data.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">
          Hello! I can answer questions about your resume and provide suggestions for improvement. Upload your resume to get started.
        </div>
      ) : (
        data.map((element, index) => (
          <div
            key={index}
            className={`flex ${element.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                element.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <Markdown>{element.parts[0].text}</Markdown>
            </div>
          </div>
        ))
      )}
      {streamdiv && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
            {answer ? <Markdown>{answer}</Markdown> : "Streaming..."}
          </div>
        </div>
      )}
    </div>
  );

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
            Upload your resume to get an ATS compatibility score, personalized suggestions, and chat with our AI assistant for tailored advice.
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
                  <Label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileText className="h-10 w-10 text-muted-foreground/70" />
                    <span className="text-sm font-medium">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX (Max 5MB)
                    </span>
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
                    <ConversationDisplayArea data={data} streamdiv={streamdiv} answer={answer} />
                    <div className="flex gap-2">
                      <Textarea
                        ref={inputRef}
                        placeholder="Ask about your resume..."
                        className="resize-none"
                        disabled={waiting}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button size="icon" onClick={handleSendMessage} disabled={waiting}>
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
                              <li
                                key={index}
                                className="flex items-start gap-2 bg-green-500/10 p-3 rounded-md"
                              >
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
                              <li
                                key={index}
                                className="flex items-start gap-2 bg-red-500/10 p-3 rounded-md"
                              >
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
                              <li
                                key={index}
                                className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-md"
                              >
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
                          <h3 className="text-lg font-medium mb-4">
                            Keywords Found in Your Resume
                          </h3>
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
                          <h3 className="text-lg font-medium mb-4">
                            Suggested Keywords to Add
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {suggestedKeywords.map((keyword, index) => (
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
                          <h3 className="text-lg font-medium mb-3">
                            Keyword Relevance
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Industry Relevance</span>
                                <span className="text-sm font-medium">{industryRelevance}%</span>
                              </div>
                              <Progress value={industryRelevance ?? 0} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Technical Skills</span>
                                <span className="text-sm font-medium">{technicalSkill}%</span>
                              </div>
                              <Progress value={technicalSkill ?? 0} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Soft Skills</span>
                                <span className="text-sm font-medium">{softSkills}%</span>
                              </div>
                              <Progress value={softSkills ?? 0} className="h-2" />
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
  );
}