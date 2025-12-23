'use client';
import React, { useState } from 'react';
import { motion, transformPropOrder } from 'framer-motion';
import {
  CheckCircle,
  CheckCircleIcon,
  Clock,
  Crop,
  Download,
  Expand,
  Loader2,
  Scissors,
  Type,
  Zap,
} from 'lucide-react';
import UploadZone from './upload-zone';
import { Button } from './ui/button';
import CanvasEditor from './canvas-editor';
import { getImageKitTransform } from '@/lib/transformkit';

type JobStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'error';

interface ProcessingJob {
  id: string;
  type: string;
  status: JobStatus;
  progress: number;
  result?: string;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  hasPrompt?: boolean;
}

const primaryTools: Tool[] = [
  {
    id: 'e-bgremove',
    name: 'Remove Background',
    icon: Scissors,
    color: 'primary',
    description: 'Remove background with AI',
  },
  {
    id: 'e-removedotbg',
    name: 'Remove Background (Pro)',
    icon: Scissors,
    color: 'secondary',
    description: 'High-quality background removal',
  },
  {
    id: 'e-changebg',
    name: 'Change Background',
    icon: Expand,
    color: 'primary',
    description: 'Replace background with AI',
    hasPrompt: true,
  },
  {
    id: 'e-edit',
    name: 'AI Edit',
    icon: Type,
    color: 'secondary',
    description: 'Edit image with text prompts',
    hasPrompt: true,
  },
  {
    id: 'bg-genfill',
    name: 'Generative Fill',
    icon: Expand,
    color: 'primary',
    description: 'Fill empty areas with AI',
    hasPrompt: true,
  },
];

const secondaryTools: Tool[] = [
  {
    id: 'e-dropshadow',
    name: 'AI Drop Shadow',
    icon: Zap,
    color: 'secondary',
    description: 'Add realistic shadows',
  },
  {
    id: 'e-retouch',
    name: 'AI Retouch',
    icon: Zap,
    color: 'primary',
    description: 'Enhance and retouch image',
  },
  {
    id: 'e-upscale',
    name: 'AI Upscale 2x',
    icon: Zap,
    color: 'secondary',
    description: 'Upscale image quality',
  },
  {
    id: 'e-genvar',
    name: 'Generate Variations',
    icon: Type,
    color: 'primary',
    description: 'Create image variations',
    hasPrompt: true,
  },
  {
    id: 'e-crop-face',
    name: 'Face Crop',
    icon: Crop,
    color: 'secondary',
    description: 'Smart face-focused cropping',
  },
  {
    id: 'e-crop-smart',
    name: 'Smart Crop',
    icon: Crop,
    color: 'primary',
    description: 'AI-powered intelligent cropping',
  },
];

const allTools: Tool[] = [...primaryTools, ...secondaryTools];

