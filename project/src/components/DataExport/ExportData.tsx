import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Image, Database, Calendar, MapPin, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'png';
  dateRange: '7d' | '30d' | '90d' | 'custom';
  locations: string[];
  pollutants: string[];
  includeForecasts: boolean;
  includeHealthAdvisory: boolean;
}

export const ExportData: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: '7d',
    locations: ['Delhi'],
    pollutants: ['pm25', 'pm10', 'aqi'],
    includeForecasts: false,
    includeHealthAdvisory: true
  });

  const handleExport = async () => {
    setIsExporting(true);
    toast.loading('Preparing your export...', { id: 'export' });

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock data based on options
      const data = generateExportData();
      
      // Create and download file
      downloadFile(data, exportOptions.format);
      
      toast.success(`Data exported successfully as ${exportOptions.format.toUpperCase()}!`, { id: 'export' });
    } catch (error) {
      toast.error('Export failed. Please try again.', { id: 'export' });
    } finally {
      setIsExporting(false);
    }
  };

  const generateExportData = () => {
    const { format, dateRange, locations, pollutants } = exportOptions;
    
    if (format === 'csv') {
      const headers = ['Date', 'Location', ...pollutants.map(p => p.toUpperCase())];
      const rows = [];
      
      // Generate sample data
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        locations.forEach(location => {
          const row = [
            date.toISOString().split('T')[0],
            location,
            ...pollutants.map(() => Math.floor(Math.random() * 200) + 20)
          ];
          rows.push(row.join(','));
        });
      }
      
      return [headers.join(','), ...rows].join('\n');
    }
    
    if (format === 'json') {
      const data = {
        exportDate: new Date().toISOString(),
        dateRange,
        locations,
        pollutants,
        data: locations.map(location => ({
          location,
          readings: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
              date: date.toISOString().split('T')[0],
              ...Object.fromEntries(
                pollutants.map(p => [p, Math.floor(Math.random() * 200) + 20])
              )
            };
          })
        }))
      };
      
      return JSON.stringify(data, null, 2);
    }
    
    return '';
  };

  const downloadFile = (data: string, format: string) => {
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airscope-data-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500 rounded-lg">
          <Download className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Export Data</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'csv', icon: FileText, label: 'CSV', desc: 'Spreadsheet data' },
              { key: 'json', icon: Database, label: 'JSON', desc: 'API format' },
              { key: 'pdf', icon: FileText, label: 'PDF', desc: 'Report format' },
              { key: 'png', icon: Image, label: 'PNG', desc: 'Chart image' }
            ].map(({ key, icon: Icon, label, desc }) => (
              <motion.button
                key={key}
                onClick={() => updateOption('format', key as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  exportOptions.format === key
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Date Range
          </label>
          <div className="space-y-2">
            {[
              { key: '7d', label: 'Last 7 days' },
              { key: '30d', label: 'Last 30 days' },
              { key: '90d', label: 'Last 90 days' },
              { key: 'custom', label: 'Custom range' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value={key}
                  checked={exportOptions.dateRange === key}
                  onChange={(e) => updateOption('dateRange', e.target.value as any)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Locations
          </label>
          <div className="space-y-2">
            {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'].map((location) => (
              <label key={location} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.locations.includes(location)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateOption('locations', [...exportOptions.locations, location]);
                    } else {
                      updateOption('locations', exportOptions.locations.filter(l => l !== location));
                    }
                  }}
                  className="text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pollutants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pollutants
          </label>
          <div className="space-y-2">
            {[
              { key: 'aqi', label: 'AQI' },
              { key: 'pm25', label: 'PM2.5' },
              { key: 'pm10', label: 'PM10' },
              { key: 'no2', label: 'NO₂' },
              { key: 'o3', label: 'O₃' },
              { key: 'co', label: 'CO' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.pollutants.includes(key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateOption('pollutants', [...exportOptions.pollutants, key]);
                    } else {
                      updateOption('pollutants', exportOptions.pollutants.filter(p => p !== key));
                    }
                  }}
                  className="text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Additional Options</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={exportOptions.includeForecasts}
              onChange={(e) => updateOption('includeForecasts', e.target.checked)}
              className="text-green-600 focus:ring-green-500 rounded"
            />
            <span className="text-sm text-gray-700">Include forecast data</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={exportOptions.includeHealthAdvisory}
              onChange={(e) => updateOption('includeHealthAdvisory', e.target.checked)}
              className="text-green-600 focus:ring-green-500 rounded"
            />
            <span className="text-sm text-gray-700">Include health advisory</span>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Estimated file size: {exportOptions.locations.length * exportOptions.pollutants.length * 0.5}MB
        </div>
        <motion.button
          onClick={handleExport}
          disabled={isExporting || exportOptions.locations.length === 0 || exportOptions.pollutants.length === 0}
          whileHover={{ scale: isExporting ? 1 : 1.02 }}
          whileTap={{ scale: isExporting ? 1 : 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export Data
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};