import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import type { Video } from '@/types';

interface VideoFormProps {
  video?: Video;
  onSuccess: () => void;
}

const VIDEO_CATEGORIES = ['Обучение', 'Обзор', 'Туториал', 'Другое'];

export function VideoForm({ video, onSuccess }: VideoFormProps) {
  const { addVideo, updateVideo } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    category: video?.category || 'Обучение',
    tags: video?.tags.join(', ') || '',
    duration: video?.duration || '',
    fileName: video?.fileName || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const videoData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: tagsArray,
      duration: formData.duration,
      fileName: formData.fileName,
    };

    if (video) {
      updateVideo(video.id, videoData);
    } else {
      addVideo(videoData);
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Название *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Например: Введение в создание семейств Revit"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Категория *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {VIDEO_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Описание видео, что в нем рассматривается"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Длительность</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
            placeholder="Например: 15:30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileName">Имя файла *</Label>
          <Input
            id="fileName"
            value={formData.fileName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fileName: e.target.value }))}
            placeholder="video_name.mp4"
            required
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Видео-файл должен быть размещен в папке /public/videos/
      </p>

      <div className="space-y-2">
        <Label htmlFor="tags">Теги (через запятую)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="Видео, Базовый уровень, Семейства"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : video ? 'Сохранить изменения' : 'Добавить видео'}
        </Button>
      </div>
    </form>
  );
}
