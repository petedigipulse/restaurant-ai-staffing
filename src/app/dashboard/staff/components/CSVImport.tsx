"use client";
import { useState } from 'react';

interface CSVImportProps {
  organizationId: string;
  onImportSuccess: () => void;
}

export default function CSVImport({ organizationId, onImportSuccess }: CSVImportProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a CSV file'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      // Read the file content as text
      const fileContent = await file.text();

      console.log('Sending CSV import request with organizationId:', organizationId);
      console.log('CSV content preview:', fileContent.substring(0, 200));
      
      const response = await fetch('/api/staff/import', {
        method: 'POST',
        headers: {
          'x-organization-id': organizationId,
          'Content-Type': 'text/csv',
        },
        body: fileContent
      });

      console.log('CSV import response status:', response.status);
      const result = await response.json();
      console.log('CSV import response:', result);

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: result.message
        });
        onImportSuccess();
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || 'Failed to import staff'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `First Name,Last Name,Email,Role,Hourly Wage,Guaranteed Hours,Employment Type,Performance Score,Stations,Phone,Emergency Contact,Start Date
Emily,Chen,emily.chen@restaurant.com,FOH Manager,32.00,30,full-time,95,"Front of House, Management","+1 (555) 123-4567","John Chen","2024-01-15"
Mai,Kanako,mai.kanako@restaurant.com,Barista,26.00,15,part-time,98,"Barista, Till","+1 (555) 987-6543","Sarah Johnson","2024-02-01"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Staff from CSV</h3>
        <p className="text-sm text-gray-600">
          Upload a CSV file to import multiple staff members at once. 
          <button
            onClick={downloadTemplate}
            className="text-purple-600 hover:text-purple-700 ml-1 underline"
          >
            Download template
          </button>
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-purple-400 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="csv-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              'Choose File'
            )}
          </label>
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus.type && (
        <div className={`mt-4 p-4 rounded-md ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      {/* CSV Format Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Required fields:</strong> First Name, Last Name, Email, Role</p>
          <p><strong>Optional fields:</strong> Hourly Wage, Guaranteed Hours, Employment Type, Performance Score, Stations, Phone, Emergency Contact, Start Date</p>
          <p><strong>Employment Type:</strong> full-time, part-time, or casual</p>
          <p><strong>Stations:</strong> Comma-separated list (e.g., "Kitchen, Front of House")</p>
          <p><strong>Date format:</strong> YYYY-MM-DD</p>
        </div>
      </div>
    </div>
  );
}
