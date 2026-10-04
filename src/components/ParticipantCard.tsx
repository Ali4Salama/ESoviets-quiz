'use client';

import { useRef, useCallback, useState } from 'react';

interface ParticipantCardProps {
  nickname: string;
  participantId: string;
  preferredSoviet: string;
  status?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

const CARD_WIDTH = 400;
const CARD_HEIGHT = 520;

export function ParticipantCard({
  nickname,
  participantId,
  preferredSoviet,
  status,
  onDownload,
  onShare,
}: ParticipantCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const wrapText = (text: string, maxCharsPerLine: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [''];
  };

  const generateImage = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = CARD_WIDTH * 2;
    canvas.height = CARD_HEIGHT * 2;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });
  }, []);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateImage();
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = `esoviets-card-${participantId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onDownload?.();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate card image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [participantId, generateImage, onDownload]);

  const handleShare = useCallback(async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateImage();
      if (!canvas) return;

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to create blob');

      const text = `I completed the E-Soviets participant questionnaire. My participant number is ${participantId}.`;
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], `esoviets-card-${participantId}.png`, { type: 'image/png' })] })) {
        const file = new File([blob], `esoviets-card-${participantId}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'E-Soviets Participant Card',
          text,
          files: [file],
        });
      } else {
        // Fallback: copy text to clipboard + trigger download
        await navigator.clipboard.writeText(`I completed the E-Soviets participant questionnaire. My participant number is ${participantId}.`);
        // Also trigger download
        const link = document.createElement('a');
        link.download = `esoviets-card-${participantId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        alert('Participant number copied to clipboard! Card image downloaded.');
      }
      onShare?.();
    } catch (err) {
      console.error('Share failed:', err);
      // Last resort: copy text
      try {
        await navigator.clipboard.writeText(`I completed the E-Soviets participant questionnaire. My participant number is ${participantId}.`);
        alert('Participant number copied to clipboard!');
      } catch {
        alert('Failed to share. Please try downloading the card instead.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [participantId, generateImage, onShare]);

  const nicknameLines = wrapText(`"${nickname}"`, 20);
  const sovietLines = wrapText(preferredSoviet, 25);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" role="img" aria-label={`E-Soviets participant card for ${nickname}`}>
        <svg
          ref={svgRef}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
          className="block drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="50%" stopColor="#141414" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />
          <rect width="100%" height="100%" fill="url(#gridPattern)" rx="16" />

          {/* Border */}
          <rect x="2" y="2" width={CARD_WIDTH - 4} height={CARD_HEIGHT - 4} fill="none" stroke="#cc0000" strokeWidth="2" rx="14" opacity="0.6" />

          {/* Inner accent line */}
          <rect x="8" y="8" width={CARD_WIDTH - 16} height={CARD_HEIGHT - 16} fill="none" stroke="#cc0000" strokeWidth="0.5" rx="12" opacity="0.3" />

          {/* E-SOVIETS Header */}
          <text x={CARD_WIDTH / 2} y={60} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="700" fill="white" letterSpacing="2">
            E-SOVIETS
          </text>

          {/* Divider */}
          <line x1={80} y1={72} x2={CARD_WIDTH - 80} y2={72} stroke="#cc0000" strokeWidth="1.5" opacity="0.6" />
          <circle cx={CARD_WIDTH / 2} cy={72} r="3" fill="#cc0000" />

          {/* NICKNAME Label */}
          <text x={CARD_WIDTH / 2} y={110} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#a0a0a0" letterSpacing="1.5">
            NICKNAME
          </text>

          {/* Nickname Value */}
          {nicknameLines.map((line, i) => (
            <text
              key={i}
              x={CARD_WIDTH / 2}
              y={135 + i * 28}
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize={nicknameLines.length > 1 ? 22 : 28}
              fontWeight="700"
              fill="white"
            >
              {line}
            </text>
          ))}

          {/* PARTICIPANT NUMBER Label */}
          <text x={CARD_WIDTH / 2} y={210} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#a0a0a0" letterSpacing="1.5">
            PARTICIPANT NUMBER
          </text>

          {/* Participant ID */}
          <text x={CARD_WIDTH / 2} y={235} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="18" fontWeight="600" fill="#cc0000" letterSpacing="1">
            {participantId}
          </text>

          {/* Divider */}
          <line x1={100} y1={255} x2={CARD_WIDTH - 100} y2={255} stroke="#cc0000" strokeWidth="1" opacity="0.4" />

          {/* SOVIET Label */}
          <text x={CARD_WIDTH / 2} y={285} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#a0a0a0" letterSpacing="1.5">
            PREFERRED SOVIET
          </text>

          {/* Soviet Name */}
          {sovietLines.map((line, i) => (
            <text
              key={i}
              x={CARD_WIDTH / 2}
              y={310 + i * 26}
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize={sovietLines.length > 1 ? 16 : 20}
              fontWeight="600"
              fill="white"
            >
              {line}
            </text>
          ))}

          {/* Status (optional) */}
          {status && (
            <text x={CARD_WIDTH / 2} y={370} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fill="#cc0000" fontWeight="500">
              {status}
            </text>
          )}

          {/* Bottom motto */}
          <text x={CARD_WIDTH / 2} y={CARD_HEIGHT - 45} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#a0a0a0" letterSpacing="2">
            ORGANIZE • DISCUSS • BUILD
          </text>

          {/* Corner accents */}
          <g stroke="#cc0000" strokeWidth="2" opacity="0.4">
            <path d="M 24 24 L 50 24 M 24 24 L 24 50" fill="none" />
            <path d={`M ${CARD_WIDTH - 24} 24 L ${CARD_WIDTH - 50} 24 M ${CARD_WIDTH - 24} 24 L ${CARD_WIDTH - 24} 50`} fill="none" />
            <path d={`M 24 ${CARD_HEIGHT - 24} L 50 ${CARD_HEIGHT - 24} M 24 ${CARD_HEIGHT - 24} L 24 ${CARD_HEIGHT - 50}`} fill="none" />
            <path d={`M ${CARD_WIDTH - 24} ${CARD_HEIGHT - 24} L ${CARD_WIDTH - 50} ${CARD_HEIGHT - 24} M ${CARD_WIDTH - 24} ${CARD_HEIGHT - 24} L ${CARD_WIDTH - 24} ${CARD_HEIGHT - 50}`} fill="none" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-white bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[48px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isGenerating ? 'Generating...' : 'Download Card'}
        </button>

        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-4 text-base font-medium text-white bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[48px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {isGenerating ? 'Generating...' : 'Share'}
        </button>
      </div>
    </div>
  );
}