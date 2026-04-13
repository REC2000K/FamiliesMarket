import { useState } from 'react';
import { Download, FileBox, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import type { RevitFamily } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FamilyCardProps {
  family: RevitFamily;
}

export function FamilyCard({ family }: FamilyCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { rateFamily, incrementDownloads } = useData();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const handleDownload = () => {
    incrementDownloads(family.id);
    // Используем filePath для скачивания
    const link = document.createElement('a');
    link.href = family.filePath;
    link.download = family.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRate = () => {
    if (user && userRating > 0) {
      rateFamily(family.id, user.id, userRating);
      setIsRatingDialogOpen(false);
    }
  };

  const hasUserRated = user && family.userRatings[user.id] !== undefined;

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileBox className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1" title={family.name}>
                {family.name}
              </h3>
              <p className="text-xs text-gray-500">{family.category}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {family.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {family.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {family.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{family.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{family.ratingCount} оценок</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{family.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(family.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <StarRating rating={family.rating} size="sm" />
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={hasUserRated ? 'text-amber-500' : 'text-gray-400'}
                >
                  <Star className={cn('h-4 w-4', hasUserRated && 'fill-amber-500')} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Оценить семейство</DialogTitle>
                  <DialogDescription>
                    {family.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'h-8 w-8',
                            star <= userRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {userRating > 0 ? `Ваша оценка: ${userRating}` : 'Выберите оценку'}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleRate} disabled={userRating === 0}>
                    Оценить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button size="sm" onClick={handleDownload} className="gap-1">
            <Download className="h-4 w-4" />
            Скачать
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
