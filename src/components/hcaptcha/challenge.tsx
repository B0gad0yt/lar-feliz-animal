'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script, { type ScriptProps } from 'next/script';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    hcaptcha?: any;
  }
}

type HCaptchaChallengeProps = {
  onTokenChange?: (token: string | null) => void;
  label?: string;
  description?: string;
  resetSignal?: number;
  className?: string;
};

const HCAPTCHA_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

export function HCaptchaChallenge({
  onTokenChange,
  label = 'Verificação humana',
  description = 'Resolva o desafio para confirmar que você não é um robô.',
  resetSignal = 0,
  className,
}: HCaptchaChallengeProps) {
  const initialSiteKey = useMemo(() => process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? null, []);
  const [siteKey, setSiteKey] = useState<string | null>(initialSiteKey);
  const [siteKeyLoading, setSiteKeyLoading] = useState(!initialSiteKey);
  const [siteKeyError, setSiteKeyError] = useState<string | null>(null);
  const [siteKeyAttempt, setSiteKeyAttempt] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [containerVersion, setContainerVersion] = useState(0);

  const handleTokenChange = useCallback(
    (value: string | null) => {
      setToken(value);
      onTokenChange?.(value);
    },
    [onTokenChange]
  );

  useEffect(() => {
    if (siteKey) {
      setSiteKeyLoading(false);
      return;
    }

    let cancelled = false;
    setSiteKeyLoading(true);

    const fetchSiteKey = async () => {
      try {
        const res = await fetch('/api/hcaptcha/sitekey');
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        if (!cancelled && data?.siteKey) {
          setSiteKey(data.siteKey);
          setSiteKeyError(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Erro ao carregar site key do hCaptcha', error);
          setSiteKeyError('Não foi possível carregar o desafio do hCaptcha.');
        }
      } finally {
        if (!cancelled) {
          setSiteKeyLoading(false);
        }
      }
    };

    fetchSiteKey();

    return () => {
      cancelled = true;
    };
  }, [siteKey, siteKeyAttempt]);

  const renderCaptcha = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!scriptReady || !siteKey) return;
    if (!containerRef.current || !window.hcaptcha) return;

    try {
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (tokenValue: string) => handleTokenChange(tokenValue),
        'expired-callback': () => handleTokenChange(null),
        'error-callback': () => setSiteKeyError('O hCaptcha retornou um erro. Tente novamente.'),
      });
      setSiteKeyError(null);
    } catch (error) {
      console.error('hCaptcha render error', error);
      setSiteKeyError('Falha ao inicializar o hCaptcha.');
    }
  }, [handleTokenChange, scriptReady, siteKey]);

  useEffect(() => {
    renderCaptcha();

    return () => {
      if (widgetIdRef.current !== null && window?.hcaptcha?.remove) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
      }
      widgetIdRef.current = null;
      handleTokenChange(null);
    };
  }, [renderCaptcha, siteKeyAttempt, handleTokenChange, containerVersion]);

  const handleReloadCaptcha = useCallback(() => {
    setSiteKeyError(null);
    handleTokenChange(null);

    if (widgetIdRef.current !== null && window?.hcaptcha?.reset) {
      try {
        window.hcaptcha.reset(widgetIdRef.current);
        return;
      } catch (error) {
        console.error('Erro ao resetar hCaptcha', error);
      }
    }

    setSiteKeyLoading(true);
    setSiteKeyAttempt((prev) => prev + 1);
  }, [handleTokenChange]);

  useEffect(() => {
    if (resetSignal > 0) {
      handleReloadCaptcha();
    }
  }, [resetSignal, handleReloadCaptcha]);

  const isCaptchaLoading = siteKeyLoading || (!scriptReady && !siteKeyError);
  const canRenderCaptcha = Boolean(siteKey && scriptReady && !siteKeyError);

  const scriptProps: ScriptProps = {
    id: 'hcaptcha-script',
    src: HCAPTCHA_SRC,
    strategy: 'lazyOnload',
    onLoad: () => setScriptReady(true),
    onError: (error) => {
      console.error('Erro ao carregar script do hCaptcha', error);
      setSiteKeyError('O script do hCaptcha não pôde ser carregado.');
    },
  };

  const assignContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (node) {
      setContainerVersion((prev) => prev + 1);
    }
  }, []);

  return (
    <div className={cn('space-y-2', className)}>
      <Script {...scriptProps} />
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-md border border-border/60 bg-background/80 p-3 min-h-[110px] flex items-center justify-center">
        {canRenderCaptcha ? (
          <div ref={assignContainerRef} className="w-full flex justify-center" />
        ) : isCaptchaLoading ? (
          <p className="text-sm text-muted-foreground">Carregando desafio do hCaptcha...</p>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive">{siteKeyError ?? 'Não foi possível carregar o hCaptcha.'}</p>
            <Button type="button" variant="outline" size="sm" onClick={handleReloadCaptcha}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
      {canRenderCaptcha && !token && (
        <p className="text-xs text-muted-foreground">Clique no desafio acima e aguarde a confirmação antes de continuar.</p>
      )}
      {!canRenderCaptcha && !isCaptchaLoading && (
        <p className="text-xs text-muted-foreground">Se o problema persistir, entre em contato com o suporte.</p>
      )}
      {token && (
        <p className="text-xs text-primary">Verificação concluída. Token válido por alguns minutos.</p>
      )}
    </div>
  );
}
