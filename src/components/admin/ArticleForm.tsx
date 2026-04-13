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
import type { Article } from '@/types';

interface ArticleFormProps {
  article?: Article;
  onSuccess: () => void;
}

const ARTICLE_CATEGORIES = ['Обучение', 'Менеджмент', 'Новости', 'Другое'];

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const { addArticle, updateArticle } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    summary: article?.summary || '',
    category: article?.category || 'Обучение',
    tags: article?.tags.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const articleData = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      category: formData.category,
      tags: tagsArray,
    };

    if (article) {
      updateArticle(article.id, articleData);
    } else {
      addArticle(articleData);
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Например: Как создавать параметрические семейства"
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
            {ARTICLE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Краткое описание *</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="Краткое описание статьи (отображается в списке)"
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Содержание *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Полный текст статьи"
          rows={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Теги (через запятую)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="Семейства, Параметры, Базовый уровень"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : article ? 'Сохранить изменения' : 'Добавить статью'}
        </Button>
      </div>
    </form>
  );
}
