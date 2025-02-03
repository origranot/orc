'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@orc/web/ui/custom-ui';
import { Button } from '@orc/web/ui/custom-ui';
import { Input } from '@orc/web/ui/custom-ui';
import { Label } from '@orc/web/ui/custom-ui';
import { Loader2, ChevronRight, ChevronLeft, Copy, CheckCircle2 } from 'lucide-react';
import { generateRegistrationToken, checkClusterRegistration } from '@orc/web/actions/cluster';

interface ClusterConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => Promise<void>;
}

export function ClusterConnectModal({ isOpen, onClose, onConnect }: ClusterConnectModalProps) {
  const [step, setStep] = useState(1);
  const [clusterName, setClusterName] = useState('');
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (step === 3 && !isRegistered) {
      setIsChecking(true);
      intervalId = setInterval(async () => {
        if (!registrationToken) return;

        try {
          const result = await checkClusterRegistration(registrationToken);
          if (result.registered) {
            setIsRegistered(true);
            if (onConnect) {
              await onConnect();
            }
            clearInterval(intervalId);
            setIsChecking(false);
          }
        } catch (error) {
          console.error('Failed to check registration:', error);
        }
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [step, registrationToken, isRegistered]);

  const validateClusterName = (name: string) => {
    const regex = /^[a-z][a-z0-9.-]*[a-z0-9]$/;
    if (name.length > 40) return 'Cluster name must be 40 characters or less';
    if (!regex.test(name)) return 'Invalid cluster name format';
    return '';
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const validationError = validateClusterName(clusterName);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      setIsGeneratingToken(true);

      try {
        const result = await generateRegistrationToken(clusterName);
        if (result.success && result.token) {
          setRegistrationToken(result.token);
          setStep(2);
        } else {
          setError(result.error || 'Failed to generate registration token');
        }
      } catch (error) {
        setError('Failed to generate registration token');
      } finally {
        setIsGeneratingToken(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const resetModal = () => {
    setStep(1);
    setClusterName('');
    setRegistrationToken(null);
    setError('');
    setIsGeneratingToken(false);
  };

  const installationCommand = registrationToken
    ? `helm install orc ./chart --set secrets.orc-secrets.data.ORC_REGISTRATION_TOKEN=${registrationToken} -n orc --create-namespace`
    : '';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        resetModal();
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Connect New Cluster</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="clusterName" className="text-base font-medium">
                  Enter your cluster name
                </Label>
                <Input
                  id="clusterName"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  placeholder="Cluster name"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">{clusterName.length}/40 characters</p>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  The cluster name should be up to 40 characters with the following restrictions:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Start with a lowercase letter.</li>
                  <li>Contains lowercase letters, numbers, dots and hyphens only.</li>
                  <li>Must be a valid FQDN (without trailing period).</li>
                  <li>End with a number or a lowercase letter.</li>
                </ul>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-base">Run the following command to install the agent on your cluster:</p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
                  {installationCommand}
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(installationCommand)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This registration token will expire in 24 hours. After installation, the operator will automatically register with our
                  service and receive a permanent token for ongoing communication.
                </p>
              </div>
              <p className="text-sm text-primary hover:underline cursor-pointer">
                Learn more about installation requirements and permissions
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 text-center py-8">
              <div className="relative w-16 h-16 mx-auto">
                {isRegistered ? (
                  <div className="rounded-full bg-green-400 dark:bg-green-700 p-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-25"></div>
                    <div className="relative rounded-full bg-primary p-4">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  </>
                )}
              </div>
              <div>
                {isRegistered ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-4">Successfully Connected!</h2>
                    <p className="text-muted-foreground">Your cluster is now connected and ready to use.</p>
                    <Button onClick={onClose} size="lg" variant="default" className="mt-4">
                      Close
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold mb-2">Waiting for Cluster</h2>
                    <p className="text-muted-foreground">Waiting for the cluster to connect. This may take a few seconds...</p>
                    {!isRegistered && isChecking && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Checking connection status...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
          )}
        </div>
        <DialogFooter className="px-6 py-4">
          {step > 1 && step !== 3 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          {step < 3 && (
            <Button onClick={handleNextStep} disabled={isGeneratingToken}>
              {isGeneratingToken ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Token
                </>
              ) : (
                <>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
