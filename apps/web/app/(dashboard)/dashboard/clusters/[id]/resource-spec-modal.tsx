'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@orc/web/ui/custom-ui';
import { Button } from '@orc/web/ui/custom-ui';

interface ResourceSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceSpec: Record<string, any> | null; // It can be any JSON object
}

export function ResourceSpecModal({ isOpen, onClose, resourceSpec }: ResourceSpecModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Resource Specification</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          {resourceSpec ? (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(JSON.parse(resourceSpec.spec), null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No resource specification to display.</p>
          )}
        </div>
        <DialogFooter className="px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}