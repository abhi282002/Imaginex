export const getImageKitTransform = (
  toolId: string,
  prompt?: string,
): string => {
  const transforms: Record<string, string> = {
    'e-bgremove': 'e-bgremove',
    'e-removedotbg': 'e-removedotbg',
    'e-changebg': prompt
      ? `e-changebg-prompt-${encodeURIComponent(prompt)}`
      : 'e-changebg',
    'e-edit': prompt ? `e-edit:${encodeURIComponent(prompt)}` : 'e-edit',
    'bg-genfill': prompt
      ? `bg-genfill:${encodeURIComponent(prompt)}`
      : 'bg-genfill',
    'e-dropshadow': 'e-dropshadow',
    'e-retouch': 'e-retouch',
    'e-upscale': 'e-upscale',
    'e-genvar': prompt ? `e-genvar:${encodeURIComponent(prompt)}` : 'e-genvar',
    'e-crop-face': 'e-crop-face',
    'e-crop-smart': 'e-crop-smart',
  };
  return transforms[toolId] || '';
};
