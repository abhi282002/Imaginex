import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Plan } from '@prisma/client';
interface UploadZoneProps {
  onImageUpload: (imageUrl: string) => void;
}

const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [usageData, setUsageData] = useState<{
    usageCount: number;
    usageLimit: number;
    plan: string;
    canUpload: boolean;
  } | null>(null);

  useEffect(() => {
    checkUsage()?.catch(console.error);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);

    handleFiles(files);
  }, []);

  const handleFiles = useCallback((files: File[]) => {}, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    [],
  );

  const clearImage = () => {
    setUploadedImage(null);
    onImageUpload('');
  };

  const updateUsage = async () => {
    const response = await fetch('/api/usage', {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403) {
        setUsageData(errorData);
        setShowPaymentModal(true);
        throw new Error('Usage limit reached');
      }
      throw new Error('Failed to update usage');
    }
    const data = await response.json();
    setUsageData(data);
    return data;
  };

  const checkUsage = async () => {
    const response = await fetch('/api/usage');
    if (!response.ok) {
      throw new Error('Failed to fetch usage data');
    }
    const data = await response.json();
    setUsageData(data);
    return data;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      className="relative"
    >
      {uploadedImage ? (
        <div className="relative glass rounded-xl p-4 border border-card-border">
          <Button
            className="absolute top-2 right-2 z-10 p-1 rounded-2xl"
            onClick={clearImage}
            variant={'ghost'}
          >
            <X className="w-4 h-4 text-foreground hover:text-destructive" />
          </Button>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={uploadedImage}
              alt="Uploaded Preview"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-foreground">
              <p className="text-sm font-medium text-foreground">
                {uploadedImage.startsWith('data:')
                  ? 'Local preview'
                  : 'Upload to cloud'}
              </p>
              <p className="text-xs text-muted-foreground">
                Ready for AI Magic📌
              </p>
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`shadow-glass rounded-xl p-8 border-2 border-dashed border-gray-800 transition-all duration-300 cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-card-border hover:border-primary/5 hover:bg-primary/5'
          } `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block text-center"
          >
            <motion.div
              animate={
                isDragOver
                  ? {
                      scale: 1.1,
                    }
                  : {
                      scale: 1,
                    }
              }
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : isDragOver ? (
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary" />
                )}
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isUploading
                ? 'Uploading to cloud....'
                : isDragOver
                ? 'Drop your photo here'
                : 'Upload Photo'}
            </h3>
            <p className="text-sm mb-4 text-muted-foreground">
              {isUploading
                ? 'Please wait while we upload your image'
                : isDragOver
                ? 'Drop & drop or click to browser'
                : 'Upload Photo'}
            </p>
            <Button variant={'outline'} className="glass border-card-border">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </>
              )}
            </Button>
          </label>
        </div>
      )}

      {/* Usage Info */}
      {usageData && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <span>
              Usage: {usageData.usageCount}/{usageData.usageLimit}{' '}
            </span>
            {usageData.plan === Plan.Free && (
              <Crown className="w-4 h-4 text-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
      )}
      {/* Payment Modal */}
      {/* {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => setShowPaymentModal(false)}
        />
      )} */}
    </motion.div>
  );
};

export default UploadZone;
