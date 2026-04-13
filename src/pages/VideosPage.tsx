import { useState, useMemo } from 'react';
import { Search, Video, Play, Clock, X, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Video as VideoType } from '@/types';

export function VideosPage() {
  const { videos } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.category));
    return Array.from(cats);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((v) => v.category === selectedCategory);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(searchLower) ||
          v.description.toLowerCase().includes(searchLower) ||
          v.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [videos, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Видеоуроки
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Обучающие видеоматериалы по работе с Revit, созданию семейств и оптимизации workflow.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по видео..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Найдено: <span className="font-medium">{filteredVideos.length}</span> видео
          </p>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg group"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-600" />
                  </div>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                      <Play className="h-6 w-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
                      {video.duration}
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mx-auto mb-4">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Видео не найдены
            </h3>
            <p className="text-gray-600 mb-4">
              Попробуйте изменить параметры поиска
            </p>
            <Button onClick={() => { setSearch(''); setSelectedCategory('all'); }}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedVideo.category}</Badge>
                  {selectedVideo.duration && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      {selectedVideo.duration}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      Видео: {selectedVideo.fileName}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Поместите видео-файл в папку /public/videos/
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-700">{selectedVideo.description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