const Editor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [editHistory, setEditHistory] = useState<ProcessingJob[]>([]);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());
  const [promptText, setPromptText] = useState<string>('');
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);

  const handleUploadImage = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setProcessingImage(null);
    setCurrentJob(null);
  };

  const handlePromptSubmit = async () => {
    if (!promptText.trim()) return;

    const tool = allTools.find(
      (tool) => tool?.hasPrompt && !activeEffects.has(tool.id),
    );
    if (!tool) return;

    await applyEffect(tool.id, promptText);
    setShowPromptInput(false);
    setPromptText('');
  };

  const handleToolClick = async (toolId: string) => {
    if (!uploadedImage) return;

    const tool = allTools.find((tool) => tool.id === toolId);
    if (!tool) return;
    

    //Toogle effect on/off
    const newActiveEffects = new Set(activeEffects);
    if (newActiveEffects.has(toolId)) {
      newActiveEffects.delete(toolId);
      setActiveEffects(newActiveEffects);

      //remove effect from image
      const remainingEffects = Array.from(newActiveEffects);

      const newImageUrl =
        remainingEffects.length > 0
          ? `${uploadedImage}?tr=${remainingEffects
              .map((effect) => getImageKitTransform(effect, promptText))
              .join(',')}`
          : uploadedImage;
      setProcessingImage(newImageUrl);
      return;
    }

    //Check the tools require prompt
    if (tool.hasPrompt) {
      setShowPromptInput(true);
      setPromptText('');
      return;
    }

    //Apply effect immediately
    await applyEffect(toolId);
  };

  const applyEffect = async (toolId: string, prompt?: string) => {
    if (!uploadedImage) return;
    const newJob: ProcessingJob = {
      id: Date.now().toString(),
      type: toolId,
      status: 'queued',
      progress: 0,
    };
    setCurrentJob(newJob);
    //Apply effect to active effects

    const newActiveEffects = new Set(activeEffects);
    newActiveEffects.add(toolId);
    setActiveEffects(newActiveEffects);

    const allEffects = Array.from(newActiveEffects);

    const transforms = allEffects.map((effect) =>
      getImageKitTransform(effect, effect === toolId ? promptText : undefined),
    );

    const newImageUrl = `${uploadedImage}?tr=${transforms.join(',')}`;

    try {
      //Start Polling the AI transformation URL to check it's complete
      setCurrentJob((prev) =>
        prev ? { ...prev, status: 'processing', progress: 10 } : null,
      );

      let attemps = 0;
      const maxAttempts = 60;
      const pollInternval = 5000;

      const pollImageKit = async (): Promise<boolean> => {
        attemps++;
        try {
          const response = await fetch(newImageUrl, {
            method: 'HEAD',
            cache: 'no-cache',
          });
          if (response.ok) {
            //AI Transformation is complete
            setProcessingImage(newImageUrl);
            setCurrentJob((prev) =>
              prev ? { ...prev, status: 'completed', progress: 100 } : null,
            );
            const completedJob = {
              ...newJob,
              status: 'completed' as JobStatus,
              progress: 100,
              results: newImageUrl,
            };

            setEditHistory((prev) => [...prev.slice(0, 2), completedJob]);
            return true;
          }
        } catch (error) {
          console.log('Polling Error', error);
          return false;
        }

        const progress = Math.min(10 + attemps * 1.5, 90);
        setCurrentJob((prev) => (prev ? { ...prev, progress } : null));

        if (attemps >= maxAttempts) {
          setProcessingImage(newImageUrl);
          setCurrentJob((prev) =>
            prev ? { ...prev, status: 'completed', progress: 100 } : null,
          );
          const completedJob = {
            ...newJob,
            status: 'completed' as JobStatus,
            progress: 100,
            results: newImageUrl,
          };

          setEditHistory((prev) => [...prev.slice(0, 2), completedJob]);
          return true;
        }
        await new Promise((resolve) => setTimeout(resolve, pollInternval));

        return pollImageKit();
      };

      await pollImageKit();
    } catch (error) {
      console.log('Polling Error', error);
      setCurrentJob((prev) =>
        prev ? { ...prev, status: 'error', progress: 100 } : null,
      );
    }
  };

  const handleExport = (format: string) => {
    if (!processingImage) return;
    const link = document.createElement('a');
    link.href = processingImage;
    link.download = `imaginex${Date.now()}.${format}`;
    link.click();
  };

  return (
    <section id="editor" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              Magic
            </span>
            <span className="text-foreground"> Studio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload your photo and transform it with AI-powered tools. See the
            maggic happen in real time
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Upload area will be here */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="lg:col-span-1"
          >
            <UploadZone onImageUpload={handleUploadImage} />

            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                AI Tools
              </h3>
              {/* Prompt Input */}
              {showPromptInput && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="space-y-3 p-4 glass rounded-lg border border-card-border"
                >
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe what you want to change..."
                    className="w-full p-3 bg-background border border-border"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      disabled={!promptText.trim()}
                      className="flex-1"
                      onClick={handlePromptSubmit}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPromptInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Tools */}
              {primaryTools.map((tool) => {
                const isActive = activeEffects.has(tool.id);
                const isProcessing =
                  currentJob?.type === tool.id &&
                  currentJob?.status === 'processing';
                const isQueued =
                  currentJob?.type === tool.id &&
                  currentJob?.status === 'queued';
                const isDisabled =
                  !uploadedImage || currentJob?.status === 'processing';
                return (
                  <Button
                    key={tool.id}
                    variant={isActive ? 'default' : 'outline'}
                    className={`w-full justify-start shadow-glass transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-gray-600 hover:border-primary/30'
                    }`}
                    onClick={() => handleToolClick(tool.id)}
                    disabled={isDisabled}
                    title={tool.description}
                  >
                    <tool.icon
                      className={`w-4 h-4 mr-2 ${
                        isProcessing ? 'animate-pulse' : ''
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{tool.name}</div>
                      {tool?.hasPrompt && (
                        <div className="text-xs opacity-70">
                          Requires Prompt
                        </div>
                      )}
                    </div>
                    {isActive && !isProcessing && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                    {isQueued && (
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                    )}
                    {isProcessing && (
                      <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                    )}
                  </Button>
                );
              })}
            </div>
          </motion.div>
          {/* Main Canvas */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="lg:col-span-2"
          >
            <CanvasEditor
              originalImage={uploadedImage}
              processedImage={processingImage}
              isProcessing={currentJob?.status === 'processing'}
            />
            {/* Secondary Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6"
            >
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Additional Tools
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {secondaryTools.map((tool) => {
                  const isActive = activeEffects.has(tool.id);
                  const isProcessing =
                    currentJob?.type === tool.id &&
                    currentJob?.status === 'processing';
                  const isQueued =
                    currentJob?.type === tool.id &&
                    currentJob?.status === 'queued';
                  const isDisabled =
                    !uploadedImage || currentJob?.status === 'processing';
                  return (
                    <Button
                      key={tool.id}
                      variant={isActive ? 'default' : 'outline'}
                      size={'sm'}
                      className={`justify-start shadow-glass transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : '*:border-gray-600 hover:border-primary/30'
                      }`}
                      onClick={() => handleToolClick(tool.id)}
                      disabled={isDisabled}
                      title={tool.description}
                    >
                      <tool.icon className="w-4 h-4 mr-2" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{tool.name}</div>
                      </div>
                      {isActive && !isProcessing && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                      {isQueued && (
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                      )}
                      {isProcessing && (
                        <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
          {/* Right Panel */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="lg:col-span-1"
          >
            <div className="shadow-glass rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Job Status
              </h3>

              {currentJob ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {currentJob.status === 'processing' ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : currentJob.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : currentJob.status === 'queued' ? (
                      <Clock className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {allTools.find((t) => t.id === currentJob.type)?.name ||
                          currentJob.type.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentJob.status === 'queued' &&
                          'Preparing AI transformation...'}
                        {currentJob.status === 'processing' &&
                          `Processing with AI (${currentJob.progress})`}
                        {currentJob.status === 'error' &&
                          'Something went wrong'}
                      </p>
                    </div>
                  </div>
                  {(currentJob.status === 'processing' ||
                    currentJob.status === 'queued') && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentJob.status === 'queued'
                            ? 'bg-muted-foreground animate-pulse'
                            : 'bg-gradient-primary'
                        }`}
                        style={{
                          width:
                            currentJob.status === 'queued'
                              ? '100%'
                              : `${currentJob.progress}%`,
                        }}
                      />
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        {currentJob.status === 'queued' && 'Initializing...'}
                        {currentJob.status === 'processing' &&
                          'Waiting for AI to complete transfomration...'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upload an image and select a tool to start
                </p>
              )}

              {/* edit histor */}

              {editHistory?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Recent Edits
                  </h4>
                  <div className="space-y-2">
                    {editHistory.map((job) => (
                      <div
                        key={job.id}
                        className="flex break-inside-avoid-column space-x-2 text-sm"
                      >
                        <CheckCircleIcon className="h-3 w-3 text-primary flex-shirnk-0" />
                        <span className="text-muted-foreground capitalize">
                          {job.type.replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Download Button */}
              {processingImage && (
                <div className="mt-6">
                  <Button
                    variant={'hero'}
                    size={'sm'}
                    onClick={() => handleExport('jpg')}
                    className="glass w-full bg-background/20 border-foreground/20 text-foreground hover:bg-background/40"
                  >
                    <Download className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Editor;
