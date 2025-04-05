import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const DialogComponent: React.FC = () => (
  <Dialog.Root>
    <Dialog.Trigger>Open Dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        {/* Fix: Add DialogTitle */}
        <Dialog.Title>Scan Results</Dialog.Title>
        {/* Or hide it visually if not needed in UI */}
        {/* <VisuallyHidden asChild><Dialog.Title>Scan Results</Dialog.Title></VisuallyHidden> */}
        
        {/* Fix for missing description */}
        <div id="dialog-desc">Your scan results will appear here.</div>
        <p aria-describedby="dialog-desc">Content goes here</p>
        
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogComponent;