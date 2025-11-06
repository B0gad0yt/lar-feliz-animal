'use client';

import { useState } from 'react';
import { useSupportModal } from '@/hooks/use-support-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HandHeart, Check } from 'lucide-react';

export function SupportModal() {
  const { hasReadModal, markAsRead } = useSupportModal();
  const [isOpen, setIsOpen] = useState(!hasReadModal);

  const handleAccept = () => {
    markAsRead();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen && !hasReadModal} onOpenChange={(open) => !open && handleAccept()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <HandHeart className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center font-headline">
            Quer nos apoiar?
          </DialogTitle>
          <DialogDescription className="text-base text-center pt-4">
            <div className="space-y-4">
              <p className="leading-relaxed">
                <strong className="text-foreground">O que é o Lar Temporário?</strong>
              </p>
              <p className="leading-relaxed">
                A pessoa apenas acolheria o animal, para que ele se mantesse seguro até encontrar um lar definitivo.
              </p>
              <p className="leading-relaxed">
                Quando você se oferece como lar temporário, <strong className="text-foreground">não tem gasto algum</strong>. Nós enviamos ração, medicamentos e arcamos com veterinário.
              </p>
              <p className="leading-relaxed">
                Você apenas acolhe o animalzinho para que ele possa achar um lar definitivo, criando uma <strong className="text-foreground">rede de apoio</strong> essencial para salvar vidas!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleAccept} size="lg" className="w-full sm:w-auto">
            <Check className="mr-2 h-5 w-5" />
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
