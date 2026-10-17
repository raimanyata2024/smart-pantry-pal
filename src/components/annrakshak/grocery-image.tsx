import { useState } from 'react';
import { getGroceryImage, neutralGroceryImage } from '@/lib/grocery-images';

type Props = { name: string; category?: string | null; className?: string; width?: number; height?: number; alt?: string; loading?: 'lazy' | 'eager' };

/** Shows the catalog photo for a grocery; on load failure switches to the category fallback once, then the neutral one. */
export function GroceryImage({ name, category, alt, ...rest }: Props) {
  const resolved = getGroceryImage({ name, category });
  const [failed, setFailed] = useState<{ for: string; step: number }>({ for: '', step: 0 });
  const id = `${name}|${category ?? ''}`;
  const step = failed.for === id ? failed.step : 0;
  const src = step === 0 ? resolved.src : step === 1 ? resolved.fallback : neutralGroceryImage;
  return <img {...rest} src={src} alt={alt ?? name} style={step > 2 ? { visibility: 'hidden' } : undefined} onError={() => setFailed({ for: id, step: step + 1 })} />;
}
