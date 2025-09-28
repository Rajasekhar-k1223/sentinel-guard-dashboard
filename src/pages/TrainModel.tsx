import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Upload, Database, Settings, Play, ArrowLeft, CheckCircle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TrainingDataset {
  id: string;
  name: string;
  type: 'network_logs' | 'security_events' | 'user_behavior' | 'malware_samples';
  size: string;
  records: number;
  lastUpdated: string;
  quality: number;
}

const mockDatasets: TrainingDataset[] = [
  {
    id: 'DS-001',
    name: 'Network Traffic Logs',
    type: 'network_logs',
    size: '2.4 GB',
    records: 1245789,
    lastUpdated: '2024-01-15 10:00:00',
    quality: 94
  },
  {
    id: 'DS-002',
    name: 'Security Event Dataset',
    type: 'security_events',
    size: '1.8 GB',
    records: 892456,
    lastUpdated: '2024-01-14 15:30:00',
    quality: 97
  },
  {
    id: 'DS-003',
    name: 'User Behavior Analytics',
    type: 'user_behavior',
    size: '950 MB',
    records: 456123,
    lastUpdated: '2024-01-13 09:15:00',
    quality: 89
  },
  {
    id: 'DS-004',
    name: 'Malware Signature Database',
    type: 'malware_samples',
    size: '3.2 GB',
    records: 234567,
    lastUpdated: '2024-01-12 14:45:00',
    quality: 96
  }
];

export default function TrainModel() {
  const navigate = useNavigate();
  const [selectedModelType, setSelectedModelType] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [isTraining, setIsTraining] = useState(false);

  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
    }, 5000);
  };

  const getDatasetTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      network_logs: 'default',
      security_events: 'destructive',
      user_behavior: 'secondary',
      malware_samples: 'outline'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Train AI Model</h1>
            <p className="text-muted-foreground">Configure and train custom AI security models</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Model Configuration */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Model Configuration
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                placeholder="Enter model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model-type">Model Type</Label>
              <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                  <SelectItem value="threat_classification">Threat Classification</SelectItem>
                  <SelectItem value="behavioral_analysis">Behavioral Analysis</SelectItem>
                  <SelectItem value="predictive">Predictive Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the model's purpose and functionality"
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                rows={3}
              />
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Training Parameters */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Training Parameters
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="epochs">Epochs</Label>
                <Input id="epochs" type="number" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-size">Batch Size</Label>
                <Input id="batch-size" type="number" defaultValue="32" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <Input id="learning-rate" type="number" step="0.001" defaultValue="0.001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validation-split">Validation Split</Label>
                <Input id="validation-split" type="number" step="0.1" defaultValue="0.2" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="optimizer">Optimizer</Label>
              <Select defaultValue="adam">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adam">Adam</SelectItem>
                  <SelectItem value="sgd">SGD</SelectItem>
                  <SelectItem value="rmsprop">RMSprop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Dataset Selection */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Training Datasets
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                  selectedDatasets.includes(dataset.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 hover:bg-accent/50'
                }`}
                onClick={() => toggleDataset(dataset.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedDatasets.includes(dataset.id)
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}>
                    {selectedDatasets.includes(dataset.id) && (
                      <CheckCircle className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">{dataset.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dataset.records.toLocaleString()} records • {dataset.size} • Updated: {dataset.lastUpdated}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Progress value={dataset.quality} className="h-2 w-16" />
                    <p className="text-xs text-muted-foreground mt-1">{dataset.quality}% Quality</p>
                  </div>
                  
                  {getDatasetTypeBadge(dataset.type)}
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Training Controls */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Training Control
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Selected Datasets: {selectedDatasets.length} | 
                Total Records: {mockDatasets
                  .filter(ds => selectedDatasets.includes(ds.id))
                  .reduce((sum, ds) => sum + ds.records, 0).toLocaleString()}
              </p>
              {isTraining && (
                <div className="space-y-2">
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground">Training in progress... Epoch 45/100</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" disabled={isTraining}>
                Save Configuration
              </Button>
              <Button 
                onClick={handleStartTraining}
                disabled={!modelName || !selectedModelType || selectedDatasets.length === 0 || isTraining}
                className="gap-2"
              >
                {isTraining ? (
                  <>
                    <Brain className="h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Training
                  </>
                )}
              </Button>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}