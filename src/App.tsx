import React, { useState, useCallback } from 'react';
import { Upload, Download, Phone } from 'lucide-react';
import { formatLebaneseMobile } from './utils/phoneFormatter';
import type { PhoneNumber } from './types';

function App() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [nextId, setNextId] = useState(1);
  const [inputFileName, setInputFileName] = useState<string>('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setInputFileName(file.name.replace(/\.[^/.]+$/, ''));
    setNextId(1); // Reset ID counter for new file

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      
      let currentId = 1;
      const formattedNumbers = lines
        .filter(line => line.trim())
        .flatMap((line, lineIndex) => {
          const originalInput = line.trim();
          const numbers = formatLebaneseMobile(originalInput, currentId, lineIndex + 1);
          currentId += numbers.length;
          return numbers;
        });

      setNumbers(formattedNumbers);
      setNextId(currentId);
    };
    reader.readAsText(file);
  }, []);

  const handleDownload = useCallback(() => {
    const headers = ['ID', 'Input ID', 'Raw Input', 'Input', 'EXT', 'PREFIX', 'NUMBER', 'Status', 'Note'].join(';');

    const rows = numbers
      .map(n => [
        n.id,
        n.inputId,
        n.rawInput,
        n.input,
        n.output.ext,
        n.output.prefix,
        n.output.number,
        n.isValid ? 'Valid' : 'Invalid',
        n.note || ''
      ].join(';'));

    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_${inputFileName || 'numbers'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [numbers, inputFileName]);

  const validCount = numbers.filter(n => n.isValid).length;
  const validationPercentage = numbers.length > 0 
    ? ((validCount / numbers.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="w-full max-w-[95vw] mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Phone className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lebanese Phone Number Formatter</h1>
          </div>

          <div className="mb-8">
            <label 
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-indigo-600 focus:outline-none"
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="font-medium text-gray-600">
                  Drop your CSV file here or click to upload
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {numbers.length > 0 && (
            <>
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-700">Results</h2>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Validation Rate: {validationPercentage}% ({validCount}/{numbers.length})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${validationPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="w-full overflow-x-auto rounded-lg">
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[60px]">ID</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[80px]">Input ID</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raw Input</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[80px]">EXT</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[70px]">PREFIX</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[100px]">NUMBER</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[80px]">Status</th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {numbers.map((number) => (
                        <tr key={number.id} className="hover:bg-gray-50">
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-[60px]">{number.id}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-[80px]">{number.inputId}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[200px]">{number.rawInput}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[200px]">{number.input}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 font-mono w-[80px]">{number.output.ext}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 font-mono w-[70px]">{number.output.prefix}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 font-mono w-[100px]">{number.output.number}</td>
                          <td className="px-2 py-2 whitespace-nowrap w-[80px]">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              number.isValid 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {number.isValid ? 'Valid' : 'Invalid'}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-sm text-gray-500 truncate">{number.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;