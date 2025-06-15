"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, Download, Eye, Trash2, Search, Calendar } from 'lucide-react';

// Mock data for health records
const healthRecords = [
  {
    id: 1,
    name: "Blood Test Results - May 2024",
    type: "Lab Results",
    date: "2024-05-25",
    doctor: "Dr. Sarah Johnson",
    summary: "Complete blood count and metabolic panel. All values within normal range.",
    fileSize: "2.3 MB",
    status: "Reviewed"
  },
  {
    id: 2,
    name: "Chest X-Ray Report",
    type: "Imaging",
    date: "2024-05-20",
    doctor: "Dr. Michael Chen",
    summary: "Chest X-ray shows clear lungs with no signs of infection or abnormalities.",
    fileSize: "5.1 MB",
    status: "Reviewed"
  },
  {
    id: 3,
    name: "Annual Physical Exam",
    type: "Checkup",
    date: "2024-05-15",
    doctor: "Dr. Emily Rodriguez",
    summary: "Comprehensive physical examination. Patient in good health overall.",
    fileSize: "1.8 MB",
    status: "Reviewed"
  },
  {
    id: 4,
    name: "Vaccination Record",
    type: "Immunization",
    date: "2024-05-10",
    doctor: "Nurse Practitioner Lisa Wong",
    summary: "COVID-19 booster vaccination administered. No adverse reactions.",
    fileSize: "0.5 MB",
    status: "Reviewed"
  },
  {
    id: 5,
    name: "Prescription History",
    type: "Medication",
    date: "2024-05-05",
    doctor: "Dr. Sarah Johnson",
    summary: "Updated prescription for blood pressure medication. Dosage adjusted.",
    fileSize: "0.8 MB",
    status: "Pending Review"
  }
];

export default function HealthRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const filteredRecords = healthRecords.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Simulate file upload and PDF processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload the file and process it
      console.log("File uploaded:", file.name);
      
      // Reset the input
      event.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Records</h1>
          <p className="text-gray-500">Manage and view your medical documents</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button className="bg-green-600 hover:bg-green-700 gap-2" disabled={isUploading}>
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Record"}
            </Button>
          </label>
        </div>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Upload your health records as PDF files. Our AI will automatically summarize the content for easy review.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search records by name, type, or doctor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="checkups">Checkups</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card 
                  key={record.id}
                  className={`cursor-pointer transition-all ${
                    selectedRecord === record.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => setSelectedRecord(record.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{record.name}</h3>
                        <p className="text-sm text-gray-500">{record.doctor}</p>
                      </div>
                      <Badge 
                        variant={record.status === "Reviewed" ? "default" : "secondary"}
                        className={record.status === "Reviewed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {record.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <Badge variant="outline">{record.type}</Badge>
                      <span>{record.fileSize}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{record.summary}</p>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden lg:block sticky top-6">
              {selectedRecord ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{healthRecords.find(r => r.id === selectedRecord)?.name}</CardTitle>
                    <CardDescription>
                      {healthRecords.find(r => r.id === selectedRecord)?.doctor} • {" "}
                      {new Date(healthRecords.find(r => r.id === selectedRecord)?.date || "").toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="summary">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="summary">AI Summary</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="summary">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI-Generated Summary</h4>
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <p className="text-sm">
                                {healthRecords.find(r => r.id === selectedRecord)?.summary}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                            <ul className="text-sm space-y-1">
                              <li>• All vital signs within normal range</li>
                              <li>• No significant abnormalities detected</li>
                              <li>• Recommended follow-up in 6 months</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                            <ul className="text-sm space-y-1">
                              <li>• Continue current medication regimen</li>
                              <li>• Maintain healthy diet and exercise</li>
                              <li>• Schedule routine follow-up appointment</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Document Information</h4>
                            <div className="text-sm space-y-2">
                              <div className="flex justify-between">
                                <span>Type:</span>
                                <span>{healthRecords.find(r => r.id === selectedRecord)?.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date:</span>
                                <span>{new Date(healthRecords.find(r => r.id === selectedRecord)?.date || "").toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Provider:</span>
                                <span>{healthRecords.find(r => r.id === selectedRecord)?.doctor}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>File Size:</span>
                                <span>{healthRecords.find(r => r.id === selectedRecord)?.fileSize}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span>{healthRecords.find(r => r.id === selectedRecord)?.status}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Sharing Options</h4>
                            <div className="space-y-2">
                              <Button size="sm" variant="outline" className="w-full">
                                Share with Doctor
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                Generate Shareable Link
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                Export to PDF
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Actions</h4>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                View Full Document
                              </Button>
                              <Button size="sm" variant="outline" className="w-full">
                                Download Original
                              </Button>
                              <Button size="sm" variant="outline" className="w-full text-red-600 hover:text-red-700">
                                Delete Record
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center p-8 h-full">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">Select a health record to view details and AI summary</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lab-results">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.filter(r => r.type === "Lab Results").map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{record.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{record.doctor}</p>
                  <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="imaging">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.filter(r => r.type === "Imaging").map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{record.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{record.doctor}</p>
                  <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="checkups">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.filter(r => r.type === "Checkup").map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{record.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{record.doctor}</p>
                  <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="medications">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.filter(r => r.type === "Medication").map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{record.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{record.doctor}</p>
                  <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
