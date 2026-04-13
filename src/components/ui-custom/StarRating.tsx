import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = i < fullStars;
        const isHalf = i === fullStars && hasHalfStar;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starValue)}
            className={cn(
              'relative transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            {/* Background star (empty) */}
            <Star
              className={cn(
                sizeClasses[size],
                'text-gray-300',
                isFilled && 'fill-amber-400 text-amber-400',
                isHalf && 'text-gray-300'
              )}
            />
            {/* Half star overlay */}
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  className={cn(
                    sizeClasses[size],
                    'fill-amber-400 text-amber-400'
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
      <span className="ml-1 text-sm text-gray-600">
        {rating > 0 ? rating.toFixed(1) : '—'}
      </span>
    </div>
  );
}
