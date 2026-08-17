import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw } from 'lucide-react';

export interface CaptchaRef {
  validate: (answer: string) => boolean;
  reset: () => void;
}

interface MathCaptchaProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function generateQuestion() {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer: answer.toString() };
}

export const MathCaptcha = forwardRef<CaptchaRef, MathCaptchaProps>(
  ({ value, onChange, error }, ref) => {
    const [captcha, setCaptcha] = useState(generateQuestion);

    const refresh = () => {
      setCaptcha(generateQuestion());
      onChange('');
    };

    useEffect(() => {
      setCaptcha(generateQuestion());
    }, []);

    useImperativeHandle(ref, () => ({
      validate: (answer: string) => answer.trim() === captcha.answer,
      reset: refresh,
    }));

    return (
      <div>
        <label className="block text-sm font-medium text-[#212121] mb-1.5">
          Verifikasi CAPTCHA
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3">
            <div className="flex-1">
              <div
                className="text-lg font-bold tracking-widest text-[#212121] select-none"
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.15)',
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                }}
              >
                {captcha.question}
              </div>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="text-[#757575] hover:text-[#E53935] transition-colors"
              title="Refresh CAPTCHA"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-24 py-3 px-3 border-2 rounded-xl focus:outline-none text-center transition-colors ${
              error ? 'border-[#E53935]' : 'border-gray-200 focus:border-[#E53935]'
            }`}
            placeholder="Jawab"
          />
        </div>
        {error && <p className="mt-1 text-xs text-[#E53935]">{error}</p>}
      </div>
    );
  }
);

MathCaptcha.displayName = 'MathCaptcha';
